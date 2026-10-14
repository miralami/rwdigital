<script lang="ts">
  /**
   * Diagram donat berbasis SVG native (tanpa dependensi luar).
   *
   * Segmen digambar sebagai path busur eksplisit (bukan trik dasharray) supaya
   * posisi tiap potongan pasti dan tidak ambigu. Donat dipilih untuk komposisi
   * (bagian-dari-keseluruhan) dengan jumlah kategori sedikit — anak, produktif,
   * lansia — karena lebih mudah dibaca daripada batang.
   *
   * SSR-safe: seluruh perhitungan murni, tidak menyentuh DOM/window.
   */

  interface Segment {
    label: string;
    value: number;
    /** Warna segmen (nilai CSS color atau var token). */
    color: string;
  }

  interface Props {
    segments: Segment[];
    /** Angka besar di tengah donat; default total segmen. */
    centerValue?: string | number;
    centerLabel?: string;
    /** Satuan nilai untuk label aksesibilitas, mis. "jiwa". */
    unit?: string;
    emptyMessage?: string;
  }

  let {
    segments,
    centerValue,
    centerLabel = 'Total jiwa',
    unit = '',
    emptyMessage = 'Data belum tersedia.'
  }: Props = $props();

  const SIZE = 200;
  const R = 74;
  const STROKE = 26;
  const C = SIZE / 2;

  const total = $derived(segments.reduce((sum, s) => sum + s.value, 0));

  /** Konversi sudut (0° = atas, searah jarum jam) ke koordinat kartesius. */
  function polar(radius: number, angleDeg: number): { x: number; y: number } {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    return { x: C + radius * Math.cos(a), y: C + radius * Math.sin(a) };
  }

  function arcPath(startDeg: number, endDeg: number): string {
    const start = polar(R, startDeg);
    const end = polar(R, endDeg);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${R} ${R} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
  }

  /** Segmen dengan sudut awal/akhir kumulatif + persentase. */
  const arcs = $derived.by(() => {
    let angle = 0;
    return segments.map((s) => {
      const fraction = total > 0 ? s.value / total : 0;
      const sweep = fraction * 360;
      const start = angle;
      const end = angle + sweep;
      angle = end;
      return { ...s, fraction, sweep, start, end };
    });
  });

  const ariaLabel = $derived(
    `Diagram lingkar komposisi. ${segments
      .map(
        (s) =>
          `${s.label} ${s.value}${unit ? ' ' + unit : ''} (${total ? Math.round((s.value / total) * 100) : 0}%)`
      )
      .join('. ')}.`
  );
</script>

{#if total === 0}
  <p class="chart-empty">{emptyMessage}</p>
{:else}
  <div class="donut">
    <svg
      class="donut-svg"
      viewBox="0 0 {SIZE} {SIZE}"
      role="img"
      aria-label={ariaLabel}
    >
      <circle class="donut-track" cx={C} cy={C} r={R} fill="none" stroke-width={STROKE} />

      {#each arcs as arc (arc.label)}
        {#if arc.sweep >= 359.999}
          <!-- Segmen tunggal 100%: busur penuh tidak bisa digambar sebagai arc. -->
          <circle
            cx={C}
            cy={C}
            r={R}
            fill="none"
            stroke={arc.color}
            stroke-width={STROKE}
          />
        {:else if arc.sweep > 0.01}
          <path
            d={arcPath(arc.start, arc.end)}
            fill="none"
            stroke={arc.color}
            stroke-width={STROKE}
            stroke-linecap="butt"
          />
        {/if}
      {/each}

      <text class="donut-value" x={C} y={C - 3} text-anchor="middle" dominant-baseline="central">
        {centerValue ?? total}
      </text>
      <text class="donut-label" x={C} y={C + 19} text-anchor="middle" dominant-baseline="central">
        {centerLabel}
      </text>
    </svg>

    <ul class="donut-legend">
      {#each arcs as arc (arc.label)}
        <li class="legend-item">
          <span class="legend-swatch" style="background-color: {arc.color}"></span>
          <span class="legend-label">{arc.label}</span>
          <span class="legend-value">
            {arc.value}
            <span class="legend-pct">{Math.round(arc.fraction * 100)}%</span>
          </span>
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  .donut {
    display: flex;
    align-items: center;
    gap: var(--space-5);
    flex-wrap: wrap;
  }

  .donut-svg {
    width: 11rem;
    height: 11rem;
    flex-shrink: 0;
  }

  .donut-track {
    stroke: var(--color-surface-muted);
  }

  .donut-value {
    font-family: var(--font-sans);
    font-size: 30px;
    font-weight: 800;
    letter-spacing: var(--tracking-tight);
    fill: var(--color-text);
  }

  .donut-label {
    font-family: var(--font-sans);
    font-size: 13px;
    font-weight: 600;
    fill: var(--color-text-muted);
  }

  .donut-legend {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    min-width: 10rem;
    flex: 1 1 12rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
  }

  .legend-swatch {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: var(--radius-xs);
    flex-shrink: 0;
  }

  .legend-label {
    color: var(--color-text);
    font-weight: 500;
  }

  .legend-value {
    margin-left: auto;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--color-text);
  }

  .legend-pct {
    margin-left: var(--space-1);
    font-weight: 600;
    color: var(--color-text-muted);
  }

  .chart-empty {
    margin: 0;
    padding: var(--space-8) 0;
    text-align: center;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }
</style>
