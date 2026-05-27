import { useMemo, useState } from 'react';
import { v2Dimensions } from '../data/v2Profile';
import { getV2ArchetypeCatalog } from '../utils/v2Scoring';

export default function V2ArchetypeGallery({ lang, onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDimension, setFilterDimension] = useState('ALL');

  const t = {
    title: { ja: 'V2 アーキタイプ一覧', en: 'V2 Archetype Library' },
    subtitle: {
      ja: '5つの指標から生まれる代表的なモニカーを一覧できます。',
      en: 'Browse the V2 monikers generated from the five desire dimensions.'
    },
    search: { ja: '名前や指標で検索...', en: 'Search names or traits...' },
    filter: { ja: '指標で絞り込み:', en: 'Filter by dimension:' },
    all: { ja: 'すべて', en: 'All' },
    balanced: { ja: 'バランス型', en: 'Balanced' },
    back: { ja: 'V2に戻る', en: 'Back to V2' }
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
          <article key={archetype.key} className="gallery-card v2-archetype-card">
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
    </div>
  );
}
