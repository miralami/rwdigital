<script lang="ts">
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import UserPlus from '@lucide/svelte/icons/user-plus';
  import type { PageData } from './$types';

  let { data, form } = $props<{
    data: PageData;
    form?: { error?: string; sukses?: string };
  }>();

  type WargaRingkas = {
    id: number;
    nama: string;
    nik: string;
    userId: string | null;
    nomorRt: number;
    noKk: string;
  };

  type TugasRt = {
    userId: string;
    rtId: number;
    nomorRt: number;
  };

  const daftarWarga = $derived(data.daftarWarga as WargaRingkas[]);
  const daftarTugas = $derived((data.daftarTugas ?? []) as TugasRt[]);
  const wargaTertaut = $derived(daftarWarga.filter((w) => w.userId));
  const wargaBelumTertaut = $derived(daftarWarga.filter((w) => !w.userId));

  function wargaDariUser(userId: string) {
    return wargaTertaut.find((w) => w.userId === userId) ?? null;
  }

  function tugasDariUser(userId: string) {
    return daftarTugas.find((t) => t.userId === userId) ?? null;
  }

  function isPengurusRt(role?: string | null) {
    return (role ?? '')
      .split(',')
      .map((r) => r.trim())
      .includes('pengurus_rt');
  }

  function roleBadge(role?: string | null) {
    if (role === 'admin_rw') return 'brand';
    if (role === 'bendahara') return 'success';
    if (role === 'pengurus_rt') return 'info';
    return 'default';
  }
</script>

<div class="page-container">
  <PageHeader
    title="Pengguna & Role"
    subtitle="Satu akun untuk satu orang. Akun warga harus ditautkan ke data kependudukan supaya portalnya terisi."
  >
    <a href="/pengaturan" class="btn btn-secondary">
      <ArrowLeft size={16} />
      <span>Kembali</span>
    </a>
  </PageHeader>

  {#if form?.error}
    <p class="banner banner-error" role="alert">{form.error}</p>
  {/if}
  {#if form?.sukses}
    <p class="banner banner-sukses" role="status">{form.sukses}</p>
  {/if}

  {#if !data.bisaKelola}
    <p class="banner banner-info">
      Hanya admin RW yang bisa mengelola akun pengguna.
    </p>
  {:else}
    {#if data.errorUser}
      <p class="banner banner-error" role="alert">{data.errorUser}</p>
    {/if}

    {#if data.bisaTambah}
      <form method="POST" action="?/tambah" class="card form-card">
        <h2>Buat akun baru</h2>

        <div class="form-grid">
          <div class="field">
            <label for="email">Email <span class="required">*</span></label>
            <input
              id="email"
              name="email"
              class="input-base"
              type="email"
              autocomplete="off"
              placeholder="nama@warga.id"
              required
            />
          </div>

          <div class="field">
            <label for="name">Nama tampilan <span class="required">*</span></label>
            <input
              id="name"
              name="name"
              class="input-base"
              type="text"
              maxlength="100"
              placeholder="Nama lengkap"
              required
            />
          </div>

          <div class="field">
            <label for="password">Kata sandi <span class="required">*</span></label>
            <input
              id="password"
              name="password"
              class="input-base"
              type="password"
              minlength="8"
              autocomplete="new-password"
              required
            />
            <span class="hint">Minimal 8 karakter.</span>
          </div>

          <div class="field">
            <label for="role">Role <span class="required">*</span></label>
            <select id="role" name="role" class="input-base" required>
              {#each data.daftarRole as role}
                <option value={role}>{data.labelRole[role]}</option>
              {/each}
            </select>
          </div>

          <div class="field field-lebar">
            <label for="wargaId">Tautkan ke warga (opsional)</label>
            <select id="wargaId" name="wargaId" class="input-base">
              <option value="">— Tidak ditautkan —</option>
              {#each wargaBelumTertaut as w}
                <option value={w.id}>
                  {w.nama} · NIK {w.nik} · RT {String(w.nomorRt).padStart(2, '0')}
                </option>
              {/each}
            </select>
            <span class="hint">
              Kalau ditautkan, role otomatis jadi Warga dan portal langsung terisi data orang tersebut.
            </span>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            <UserPlus size={16} />
            <span>Buat akun</span>
          </button>
        </div>
      </form>
    {/if}

    <div class="card table-card">
      <h2>Daftar akun ({data.daftarUser.length})</h2>

      {#if data.daftarUser.length === 0}
        <p class="empty">Belum ada akun.</p>
      {:else}
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
                <th>RT tugas</th>
                <th>Warga tertaut</th>
                {#if data.bisaAturRole || data.bisaHapus}<th><span class="sr-only">Aksi</span></th>{/if}
              </tr>
            </thead>
            <tbody>
              {#each data.daftarUser as user (user.id)}
                {@const tertaut = wargaDariUser(user.id)}
                {@const tugas = tugasDariUser(user.id)}
                <tr>
                  <td class="font-bold">{user.name}</td>
                  <td class="mono">{user.email}</td>
                  <td>
                    <Badge variant={roleBadge(user.role)}>
                      {data.labelRole[(user.role ?? 'warga') as keyof typeof data.labelRole] ??
                        user.role ??
                        '—'}
                    </Badge>
                  </td>
                  <td>
                    {#if isPengurusRt(user.role)}
                      {#if tugas}
                        <span class="tertaut">RT {String(tugas.nomorRt).padStart(2, '0')}</span>
                      {:else}
                        <span class="muted">Belum ditugaskan</span>
                      {/if}

                      {#if data.bisaAturRole}
                        <form method="POST" action="?/aturRt" class="inline">
                          <input type="hidden" name="userId" value={user.id} />
                          <select name="rtId" class="input-base input-role" aria-label="RT tugas">
                            {#each data.daftarRt as r}
                              <option value={r.id} selected={tugas?.rtId === r.id}>
                                RT {String(r.nomor).padStart(2, '0')}
                              </option>
                            {/each}
                          </select>
                          <button type="submit" class="btn btn-secondary btn-sm">Simpan</button>
                        </form>
                        {#if tugas}
                          <form method="POST" action="?/lepasRt" class="inline">
                            <input type="hidden" name="userId" value={user.id} />
                            <button type="submit" class="btn btn-ghost btn-sm">Lepas</button>
                          </form>
                        {/if}
                      {/if}
                    {:else}
                      <span class="muted">-</span>
                    {/if}
                  </td>
                  <td>
                    {#if tertaut}
                      <span class="tertaut">{tertaut.nama}</span>
                      <form method="POST" action="?/lepas" class="inline">
                        <input type="hidden" name="wargaId" value={tertaut.id} />
                        <button type="submit" class="btn btn-ghost btn-sm">Lepas</button>
                      </form>
                    {:else}
                      <span class="muted">—</span>
                    {/if}
                  </td>
                  {#if data.bisaAturRole || data.bisaHapus}
                    <td class="aksi">
                      {#if data.bisaAturRole}
                        <form method="POST" action="?/ubahRole" class="inline">
                          <input type="hidden" name="userId" value={user.id} />
                          <select name="role" class="input-base input-role" aria-label="Role">
                            {#each data.daftarRole as role}
                              <option value={role} selected={(user.role ?? 'warga') === role}>
                                {data.labelRole[role]}
                              </option>
                            {/each}
                          </select>
                          <button type="submit" class="btn btn-secondary btn-sm">Ubah</button>
                        </form>
                      {/if}

                      {#if data.bisaAturRole}
                        <details class="tautkan">
                          <summary class="btn btn-secondary btn-sm">Tautkan</summary>
                          <form method="POST" action="?/tautkan" class="tautkan-form">
                            <input type="hidden" name="userId" value={user.id} />
                            <select name="wargaId" class="input-base" required>
                              <option value="">Pilih warga…</option>
                              {#each data.daftarWarga as w}
                                <option value={w.id}>
                                  {w.nama} · RT {String(w.nomorRt).padStart(2, '0')}
                                  {w.userId ? ' (sudah tertaut)' : ''}
                                </option>
                              {/each}
                            </select>
                            <button type="submit" class="btn btn-primary btn-sm">Simpan</button>
                          </form>
                        </details>
                      {/if}

                      {#if data.bisaHapus}
                        <form
                          method="POST"
                          action="?/hapus"
                          onsubmit={(e) => {
                            if (!confirm(`Hapus akun ${user.email}?`)) e.preventDefault();
                          }}
                        >
                          <input type="hidden" name="userId" value={user.id} />
                          <button type="submit" class="btn btn-ghost btn-sm btn-hapus">
                            Hapus
                          </button>
                        </form>
                      {/if}
                    </td>
                  {/if}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>

    <div class="card table-card">
      <h2>Warga belum punya akun ({wargaBelumTertaut.length})</h2>
      {#if wargaBelumTertaut.length === 0}
        <p class="empty">Semua warga aktif sudah punya akun.</p>
      {:else}
        <ul class="warga-list">
          {#each wargaBelumTertaut as w}
            <li>
              <span class="font-bold">{w.nama}</span>
              <span class="muted">NIK {w.nik} · RT {String(w.nomorRt).padStart(2, '0')}</span>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
</div>

<style>
  .page-container {
    max-width: 64rem;
  }

  .banner {
    margin: 0 0 var(--space-4);
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    border: 1px solid var(--color-border);
  }

  .banner-error {
    border-color: color-mix(in oklab, var(--color-danger) 35%, transparent);
    background: var(--color-danger-bg);
    color: var(--color-danger);
  }

  .banner-sukses {
    border-color: color-mix(in oklab, var(--color-success) 35%, transparent);
    background: var(--color-success-bg);
    color: var(--color-success);
  }

  .banner-info {
    background: var(--color-surface-muted);
    color: var(--color-text-muted);
  }

  .form-card {
    padding: var(--space-5);
    margin-bottom: var(--space-4);
  }

  h2 {
    margin: 0 0 var(--space-4);
    font-size: var(--text-base);
    font-weight: 600;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
    gap: var(--space-3);
  }

  .field-lebar {
    grid-column: 1 / -1;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  label {
    font-size: var(--text-sm);
    font-weight: 500;
  }

  .required {
    color: var(--color-danger);
  }

  .hint {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--space-4);
  }

  .table-card {
    padding: var(--space-5);
    margin-bottom: var(--space-4);
  }

  .empty {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    margin: 0;
  }

  .table-wrap {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-sm);
  }

  th,
  td {
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
    text-align: left;
    vertical-align: middle;
  }

  th {
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--color-text-muted);
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  .font-bold {
    font-weight: 700;
  }

  .mono {
    font-family: var(--font-mono, ui-monospace, SFMono-Regular, monospace);
    font-size: var(--text-xs);
    overflow-wrap: anywhere;
  }

  .muted {
    color: var(--color-text-muted);
    font-size: var(--text-xs);
  }

  .tertaut {
    font-weight: 600;
  }

  .aksi {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .inline {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
  }

  .input-role {
    width: 9rem;
    min-height: var(--tap-min);
  }

  .tautkan {
    position: relative;
  }

  .tautkan > summary {
    list-style: none;
    cursor: pointer;
  }

  .tautkan > summary::-webkit-details-marker {
    display: none;
  }

  .tautkan-form {
    display: flex;
    gap: var(--space-2);
    align-items: center;
    margin-top: var(--space-2);
  }

  .btn-sm {
    min-height: var(--tap-min);
    padding-inline: var(--space-3);
    font-size: var(--text-sm);
  }

  .btn-hapus {
    color: var(--color-danger);
  }

  .btn-hapus:hover {
    background: var(--color-danger-bg);
  }

  .warga-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    font-size: var(--text-sm);
  }

  .warga-list li {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    align-items: baseline;
    padding-bottom: var(--space-2);
    border-bottom: 1px solid var(--color-border);
  }

  .warga-list li:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
</style>
