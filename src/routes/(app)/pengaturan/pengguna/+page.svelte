<script lang="ts">
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import UserPlus from '@lucide/svelte/icons/user-plus';
  import ShieldCheck from '@lucide/svelte/icons/shield-check';
  import Plus from '@lucide/svelte/icons/plus';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import Users from '@lucide/svelte/icons/users';
  import Lock from '@lucide/svelte/icons/lock';
  import type { Izin } from '$lib/akses';
  import type { PageData } from './$types';

  let { data, form } = $props<{
    data: PageData;
    form?: { error?: string; sukses?: string };
  }>();

  let activeTab = $state<'pengguna' | 'peran'>('pengguna');
  let openPeran = $state<Record<number, boolean>>({});

  function togglePeran(id: number) {
    openPeran[id] = !openPeran[id];
  }

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
    if (role === 'ketua_rw') return 'brand';
    if (role === 'sekretaris') return 'info';
    return 'default';
  }

  function isAdminRw(role?: string | null) {
    return (role ?? '')
      .split(',')
      .map((r) => r.trim().toLowerCase())
      .includes('admin_rw');
  }
</script>

{#snippet matriks(nilai: Izin, bisaUbah: boolean)}
  <div class="matriks">
    {#each data.modulAkses as modul (modul.key)}
      <div class="matriks-baris">
        <div class="matriks-info">
          <span class="matriks-label">{modul.label}</span>
          <span class="matriks-desc">{modul.deskripsi}</span>
        </div>
        <div class="matriks-aksi">
          {#each modul.aksi as aksi (aksi)}
            <label class="chip" class:nonaktif={!bisaUbah}>
              <input
                type="checkbox"
                name={`izin_${modul.key}`}
                value={aksi}
                checked={Boolean(nilai[modul.key]?.includes(aksi))}
                disabled={!bisaUbah}
              />
              <span>{data.labelAksi[aksi] ?? aksi}</span>
            </label>
          {/each}
        </div>
      </div>
    {/each}
  </div>
{/snippet}

<div class="page-container">
  <PageHeader
    title="Pengguna & Hak Akses"
    subtitle="Kelola akun pengguna, penugasan wilayah RT, dan konfigurasi matriks peran & izin."
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

  <!-- TAB SWITCHER -->
  <div class="tabs-bar">
    <div class="tabs-container">
      <button
        class="tab-btn"
        class:active={activeTab === 'pengguna'}
        onclick={() => (activeTab = 'pengguna')}
      >
        <Users size={16} />
        <span>Akun Pengguna ({data.daftarUser.length})</span>
      </button>
      <button
        class="tab-btn"
        class:active={activeTab === 'peran'}
        onclick={() => (activeTab = 'peran')}
      >
        <ShieldCheck size={16} />
        <span>Peran & Izin ({data.daftarPeran.length})</span>
      </button>
    </div>
  </div>

  <!-- TAB 1: PENGGUNA -->
  {#if activeTab === 'pengguna'}
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
                        {#if data.bisaAturRole && !isAdminRw(user.role)}
                          <form method="POST" action="?/ubahRole" class="inline">
                            <input type="hidden" name="userId" value={user.id} />
                            <select name="role" class="input-base input-role" aria-label="Role">
                              {#each data.daftarRole as role}
                                <option value={role} selected={(user.role ?? 'warga') === role}>
                                  {data.labelRole[role] ?? role}
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

                        {#if data.bisaHapus && !isAdminRw(user.role)}
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
    {/if}
  {/if}

  <!-- TAB 2: PERAN & IZIN -->
  {#if activeTab === 'peran'}
    {#if !data.bisaKelolaPeran}
      <p class="banner banner-info">
        Hanya admin yang memiliki izin untuk membaca modul peran & izin.
      </p>
    {:else}
      <p class="banner banner-info">
        <ShieldCheck size={16} />
        <span>
          Izin menentukan menu yang muncul dan aksi yang boleh dijalankan. Halaman yang modulnya tidak
          dicentang akan ditolak dengan kode 403, bukan hanya disembunyikan.
        </span>
      </p>

      {#if data.aksesPeran.create}
        <form method="POST" action="?/tambahPeran" class="card form-card">
          <h2>Buat peran baru</h2>

          <div class="form-grid">
            <div class="field">
              <label for="nama-peran">Slug <span class="required">*</span></label>
              <input
                id="nama-peran"
                name="nama"
                class="input-base mono"
                type="text"
                maxlength="40"
                placeholder="petugas_posyandu"
                required
              />
              <span class="hint">Huruf kecil, angka, garis bawah, atau strip.</span>
            </div>

            <div class="field">
              <label for="label-peran">Nama tampilan <span class="required">*</span></label>
              <input
                id="label-peran"
                name="label"
                class="input-base"
                type="text"
                maxlength="60"
                placeholder="Petugas Posyandu"
                required
              />
            </div>

            <div class="field">
              <label for="tipe-peran">Tipe akses</label>
              <select id="tipe-peran" name="tipe" class="input-base">
                <option value="staff">Staf (dashboard pengurus)</option>
                <option value="warga">Warga (portal warga)</option>
              </select>
            </div>

            <div class="field">
              <label for="scope-peran">Batas data</label>
              <select id="scope-peran" name="scope" class="input-base">
                <option value="all">Seluruh RW</option>
                <option value="rt">RT yang ditugaskan</option>
                <option value="none">Tanpa data staf</option>
              </select>
            </div>

            <div class="field field-lebar">
              <label for="deskripsi-peran">Deskripsi</label>
              <input
                id="deskripsi-peran"
                name="deskripsi"
                class="input-base"
                type="text"
                maxlength="300"
                placeholder="Dipakai untuk apa peran ini?"
              />
            </div>
          </div>

          <h3 class="matriks-judul">Izin modul bawaan</h3>
          {@render matriks({}, true)}

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">
              <Plus size={16} />
              <span>Buat peran</span>
            </button>
          </div>
        </form>
      {/if}

      <!-- Collapsible Peran Cards (Accordion Style) -->
      <div class="peran-list">
        {#each data.daftarPeran as p (p.id)}
          {@const isExpanded = openPeran[p.id] ?? false}
          <article class="card peran-card" class:expanded={isExpanded}>
            <header class="peran-head" onclick={() => togglePeran(p.id)} role="button" tabindex="0" onkeydown={(e) => { if (e.key === 'Enter') togglePeran(p.id); }}>
              <div class="peran-head-left">
                <button type="button" class="btn-toggle-peran" aria-label={isExpanded ? 'Tutup matriks izin' : 'Buka matriks izin'}>
                  {#if isExpanded}
                    <ChevronDown size={18} />
                  {:else}
                    <ChevronRight size={18} />
                  {/if}
                </button>
                <div class="peran-identitas">
                  <div class="peran-judul">
                    <h3>{p.label}</h3>
                    <code>{p.nama}</code>
                    {#if p.superadmin}
                      <Badge variant="brand">Superadmin</Badge>
                    {/if}
                    {#if p.sistem && !p.superadmin}
                      <Badge variant="info">Bawaan sistem</Badge>
                    {/if}
                  </div>
                  <div class="peran-meta">
                    <span class="muted">{p.jumlahPengguna} akun memakai</span>
                    <span class="dot-sep">·</span>
                    <span class="muted">{p.tipe === 'staff' ? 'Staf (dashboard)' : 'Warga (portal)'}</span>
                    <span class="dot-sep">·</span>
                    <span class="muted">{p.scope === 'all' ? 'Seluruh RW' : p.scope === 'rt' ? 'RT tugas' : 'Tanpa data'}</span>
                  </div>
                </div>
              </div>

              {#if data.aksesPeran.delete && !p.sistem && !p.superadmin}
                <div onclick={(e) => e.stopPropagation()} role="presentation">
                  <form
                    method="POST"
                    action="?/hapusPeran"
                    onsubmit={(e) => {
                      if (!confirm(`Hapus peran ${p.label}?`)) e.preventDefault();
                    }}
                  >
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      type="submit"
                      class="btn btn-ghost btn-sm btn-hapus"
                      disabled={p.jumlahPengguna > 0}
                      title={p.jumlahPengguna > 0 ? 'Pindahkan akun pemakai lebih dulu' : 'Hapus peran'}
                    >
                      Hapus
                    </button>
                  </form>
                </div>
              {/if}
            </header>

            <!-- Expanded Body: Permissions Matrix Editor -->
            {#if isExpanded}
              <div class="peran-body">
                {#if p.superadmin}
                  <p class="banner banner-info superadmin-note">
                    <Lock size={16} />
                    <span>Peran superadmin selalu memiliki akses penuh ke seluruh modul dan aksi.</span>
                  </p>
                {:else}
                  <form method="POST" action="?/ubahPeran" class="ubah-peran-form">
                    <input type="hidden" name="id" value={p.id} />

                    <div class="form-grid">
                      <div class="field">
                        <label for={`label-${p.id}`}>Nama tampilan</label>
                        <input
                          id={`label-${p.id}`}
                          name="label"
                          class="input-base"
                          type="text"
                          value={p.label}
                          maxlength="60"
                          disabled={!data.aksesPeran.update}
                          required
                        />
                      </div>

                      <div class="field">
                        <label for={`tipe-${p.id}`}>Tipe akses</label>
                        <select
                          id={`tipe-${p.id}`}
                          name="tipe"
                          class="input-base"
                          disabled={!data.aksesPeran.update}
                        >
                          <option value="staff" selected={p.tipe === 'staff'}>Staf (dashboard)</option>
                          <option value="warga" selected={p.tipe === 'warga'}>Warga (portal)</option>
                        </select>
                      </div>

                      <div class="field">
                        <label for={`scope-${p.id}`}>Batas data</label>
                        <select
                          id={`scope-${p.id}`}
                          name="scope"
                          class="input-base"
                          disabled={!data.aksesPeran.update}
                        >
                          <option value="all" selected={p.scope === 'all'}>Seluruh RW</option>
                          <option value="rt" selected={p.scope === 'rt'}>RT tugas</option>
                          <option value="none" selected={p.scope === 'none'}>Tanpa data staf</option>
                        </select>
                      </div>

                      <div class="field field-lebar">
                        <label for={`deskripsi-${p.id}`}>Deskripsi</label>
                        <input
                          id={`deskripsi-${p.id}`}
                          name="deskripsi"
                          class="input-base"
                          type="text"
                          value={p.deskripsi ?? ''}
                          maxlength="300"
                          disabled={!data.aksesPeran.update}
                        />
                      </div>
                    </div>

                    <h4 class="matriks-subjudul">Matriks Izin Modul</h4>
                    {@render matriks(p.permissions, data.aksesPeran.update)}

                    {#if data.aksesPeran.update}
                      <div class="peran-simpan">
                        <button type="submit" class="btn btn-primary btn-sm">Simpan Izin Peran</button>
                      </div>
                    {/if}
                  </form>
                {/if}
              </div>
            {/if}
          </article>
        {/each}
      </div>
    {/if}
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
    display: flex;
    align-items: center;
    gap: var(--space-2);
    background: var(--color-surface-muted);
    color: var(--color-text-muted);
  }

  /* ─── TABS ─── */
  .tabs-bar {
    margin-bottom: var(--space-4);
  }

  .tabs-container {
    display: inline-flex;
    background: var(--color-surface-muted);
    padding: var(--space-1);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    gap: var(--space-1);
  }

  .tab-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    border: none;
    background: transparent;
    font-family: inherit;
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--color-text-muted);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: all 0.15s ease;
  }

  .tab-btn:hover {
    color: var(--color-text);
  }

  .tab-btn.active {
    background: var(--color-surface);
    color: var(--color-text);
    font-weight: 600;
    box-shadow: var(--shadow-sm);
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
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
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
    font-family: var(--font-mono, monospace);
    font-size: var(--text-xs);
  }

  .muted {
    color: var(--color-text-muted);
    font-size: var(--text-xs);
  }

  .tertaut {
    font-weight: 600;
  }

  .dot-sep {
    color: var(--color-text-muted);
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

  /* ─── PERAN LIST (ACCORDION) ─── */
  .peran-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .peran-card {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    overflow: hidden;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .peran-card:hover {
    border-color: var(--color-brand-300);
  }

  .peran-card.expanded {
    border-color: var(--color-brand-500);
    box-shadow: var(--shadow-sm);
  }

  .peran-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    cursor: pointer;
    user-select: none;
  }

  .peran-head-left {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex: 1;
  }

  .btn-toggle-peran {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border: none;
    background: var(--color-surface-muted);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    cursor: pointer;
    flex-shrink: 0;
  }

  .peran-identitas {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .peran-judul {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .peran-judul h3 {
    margin: 0;
    font-size: var(--text-sm);
    font-weight: 700;
  }

  .peran-meta {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-xs);
  }

  .peran-body {
    border-top: 1px solid var(--color-border);
    padding: var(--space-4);
    background: var(--color-surface-muted);
  }

  .ubah-peran-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .matriks-judul {
    font-size: var(--text-sm);
    font-weight: 600;
    margin: var(--space-4) 0 var(--space-2);
  }

  .matriks-subjudul {
    font-size: var(--text-xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--color-text-muted);
    margin: var(--space-2) 0 0;
  }

  .peran-simpan {
    display: flex;
    justify-content: flex-end;
  }

  /* ─── MATRIKS IZIN ─── */
  .matriks {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    background: var(--color-surface);
    padding: var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .matriks-baris {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding-bottom: var(--space-2);
    border-bottom: 1px solid var(--color-border);
  }

  .matriks-baris:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  @media (min-width: 640px) {
    .matriks-baris {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .matriks-info {
    display: flex;
    flex-direction: column;
  }

  .matriks-label {
    font-size: var(--text-xs);
    font-weight: 700;
  }

  .matriks-desc {
    font-size: var(--text-2xs);
    color: var(--color-text-muted);
  }

  .matriks-aksi {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--text-xs);
    cursor: pointer;
  }

  .chip.nonaktif {
    cursor: not-allowed;
    opacity: 0.6;
  }
</style>
