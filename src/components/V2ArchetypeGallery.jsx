import { useMemo, useState } from 'react';
import { v2Dimensions } from '../data/v2Profile';
import { getV2ArchetypeCatalog } from '../utils/v2Scoring';

export default function V2ArchetypeGallery({ lang, onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDimension, setFilterDimension] = useState('ALL');
  const [selectedArchetype, setSelectedArchetype] = useState(null);

  const t = {
    title: { ja: 'V2 アーキタイプ一覧', en: 'V2 Archetype Library' },
    subtitle: {
      ja: '5つの指標から生まれる代表的なモニカーを一覧できます。クリックすると詳細を表示します。',
      en: 'Browse the V2 monikers generated from the five desire dimensions. Click to view details.'
    },
    search: { ja: '名前や指標で検索...', en: 'Search names or traits...' },
    filter: { ja: '指標で絞り込み:', en: 'Filter by dimension:' },
    all: { ja: 'すべて', en: 'All' },
    balanced: { ja: 'バランス型', en: 'Balanced' },
    back: { ja: 'V2に戻る', en: 'Back to V2' },
    close: { ja: '閉じる', en: 'Close' },
    composition: { ja: '構成指標', en: 'Composition' },
    description: { ja: '特徴の説明', en: 'Preference Detail' }
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
        {filteredArchetypes.map((archetype) => (
          <article
            key={archetype.key}
            className="gallery-card v2-archetype-card"
            onClick={() => handleOpenDetails(archetype)}
            style={{ cursor: 'pointer' }}
          >
            <div className="gallery-card-code">{archetype.family.title[lang]}</div>
            <p className="gallery-card-tagline">{archetype.family.tagline[lang]}</p>

            <div className="v2-gallery-traits">
              {archetype.isBalanced ? (
                <span>{t.balanced[lang]}</span>
              ) : archetype.traits.map((trait) => (
                <span key={`${archetype.key}-${trait.key}`}>
                  {v2Dimensions[trait.key][trait.side][lang]}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* Details Modal */}
      {selectedArchetype && (
        <div className="modal-overlay" onClick={handleCloseDetails}>
          <div
            className="glass-card modal-content-wrapper animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            style={{ border: '1px solid rgba(255, 255, 255, 0.15)' }}
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

            <div style={{ marginTop: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-s)', marginBottom: '15px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '5px' }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {selectedArchetype.traits.map((trait) => {
                    const dimension = v2Dimensions[trait.key];
                    return (
                      <div
                        key={trait.key}
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: `1px solid ${dimension.color}30`,
                          padding: '20px',
                          borderRadius: '12px',
                          boxShadow: `0 4px 15px ${dimension.color}05`
                        }}
                      >
                        <h5 style={{ color: dimension.color, fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', marginTop: 0 }}>
                          {dimension.title[lang]} — <span style={{ textDecoration: 'underline' }}>{dimension[trait.side][lang]} ({dimension.code[trait.side]})</span>
                        </h5>
                        <p style={{ fontSize: '0.95rem', color: '#dfdde8', lineHeight: '1.5', margin: 0 }}>
                          {dimension.descriptions[trait.side][lang]}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

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
