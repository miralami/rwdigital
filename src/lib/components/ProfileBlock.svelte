<script lang="ts">
  import LogOut from '@lucide/svelte/icons/log-out';
  import { formatRole, inisial } from '$lib/format';

  interface Props {
    user?: { name?: string; email?: string; role?: string } | null;
    onLogout: () => void;
    /** true saat dipakai di dalam sheet/menu sempit. */
    compact?: boolean;
  }

  let { user, onLogout, compact = false }: Props = $props();
</script>

<div class="profile" class:compact>
  <span class="profile-avatar" aria-hidden="true">{inisial(user?.name)}</span>
  <span class="profile-text">
    <span class="profile-name">{user?.name ?? 'Pengurus'}</span>
    <span class="profile-role">{formatRole(user?.role)}</span>
  </span>
  <button type="button" class="profile-logout" onclick={onLogout}>
    <LogOut size={16} />
    <span>Keluar</span>
  </button>
</div>

<style>
  .profile {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    background-color: var(--color-surface-muted);
  }

  .profile-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    flex-shrink: 0;
    border-radius: var(--radius-full);
    background-color: var(--color-accent);
    color: var(--color-accent-contrast);
    font-size: var(--text-sm);
    font-weight: 700;
  }

  .profile-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
  }

  .profile-name {
    font-size: var(--text-sm);
    font-weight: 600;
    line-height: 1.3;
    color: var(--color-text);
    overflow-wrap: anywhere;
  }

  .profile-role {
    font-size: var(--text-xs);
    line-height: 1.3;
    color: var(--color-text-muted);
  }

  /* Keluar bukan tindakan destruktif — netral, bukan merah. */
  .profile-logout {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    flex-shrink: 0;
    min-height: 2.25rem;
    padding: 0.375rem var(--space-3);
    font-family: inherit;
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--color-text);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color 0.15s ease, border-color 0.15s ease;
  }
  .profile-logout:hover {
    background-color: var(--color-surface);
    border-color: var(--color-text-muted);
  }

  .compact {
    background-color: transparent;
    padding: 0;
  }
</style>
