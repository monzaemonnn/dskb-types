import { v2Dimensions } from '../data/v2Profile';

const DIMENSION_KEYS = Object.keys(v2Dimensions);
const SIZE = 380;
const CENTER = SIZE / 2;
const RADIUS = 100;
const LEVELS = 4;

function polarToCartesian(angleDeg, radius) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(angleRad),
    y: CENTER + radius * Math.sin(angleRad)
  };
}

function getPolygonPoints(radius) {
  return DIMENSION_KEYS.map((_, i) => {
    const angle = (360 / DIMENSION_KEYS.length) * i;
    const { x, y } = polarToCartesian(angle, radius);
    return `${x},${y}`;
  }).join(' ');
}

function getLabelProps(angle, radius) {
  const angleRad = ((angle - 90) * Math.PI) / 180;
  const dist = radius + 15;
  const x = CENTER + dist * Math.cos(angleRad);
  const y = CENTER + dist * Math.sin(angleRad);

  let textAnchor = 'middle';
  let dy = '0.35em';

  const normalized = (angle % 360 + 360) % 360;
  if (normalized < 10 || normalized > 350) {
    textAnchor = 'middle';
    dy = '-0.6em';
  } else if (normalized > 170 && normalized < 190) {
    textAnchor = 'middle';
    dy = '1.2em';
  } else if (normalized >= 10 && normalized <= 170) {
    textAnchor = 'start';
  } else if (normalized >= 190 && normalized <= 350) {
    textAnchor = 'end';
  }

  return { x, y, textAnchor, dy };
}

export default function V2RadarChart({ scores, lang }) {
  const dataPoints = DIMENSION_KEYS.map((key, i) => {
    const score = scores[key] ?? 50;
    const r = (score / 100) * RADIUS;
    const angle = (360 / DIMENSION_KEYS.length) * i;
    return polarToCartesian(angle, r);
  });

  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ width: '100%', maxWidth: '320px', margin: '0 auto', display: 'block' }}>
      {/* Grid levels */}
      {Array.from({ length: LEVELS }, (_, i) => {
        const r = (RADIUS / LEVELS) * (i + 1);
        return (
          <polygon
            key={`grid-${i}`}
            points={getPolygonPoints(r)}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1"
          />
        );
      })}

      {/* Axis lines */}
      {DIMENSION_KEYS.map((_, i) => {
        const angle = (360 / DIMENSION_KEYS.length) * i;
        const { x, y } = polarToCartesian(angle, RADIUS);
        return (
          <line key={`axis-${i}`} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={dataPolygon}
        fill="rgba(0, 245, 255, 0.15)"
        stroke="#00f5ff"
        strokeWidth="2"
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={`dot-${i}`} cx={p.x} cy={p.y} r="4" fill="#00f5ff" />
      ))}

      {/* Labels */}
      {DIMENSION_KEYS.map((key, i) => {
        const angle = (360 / DIMENSION_KEYS.length) * i;
        const { x, y, textAnchor, dy } = getLabelProps(angle, RADIUS);
        const dimension = v2Dimensions[key];
        return (
          <text
            key={`label-${i}`}
            x={x}
            y={y}
            textAnchor={textAnchor}
            dy={dy}
            fill="var(--text-muted)"
            fontSize="10"
            fontWeight="600"
          >
            {dimension.title[lang]}
          </text>
        );
      })}
    </svg>
  );
}
