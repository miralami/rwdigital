<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand';
    dot?: boolean;
    children?: Snippet;
  }

  let { variant = 'default', dot = false, children }: Props = $props();
</script>

<!-- Styling berasal dari .badge global di app.css — satu sumber kebenaran. -->
<span class="badge variant-{variant}">
  {#if dot}<span class="badge-dot" aria-hidden="true"></span>{/if}
  {@render children?.()}
</span>
