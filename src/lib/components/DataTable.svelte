<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Search, ArrowUpDown, ArrowUp, ArrowDown } from '@lucide/svelte';

  export interface Column {
    key: string;
    label: string;
    sortable?: boolean;
    class?: string;
    render?: (row: any) => string;
  }

  interface Props {
    columns: Column[];
    data: any[];
    searchable?: boolean;
    searchKeys?: string[];
    emptyMessage?: string;
    onRowClick?: (row: any) => void;
  }

  let {
    columns,
    data,
    searchable = true,
    searchKeys = [],
    emptyMessage = 'Tidak ada data.',
    onRowClick
  }: Props = $props();

  let searchQuery = $state('');
  let sortKey = $state<string | null>(null);
  let sortDir = $state<'asc' | 'desc'>('asc');

  const dispatch = createEventDispatcher<{ rowClick: { row: any } }>();

  let filtered = $derived.by(() => {
    let result = data;

    if (searchQuery && searchKeys.length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((row: any) =>
        searchKeys.some(key => {
          const val = row[key];
          return val != null && String(val).toLowerCase().includes(q);
        })
      );
    }

    if (sortKey) {
      result = [...result].sort((a: any, b: any) => {
        const aVal = a[sortKey!];
        const bVal = b[sortKey!];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }

    return result;
  });

  function toggleSort(key: string) {
    if (sortKey === key) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey = key;
      sortDir = 'asc';
    }
  }

  function handleRowClick(row: any) {
    dispatch('rowClick', { row });
    onRowClick?.(row);
  }
</script>

<div class="datatable">
  {#if searchable}
    <div class="datatable-toolbar">
      <div class="search-box">
        <span class="search-icon">
          <Search size={16} />
        </span>
        <input
          type="search"
          placeholder="Cari dalam tabel..."
          bind:value={searchQuery}
          class="search-input"
        />
      </div>
      <div class="toolbar-meta">
        <span class="count-badge">
          {filtered.length} dari {data.length} data
        </span>
      </div>
    </div>
  {/if}

  <div class="table-card">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            {#each columns as col}
              <th
                class={col.class ?? ''}
                class:sortable={col.sortable !== false}
                onclick={col.sortable !== false ? () => toggleSort(col.key) : undefined}
                role={col.sortable !== false ? 'button' : undefined}
                tabindex={col.sortable !== false ? 0 : undefined}
              >
                <div class="th-content">
                  <span>{col.label}</span>
                  {#if col.sortable !== false}
                    <span class="sort-icon" class:is-active={sortKey === col.key}>
                      {#if sortKey === col.key}
                        {#if sortDir === 'asc'}
                          <ArrowUp size={14} />
                        {:else}
                          <ArrowDown size={14} />
                        {/if}
                      {:else}
                        <ArrowUpDown size={14} />
                      {/if}
                    </span>
                  {/if}
                </div>
              </th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each filtered as row (row.id ?? JSON.stringify(row))}
            <tr
              onclick={() => handleRowClick(row)}
              class:clickable={!!onRowClick}
            >
              {#each columns as col}
                <td class={col.class ?? ''}>
                  {#if col.render}
                    {@html col.render(row)}
                  {:else}
                    {row[col.key] ?? '—'}
                  {/if}
                </td>
              {/each}
            </tr>
          {:else}
            <tr>
              <td colspan={columns.length} class="empty-cell">
                <p class="empty-text">{emptyMessage}</p>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

<style>
  .datatable {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .datatable-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .search-box {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 22rem;
  }

  .search-icon {
    position: absolute;
    left: 0.75rem;
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 0.5rem 0.75rem 0.5rem 2.25rem;
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

  .search-input:focus {
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px oklch(0.40 0.16 255 / 0.12);
  }

  .count-badge {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    background: var(--color-surface-overlay);
    padding: 0.25rem 0.625rem;
    border-radius: var(--radius-full);
    border: 1px solid var(--color-border);
  }

  .table-card {
    background: var(--color-surface-raised);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    overflow: hidden;
  }

  .table-wrap {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 0.875rem;
  }

  th {
    text-align: left;
    padding: 0.75rem 1rem;
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--color-text-secondary);
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    white-space: nowrap;
    user-select: none;
  }

  .th-content {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
  }

  .sort-icon {
    display: inline-flex;
    align-items: center;
    color: var(--color-text-disabled);
    transition: color 0.15s ease;
  }

  th.sortable {
    cursor: pointer;
  }

  th.sortable:hover {
    color: var(--color-text-primary);
    background: var(--color-surface-overlay);
  }

  th.sortable:hover .sort-icon {
    color: var(--color-text-secondary);
  }

  .sort-icon.is-active {
    color: var(--color-brand-600);
  }

  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--color-border);
    color: var(--color-text-primary);
    white-space: nowrap;
    background: var(--color-surface-raised);
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr {
    transition: background-color 0.1s ease;
  }

  tbody tr:hover td {
    background: var(--color-surface-overlay);
  }

  tbody tr.clickable {
    cursor: pointer;
  }

  .empty-cell {
    text-align: center;
    padding: 3rem 1rem !important;
    background: var(--color-surface-raised) !important;
  }

  .empty-text {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: 0.875rem;
  }
</style>
