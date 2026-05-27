# V2 Results Dashboard Expansion — Full Implementation Spec

> [!IMPORTANT]
> This spec is designed to be followed mechanically. Every file path, data structure, and code pattern is specified exactly. Do not improvise or deviate.

---

## Overview

**Goal**: Make the V2 result screen as rich and mesmerizing as V1 by adding per-archetype descriptions, strengths, cautions, compatibility, a radar chart, and a tabbed detail panel.

**Files to modify**:
1. `src/data/v2Profile.js` — expand `v2ResultFamilies` data
2. `src/components/V2ResultsDashboard.jsx` — add UI sections
3. `src/components/V2RadarChart.jsx` — **new file**, pentagon radar chart
4. `src/index.css` — minor CSS additions (reuse existing V1 classes where possible)

---

## PART 1: Expand `v2ResultFamilies` Data

### File: `src/data/v2Profile.js`

### Current Shape (DO NOT CHANGE existing fields)

```js
fantasyPractice_left_depthVariety_left: {
  title: { ja: '妄想家', en: 'The Dreamer' },
  tagline: {
    ja: '空想の余白と、安心できる深さの中で欲望が育つ。',
    en: 'Your desire grows through imagination, privacy, and emotionally safe depth.'
  }
}
```

### New Shape (ADD these fields to every entry)

```js
fantasyPractice_left_depthVariety_left: {
  title: { ja: '妄想家', en: 'The Dreamer' },
  tagline: { ... },  // keep existing

  // --- NEW FIELDS BELOW ---

  description: {
    ja: '... 2-4 sentences describing this archetype personality in detail ...',
    en: '... 2-4 sentences describing this archetype personality in detail ...'
  },

  strengths: {
    ja: [
      '... strength 1 ...',
      '... strength 2 ...',
      '... strength 3 ...',
      '... strength 4 ...'
    ],
    en: [
      '... strength 1 ...',
      '... strength 2 ...',
      '... strength 3 ...',
      '... strength 4 ...'
    ]
  },

  cautions: {
    ja: [
      '... caution/vulnerability 1 ...',
      '... caution/vulnerability 2 ...',
      '... caution/vulnerability 3 ...'
    ],
    en: [
      '... caution/vulnerability 1 ...',
      '... caution/vulnerability 2 ...',
      '... caution/vulnerability 3 ...'
    ]
  },

  idealConditions: {
    ja: '... 1-2 sentences describing the ideal relational/environmental conditions ...',
    en: '... 1-2 sentences describing the ideal relational/environmental conditions ...'
  },

  // compatibility key — must be a valid key from v2ResultFamilies
  bestMatch: 'some_other_archetype_key',
  // tension/obsessive pairing key — must be a valid key from v2ResultFamilies
  abyssMatch: 'some_other_archetype_key'
}
```

### All Keys That Need Content Written

Here are ALL the keys in `v2ResultFamilies` that need the new fields added. Each key is listed with its current title so the writer understands the archetype:

| # | Key | Title (EN) | Title (JA) | Defining Traits |
|---|-----|-----------|-----------|-----------------|
| 1 | `fantasyPractice_left_depthVariety_left` | The Dreamer | 妄想家 | Fantasy-leaning + Depth-leaning |
| 2 | `fantasyPractice_left_depthVariety_right` | The Explorer | 冒険家 | Fantasy-leaning + Variety-leaning |
| 3 | `fantasyPractice_left_bodyStory_right` | The Storyteller | 物語派 | Fantasy-leaning + Story-focused |
| 4 | `fantasyPractice_right_bodyStory_left` | The Sensor | 体感派 | Practice-leaning + Body-focused |
| 5 | `fantasyPractice_right_agency_left` | The Director | 仕掛け人 | Practice-leaning + Lead-leaning |
| 6 | `sparkBrake_right_depthVariety_left` | The Gatekeeper | 守り手 | Guarded-spark + Depth-leaning |
| 7 | `sparkBrake_left_bodyStory_right` | The Igniter | 火付け役 | Fast-spark + Story-focused |
| 8 | `sparkBrake_left_depthVariety_right` | The Firestarter | 起爆剤 | Fast-spark + Variety-leaning |
| 9 | `bodyStory_left_agency_left` | The Conductor | 指揮者 | Body-focused + Lead-leaning |
| 10 | `bodyStory_right_agency_right` | The Receiver | 受け手 | Story-focused + Yield-leaning |
| 11 | `agency_left_depthVariety_right` | The Catalyst | 起こし屋 | Lead-leaning + Variety-leaning |
| 12 | `balanced` | The Switch | 変幻自在 | No dominant traits |

### Content-Writing Guidelines

When writing the `description`, `strengths`, `cautions`, and `idealConditions` for each archetype:

1. **Derive from the two defining traits.** Each archetype is defined by 2 of the 5 dimensions leaning in a specific direction. Use the dimension descriptions from `v2Dimensions` as source material. For example, "The Dreamer" combines Fantasy-leaning ("enjoys desire as imagination or story") with Depth-leaning ("trust, history, and focused connection deepen desire"). The description should weave both together.

2. **Tone: clinical backbone, warm delivery.** Not a meme, not a medical paper. Example: "You nurture desire through the safety of imagination and the warmth of deep trust. Your inner world is vivid and detailed — a place where scenarios can unfold without pressure."

3. **Strengths should feel validating.** Users should read them and think "yes, that's a real strength of mine." Example: "Rich inner world that keeps desire alive even during physical distance."

4. **Cautions should feel insightful, not shaming.** Example: "May retreat into fantasy when real-life intimacy requires vulnerability."

5. **idealConditions should be vivid and specific.** Example: "A patient partner who values emotional safety and gives you space to share fantasies at your own pace."

6. **Write 4 strengths and 3 cautions per archetype** (matching V1's pattern).

7. **Both JP and EN are required.** Japanese should be natural, not machine-translated. The JP copy is the primary audience.

### Compatibility Pairing Rules

When assigning `bestMatch` and `abyssMatch`:

- **bestMatch**: Pick the archetype whose traits most naturally complement. General heuristic:
  - Same modality preference (both Body or both Story) + opposite agency (Lead↔Yield) = natural fit
  - Same depth/variety preference + complementary spark pattern = comfortable rhythm

- **abyssMatch**: Pick the archetype that creates the most intense/obsessive dynamic. General heuristic:
  - Opposite on fantasy-practice (one dreams, one enacts) = magnetic but volatile
  - Same agency direction (both Lead or both Yield) = power struggle / mirror obsession

- **The `balanced` type**: Set `bestMatch` to any archetype, and `abyssMatch` to any archetype. The balanced type is flexible so any pairing is narratively defensible.

- **Every key must be a valid key from the list of 12 above.** Do not invent new keys.

---

## PART 2: Add UI Sections to `V2ResultsDashboard.jsx`

### File: `src/components/V2ResultsDashboard.jsx`

### 2A: Import the new radar chart

Add at the top of the file:

```jsx
import V2RadarChart from './V2RadarChart';
```

### 2B: Add translation strings

Add these to the existing `t` object inside the component:

```js
overview: { ja: '概要', en: 'Overview' },
strengthsTab: { ja: '特徴・長所', en: 'Strengths' },
cautionsTab: { ja: '注意点', en: 'Cautions' },
idealLabel: { ja: '理想的な条件', en: 'Ideal Conditions' },
compatTitle: { ja: '相性診断', en: 'Chemistry & Compatibility' },
bestMatchLabel: { ja: '最高相性', en: 'Best Match' },
abyssMatchLabel: { ja: '沼相性 (危険な引力)', en: 'Abyss Match (Dangerous Pull)' },
clickDetail: { ja: 'クリックして詳細を表示', en: 'Click to view details' },
close: { ja: '閉じる', en: 'Close' },
profileChart: { ja: 'プロフィールチャート', en: 'Profile Chart' },
```

### 2C: Add state for tabs and compatibility modal

Add near the top of the component, after existing `useState` calls:

```jsx
const [activeTab, setActiveTab] = useState('overview');
const [modalArchetype, setModalArchetype] = useState(null);
```

### 2D: Add the new sections

Insert the following JSX blocks between the existing meter card (`v2-meter-card`) and the actions card (`actions-card`). The exact insertion point is after the closing `</div>` of the `v2-meter-card` div and before the opening `<div className="glass-card actions-card">`.

#### Section 1: Radar Chart + Tabbed Panel (side-by-side grid like V1)

```jsx
{/* Profile detail grid */}
<div className="results-grid">
  {/* Radar chart card */}
  <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
    <h2 className="card-title">
      <span style={{ color: 'var(--color-s)' }}>✦</span>
      {t.profileChart[lang]}
    </h2>
    <V2RadarChart scores={scores} lang={lang} />
  </div>

  {/* Tabbed detail card */}
  <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
    <div className="tabs-header">
      <button
        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
        onClick={() => setActiveTab('overview')}
      >
        {t.overview[lang]}
      </button>
      <button
        className={`tab-btn ${activeTab === 'strengths' ? 'active' : ''}`}
        onClick={() => setActiveTab('strengths')}
      >
        {t.strengthsTab[lang]}
      </button>
      <button
        className={`tab-btn ${activeTab === 'cautions' ? 'active' : ''}`}
        onClick={() => setActiveTab('cautions')}
      >
        {t.cautionsTab[lang]}
      </button>
    </div>

    <div className="tab-content-panel">
      {activeTab === 'overview' && resultFamily.description && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ color: '#dfdde8', fontSize: '1rem', lineHeight: '1.6' }}>
            {resultFamily.description[lang]}
          </p>
          {resultFamily.idealConditions && (
            <div style={{ marginTop: '10px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-s)', marginBottom: '8px', textTransform: 'uppercase' }}>
                {t.idealLabel[lang]}
              </h4>
              <p className="ideal-env-text">{resultFamily.idealConditions[lang]}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'strengths' && resultFamily.strengths && (
        <ul className="trait-list animate-fade-in">
          {resultFamily.strengths[lang].map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}

      {activeTab === 'cautions' && resultFamily.cautions && (
        <ul className="trait-list weakness animate-fade-in">
          {resultFamily.cautions[lang].map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>

    {/* Compatibility section */}
    {(resultFamily.bestMatch || resultFamily.abyssMatch) && (
      <div style={{ marginTop: 'auto', paddingTop: '30px' }}>
        <h2 className="card-title" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px', borderBottom: 'none', paddingBottom: '0', marginBottom: '15px' }}>
          <span style={{ color: 'var(--color-b)' }}>✦</span>
          {t.compatTitle[lang]}
        </h2>

        <div className="compatibility-container">
          {resultFamily.bestMatch && v2ResultFamilies[resultFamily.bestMatch] && (
            <div className="compat-card best" onClick={() => setModalArchetype(resultFamily.bestMatch)}>
              <div className="compat-label">{t.bestMatchLabel[lang]}</div>
              <div className="compat-type-name">
                {v2ResultFamilies[resultFamily.bestMatch].title[lang]}
              </div>
              <div className="compat-type-desc">
                {t.clickDetail[lang]}
              </div>
            </div>
          )}

          {resultFamily.abyssMatch && v2ResultFamilies[resultFamily.abyssMatch] && (
            <div className="compat-card abyss" onClick={() => setModalArchetype(resultFamily.abyssMatch)}>
              <div className="compat-label">{t.abyssMatchLabel[lang]}</div>
              <div className="compat-type-name">
                {v2ResultFamilies[resultFamily.abyssMatch].title[lang]}
              </div>
              <div className="compat-type-desc">
                {t.clickDetail[lang]}
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
</div>
```

#### Section 2: Compatibility Modal

Add this JSX **before** the final closing `</div>` of the component's return statement (the `v2-results-container` div). Place it right before `</div>` at the end:

```jsx
{/* Compatibility modal */}
{modalArchetype && v2ResultFamilies[modalArchetype] && (() => {
  const modalData = v2ResultFamilies[modalArchetype];
  return (
    <div className="modal-overlay" onClick={() => setModalArchetype(null)}>
      <div className="glass-card modal-content-wrapper animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ border: '1px solid rgba(255, 255, 255, 0.15)' }}>
        <button className="modal-close-btn" onClick={() => setModalArchetype(null)}>×</button>

        <div className="modal-heading">
          <div className="results-badge" style={{ display: 'inline-block' }}>
            {modalArchetype === resultFamily.bestMatch ? t.bestMatchLabel[lang] : t.abyssMatchLabel[lang]}
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '10px 0' }}>{modalData.title[lang]}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontStyle: 'italic' }}>
            " {modalData.tagline[lang]} "
          </p>
        </div>

        {modalData.description && (
          <p style={{ fontSize: '0.95rem', color: '#dfdde8', lineHeight: '1.6', marginBottom: '20px' }}>
            {modalData.description[lang]}
          </p>
        )}

        {modalData.strengths && (
          <>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-s)', marginBottom: '8px', textTransform: 'uppercase' }}>
              {t.strengthsTab[lang]}
            </h4>
            <ul className="trait-list" style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
              {modalData.strengths[lang].map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </>
        )}

        {modalData.cautions && (
          <>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-d)', marginBottom: '8px', textTransform: 'uppercase' }}>
              {t.cautionsTab[lang]}
            </h4>
            <ul className="trait-list weakness" style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
              {modalData.cautions[lang].map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </>
        )}

        <button className="btn-primary" onClick={() => setModalArchetype(null)} style={{ width: '100%', marginTop: '10px', padding: '10px 0', borderRadius: '8px', fontSize: '0.95rem' }}>
          {t.close[lang]}
        </button>
      </div>
    </div>
  );
})()}
```

### 2E: Add missing import

At the top of the file, add `v2ResultFamilies` to the existing import from `../data/v2Profile`:

```jsx
import { v2Dimensions, v2ResultFamilies } from '../data/v2Profile';
```

---

## PART 3: Create Pentagon Radar Chart

### File: `src/components/V2RadarChart.jsx` (NEW FILE)

This is a self-contained SVG component. Copy this exactly:

```jsx
import { v2Dimensions } from '../data/v2Profile';

const DIMENSION_KEYS = Object.keys(v2Dimensions);
const SIZE = 300;
const CENTER = SIZE / 2;
const RADIUS = 110;
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

export default function V2RadarChart({ scores, lang }) {
  const dataPoints = DIMENSION_KEYS.map((key, i) => {
    const score = scores[key] ?? 50;
    const r = (score / 100) * RADIUS;
    const angle = (360 / DIMENSION_KEYS.length) * i;
    return polarToCartesian(angle, r);
  });

  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ width: '100%', maxWidth: '280px', margin: '0 auto', display: 'block' }}>
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
        const { x, y } = polarToCartesian(angle, RADIUS + 24);
        const dimension = v2Dimensions[key];
        return (
          <text
            key={`label-${i}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
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
```

---

## PART 4: CSS Additions

### File: `src/index.css`

The tabbed panel, compatibility cards, trait lists, modal overlay, results-grid, and other classes already exist in `index.css` from V1. **Do not duplicate them.** The V2 components above use the same class names as V1 (`tabs-header`, `tab-btn`, `tab-content-panel`, `compatibility-container`, `compat-card`, `compat-label`, `compat-type-name`, `compat-type-desc`, `modal-overlay`, `modal-content-wrapper`, `modal-close-btn`, `trait-list`, `results-grid`, etc.).

If the `results-grid` class doesn't already apply within `.v2-results-container`, add this one rule:

```css
.v2-results-container .results-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .v2-results-container .results-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## PART 5: Verification Checklist

After implementing, verify all of the following:

- [ ] `npm run build` completes with 0 errors
- [ ] Taking the V2 quiz and completing it shows the new tabbed panel with Overview / Strengths / Cautions
- [ ] The radar chart renders a pentagon shape with 5 labeled axes
- [ ] The compatibility section shows Best Match and Abyss Match cards
- [ ] Clicking a compatibility card opens a modal with the matched archetype's full details
- [ ] Both English and Japanese render correctly for all new content
- [ ] The `balanced` archetype (The Switch) renders gracefully even if it has simpler content
- [ ] Mobile layout stacks the grid to single column

---

## Summary of Changes

| File | Action |
|------|--------|
| `src/data/v2Profile.js` | Add `description`, `strengths`, `cautions`, `idealConditions`, `bestMatch`, `abyssMatch` to all 12 entries in `v2ResultFamilies` |
| `src/components/V2ResultsDashboard.jsx` | Add radar chart import, tabbed panel, compatibility section, compatibility modal, new translation strings, new state variables |
| `src/components/V2RadarChart.jsx` | **Create new file** — pentagon SVG radar chart |
| `src/index.css` | Add `.v2-results-container .results-grid` grid rule (1 rule + 1 media query) |
