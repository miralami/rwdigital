<script lang="ts">
  interface Props {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
    value?: any;
    oninput?: (e: Event) => void;
    onchange?: (e: Event) => void;
    children?: any;
    class?: string;
  }

  let {
    label,
    name,
    type = 'text',
    placeholder,
    required = false,
    error,
    value = $bindable(),
    oninput,
    onchange,
    children,
    class: className
  }: Props = $props();
</script>

<div class="form-field{error ? ' has-error' : ''}{className ? ' ' + className : ''}">
  <label for={name}>
    {label}
    {#if required}<span class="required" aria-hidden="true">*</span>{/if}
  </label>
  {#if children}
    {@render children()}
  {:else}
    <input
      {type}
      {name}
      id={name}
      {placeholder}
      {required}
      bind:value
      {oninput}
      {onchange}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
    />
  {/if}
  {#if error}
    <p class="field-error" id="{name}-error" role="alert">{error}</p>
  {/if}
</div>

<style>
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    margin-bottom: 1.125rem;
  }

  label {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-text-primary);
    letter-spacing: -0.01em;
  }

  .required {
    color: var(--color-danger);
    margin-left: 0.15rem;
  }

  /* svelte-ignore css_unused_selector */
  input, select, textarea {
    padding: 0.5625rem 0.75rem;
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-family: var(--font-sans);
    background: var(--color-surface-raised);
    color: var(--color-text-primary);
    outline: none;
    box-shadow: var(--shadow-xs);
    transition: border-color 0.15s, box-shadow 0.15s;
    width: 100%;
    box-sizing: border-box;
  }

  input:focus, select:focus, textarea:focus {
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px oklch(0.40 0.16 255 / 0.12);
  }

  .has-error input,
  .has-error select,
  .has-error textarea {
    border-color: var(--color-danger);
  }

  .has-error input:focus,
  .has-error select:focus,
  .has-error textarea:focus {
    box-shadow: 0 0 0 3px oklch(0.56 0.20 25 / 0.15);
  }

  .field-error {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-danger);
    margin: 0.125rem 0 0;
  }
</style>
