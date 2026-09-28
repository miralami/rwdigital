<script lang="ts">
  interface Props {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
    /** Petunjuk pendek di bawah field (opsional). */
    hint?: string;
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
    hint,
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
      aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
    />
  {/if}
  {#if error}
    <p class="field-error" id="{name}-error" role="alert">{error}</p>
  {:else if hint}
    <p class="field-hint" id="{name}-hint">{hint}</p>
  {/if}
</div>

<style>
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    margin-bottom: var(--space-5);
  }

  label {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text);
  }

  .required {
    color: var(--color-danger);
    margin-left: 0.125rem;
  }

  /* :global() karena control juga bisa datang dari `children` (select/textarea). */
  :global(input), :global(select), :global(textarea) {
    width: 100%;
    min-height: 2.5rem;
    padding: 0.5rem var(--space-3);
    font-family: inherit;
    font-size: var(--text-sm);
    line-height: 1.5;
    color: var(--color-text);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-md);
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  :global(input:focus), :global(select:focus), :global(textarea:focus) {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-accent) 18%, transparent);
  }

  .has-error :global(input),
  .has-error :global(select),
  .has-error :global(textarea) {
    border-color: var(--color-danger);
  }

  .has-error :global(input:focus),
  .has-error :global(select:focus),
  .has-error :global(textarea:focus) {
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-danger) 18%, transparent);
  }

  .field-hint {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .field-error {
    margin: 0;
    font-size: var(--text-xs);
    font-weight: 500;
    color: var(--color-danger);
  }
</style>
