import { useState } from 'react';

export default function V2WelcomeScreen({ lang, onStart, onContinue, hasSavedProgress, onBackToV1, onViewArchetypes }) {
  const [agreedDisclaimer, setAgreedDisclaimer] = useState(false);

  const t = {
    badge: { ja: 'V2 Beta / 研究ベースの新診断', en: 'V2 Beta / Research-Informed Profile' },
    title: { ja: '欲望パターン診断', en: 'Desire Pattern Profile' },
    subtitle: {
      ja: '空想・安心・刺激・関係性から、あなたの欲望の動き方を見る30問。',
      en: 'A 30-item profile for how desire moves through fantasy, safety, cues, and relationships.'
    },
    description: {
      ja: 'V2はDSKBとは別の新しい診断です。空想と現実の距離、気持ちが入る条件、体感と物語、主導権、深さと変化の5つの指標から、あなたの欲望パターンを分析します。',
      en: 'V2 is a new instrument separate from DSKB. It maps five dimensions: fantasy-practice distance, spark and brakes, body vs story, agency, and depth vs variety.'
    },
    science: {
      ja: '性科学・関係性研究を参考にしたエンタメ診断です。診断・治療・専門的助言ではありません。',
      en: 'This is an entertainment profile informed by sexology and relationship research. It is not diagnosis, therapy, or professional advice.'
    },
    privacy: {
      ja: 'このベータ版では回答は端末内に保存されるだけで、サーバーには送信されません。',
      en: 'In this beta, answers are stored only on this device and are not sent to a server.'
    },
    agree: {
      ja: '内容を理解し、18歳以上として開始する',
      en: 'I understand and want to proceed as an adult'
    },
    start: { ja: 'V2診断を開始', en: 'Start V2 Profile' },
    continue: { ja: 'V2を途中から再開', en: 'Continue V2 Profile' },
    archetypes: { ja: 'アーキタイプ一覧', en: 'Explore archetypes' },
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
      <div className="welcome-badge v2-beta-badge">{t.badge[lang]}</div>
      <h1 className="welcome-title">
        {t.title[lang]}<br />
        <span style={{ fontSize: '1.35rem', fontWeight: 600 }}>{t.subtitle[lang]}</span>
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
        <div className="disclaimer-title">{lang === 'ja' ? 'ベータ版の注意' : 'Beta Notice'}</div>
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
        <button className="btn-glass" onClick={onBackToV1}>
          {t.back[lang]}
        </button>
        <button className="btn-glass" onClick={onViewArchetypes}>
          {t.archetypes[lang]}
        </button>
      </div>
    </div>
  );
}
