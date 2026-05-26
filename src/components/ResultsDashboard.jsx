import { useState, useRef } from 'react';
import RadarChart from './RadarChart';
import { types } from '../data/types';

export default function ResultsDashboard({ typeCode, dPct, sPct, kPct, bPct, lang, onReset, onViewGallery }) {
  const resultData = types[typeCode];
  const [activeTab, setActiveTab] = useState('overview');
  const [modalType, setModalType] = useState(null); // type code of type shown in modal
  const [copySuccess, setCopySuccess] = useState(false);
  const [linkCopySuccess, setLinkCopySuccess] = useState(false);
  const canvasRef = useRef(null);

  if (!resultData) return <div>Type not found.</div>;

  const t = {
    resultsBadge: { en: "Your Personality Profile", ja: "あなたの診断結果" },
    overview: { en: "Overview", ja: "概要" },
    traits: { en: "Strengths", ja: "特徴・長所" },
    weaknesses: { en: "Warnings", ja: "短所・注意点" },
    idealEnv: { en: "Ideal Environment", ja: "好む環境・シチュエーション" },
    compatibility: { en: "Chemistry & Compatibility", ja: "相性診断" },
    bestMatch: { en: "Best Match (Highest Chemistry)", ja: "最高相性 (最も居心地が良い)" },
    abyssMatch: { en: "Abyss Match (Obsessive/Addictive)", ja: "沼相性 (狂信的・依存しやすい)" },
    shareText: { en: "Copy Results for Twitter/SNS", ja: "診断結果をコピー (SNSシェア用)" },
    copyLink: { en: "Copy Result Link", ja: "結果リンクをコピー" },
    downloadText: { en: "Download Profile Card (PNG)", ja: "プロフィール画像をダウンロード" },
    retake: { en: "Retake Quiz", ja: "もう一度診断する" },
    gallery: { en: "Explore All Types", ja: "16タイプ一覧へ" },
    copied: { en: "Copied!", ja: "コピーしました！" },
    close: { en: "Close", ja: "閉じる" }
  };

  // SNS Share text generator
  const handleCopyShareText = () => {
    const jpName = resultData.nameJP;
    const enName = resultData.nameEN;
    const resultUrl = typeof window !== 'undefined' ? window.location.href : '';

    const text = `【16 DSKB Types (ドスケベ診断)】
私の診断タイプは【${typeCode} : ${jpName} (${enName})】でした！

📊 各指標の傾向：
・Distance: Danger ${dPct}% / Deep ${100 - dPct}%
・Stimulus: Shape ${sPct}% / Story ${100 - sPct}%
・Kankei: Kanshu ${kPct}% / Kachiku ${100 - kPct}%
・Buddy: Broad ${bPct}% / Beloved ${100 - bPct}%

✨ キャッチコピー: "${resultData.tagline[lang]}"

#16DSKBTypes #DSKB診断
テストはこちらから ➡️ ${resultUrl}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleCopyResultLink = () => {
    if (typeof window === 'undefined') return;

    navigator.clipboard.writeText(window.location.href).then(() => {
      setLinkCopySuccess(true);
      setTimeout(() => setLinkCopySuccess(false), 2000);
    });
  };

  // Dynamic canvas-based image downloader
  const handleDownloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Setup High-DPI Canvas size
    canvas.width = 600;
    canvas.height = 850;

    // Draw background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#090712');
    grad.addColorStop(0.5, '#110d24');
    grad.addColorStop(1, '#06050b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid/orbs decoration (simulated glow)
    ctx.fillStyle = 'rgba(255, 0, 127, 0.05)';
    ctx.beginPath();
    ctx.arc(0, 0, 250, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(0, 245, 255, 0.05)';
    ctx.beginPath();
    ctx.arc(canvas.width, canvas.height, 250, 0, Math.PI * 2);
    ctx.fill();

    // Draw border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 15;
    ctx.strokeRect(7.5, 7.5, canvas.width - 15, canvas.height - 15);

    // Draw Title Header
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('16 DSKB TYPES PERSONALITY PROFILE', canvas.width / 2, 45);

    // Draw Type Code
    ctx.fillStyle = '#00f5ff';
    ctx.font = 'bold 78px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(typeCode, canvas.width / 2, 135);

    // Draw glow underline for type code
    const lineGrad = ctx.createLinearGradient(150, 0, 450, 0);
    lineGrad.addColorStop(0, 'rgba(255, 0, 127, 0)');
    lineGrad.addColorStop(0.5, '#ff007f');
    lineGrad.addColorStop(1, 'rgba(255, 0, 127, 0)');
    ctx.fillStyle = lineGrad;
    ctx.fillRect(150, 155, 300, 3);

    // Draw Archetype Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(resultData.nameJP, canvas.width / 2, 200);

    // Draw English Subtitle
    ctx.fillStyle = '#9c99b6';
    ctx.font = 'italic 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(resultData.nameEN, canvas.width / 2, 230);

    // Draw tagline (wrapped)
    ctx.fillStyle = '#dfdde8';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    const taglineText = `"${resultData.tagline[lang]}"`;
    ctx.fillText(taglineText, canvas.width / 2, 275);

    // Draw stats header
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(100, 310, 400, 1);

    // Draw Stats bars
    const drawProgressBar = (labelL, pctL, labelR, color, yPos) => {
      // Labels
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${labelL} (${pctL}%)`, 100, yPos - 10);

      ctx.fillStyle = '#9c99b6';
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${labelR} (${100 - pctL}%)`, 500, yPos - 10);

      // Track
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(100, yPos, 400, 10);

      // Fill
      ctx.fillStyle = color;
      ctx.fillRect(100, yPos, (pctL / 100) * 400, 10);
    };

    drawProgressBar('D: Danger', dPct, 'd: Deep', '#ff007f', 360);
    drawProgressBar('S: Shape', sPct, 's: Story', '#00f5ff', 430);
    drawProgressBar('K: Kanshu', kPct, 'k: Kachiku', '#a020f0', 500);
    drawProgressBar('B: Broad', bPct, 'b: Beloved', '#ffd700', 570);

    // Divider
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(100, 620, 400, 1);

    // Draw brief summary text
    ctx.fillStyle = '#9c99b6';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    const lines = lang === 'ja'
      ? [
          "各設問における指標スコアより、あなたの深層的な欲望と関係性の",
          "好みがパーソナライズされて出力されています。他タイプとの相性も存在します。"
        ]
      : [
          "This card maps your subconscious desires based on your responses.",
          "Check compatibility matches and find out your deep interactive style."
        ];

    ctx.fillText(lines[0], canvas.width / 2, 660);
    ctx.fillText(lines[1], canvas.width / 2, 685);

    // Draw Footer URL
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('16dskbtypes.com', canvas.width / 2, 790);

    // Create Download Link
    const imageURL = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = `dskb-profile-${typeCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open chemistry modal details
  const handleOpenModal = (code) => {
    setModalType(code);
  };

  // Close chemistry modal
  const handleCloseModal = () => {
    setModalType(null);
  };

  const modalData = modalType ? types[modalType] : null;

  return (
    <div className="results-container">
      {/* Hidden canvas for card export */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Main card Header */}
      <div className="glass-card results-header-card animate-fade-in">
        <div className="results-badge">{t.resultsBadge[lang]}</div>
        <div className="results-type-code">{typeCode}</div>
        <h1 className="results-type-title">{resultData.nameJP}</h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '15px' }}>
          {resultData.nameEN}
        </h2>
        <div className="results-tagline">“ {resultData.tagline[lang]} ”</div>
        <div className="results-divider"></div>
        <p className="results-description">{resultData.description[lang]}</p>
      </div>

      {/* Grid of Charts and Descriptions */}
      <div className="results-grid">
        {/* Radar & Progress Bars */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h2 className="card-title">
            <span style={{ color: 'var(--color-s)' }}>✦</span>
            {lang === 'ja' ? '指標スコア詳細' : 'Profile Analytics'}
          </h2>
          
          <RadarChart dPct={dPct} sPct={sPct} kPct={kPct} bPct={bPct} lang={lang} />
          
          <div className="axis-bar-container">
            {/* D vs d */}
            <div className="axis-item">
              <div className="axis-labels">
                <span className="axis-label-left" style={{ color: 'var(--color-d)' }}>D: Danger / Public ({dPct}%)</span>
                <span className="axis-label-right">d: Deep / Private ({100 - dPct}%)</span>
              </div>
              <div className="axis-bar-track">
                <div className="axis-bar-fill d-axis" style={{ width: `${dPct}%` }}></div>
              </div>
              <span className="axis-description-hint">
                {lang === 'ja' 
                  ? 'スリルや露出を好む開放的環境 (D) ⇔ 二人きりの安心感を求める密室 (d)' 
                  : 'Prefers open/risky spaces with a public edge (D) vs. locked, secure private rooms (d)'}
              </span>
            </div>

            {/* S vs s */}
            <div className="axis-item">
              <div className="axis-labels">
                <span className="axis-label-left" style={{ color: 'var(--color-s)' }}>S: Shape / Sensory ({sPct}%)</span>
                <span className="axis-label-right">s: Story / Context ({100 - sPct}%)</span>
              </div>
              <div className="axis-bar-track">
                <div className="axis-bar-fill s-axis" style={{ width: `${sPct}%` }}></div>
              </div>
              <span className="axis-description-hint">
                {lang === 'ja' 
                  ? '肉体の美しさや直接的な感覚刺激 (S) ⇔ 関係性の設定・ストーリーやルール (s)' 
                  : 'Fascinated by physical form, touch, and visual beauty (S) vs. rules, narratives, and scenario-play (s)'}
              </span>
            </div>

            {/* K vs k */}
            <div className="axis-item">
              <div className="axis-labels">
                <span className="axis-label-left" style={{ color: 'var(--color-k)' }}>K: Kanshu / Dominant ({kPct}%)</span>
                <span className="axis-label-right">k: Kachiku / Submissive ({100 - kPct}%)</span>
              </div>
              <div className="axis-bar-track">
                <div className="axis-bar-fill k-axis" style={{ width: `${kPct}%` }}></div>
              </div>
              <span className="axis-description-hint">
                {lang === 'ja' 
                  ? '自ら計画し主導権を握るリード派 (K) ⇔ 相手に心身を委ねて尽くす受動派 (k)' 
                  : 'Enjoys supervising and maintaining control (K) vs. yielding control and serving the partner (k)'}
              </span>
            </div>

            {/* B vs b */}
            <div className="axis-item">
              <div className="axis-labels">
                <span className="axis-label-left" style={{ color: 'var(--color-b)' }}>B: Broad / Fluid ({bPct}%)</span>
                <span className="axis-label-right">b: Beloved / Exclusive ({100 - bPct}%)</span>
              </div>
              <div className="axis-bar-track">
                <div className="axis-bar-fill b-axis" style={{ width: `${bPct}%` }}></div>
              </div>
              <span className="axis-description-hint">
                {lang === 'ja' 
                  ? '複数人での流動的なやり取りを許容する (B) ⇔ たった一人の相手との排他的独占 (b)' 
                  : 'Comfortable with multiple connections or fluid networks (B) vs. intensive, exclusive devotion to one (b)'}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed traits breakdown tabs */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="tabs-header">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              {t.overview[lang]}
            </button>
            <button
              className={`tab-btn ${activeTab === 'traits' ? 'active' : ''}`}
              onClick={() => setActiveTab('traits')}
            >
              {t.traits[lang]}
            </button>
            <button
              className={`tab-btn ${activeTab === 'weaknesses' ? 'active' : ''}`}
              onClick={() => setActiveTab('weaknesses')}
            >
              {t.weaknesses[lang]}
            </button>
          </div>

          <div className="tab-content-panel">
            {activeTab === 'overview' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p style={{ color: '#dfdde8', fontSize: '1rem', lineHeight: '1.6' }}>
                  {resultData.description[lang]}
                </p>
                <div style={{ marginTop: '10px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-s)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    {t.idealEnv[lang]}
                  </h4>
                  <p className="ideal-env-text">{resultData.idealEnvironment[lang]}</p>
                </div>
              </div>
            )}

            {activeTab === 'traits' && (
              <ul className="trait-list animate-fade-in">
                {resultData.traits[lang].map((trait, i) => (
                  <li key={i}>{trait}</li>
                ))}
              </ul>
            )}

            {activeTab === 'weaknesses' && (
              <ul className="trait-list weakness animate-fade-in">
                {resultData.weaknesses[lang].map((weak, i) => (
                  <li key={i}>{weak}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Compatibility Matcher */}
          <div style={{ marginTop: 'auto', paddingTop: '30px' }}>
            <h2 className="card-title" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px', borderBottom: 'none', paddingBottom: '0', marginBottom: '15px' }}>
              <span style={{ color: 'var(--color-b)' }}>✦</span>
              {t.compatibility[lang]}
            </h2>
            
            <div className="compatibility-container">
              {/* Best Match Card */}
              {types[resultData.bestMatch] && (
                <div className="compat-card best" onClick={() => handleOpenModal(resultData.bestMatch)}>
                  <div className="compat-label">{t.bestMatch[lang]}</div>
                  <div className="compat-type-name">
                    {types[resultData.bestMatch].code} : {types[resultData.bestMatch].nameJP}
                  </div>
                  <div className="compat-type-desc">
                    {lang === 'ja' ? 'クリックして相性詳細を表示' : 'Click to view compatibility detail'}
                  </div>
                </div>
              )}

              {/* Abyss Match Card */}
              {types[resultData.abyssMatch] && (
                <div className="compat-card abyss" onClick={() => handleOpenModal(resultData.abyssMatch)}>
                  <div className="compat-label">{t.abyssMatch[lang]}</div>
                  <div className="compat-type-name">
                    {types[resultData.abyssMatch].code} : {types[resultData.abyssMatch].nameJP}
                  </div>
                  <div className="compat-type-desc">
                    {lang === 'ja' ? 'クリックして相性詳細を表示' : 'Click to view compatibility detail'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sharing & Reset Actions */}
      <div className="glass-card actions-card">
        <button className="btn-primary" onClick={handleCopyShareText}>
          {copySuccess ? `✓ ${t.copied[lang]}` : t.shareText[lang]}
        </button>

        <button className="btn-glass" onClick={handleCopyResultLink}>
          {linkCopySuccess ? `✓ ${t.copied[lang]}` : t.copyLink[lang]}
        </button>
        
        <button className="btn-glass" onClick={handleDownloadCard}>
          <span style={{ fontSize: '1.1rem' }}>⬇</span> {t.downloadText[lang]}
        </button>

        <button className="btn-glass" onClick={onViewGallery}>
          {t.gallery[lang]}
        </button>

        <button className="btn-glass" onClick={onReset} style={{ borderColor: 'rgba(255, 0, 127, 0.3)' }}>
          {t.retake[lang]}
        </button>
      </div>

      {/* Modal for Compatibility Archetype Details */}
      {modalType && modalData && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="glass-card modal-content-wrapper animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
            
            <div className="modal-heading">
              <div className="results-badge" style={{ display: 'inline-block' }}>
                {modalType === resultData.bestMatch ? t.bestMatch[lang] : t.abyssMatch[lang]}
              </div>
              <h2 className="results-type-code" style={{ fontSize: '3rem', margin: '10px 0' }}>{modalType}</h2>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{modalData.nameJP}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontStyle: 'italic' }}>{modalData.nameEN}</p>
            </div>

            <p style={{ fontSize: '0.95rem', color: '#dfdde8', lineHeight: '1.6', marginBottom: '20px' }}>
              {modalData.description[lang]}
            </p>

            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-s)', marginBottom: '8px', textTransform: 'uppercase' }}>
              {t.idealEnv[lang]}
            </h4>
            <p className="ideal-env-text" style={{ fontSize: '0.9rem', marginBottom: '20px' }}>{modalData.idealEnvironment[lang]}</p>

            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-s)', marginBottom: '8px', textTransform: 'uppercase' }}>
              {lang === 'ja' ? '主な特徴' : 'Key Preferences'}
            </h4>
            <ul className="trait-list" style={{ fontSize: '0.9rem' }}>
              {modalData.traits[lang].map((trait, i) => (
                <li key={i}>{trait}</li>
              ))}
            </ul>

            <button className="btn-primary" onClick={handleCloseModal} style={{ width: '100%', marginTop: '30px', padding: '10px 0', borderRadius: '8px', fontSize: '0.95rem' }}>
              {t.close[lang]}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
