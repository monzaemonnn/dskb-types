import { v2Dimensions } from '../data/v2Profile';

const DIMENSION_KEYS = Object.keys(v2Dimensions);
const SIZE = 400;
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

function getLabelLines(title, lang) {
  if (lang === 'ja') {
    return [title];
  }
  // For English, split at the last space to wrap the long "Orientation/Distance/Pattern/Focus" labels
  const lastSpaceIndex = title.lastIndexOf(' ');
  if (lastSpaceIndex !== -1) {
    return [
      title.substring(0, lastSpaceIndex),
      title.substring(lastSpaceIndex + 1)
    ];
  }
  return [title];
}

function getLabelProps(angle, radius, numLines) {
  const angleRad = ((angle - 90) * Math.PI) / 180;
  const dist = radius + 15;
  const x = CENTER + dist * Math.cos(angleRad);
  const y = CENTER + dist * Math.sin(angleRad);

  let textAnchor = 'middle';
  let dy = '0.35em';

  const normalized = (angle % 360 + 360) % 360;
  if (normalized < 10 || normalized > 350) {
    textAnchor = 'middle';
    dy = numLines > 1 ? '-1.3em' : '-0.6em';
  } else if (normalized > 170 && normalized < 190) {
    textAnchor = 'middle';
    dy = '1.2em';
  } else if (normalized >= 10 && normalized <= 170) {
    textAnchor = 'start';
    dy = numLines > 1 ? '-0.2em' : '0.35em';
  } else if (normalized >= 190 && normalized <= 350) {
    textAnchor = 'end';
    dy = numLines > 1 ? '-0.2em' : '0.35em';
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
            stroke="var(--color-border-subtle)"
            strokeWidth="1"
          />
        );
      })}

      {/* Axis lines */}
      {DIMENSION_KEYS.map((_, i) => {
        const angle = (360 / DIMENSION_KEYS.length) * i;
        const { x, y } = polarToCartesian(angle, RADIUS);
        return (
          <line key={`axis-${i}`} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="var(--color-border-subtle)" strokeWidth="1" />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={dataPolygon}
        fill="var(--color-secondary)"
        fillOpacity="0.3"
        stroke="var(--color-secondary)"
        strokeWidth="2"
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={`dot-${i}`} cx={p.x} cy={p.y} r="4" fill="var(--color-secondary)" />
      ))}

      {/* Labels */}
      {DIMENSION_KEYS.map((key, i) => {
        const angle = (360 / DIMENSION_KEYS.length) * i;
        const dimension = v2Dimensions[key];
        const title = dimension.title[lang];
        const lines = getLabelLines(title, lang);
        const { x, y, textAnchor, dy } = getLabelProps(angle, RADIUS, lines.length);

        return (
          <text
            key={`label-${i}`}
            x={x}
            y={y}
            textAnchor={textAnchor}
            fill="var(--color-text-muted)"
            fontSize="12"
            fontWeight="600"
          >
            {lines.map((line, index) => (
              <tspan
                key={index}
                x={x}
                dy={index === 0 ? dy : '1.2em'}
              >
                {line}
              </tspan>
            ))}
          </text>
        );
      })}
    </svg>
  );
}
