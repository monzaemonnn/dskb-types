import { useState } from 'react';

export default function V2WelcomeScreen({ lang, onStart, onContinue, hasSavedProgress, onBackToV1, onViewArchetypes, onViewMethodology, hideBackToV1 }) {
  const [agreedDisclaimer, setAgreedDisclaimer] = useState(false);

  const t = {
    badge: { ja: '研究ベースの心理・関係性分析', en: 'Research-Informed Relationship Profile' },
    title: { ja: '欲望パターン診断', en: 'Desire Pattern Profile' },
    subtitle: {
      ja: '空想・安心・刺激・関係性から、あなたの欲望の動き方を見る30問。',
      en: 'A 30-item profile for how desire moves through fantasy, safety, cues, and relationships.'
    },
    description: {
      ja: '本診断はDSKBとは別の新しいアプローチです。空想と現実の距離、気持ちが入る条件、体感と物語、主導権、深さと変化の5つの指標から、あなたの欲望パターンを多角的に分析します。',
      en: 'This is a dedicated instrument mapping five dimensions: fantasy-practice distance, spark and brakes, body vs story, agency, and depth vs variety.'
    },
    science: {
      ja: '性科学・関係性研究の知見をもとに設計された自己理解エンタメ診断です。医学的な診断や専門的助言を提供するものではありません。',
      en: 'This is an self-understanding tool informed by sexology and relationship research. It does not provide medical diagnosis or professional advice.'
    },
    privacy: {
      ja: '回答データはすべてご利用の端末内に保存され、外部サーバーに送信されることはありません。',
      en: 'Your answers are saved locally on this device and are never sent to a server.'
    },
    agree: {
      ja: '内容を理解し、18歳以上として開始する',
      en: 'I understand and want to proceed as an adult'
    },
    start: { ja: '診断を開始', en: 'Start Profile' },
    continue: { ja: '途中から再開', en: 'Continue Profile' },
    archetypes: { ja: 'アーキタイプ一覧', en: 'Explore archetypes' },
    methodology: { ja: '診断方法論について', en: 'Methodology' },
    back: { ja: 'DSKBに戻る', en: 'Back to DSKB' },
    cards: [
      {
        title: { ja: '空想と現実', en: 'Fantasy & Practice' },
        body: { ja: '空想として惹かれるものと、現実で求めたいものを分けて見ます。', en: 'Separates fantasy appeal from real-life comfort.' }
      },
      {
        title: { ja: '着火とブレーキ', en: 'Spark & Brakes' },
        body: { ja: '何で気持ちが入り、何で止まりやすいかを見ます。', en: 'Looks at what activates desire and what shuts it down.' }
      },
      {
        title: { ja: '関係性の形', en: 'Relational Shape' },
        body: { ja: '体感、物語、主導権、深さと変化のバランスを扱います。', en: 'Maps body, story, agency, depth, and variety.' }
      }
    ]
  };

  return (
    <div className="glass-card welcome-container v2-welcome-container">
      <div className="results-badge" style={{ display: 'inline-block', marginBottom: 'var(--spacing-md)' }}>
        {t.badge[lang]}
      </div>
      <h1 className="welcome-title">
        {t.title[lang]}<br />
        <span>{t.subtitle[lang]}</span>
      </h1>

      <p className="welcome-description">{t.description[lang]}</p>

      <div className="v2-info-grid">
        {t.cards.map((card) => (
          <div className="info-item v2-info-item" key={card.title.en}>
            <h3>{card.title[lang]}</h3>
            <p>{card.body[lang]}</p>
          </div>
        ))}
      </div>

      <div className="disclaimer-card">
        <div className="disclaimer-title">{lang === 'ja' ? '免責・同意事項' : 'Disclaimer & Consent'}</div>
        <p className="disclaimer-text">{t.science[lang]}</p>
        <p className="disclaimer-text" style={{ marginTop: '8px' }}>{t.privacy[lang]}</p>
        <label className="consent-row">
          <input
            type="checkbox"
            checked={agreedDisclaimer}
            onChange={(event) => setAgreedDisclaimer(event.target.checked)}
          />
          <span>{t.agree[lang]}</span>
        </label>
      </div>

      <div className="welcome-action-row">
        {hasSavedProgress && (
          <button className="btn-primary" onClick={onContinue}>
            {t.continue[lang]} <span>✦</span>
          </button>
        )}
        <button
          className="btn-primary"
          onClick={onStart}
          disabled={!agreedDisclaimer}
          style={{ opacity: agreedDisclaimer ? 1 : 0.4, cursor: agreedDisclaimer ? 'pointer' : 'not-allowed' }}
        >
          {t.start[lang]} <span>✦</span>
        </button>
        {!hideBackToV1 && (
          <button className="btn-glass" onClick={onBackToV1}>
            {t.back[lang]}
          </button>
        )}
        <button className="btn-glass" onClick={onViewArchetypes}>
          {t.archetypes[lang]}
        </button>
        <button className="btn-glass" onClick={onViewMethodology}>
          {t.methodology[lang]}
        </button>
      </div>
    </div>
  );
}
