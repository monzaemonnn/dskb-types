import { useMemo, useRef, useState } from 'react';
import { v2Dimensions, v2ResultFamilies } from '../data/v2Profile';
import { getPrimaryTraits, getTraitSide, getV2CodeTraits, getV2ResultFamily, getV2TypeCode } from '../utils/v2Scoring';
import V2RadarChart from './V2RadarChart';

export default function V2ResultsDashboard({ scores, lang, onReset, onBackToV1, onViewArchetypes, onViewMethodology }) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [linkCopySuccess, setLinkCopySuccess] = useState(false);
  const [nativeShareSuccess, setNativeShareSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [modalArchetype, setModalArchetype] = useState(null);
  const canvasRef = useRef(null);
  const resultFamily = getV2ResultFamily(scores);
  const primaryTraits = useMemo(() => getPrimaryTraits(scores), [scores]);
  const typeCode = useMemo(() => getV2TypeCode(scores), [scores]);
  const codeTraits = useMemo(() => getV2CodeTraits(scores), [scores]);

  const t = {
    badge: { ja: 'V2 診断結果', en: 'V2 Profile Result' },
    typeLabel: { ja: 'あなたのV2タイプ', en: 'Your V2 type' },
    codeNote: {
      ja: 'タイプコードは5つの指標の方向を短く表したものです。細かい強さは下のメーターで見られます。',
      en: 'Your type code is a shorthand for the direction of all five dimensions. The meters below show how strong each signal is.'
    },
    strongest: { ja: '強く出た傾向', en: 'Strongest patterns' },
    detail: { ja: '5つの指標', en: 'Five dimensions' },
    share: { ja: 'SNS文面をコピー', en: 'Copy SNS caption' },
    nativeShare: { ja: '結果をシェア', en: 'Share result' },
    xShare: { ja: '投稿', en: 'Post' },
    lineShare: { ja: '送る', en: 'Send' },
    copyLink: { ja: '結果リンクをコピー', en: 'Copy result link' },
    download: { ja: 'プロフィール画像をダウンロード', en: 'Download profile card' },
    archetypes: { ja: 'アーキタイプ一覧', en: 'Explore archetypes' },
    methodology: { ja: 'V2方法論', en: 'V2 Methodology' },
    copied: { ja: 'コピーしました', en: 'Copied' },
    shared: { ja: '共有しました', en: 'Shared' },
    retake: { ja: 'V2をもう一度', en: 'Retake V2' },
    back: { ja: 'DSKBに戻る', en: 'Back to DSKB' },
    sharePanelTitle: { ja: 'タイムラインに投げる', en: 'Make it easy to post' },
    sharePanelCopy: {
      ja: 'タイプコード、モニカー、一言だけで共有できます。細かい説明はリンク先に残します。',
      en: 'Share the code, moniker, and one line. The full detail stays on the result link.'
    },
    sharePrompt: {
      ja: '同じタイプの人いますか？',
      en: 'Who else got this type?'
    },
    beta: {
      ja: 'これはベータ版のエンタメ診断です。医学的・臨床的な診断ではありません。',
      en: 'This is a beta entertainment profile, not a medical or clinical assessment.'
    },
    balanced: { ja: 'ゆらぎあり', en: 'Flexible signal' },
    overview: { ja: '概要', en: 'Overview' },
    strengthsTab: { ja: '特徴・長所', en: 'Strengths' },
    cautionsTab: { ja: '注意点', en: 'Cautions' },
    idealLabel: { ja: '理想的な条件', en: 'Ideal Conditions' },
    compatTitle: { ja: '相性診断', en: 'Chemistry & Compatibility' },
    bestMatchLabel: { ja: '最高相性', en: 'Best Match' },
    abyssMatchLabel: { ja: '沼相性 (危険な引力)', en: 'Abyss Match (Dangerous Pull)' },
    clickDetail: { ja: 'クリックして詳細を表示', en: 'Click to view details' },
    close: { ja: '閉じる', en: 'Close' },
    profileChart: { ja: 'プロフィールチャート', en: 'Profile Chart' }
  };

  const getDescription = (dimensionKey, score) => {
    const side = getTraitSide(score);
    return v2Dimensions[dimensionKey].descriptions[side][lang];
  };

  const getTraitLabel = (trait) => {
    const dimension = v2Dimensions[trait.key];
    if (trait.side === 'balanced') return t.balanced[lang];
    return dimension[trait.side][lang];
  };

  const getResultUrl = () => {
    if (typeof window === 'undefined') return 'https://dskb-types.vercel.app/';
    return window.location.href;
  };

  const getShareTitle = () => (
    lang === 'ja'
      ? `私は${typeCode}「${resultFamily.title.ja}」でした`
      : `I got ${typeCode}: ${resultFamily.title.en}`
  );

  const getShareText = ({ includeUrl = true } = {}) => {
    const resultUrl = getResultUrl();
    const labels = primaryTraits.map(getTraitLabel).join(' / ');
    const scoreLine = Object.entries(v2Dimensions)
      .map(([key, dimension]) => `${dimension.codeName[scores[key] <= 50 ? 'left' : 'right'].en[0]}:${scores[key]}`)
      .join(' ');
    const urlLine = includeUrl ? `\n${lang === 'ja' ? '診断はこちら' : 'Take the quiz'}: ${resultUrl}` : '';

    if (lang === 'ja') {
      return `私の欲望パターン診断V2は【${typeCode}: ${resultFamily.title.ja}】でした。
${labels}
${t.sharePrompt.ja}

#欲望パターン診断 #DSKBTypes${urlLine}`;
    }

    return `I got ${typeCode}: ${resultFamily.title.en} on the Desire Pattern Profile.
${labels}
${scoreLine}
${t.sharePrompt.en}

#DesirePatternProfile #DSKBTypes${urlLine}`;
  };

  const handleCopyShareText = () => {
    navigator.clipboard.writeText(getShareText()).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleCopyResultLink = () => {
    navigator.clipboard.writeText(getResultUrl()).then(() => {
      setLinkCopySuccess(true);
      setTimeout(() => setLinkCopySuccess(false), 2000);
    });
  };

  const handleNativeShare = async () => {
    if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
      handleCopyShareText();
      return;
    }

    try {
      await navigator.share({
        title: getShareTitle(),
        text: getShareText({ includeUrl: false }),
        url: getResultUrl()
      });
      setNativeShareSuccess(true);
      setTimeout(() => setNativeShareSuccess(false), 2000);
    } catch {
      // User cancellation is expected; keep the UI quiet.
    }
  };

  const handleOpenXShare = () => {
    const shareUrl = new URL('https://twitter.com/intent/tweet');
    shareUrl.searchParams.set('text', getShareText({ includeUrl: false }));
    shareUrl.searchParams.set('url', getResultUrl());
    window.open(shareUrl.toString(), '_blank', 'noopener,noreferrer');
  };

  const handleOpenLineShare = () => {
    const linePayload = `${getShareText({ includeUrl: false })}\n${getResultUrl()}`;
    window.open(`https://line.me/R/msg/text/?${encodeURIComponent(linePayload)}`, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = 1200;
    const height = 1600;
    canvas.width = width;
    canvas.height = height;

    const background = ctx.createLinearGradient(0, 0, width, height);
    background.addColorStop(0, '#12091d');
    background.addColorStop(0.5, '#090712');
    background.addColorStop(1, '#071926');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(255, 0, 127, 0.16)';
    ctx.beginPath();
    ctx.arc(160, 180, 320, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(0, 245, 255, 0.14)';
    ctx.beginPath();
    ctx.arc(1040, 280, 330, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 4;
    ctx.strokeRect(70, 70, width - 140, height - 140);

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.58)';
    ctx.font = '700 28px sans-serif';
    ctx.fillText('DESIRE PATTERN PROFILE V2', width / 2, 170);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 180px sans-serif';
    ctx.fillText(typeCode, width / 2, 390);

    ctx.fillStyle = '#00f5ff';
    ctx.font = '900 62px sans-serif';
    ctx.fillText(resultFamily.title[lang], width / 2, 500);

    ctx.fillStyle = '#c6c2d6';
    ctx.font = 'italic 34px sans-serif';
    const tagline = resultFamily.tagline[lang];
    const taglineLines = tagline.length > 48 ? [tagline.slice(0, 48), tagline.slice(48)] : [tagline];
    taglineLines.forEach((line, index) => ctx.fillText(line.trim(), width / 2, 610 + index * 46));

    codeTraits.forEach((trait, index) => {
      const x = 180 + index * 210;
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(x - 72, 760, 144, 130);
      ctx.fillStyle = '#00f5ff';
      ctx.font = '900 50px sans-serif';
      ctx.fillText(trait.code, x, 815);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 22px sans-serif';
      ctx.fillText(trait.name[lang], x, 858);
    });

    ctx.fillStyle = '#f3f3f6';
    ctx.font = '800 30px sans-serif';
    ctx.fillText(primaryTraits.map(getTraitLabel).join(' / '), width / 2, 1010);

    ctx.fillStyle = '#9c99b6';
    ctx.font = '24px sans-serif';
    ctx.fillText('dskb-types.vercel.app', width / 2, 1435);

    const link = document.createElement('a');
    link.download = `desire-pattern-${typeCode}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="results-container v2-results-container">
      <div className="glass-card results-header-card v2-results-hero animate-fade-in">
        <div className="results-badge">{t.badge[lang]}</div>
        <div className="v2-type-lockup" aria-label={t.typeLabel[lang]}>
          <span>{t.typeLabel[lang]}</span>
          <strong>{typeCode}</strong>
        </div>
        <h1 className="v2-result-title">{resultFamily.title[lang]}</h1>
        <p className="results-tagline">“ {resultFamily.tagline[lang]} ”</p>

        <div className="v2-code-strip">
          {codeTraits.map((trait) => (
            <div className="v2-code-chip" key={trait.key}>
              <strong>{trait.code}</strong>
              <span>{trait.name[lang]}</span>
            </div>
          ))}
        </div>
        <p className="v2-code-note">{t.codeNote[lang]}</p>

        <div className="v2-trait-strip" aria-label={t.strongest[lang]}>
          {primaryTraits.map((trait) => (
            <div className="v2-trait-chip" key={trait.key}>
              <span>{v2Dimensions[trait.key].title[lang]}</span>
              <strong>{getTraitLabel(trait)}</strong>
            </div>
          ))}
        </div>

        <p className="v2-beta-note">{t.beta[lang]}</p>
      </div>

      <div className="glass-card v2-meter-card">
        <h2 className="card-title">
          <span style={{ color: 'var(--color-s)' }}>✦</span>
          {t.detail[lang]}
        </h2>

        <div className="v2-meter-list">
          {Object.entries(v2Dimensions).map(([key, dimension]) => {
            const score = scores[key];
            return (
              <div className="v2-meter-item" key={key}>
                <div className="v2-meter-heading">
                  <strong>{dimension.title[lang]}</strong>
                  <span>{score}%</span>
                </div>
                <div className="v2-meter-poles">
                  <span>{dimension.left[lang]}</span>
                  <span>{dimension.right[lang]}</span>
                </div>
                <div className="v2-meter-track">
                  <div className="v2-meter-thumb" style={{ left: `${score}%`, background: dimension.color }}></div>
                </div>
                <p>{getDescription(key, score)}</p>
              </div>
            );
          })}
        </div>
      </div>

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

      <div className="glass-card actions-card">
        <div className="share-hook-card">
          <span>{t.sharePanelTitle[lang]}</span>
          <strong>{getShareTitle()}</strong>
          <p>{t.sharePanelCopy[lang]}</p>
        </div>

        <button className="btn-primary" onClick={handleNativeShare}>
          {nativeShareSuccess ? `✓ ${t.shared[lang]}` : t.nativeShare[lang]}
        </button>
        <button className="btn-glass share-service-btn x-share" onClick={handleOpenXShare}>
          X <span>{t.xShare[lang]}</span>
        </button>
        <button className="btn-glass share-service-btn line-share" onClick={handleOpenLineShare}>
          LINE <span>{t.lineShare[lang]}</span>
        </button>
        <button className="btn-primary" onClick={handleCopyShareText}>
          {copySuccess ? `✓ ${t.copied[lang]}` : t.share[lang]}
        </button>
        <button className="btn-glass" onClick={handleCopyResultLink}>
          {linkCopySuccess ? `✓ ${t.copied[lang]}` : t.copyLink[lang]}
        </button>
        <button className="btn-glass" onClick={handleDownloadCard}>
          {t.download[lang]}
        </button>
        <button className="btn-glass" onClick={onViewArchetypes}>
          {t.archetypes[lang]}
        </button>
        <button className="btn-glass" onClick={onViewMethodology}>
          {t.methodology[lang]}
        </button>
        <button className="btn-glass" onClick={onReset}>
          {t.retake[lang]}
        </button>
        <button className="btn-glass" onClick={onBackToV1}>
          {t.back[lang]}
        </button>
        <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true"></canvas>
      </div>

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
    </div>
  );
}
