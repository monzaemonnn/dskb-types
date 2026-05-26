import { useState } from 'react';
import { types } from '../data/types';

export default function TypeGallery({ lang, onBack }) {
  const [selectedType, setSelectedType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAxis, setFilterAxis] = useState('ALL'); // ALL, D, d, S, s, K, k, B, b

  const t = {
    title: { en: "16 Archetypes Encyclopedia", ja: "16タイプ関係性・性癖図鑑" },
    subtitle: { en: "Browse all 16 personality types and explore their traits.", ja: "すべての16タイプとそれぞれの性質・相性の詳細を閲覧できます。" },
    searchPlace: { en: "Search by name or code...", ja: "コードやキーワードで検索..." },
    backBtn: { en: "Back to Home", ja: "ホームに戻る" },
    filterLabel: { en: "Filter by trait:", ja: "指標で絞り込み:" },
    all: { en: "All Types", ja: "すべて" },
    idealEnv: { en: "Ideal Environment", ja: "好む環境・シチュエーション" },
    traits: { en: "Key Preferences", ja: "主な特徴" },
    weaknesses: { en: "Warnings / Vulnerabilities", ja: "短所・注意点" },
    compatibility: { en: "Compatibility Matrix", ja: "相性の良いタイプ" },
    bestMatch: { en: "Best Match", ja: "最高相性" },
    abyssMatch: { en: "Abyss Match", ja: "沼相性" },
    close: { en: "Close", ja: "閉じる" }
  };

  const handleOpenDetails = (code) => {
    setSelectedType(code);
  };

  const handleCloseDetails = () => {
    setSelectedType(null);
  };

  // Convert types object to array
  const typeList = Object.values(types);

  // Filter list
  const filteredTypes = typeList.filter((type) => {
    // Search term matching
    const matchesSearch = 
      type.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.nameJP.includes(searchTerm) ||
      type.nameEN.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Axis filter matching
    if (filterAxis === 'ALL') return true;
    return type.code.includes(filterAxis);
  });

  const detailData = selectedType ? types[selectedType] : null;

  return (
    <div className="gallery-container">
      {/* Header */}
      <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
        <h1 className="gallery-hero-title">{t.title[lang]}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t.subtitle[lang]}</p>
        
        {/* Controls */}
        <div className="gallery-controls">
          <input
            className="gallery-search"
            type="text"
            placeholder={t.searchPlace[lang]}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Filter Buttons */}
          <div className="gallery-filter">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.filterLabel[lang]}</span>
            <select
              value={filterAxis}
              onChange={(e) => setFilterAxis(e.target.value)}
            >
              <option value="ALL">{t.all[lang]}</option>
              <option value="D">D (Danger)</option>
              <option value="d">d (Deep)</option>
              <option value="S">S (Shape)</option>
              <option value="s">s (Story)</option>
              <option value="K">K (Kanshu)</option>
              <option value="k">k (Kachiku)</option>
              <option value="B">B (Broad)</option>
              <option value="b">b (Beloved)</option>
            </select>
          </div>

          <button className="btn-glass gallery-back-btn" onClick={onBack}>
            <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>✦</span> {t.backBtn[lang]}
          </button>
        </div>
      </div>

      {/* Grid of types */}
      <div className="gallery-grid">
        {filteredTypes.map((type) => (
          <div key={type.code} className="gallery-card" onClick={() => handleOpenDetails(type.code)}>
            <div className="gallery-card-code">{type.code}</div>
            <h3 className="gallery-card-name">{type.nameJP}</h3>
            <p className="gallery-card-tagline">{type.tagline[lang]}</p>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {selectedType && detailData && (
        <div className="modal-overlay" onClick={handleCloseDetails}>
          <div className="glass-card modal-content-wrapper animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <button className="modal-close-btn" onClick={handleCloseDetails}>×</button>
            
            <div className="modal-heading">
              <div className="results-badge" style={{ display: 'inline-block' }}>{selectedType}</div>
              <h2 className="results-type-code" style={{ fontSize: '3.5rem', margin: '10px 0' }}>{selectedType}</h2>
              <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{detailData.nameJP}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontStyle: 'italic' }}>{detailData.nameEN}</p>
            </div>

            <p style={{ fontSize: '0.95rem', color: '#dfdde8', lineHeight: '1.6', marginBottom: '25px' }}>
              {detailData.description[lang]}
            </p>

            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-s)', marginBottom: '8px', textTransform: 'uppercase' }}>
              {t.idealEnv[lang]}
            </h4>
            <p className="ideal-env-text" style={{ fontSize: '0.9rem', marginBottom: '25px' }}>{detailData.idealEnvironment[lang]}</p>

            {/* Grid for preferences & weaknesses */}
            <div className="modal-detail-grid">
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-s)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  {t.traits[lang]}
                </h4>
                <ul className="trait-list" style={{ fontSize: '0.85rem' }}>
                  {detailData.traits[lang].map((trait, i) => (
                    <li key={i}>{trait}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-d)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  {t.weaknesses[lang]}
                </h4>
                <ul className="trait-list weakness" style={{ fontSize: '0.85rem' }}>
                  {detailData.weaknesses[lang].map((weak, i) => (
                    <li key={i}>{weak}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Compatibility Matches */}
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-b)', marginBottom: '12px', textTransform: 'uppercase', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
              {t.compatibility[lang]}
            </h4>
            <div className="modal-match-list">
              {types[detailData.bestMatch] && (
                <div
                  className="modal-match-card best"
                  onClick={() => handleOpenDetails(detailData.bestMatch)}
                >
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-s)', fontWeight: 700, textTransform: 'uppercase' }}>{t.bestMatch[lang]}</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                    {detailData.bestMatch} : {types[detailData.bestMatch].nameJP}
                  </div>
                </div>
              )}
              {types[detailData.abyssMatch] && (
                <div
                  className="modal-match-card abyss"
                  onClick={() => handleOpenDetails(detailData.abyssMatch)}
                >
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-d)', fontWeight: 700, textTransform: 'uppercase' }}>{t.abyssMatch[lang]}</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                    {detailData.abyssMatch} : {types[detailData.abyssMatch].nameJP}
                  </div>
                </div>
              )}
            </div>

            <button className="btn-primary" onClick={handleCloseDetails} style={{ width: '100%', marginTop: '30px', padding: '10px 0', borderRadius: '8px', fontSize: '0.95rem' }}>
              {t.close[lang]}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
