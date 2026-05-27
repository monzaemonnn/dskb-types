import { useMemo, useState } from 'react';
import { v2Dimensions, v2ResultFamilies } from '../data/v2Profile';
import { getV2ArchetypeCatalog } from '../utils/v2Scoring';

export default function V2ArchetypeGallery({ lang, onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDimension, setFilterDimension] = useState('ALL');
  const [selectedArchetype, setSelectedArchetype] = useState(null);

  const t = {
    title: { ja: 'V2 アーキタイプ図鑑', en: 'V2 Archetype Encyclopedia' },
    subtitle: {
      ja: '5つの欲望指標から生まれる12のアーキタイプと、それぞれの性質・相性の詳細を閲覧できます。',
      en: 'Browse all 12 relationship archetypes and explore their traits, descriptions, and compatibility.'
    },
    search: { ja: '名前や指標で検索...', en: 'Search names or traits...' },
    filter: { ja: '指標で絞り込み:', en: 'Filter by dimension:' },
    all: { ja: 'すべて', en: 'All' },
    balanced: { ja: 'バランス型', en: 'Balanced' },
    back: { ja: 'V2に戻る', en: 'Back to V2' },
    close: { ja: '閉じる', en: 'Close' },
    composition: { ja: '構成指標 (パラメータ)', en: 'Composition' },
    description: { ja: '特徴の説明', en: 'Preference Detail' },
    idealLabel: { ja: '理想的な環境・条件', en: 'Ideal Environment' },
    strengthsLabel: { ja: '特徴・長所', en: 'Key Strengths' },
    cautionsLabel: { ja: '注意点・リスク', en: 'Cautions & Vulnerabilities' },
    compatibility: { ja: '相性の良いアーキタイプ', en: 'Compatibility Mapping' },
    bestMatchLabel: { ja: '最高相性', en: 'Best Match' },
    abyssMatchLabel: { ja: '沼相性 (危険な引力)', en: 'Abyss Match (Dangerous Pull)' }
  };

  const archetypes = useMemo(() => getV2ArchetypeCatalog(), []);

  const filteredArchetypes = archetypes.filter((archetype) => {
    const search = searchTerm.trim().toLowerCase();
    const title = archetype.family.title[lang].toLowerCase();
    const tagline = archetype.family.tagline[lang].toLowerCase();
    const traitText = archetype.traits
      .map((trait) => `${v2Dimensions[trait.key].title[lang]} ${v2Dimensions[trait.key][trait.side][lang]}`)
      .join(' ')
      .toLowerCase();

    const matchesSearch = !search || title.includes(search) || tagline.includes(search) || traitText.includes(search);
    const matchesFilter = filterDimension === 'ALL' || archetype.traits.some((trait) => trait.key === filterDimension);

    return matchesSearch && matchesFilter;
  });

  const handleOpenDetails = (archetype) => {
    setSelectedArchetype(archetype);
  };

  const handleOpenDetailsByKey = (key) => {
    const arch = archetypes.find((a) => a.key === key);
    if (arch) {
      setSelectedArchetype(arch);
    }
  };

  const handleCloseDetails = () => {
    setSelectedArchetype(null);
  };

  return (
    <div className="gallery-container v2-gallery-container">
      <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
        <h1 className="gallery-hero-title">{t.title[lang]}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t.subtitle[lang]}</p>

        <div className="gallery-controls">
          <input
            className="gallery-search"
            type="text"
            placeholder={t.search[lang]}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <div className="gallery-filter">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.filter[lang]}</span>
            <select value={filterDimension} onChange={(event) => setFilterDimension(event.target.value)}>
              <option value="ALL">{t.all[lang]}</option>
              {Object.entries(v2Dimensions).map(([key, dimension]) => (
                <option key={key} value={key}>{dimension.title[lang]}</option>
              ))}
            </select>
          </div>

          <button className="btn-glass gallery-back-btn" onClick={onBack}>
            <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>✦</span> {t.back[lang]}
          </button>
        </div>
      </div>

      <div className="gallery-grid v2-archetype-grid">
        {filteredArchetypes.map((archetype) => {
          const color1 = archetype.isBalanced ? 'var(--color-d)' : v2Dimensions[archetype.traits[0].key].color;
          const color2 = archetype.isBalanced ? 'var(--color-b)' : v2Dimensions[archetype.traits[1].key].color;

          return (
            <article
              key={archetype.key}
              className="gallery-card v2-archetype-card"
              onClick={() => handleOpenDetails(archetype)}
              style={{
                '--glow-1': color1,
                '--glow-2': color2
              }}
            >
              <div className="gallery-card-code">{archetype.family.title[lang]}</div>
              <p className="gallery-card-tagline">{archetype.family.tagline[lang]}</p>

              <div className="v2-gallery-traits">
                {archetype.isBalanced ? (
                  <span style={{ borderColor: 'rgba(255, 255, 255, 0.15)', color: '#fff', background: 'rgba(255, 255, 255, 0.08)' }}>
                    {t.balanced[lang]}
                  </span>
                ) : (
                  archetype.traits.map((trait) => {
                    const dim = v2Dimensions[trait.key];
                    return (
                      <span
                        key={`${archetype.key}-${trait.key}`}
                        style={{
                          borderColor: `${dim.color}40`,
                          color: dim.color,
                          background: `${dim.color}0d`
                        }}
                      >
                        {dim[trait.side][lang]}
                      </span>
                    );
                  })
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Details Modal */}
      {selectedArchetype && (
        <div className="modal-overlay" onClick={handleCloseDetails}>
          <div
            className="glass-card modal-content-wrapper animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            style={{ border: '1px solid rgba(255, 255, 255, 0.15)', maxWidth: '640px' }}
          >
            <button className="modal-close-btn" onClick={handleCloseDetails}>×</button>
            
            <div className="modal-heading" style={{ textAlign: 'center', marginBottom: '25px' }}>
              <h2 className="results-type-code" style={{ fontSize: '2.5rem', margin: '10px 0', color: 'var(--text-main)' }}>
                {selectedArchetype.family.title[lang]}
              </h2>
              <p className="results-tagline" style={{ fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--text-muted)', margin: '10px 0 0 0' }}>
                “ {selectedArchetype.family.tagline[lang]} ”
              </p>
            </div>

            {/* Description */}
            {selectedArchetype.family.description && (
              <p style={{ fontSize: '0.95rem', color: '#dfdde8', lineHeight: '1.6', marginBottom: '20px' }}>
                {selectedArchetype.family.description[lang]}
              </p>
            )}

            {/* Ideal Environment / Conditions */}
            {selectedArchetype.family.idealConditions && (
              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-s)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  {t.idealLabel[lang]}
                </h4>
                <p className="ideal-env-text" style={{ fontSize: '0.9rem', margin: 0 }}>
                  {selectedArchetype.family.idealConditions[lang]}
                </p>
              </div>
            )}

            {/* Grid for strengths & cautions */}
            <div className="modal-detail-grid" style={{ marginBottom: '25px' }}>
              {selectedArchetype.family.strengths && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-s)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    {t.strengthsLabel[lang]}
                  </h4>
                  <ul className="trait-list" style={{ fontSize: '0.85rem' }}>
                    {selectedArchetype.family.strengths[lang].map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedArchetype.family.cautions && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-d)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    {t.cautionsLabel[lang]}
                  </h4>
                  <ul className="trait-list weakness" style={{ fontSize: '0.85rem' }}>
                    {selectedArchetype.family.cautions[lang].map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Parametrical Composition */}
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-b)', marginBottom: '12px', textTransform: 'uppercase', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                {selectedArchetype.isBalanced ? t.description[lang] : t.composition[lang]}
              </h4>

              {selectedArchetype.isBalanced ? (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                  <p style={{ fontSize: '0.95rem', color: '#dfdde8', lineHeight: '1.6', margin: 0 }}>
                    {lang === 'ja'
                      ? '5つのすべての指標において中立または柔軟なバランスを示しており、特定の極端な傾向に固定されません。相手のタイプ、シチュエーション、タイミングに応じて「導く」側にも「委ねる」側にもなれる、非常に柔軟で環境適応力の高いタイプです。'
                      : 'You show a balanced or flexible pattern across all five dimensions. Rather than being fixed in extreme preferences, you adapt fluidly to different partners, scenarios, and contexts, allowing you to easily lead or yield as needed.'}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedArchetype.traits.map((trait) => {
                    const dimension = v2Dimensions[trait.key];
                    return (
                      <div
                        key={trait.key}
                        style={{
                          background: 'rgba(255,255,255,0.01)',
                          border: `1px solid ${dimension.color}20`,
                          padding: '12px 16px',
                          borderRadius: '8px'
                        }}
                      >
                        <h5 style={{ color: dimension.color, fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px', marginTop: 0 }}>
                          {dimension.title[lang]} — <span style={{ textDecoration: 'underline' }}>{dimension[trait.side][lang]} ({dimension.code[trait.side]})</span>
                        </h5>
                        <p style={{ fontSize: '0.85rem', color: '#dfdde8', lineHeight: '1.4', margin: 0 }}>
                          {dimension.descriptions[trait.side][lang]}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Compatibility pairings */}
            {(selectedArchetype.family.bestMatch || selectedArchetype.family.abyssMatch) && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', marginTop: '20px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-b)', marginBottom: '12px', textTransform: 'uppercase' }}>
                  {t.compatibility[lang]}
                </h4>
                <div className="modal-match-list">
                  {selectedArchetype.family.bestMatch && v2ResultFamilies[selectedArchetype.family.bestMatch] && (
                    <div
                      className="modal-match-card best"
                      onClick={() => handleOpenDetailsByKey(selectedArchetype.family.bestMatch)}
                    >
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-s)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {t.bestMatchLabel[lang]}
                      </span>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                        {v2ResultFamilies[selectedArchetype.family.bestMatch].title[lang]}
                      </div>
                    </div>
                  )}
                  {selectedArchetype.family.abyssMatch && v2ResultFamilies[selectedArchetype.family.abyssMatch] && (
                    <div
                      className="modal-match-card abyss"
                      onClick={() => handleOpenDetailsByKey(selectedArchetype.family.abyssMatch)}
                    >
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-d)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {t.abyssMatchLabel[lang]}
                      </span>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                        {v2ResultFamilies[selectedArchetype.family.abyssMatch].title[lang]}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              className="btn-primary"
              onClick={handleCloseDetails}
              style={{ width: '100%', marginTop: '30px', padding: '10px 0', borderRadius: '8px', fontSize: '0.95rem' }}
            >
              {t.close[lang]}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
