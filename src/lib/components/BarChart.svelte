<script lang="ts">
  /**
   * Grafik batang horizontal berbasis SVG native (tanpa dependensi luar).
   *
   * Horizontal (bukan vertikal) dipilih karena kategori di sini adalah label
   * pendek seperti "RT 01" yang panjangnya seragam — jauh lebih mudah dibaca
   * daripada label miring di bawah sumbu-x.
   *
   * SSR-safe: seluruh perhitungan murni, tidak menyentuh DOM/window, sehingga
   * render server dan hidrasi browser identik.
   */

  interface Datum {
    label: string;
    value: number;
  }

  interface Props {
    data: Datum[];
    /** Satuan nilai untuk label aksesibilitas, mis. "jiwa". */
    unit?: string;
    /** Pesan saat tidak ada data (mencegah grafik kosong yang membingungkan). */
    emptyMessage?: string;
    /** Warna batang (nilai CSS color atau var token). */
    barColor?: string;
  }

  let {
    data,
    unit = '',
    emptyMessage = 'Data belum tersedia.',
    barColor = 'var(--color-brand-600)'
  }: Props = $props();

  // Geometri dalam satuan viewBox; SVG menskala sendiri ke lebar kontainer.
  const VB_W = 640;
  const LABEL_W = 84;
  const VALUE_W = 64;
  const BAR_H = 22;
  const ROW_H = 42;
  const PAD_Y = 6;
  const TRACK_X = LABEL_W;
  const TRACK_W = VB_W - LABEL_W - VALUE_W;

  const maxValue = $derived(Math.max(1, ...data.map((d) => d.value)));
  const height = $derived(data.length * ROW_H + PAD_Y * 2);

  const ariaLabel = $derived(
    `Grafik batang. ${data
      .map((d) => `${d.label} sebanyak ${d.value}${unit ? ' ' + unit : ''}`)
      .join('. ')}.`
  );

  function barWidth(value: number): number {
    // Batang dengan nilai > 0 tetap diberi lebar minimum agar terlihat.
    if (value <= 0) return 0;
    return Math.max(4, Math.round((value / maxValue) * TRACK_W));
  }
</script>

{#if data.length === 0}
  <p class="chart-empty">{emptyMessage}</p>
{:else}
  <svg
    class="bar-chart"
    viewBox="0 0 {VB_W} {height}"
    preserveAspectRatio="xMidYMid meet"
    role="img"
    aria-label={ariaLabel}
  >
    {#each data as d, i (d.label)}
      {@const rowY = PAD_Y + i * ROW_H}
      {@const barY = rowY + (ROW_H - BAR_H) / 2}
      <text
        class="bar-label"
        x={LABEL_W - 12}
        y={barY + BAR_H / 2}
        text-anchor="end"
        dominant-baseline="central"
      >
        {d.label}
      </text>

      <rect class="bar-track" x={TRACK_X} y={barY} width={TRACK_W} height={BAR_H} rx="6" />

      {#if d.value > 0}
        <rect
          x={TRACK_X}
          y={barY}
          width={barWidth(d.value)}
          height={BAR_H}
          rx="6"
          style="fill: {barColor}"
        />
      {/if}

      <text
        class="bar-value"
        x={TRACK_X + TRACK_W + 12}
        y={barY + BAR_H / 2}
        text-anchor="start"
        dominant-baseline="central"
      >
        {d.value}
      </text>
    {/each}
  </svg>
{/if}

<style>
  .bar-chart {
    display: block;
    width: 100%;
    height: auto;
  }

  .bar-label {
    font-family: var(--font-sans);
    font-size: 15px;
    font-weight: 600;
    fill: var(--color-text-muted);
  }

  .bar-track {
    fill: var(--color-surface-muted);
  }

  .bar-value {
    font-family: var(--font-sans);
    font-size: 15px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    fill: var(--color-text);
  }

  .chart-empty {
    margin: 0;
    padding: var(--space-8) 0;
    text-align: center;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }
</style>
