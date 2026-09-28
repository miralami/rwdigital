<script lang="ts">
  import { signIn } from '$lib/auth-client';
  import { goto } from '$app/navigation';
  import { Building2, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from '@lucide/svelte';

  let email    = $state('');
  let password = $state('');
  let error    = $state('');
  let loading  = $state(false);

  async function handleLogin(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    error   = '';

    const result = await signIn.email({ email, password });
    if (result.error) {
      error = result.error.message ?? 'Login gagal. Periksa kembali email dan kata sandi Anda.';
    } else {
      // Ke '/' supaya server yang memutuskan landing page (portal warga atau
      // dashboard) dari role. Tidak ada pembacaan session di client.
      goto('/', { invalidateAll: true });
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
      <div class="card-header">
        <h2>Masuk ke Akun</h2>
        <p>Silakan masukkan kredensial terdaftar untuk melanjutkan.</p>
      </div>

      {#if error}
        <div class="login-error" role="alert">
          <AlertCircle size={16} />
          <span>{error}</span>
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
              placeholder="pengurus@rw.id"
            />
          </div>
        </div>

        <div class="field">
          <label for="password">Kata Sandi</label>
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
    max-width: 25rem;
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

  .card-header h2 {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0;
    letter-spacing: -0.015em;
  }

  .card-header p {
    font-size: 0.8125rem;
    color: var(--color-text-secondary);
    margin: 0.25rem 0 0;
  }

  .login-error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--color-danger-bg);
    color: var(--color-danger);
    border: 1px solid oklch(0.56 0.20 25 / 0.2);
    border-radius: var(--radius-md);
    padding: 0.625rem 0.75rem;
    font-size: 0.8125rem;
    margin-bottom: 1.25rem;
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

  label {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 0.75rem;
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 0.625rem 0.75rem 0.625rem 2.25rem;
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-family: var(--font-sans);
    background: var(--color-surface-raised);
    color: var(--color-text-primary);
    outline: none;
    box-shadow: var(--shadow-xs);
    transition: all 0.15s ease;
  }

  input:focus {
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px oklch(0.40 0.16 255 / 0.15);
  }

  .btn-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.6875rem 1rem;
    background: var(--color-brand-700);
    color: #fff;
    border: 1px solid var(--color-brand-800);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 600;
    font-family: var(--font-sans);
    cursor: pointer;
    box-shadow: var(--shadow-xs);
    transition: all 0.15s ease;
    margin-top: 0.5rem;
  }

  .btn-submit:hover:not(:disabled) {
    background: var(--color-brand-800);
    box-shadow: var(--shadow-sm);
  }

  .btn-submit:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  :global(.spinner) {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .login-footer {
    margin-top: 1.5rem;
    text-align: center;
  }

  .login-footer p {
    font-size: 0.75rem;
    color: var(--color-text-disabled);
    margin: 0;
  }
</style>
