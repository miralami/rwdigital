<script lang="ts">
  import type { Component, Snippet } from 'svelte';

  interface Props {
    /** Render sebagai <a> bila diisi, selain itu <button>. */
    href?: string;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
    icon?: Component<any>;
    iconPosition?: 'start' | 'end';
    disabled?: boolean;
    fullWidth?: boolean;
    ariaLabel?: string;
    title?: string;
    class?: string;
    onclick?: (e: MouseEvent) => void;
    children?: Snippet;
  }

  let {
    href,
    variant = 'secondary',
    size = 'md',
    type = 'button',
    icon: Icon,
    iconPosition = 'start',
    disabled = false,
    fullWidth = false,
    ariaLabel,
    title,
    class: className = '',
    onclick,
    children
  }: Props = $props();

  const iconSize = $derived(size === 'sm' ? 15 : 16);
  const classes = $derived(
    ['btn', `btn-${variant}`, size !== 'md' ? `btn-${size}` : '', fullWidth ? 'btn-block' : '', className]
      .filter(Boolean)
      .join(' ')
  );
</script>

{#if href}
  <a {href} class={classes} aria-label={ariaLabel} {title} onclick={onclick}>
    {#if Icon && iconPosition === 'start'}<Icon size={iconSize} />{/if}
    {@render children?.()}
    {#if Icon && iconPosition === 'end'}<Icon size={iconSize} />{/if}
  </a>
{:else}
  <button
    {type}
    class={classes}
    disabled={disabled}
    aria-label={ariaLabel}
    {title}
    {onclick}
  >
    {#if Icon && iconPosition === 'start'}<Icon size={iconSize} />{/if}
    {@render children?.()}
    {#if Icon && iconPosition === 'end'}<Icon size={iconSize} />{/if}
  </button>
{/if}
