<script lang="ts">
  import { signIn, authClient } from '$lib/auth-client';
  import { goto } from '$app/navigation';
  import Building2 from '@lucide/svelte/icons/building-2';
  import Mail from '@lucide/svelte/icons/mail';
  import Lock from '@lucide/svelte/icons/lock';
  import AlertCircle from '@lucide/svelte/icons/alert-circle';
  import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Loader2 from '@lucide/svelte/icons/loader-2';
  import UserCheck from '@lucide/svelte/icons/user-check';
  import KeyRound from '@lucide/svelte/icons/key-round';

  let mode = $state<'masuk' | 'lupa' | 'klaim'>('masuk');

  // Form states
  let email = $state('');
  let password = $state('');
  let error = $state('');
  let successMsg = $state('');
  let loading = $state(false);

  // Klaim fields
  let klaimNik = $state('');
  let klaimNoKk = $state('');
  let klaimTglLahir = $state('');
  let klaimEmail = $state('');
  let klaimPassword = $state('');

  function resetForm() {
    error = '';
    successMsg = '';
  }

  async function handleLogin(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    resetForm();

    const result = await signIn.email({ email, password });
    if (result.error) {
      // Pesan Better Auth berbahasa Inggris; tampilkan versi Bahasa Indonesia.
      error =
        result.error.status === 429
          ? 'Terlalu banyak percobaan masuk. Tunggu beberapa saat lalu coba lagi.'
          : 'Login gagal. Periksa kembali email dan kata sandi Anda.';
    } else {
      goto('/', { invalidateAll: true });
    }
    loading = false;
  }

  async function handleLupaPassword(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    resetForm();

    try {
      const res = await (authClient as any).forgetPassword({
        email,
        redirectTo: '/login?reset=sukses'
      });
      if (res.error) {
        error = res.error.message ?? 'Gagal memproses permintaan reset password.';
      } else {
        successMsg = `Instruksi reset kata sandi telah dikirimkan ke email ${email}. Silakan periksa kotak masuk atau spam email Anda.`;
      }
    } catch (err: any) {
      error = err.message || 'Terjadi kesalahan saat meminta reset kata sandi.';
    }
    loading = false;
  }

  async function handleKlaimAkun(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    resetForm();

    try {
      const res = await fetch('/api/auth/klaim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nik: klaimNik,
          noKk: klaimNoKk,
          tanggalLahir: klaimTglLahir,
          email: klaimEmail,
          password: klaimPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        error = data.error ?? 'Gagal mengklaim akun warga.';
      } else {
        successMsg = data.message;
        mode = 'masuk';
        email = klaimEmail;
      }
    } catch (err: any) {
      error = err.message || 'Gagal menghubungi server.';
    }
    loading = false;
  }
</script>

<div class="login-page">
  <div class="login-wrapper">
    <div class="brand-crest">
      <div class="crest-icon-box">
        <Building2 size={28} />
      </div>
      <h1 class="brand-name">RW Digital</h1>
      <p class="brand-subtitle">Portal Pelayanan & Tata Kelola Lingkungan</p>
    </div>

    <div class="login-card">
      {#if mode === 'masuk'}
        <div class="card-header">
          <h2>Masuk ke Akun</h2>
          <p>Silakan masukkan kredensial terdaftar untuk melanjutkan.</p>
        </div>

        {#if error}
          <div class="login-banner banner-error" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        {/if}
        {#if successMsg}
          <div class="login-banner banner-success" role="status">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        {/if}

        <form onsubmit={handleLogin} class="login-form">
          <div class="field">
            <label for="email">Alamat Email</label>
            <div class="input-wrap">
              <span class="input-icon">
                <Mail size={16} />
              </span>
              <input
                id="email"
                type="email"
                bind:value={email}
                required
                autocomplete="email"
                placeholder="nama@email.com"
              />
            </div>
          </div>

          <div class="field">
            <div class="label-row">
              <label for="password">Kata Sandi</label>
              <button
                type="button"
                class="link-btn"
                onclick={() => { mode = 'lupa'; resetForm(); }}
              >
                Lupa kata sandi?
              </button>
            </div>
            <div class="input-wrap">
              <span class="input-icon">
                <Lock size={16} />
              </span>
              <input
                id="password"
                type="password"
                bind:value={password}
                required
                autocomplete="current-password"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} class="btn-submit">
            {#if loading}
              <Loader2 size={16} class="spinner" />
              <span>Memverifikasi...</span>
            {:else}
              <span>Masuk ke Sistem</span>
              <ArrowRight size={16} />
            {/if}
          </button>
        </form>

        <div class="card-divider">
          <span>atau</span>
        </div>

        <button
          type="button"
          class="btn-secondary-full"
          onclick={() => { mode = 'klaim'; resetForm(); }}
        >
          <UserCheck size={16} />
          <span>Warga Baru? Klaim Akun Kependudukan</span>
        </button>

      {:else if mode === 'lupa'}
        <div class="card-header">
          <button
            type="button"
            class="back-inline-btn"
            onclick={() => { mode = 'masuk'; resetForm(); }}
          >
            <ArrowLeft size={16} />
            <span>Kembali ke login</span>
          </button>
          <h2>Pemulihan Kata Sandi</h2>
          <p>Masukkan alamat email akun warga Anda untuk menerima instruksi reset.</p>
        </div>

        {#if error}
          <div class="login-banner banner-error" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        {/if}
        {#if successMsg}
          <div class="login-banner banner-success" role="status">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        {/if}

        <form onsubmit={handleLupaPassword} class="login-form">
          <div class="field">
            <label for="reset-email">Email Terdaftar</label>
            <div class="input-wrap">
              <span class="input-icon">
                <Mail size={16} />
              </span>
              <input
                id="reset-email"
                type="email"
                bind:value={email}
                required
                placeholder="nama@email.com"
              />
            </div>
            <span class="hint-text">Tautan pemulihan akan dikirimkan ke alamat email terdaftar saat klaim.</span>
          </div>

          <button type="submit" disabled={loading} class="btn-submit">
            {#if loading}
              <Loader2 size={16} class="spinner" />
              <span>Mengirimkan...</span>
            {:else}
              <KeyRound size={16} />
              <span>Kirim Tautan Reset</span>
            {/if}
          </button>
        </form>

      {:else if mode === 'klaim'}
        <div class="card-header">
          <button
            type="button"
            class="back-inline-btn"
            onclick={() => { mode = 'masuk'; resetForm(); }}
          >
            <ArrowLeft size={16} />
            <span>Kembali ke login</span>
          </button>
          <h2>Klaim Akun Warga</h2>
          <p>Verifikasi data NIK &amp; daftarkan email pribadi untuk aktivasi akun warga.</p>
        </div>

        {#if error}
          <div class="login-banner banner-error" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        {/if}

        <form onsubmit={handleKlaimAkun} class="login-form">
          <div class="field">
            <label for="nik">Nomor Induk Kependudukan (NIK)</label>
            <input
              id="nik"
              type="text"
              maxlength="16"
              bind:value={klaimNik}
              class="input-plain"
              required
              placeholder="16 digit NIK sesuai KTP"
            />
          </div>

          <div class="field">
            <label for="nokk">Nomor Kartu Keluarga (No. KK)</label>
            <input
              id="nokk"
              type="text"
              maxlength="16"
              bind:value={klaimNoKk}
              class="input-plain"
              required
              placeholder="16 digit Nomor KK"
            />
          </div>

          <div class="field">
            <label for="tglLahir">Tanggal Lahir</label>
            <input
              id="tglLahir"
              type="date"
              bind:value={klaimTglLahir}
              class="input-plain"
              required
            />
          </div>

          <div class="field">
            <label for="kemail">Alamat Email Aktif</label>
            <input
              id="kemail"
              type="email"
              bind:value={klaimEmail}
              class="input-plain"
              required
              placeholder="email.aktif@gmail.com"
            />
            <span class="hint-text">Digunakan untuk menerima pemberitahuan iuran &amp; pemulihan kata sandi.</span>
          </div>

          <div class="field">
            <label for="kpass">Buat Kata Sandi Baru</label>
            <input
              id="kpass"
              type="password"
              minlength="6"
              bind:value={klaimPassword}
              class="input-plain"
              required
              placeholder="Minimal 6 karakter"
            />
          </div>

          <button type="submit" disabled={loading} class="btn-submit">
            {#if loading}
              <Loader2 size={16} class="spinner" />
              <span>Memverifikasi Data...</span>
            {:else}
              <UserCheck size={16} />
              <span>Aktivasi Akun Saya</span>
            {/if}
          </button>
        </form>
      {/if}
    </div>

    <footer class="login-footer">
      <p>Sistem Informasi Administrasi Rukun Warga</p>
    </footer>
  </div>
</div>

<style>
  .login-page {
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at 50% 0%, var(--color-brand-100) 0%, var(--color-surface) 75%);
    padding: 2rem 1rem;
    font-family: var(--font-sans);
  }

  .login-wrapper {
    width: 100%;
    max-width: 26rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .brand-crest {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .crest-icon-box {
    width: 3.25rem;
    height: 3.25rem;
    border-radius: var(--radius-xl);
    background: linear-gradient(135deg, var(--color-brand-600) 0%, var(--color-brand-900) 100%);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px oklch(0.2 0.08 255 / 0.25);
    margin-bottom: 0.75rem;
  }

  .brand-name {
    font-size: 1.375rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: var(--color-text-primary);
    margin: 0;
  }

  .brand-subtitle {
    font-size: 0.8125rem;
    color: var(--color-text-secondary);
    margin: 0.25rem 0 0;
  }

  .login-card {
    background: var(--color-surface-raised);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-2xl);
    padding: 2rem;
    width: 100%;
    box-shadow: var(--shadow-lg);
  }

  .card-header {
    margin-bottom: 1.5rem;
  }

  .back-inline-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: transparent;
    border: none;
    padding: 0;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-brand-600);
    cursor: pointer;
  }

  .back-inline-btn:hover {
    text-decoration: underline;
  }

  .card-header h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0 0 0.375rem 0;
  }

  .card-header p {
    font-size: 0.8125rem;
    color: var(--color-text-secondary);
    margin: 0;
    line-height: 1.4;
  }

  .login-banner {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    padding: 0.75rem;
    border-radius: var(--radius-md);
    font-size: 0.8125rem;
    margin-bottom: 1.25rem;
    line-height: 1.4;
  }

  .banner-error {
    background: var(--color-danger-subtle);
    color: var(--color-danger);
    border: 1px solid var(--color-danger-border);
  }

  .banner-success {
    background: var(--color-success-bg);
    color: var(--color-success);
    border: 1px solid var(--color-success);
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.125rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .link-btn {
    background: none;
    border: none;
    padding: 0;
    font-size: 0.75rem;
    color: var(--color-brand-600);
    cursor: pointer;
    text-decoration: none;
  }

  .link-btn:hover {
    text-decoration: underline;
  }

  label {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .hint-text {
    font-size: 0.7rem;
    color: var(--color-text-muted);
  }

  .input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 0.875rem;
    color: var(--color-text-secondary);
    pointer-events: none;
    display: flex;
  }

  .input-wrap input {
    width: 100%;
    padding: 0.6875rem 0.875rem 0.6875rem 2.5rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text-primary);
    font-size: 0.875rem;
    transition: all 0.15s ease;
  }

  .input-plain {
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text-primary);
    font-size: 0.875rem;
  }

  .input-wrap input:focus,
  .input-plain:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px oklch(0.55 0.22 255 / 0.15);
  }

  .btn-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem;
    border-radius: var(--radius-md);
    background: var(--color-brand-600);
    color: #fff;
    font-size: 0.875rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background 0.15s ease;
    margin-top: 0.5rem;
  }

  .btn-submit:hover:not(:disabled) {
    background: var(--color-brand-700);
  }

  .btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .card-divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 1.25rem 0;
    color: var(--color-text-muted);
    font-size: 0.75rem;
  }

  .card-divider::before,
  .card-divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--color-border);
  }

  .card-divider span {
    padding: 0 0.5rem;
  }

  .btn-secondary-full {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.625rem;
    border-radius: var(--radius-md);
    background: var(--color-surface-muted);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .btn-secondary-full:hover {
    background: var(--color-brand-50);
    border-color: var(--color-brand-300);
    color: var(--color-brand-700);
  }

  .login-footer {
    margin-top: 2rem;
    text-align: center;
  }

  .login-footer p {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  :global(.spinner) {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>
