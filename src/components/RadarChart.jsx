export default function RadarChart({ dPct, sPct, kPct, bPct, lang }) {
  // Center is (120, 120), Max radius is 80
  const cx = 120;
  const cy = 120;
  const r = 80;

  // Calculate coordinates for the polygon
  // Top: Danger (D)
  const dY = cy - (dPct / 100) * r;
  // Right: Shape (S)
  const sX = cx + (sPct / 100) * r;
  // Bottom: Kanshu/Dominant (K)
  const kY = cy + (kPct / 100) * r;
  // Left: Broad (B)
  const bX = cx - (bPct / 100) * r;

  const polygonPoints = `${cx},${dY} ${sX},${cy} ${cx},${kY} ${bX},${cy}`;

  // Grid levels (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1];

  const labels = {
    D: lang === 'ja' ? 'D: 開放・スリル' : 'D: Danger / Public',
    d: lang === 'ja' ? 'd: 密室・没入' : 'd: Deep / Private',
    S: lang === 'ja' ? 'S: 肉体・視覚' : 'S: Shape / Physical',
    s: lang === 'ja' ? 's: 設定・文脈' : 's: Story / Context',
    K: lang === 'ja' ? 'K: 主導・監修' : 'K: Kanshu / Dominant',
    k: lang === 'ja' ? 'k: 委ねる・受動' : 'k: Kachiku / Submissive',
    B: lang === 'ja' ? 'B: 複数・オープン' : 'B: Broad / Multiple',
    b: lang === 'ja' ? 'b: 特定・独占' : 'b: Beloved / Exclusive'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
      <svg width="260" height="260" viewBox="0 0 260 260" style={{ overflow: 'visible' }}>
        {/* Background grid concentric diamonds */}
        {gridLevels.map((level, i) => {
          const size = r * level;
          const points = `${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}`;
          return (
            <polygon
              key={i}
              points={points}
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />
          );
        })}

        {/* Axes lines */}
        <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
        <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />

        {/* Outer boundaries marker circles */}
        <circle cx={cx} cy={cy - r} r="3" fill="var(--color-d)" />
        <circle cx={cx + r} cy={cy} r="3" fill="var(--color-s)" />
        <circle cx={cx} cy={cy + r} r="3" fill="var(--color-k)" />
        <circle cx={cx - r} cy={cy} r="3" fill="var(--color-b)" />

        {/* Plotted Area */}
        <polygon
          points={polygonPoints}
          fill="rgba(0, 245, 255, 0.2)"
          stroke="var(--color-s)"
          strokeWidth="2.5"
          filter="drop-shadow(0 0 6px rgba(0, 245, 255, 0.3))"
          style={{ transition: 'all 0.5s ease-in-out' }}
        />

        {/* Points on the plotted area */}
        <circle cx={cx} cy={dY} r="4" fill="var(--color-d)" style={{ transition: 'all 0.5s ease-in-out' }} />
        <circle cx={sX} cy={cy} r="4" fill="var(--color-s)" style={{ transition: 'all 0.5s ease-in-out' }} />
        <circle cx={cx} cy={kY} r="4" fill="var(--color-k)" style={{ transition: 'all 0.5s ease-in-out' }} />
        <circle cx={bX} cy={cy} r="4" fill="var(--color-b)" style={{ transition: 'all 0.5s ease-in-out' }} />

        {/* Labels */}
        {/* Top: D (Danger) vs d (Deep) */}
        <text x={cx} y={cy - r - 22} textAnchor="middle" fill="var(--color-d)" fontSize="10" fontWeight="700">
          {labels.D}
        </text>
        <text x={cx} y={cy - r - 10} textAnchor="middle" fill="var(--text-muted)" fontSize="9">
          ({dPct}%)
        </text>
        <text x={cx} y={cy + r + 15} textAnchor="middle" fill="var(--text-muted)" fontSize="9">
          {labels.d} ({100 - dPct}%)
        </text>

        {/* Right: S (Shape) vs s (Story) */}
        <text x={cx + r + 10} y={cy - 5} textAnchor="start" fill="var(--color-s)" fontSize="10" fontWeight="700">
          {labels.S}
        </text>
        <text x={cx + r + 10} y={cy + 7} textAnchor="start" fill="var(--text-muted)" fontSize="9">
          ({sPct}%)
        </text>
        <text x={cx - r - 10} y={cy - 5} textAnchor="end" fill="var(--text-muted)" fontSize="9">
          {labels.s} ({100 - sPct}%)
        </text>

        {/* Bottom: K (Kanshu) vs k (Kachiku) */}
        <text x={cx} y={cy + r + 30} textAnchor="middle" fill="var(--color-k)" fontSize="10" fontWeight="700">
          {labels.K}
        </text>
        <text x={cx} y={cy + r + 42} textAnchor="middle" fill="var(--text-muted)" fontSize="9">
          ({kPct}%)
        </text>

        {/* Left: B (Broad) vs b (Beloved) */}
        <text x={cx - r - 10} y={cy + 15} textAnchor="end" fill="var(--color-b)" fontSize="10" fontWeight="700">
          {labels.B}
        </text>
        <text x={cx - r - 10} y={cy + 27} textAnchor="end" fill="var(--text-muted)" fontSize="9">
          ({bPct}%)
        </text>
        <text x={cx + r + 10} y={cy + 25} textAnchor="start" fill="var(--text-muted)" fontSize="9">
          {labels.b} ({100 - bPct}%)
        </text>
      </svg>
    </div>
  );
}
