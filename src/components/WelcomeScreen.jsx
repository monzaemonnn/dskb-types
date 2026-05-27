import { useState } from 'react';

export default function WelcomeScreen({ onStart, onContinue, lang, hasSavedProgress, onViewGallery, onViewMethodology, onViewV2 }) {
  const [agreedDisclaimer, setAgreedDisclaimer] = useState(false);

  const t = {
    badge: {
      en: "Interactive Desires Profiling",
      ja: "関係性と相性の深層心理分析"
    },
    title: {
      en: "16 DSKB Types",
      ja: "16タイプ DSKB 診断"
    },
    subtitle: {
      en: "Personality & Intimacy Profile",
      ja: "パーソナリティ＆関係性スタイル診断"
    },
    description: {
      en: "Unlock your subconscious relationship profile. This test maps your intimate preferences, communication styles, and chemistry dynamics across 4 distinct dimensions.",
      ja: "自分自身の隠れた欲望や、関係性におけるスタンスを紐解くための診断テスト。4つの指標（D・S・K・B）から、あなたの親密さのスタイルと相性のダイナミクスを分析します。"
    },
    axesTitle: {
      en: "The 4 Intimacy Dimensions",
      ja: "分析される4つの指標"
    },
    axisD: {
      title: { en: "Distance (D / d)", ja: "距離感と空間 (D / d)" },
      desc: { 
        en: "Danger (Open/Risk) vs. Deep (Private/Room). Do you prefer the thrill of semi-public settings or the absolute security of a closed room?", 
        ja: "Danger（開放・スリル） ⇔ Deep（密室・没入）。人目のスリルや屋外の気配を好むか、それとも誰にも邪魔されない密室を好むか。" 
      }
    },
    axisS: {
      title: { en: "Stimulus (S / s)", ja: "刺激の方向性 (S / s)" },
      desc: { 
        en: "Shape (Sensory/Visual) vs. Story (Narrative/Rules). Are you excited by visual aesthetics and physical touch, or psychological settings and context?", 
        ja: "Shape（肉体・視覚） ⇔ Story（設定・文脈）。肉体のラインや視覚的・触覚的刺激を好むか、それとも関係性、言葉、シチュエーション設定を好むか。" 
      }
    },
    axisK: {
      title: { en: "Kankei / Dynamic (K / k)", ja: "主導権と関係性 (K / k)" },
      desc: { 
        en: "Kanshu (Dominant/Lead) vs. Kachiku (Submissive/Yield). Do you crave control and directing the scenario, or find ecstasy in yielding and trust?", 
        ja: "Kanshu（主導・監修） ⇔ Kachiku（受動・委ねる）。自ら計画し主導することに興奮するか、それとも相手に身を委ねて尽くすことに快感を覚えるか。" 
      }
    },
    axisB: {
      title: { en: "Buddy Scope (B / b)", ja: "パートナーとの関係範囲 (B / b)" },
      desc: { 
        en: "Broad (Polyamorous/Multiple) vs. Beloved (Exclusive/One). Are you open to fluid, multi-partner interactions or do you desire exclusive, intense devotion?", 
        ja: "Broad（複数・広がり） ⇔ Beloved（特定・独占）。複数人での流動的なやり取りを好むか、それとも一対一の深く濃密な独占関係を求めるか。" 
      }
    },
    disclaimerTitle: {
      en: "Disclaimer & Age Notice",
      ja: "免責事項・年齢確認"
    },
    disclaimerText: {
      en: "This test is a lighthearted, psychological joke/personality test for entertainment purposes. It contains suggestive themes and relationship scenarios. There is no explicit nudity or pornography. By proceeding, you confirm you are comfortable with these adult-themed joke concepts.",
      ja: "この診断はエンターテインメントを目的としたジョーク性格診断です。恋愛観や好みのシチュエーションに関する若干際どい表現が含まれますが、直接的な性描写や露骨な画像は一切ありません。開始することで、大人向けユーモアを含んだ診断である点に同意したものとみなされます。"
    },
    agreeText: {
      en: "I understand and wish to proceed (I am 18+)",
      ja: "内容を理解し、診断を開始する（18歳以上）"
    },
    startBtn: {
      en: "Start Personality Test",
      ja: "診断を開始する"
    },
    continueBtn: {
      en: "Continue Saved Quiz",
      ja: "途中から再開する"
    },
    galleryBtn: {
      en: "Explore All 16 Types",
      ja: "16タイプ一覧を見る"
    },
    methodologyBtn: {
      en: "Scientific Methodology",
      ja: "科学的根拠を見る"
    },
    v2Btn: {
      en: "Try V2 Beta",
      ja: "V2ベータを試す"
    }
  };

  return (
    <div className="glass-card welcome-container">
      <div className="welcome-badge">{t.badge[lang]}</div>
      <h1 className="welcome-title">
        {t.title[lang]}<br />
        <span style={{ fontSize: '1.6rem', fontWeight: 600 }}>{t.subtitle[lang]}</span>
      </h1>
      
      <p className="welcome-description">{t.description[lang]}</p>

      {/* Axis Descriptions */}
      <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px', textAlign: 'left' }}>
        {t.axesTitle[lang]}
      </h2>
      <div className="welcome-info-grid">
        <div className="info-item">
          <h3 style={{ color: 'var(--color-d)' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-d)' }}></span>
            {t.axisD.title[lang]}
          </h3>
          <p>{t.axisD.desc[lang]}</p>
        </div>
        <div className="info-item">
          <h3 style={{ color: 'var(--color-s)' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-s)' }}></span>
            {t.axisS.title[lang]}
          </h3>
          <p>{t.axisS.desc[lang]}</p>
        </div>
        <div className="info-item">
          <h3 style={{ color: 'var(--color-k)' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-k)' }}></span>
            {t.axisK.title[lang]}
          </h3>
          <p>{t.axisK.desc[lang]}</p>
        </div>
        <div className="info-item">
          <h3 style={{ color: 'var(--color-b)' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-b)' }}></span>
            {t.axisB.title[lang]}
          </h3>
          <p>{t.axisB.desc[lang]}</p>
        </div>
      </div>

      {/* Consent disclaimer */}
      <div className="disclaimer-card">
        <div className="disclaimer-title">{t.disclaimerTitle[lang]}</div>
        <p className="disclaimer-text">{t.disclaimerText[lang]}</p>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '15px', cursor: 'pointer', fontSize: '0.85rem' }}>
          <input
            type="checkbox"
            checked={agreedDisclaimer}
            onChange={(e) => setAgreedDisclaimer(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--color-d)' }}
          />
          <span style={{ color: agreedDisclaimer ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: agreedDisclaimer ? '600' : '400' }}>
            {t.agreeText[lang]}
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
        {hasSavedProgress && (
          <button className="btn-primary" onClick={onContinue}>
            {t.continueBtn[lang]}
            <span>✦</span>
          </button>
        )}
        <button
          className={hasSavedProgress ? 'btn-glass' : 'btn-primary'}
          onClick={onStart}
          disabled={!agreedDisclaimer}
          style={{ opacity: agreedDisclaimer ? 1 : 0.4, cursor: agreedDisclaimer ? 'pointer' : 'not-allowed' }}
        >
          {t.startBtn[lang]}
          <span>✦</span>
        </button>
        <button className="btn-glass" onClick={onViewGallery}>
          {t.galleryBtn[lang]}
        </button>
        <button className="btn-glass" onClick={onViewMethodology}>
          {t.methodologyBtn[lang]}
        </button>
        <button className="btn-glass v2-entry-btn" onClick={onViewV2}>
          {t.v2Btn[lang]}
        </button>
      </div>
    </div>
  );
}
