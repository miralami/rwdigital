<script lang="ts">
  import { page } from '$app/state';

  const status  = $derived(page.status);
  const denied  = $derived(status === 403);
  const title   = $derived(denied ? 'Akses ditolak' : 'Halaman tidak ditemukan');
  const message = $derived(
    denied
      ? 'Akun Anda tidak punya akses ke halaman ini. Hubungi pengurus RW bila ini keliru.'
      : 'Halaman yang Anda cari tidak ada atau sudah dipindahkan.'
  );
</script>

<svelte:head>
  <title>{title} — RW Digital</title>
</svelte:head>

<div class="error-page">
  <div class="error-box">
    <p class="error-code">{status}</p>
    <h1 class="error-title">{title}</h1>
    <p class="error-message">{message}</p>
    <a class="btn-back" href="/">Kembali ke halaman utama</a>
  </div>
</div>

<style>
  .error-page {
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    background: var(--color-surface);
    font-family: var(--font-sans);
  }

  .error-box {
    width: 100%;
    max-width: 24rem;
    text-align: center;
    background: var(--color-surface-raised);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-2xl);
    padding: 2.5rem 2rem;
    box-shadow: var(--shadow-lg);
  }

  .error-code {
    font-size: 2.75rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
    color: var(--color-text-disabled);
    margin: 0 0 0.75rem;
  }

  .error-title {
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.015em;
    color: var(--color-text-primary);
    margin: 0 0 0.5rem;
  }

  .error-message {
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--color-text-secondary);
    margin: 0 0 1.75rem;
  }

  .btn-back {
    display: inline-block;
    padding: 0.625rem 1.125rem;
    background: var(--color-brand-700);
    color: #fff;
    border: 1px solid var(--color-brand-800);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
  }

  .btn-back:hover {
    background: var(--color-brand-800);
  }
</style>
