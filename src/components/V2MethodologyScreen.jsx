export default function V2MethodologyScreen({ lang, onBack }) {
  const t = {
    title: {
      ja: 'V2 方法論',
      en: 'V2 Methodology'
    },
    subtitle: {
      ja: '欲望パターン診断は、性科学・関係性研究を参考にしたエンタメ診断です。臨床診断ではありません。',
      en: 'The Desire Pattern Profile is an entertainment quiz informed by sexology and relationship research. It is not a clinical assessment.'
    },
    back: {
      ja: 'V2に戻る',
      en: 'Back to V2'
    },
    sections: [
      {
        title: { ja: '何を測っているか', en: 'What V2 Measures' },
        body: {
          ja: 'V2は、性的嗜好そのものを断定するのではなく、欲望が動きやすい条件を5つの指標で見ます。空想として惹かれるもの、現実で試したいもの、安心が必要な度合い、体感と物語の比重、主導権、深さと変化の向きなどを扱います。',
          en: 'V2 does not claim to diagnose sexuality or fetish identity. It maps the conditions under which desire tends to move: fantasy versus real-life preference, activation and inhibition, body versus story cues, agency, and depth versus variety.'
        }
      },
      {
        title: { ja: '質問設計', en: 'Item Design' },
        body: {
          ja: '30問、5指標、各指標6問です。回答は5段階リッカート尺度で、各指標には同意方向と反対方向の項目を混ぜています。回答中は指標名を表示せず、結果を狙って答えるバイアスを減らしています。',
          en: 'The beta has 30 items: 5 dimensions with 6 items each. Responses use a 5-point Likert scale. Items are keyed in both directions, and dimension labels are hidden during the quiz to reduce expectation bias.'
        }
      },
      {
        title: { ja: 'スコアリング', en: 'Scoring' },
        body: {
          ja: '各回答は -2 から +2 に変換され、逆向き項目は符号を反転します。各指標の合計を 0〜100 に変換し、50を中心に左右どちらの傾向が強いかを見ます。公開タイプコードは5文字ですが、詳細メーターでは強さと中間性も表示します。',
          en: 'Each answer is converted from -2 to +2, with reverse-keyed items flipped. Each dimension is converted to a 0-100 score. The public type code uses one letter per axis, while the meters preserve strength and midpoint nuance.'
        }
      },
      {
        title: { ja: 'なぜ5文字コードなのか', en: 'Why a 5-Letter Code' },
        body: {
          ja: 'MBTIのように覚えやすく共有しやすい形にするため、V2では5文字コードを使います。ただし、コードは診断名ではなくスコアの短縮表示です。近いスコアでも文字は必ず出ますが、詳細メーターで「強い傾向」か「ゆらぎ」かを確認できます。',
          en: 'V2 uses a five-letter code because it is easier to remember and share. The code is shorthand, not a diagnosis. Even near-midpoint axes receive a letter, but the detail meters show whether that signal is strong or flexible.'
        }
      },
      {
        title: { ja: 'プライバシー', en: 'Privacy' },
        body: {
          ja: '現在のベータ版では、回答は端末内のローカルストレージに保存されるだけで、サーバーには送信されません。結果URLには集計後の5つのスコアだけが含まれます。',
          en: 'In the current beta, answers are stored only in local storage on this device and are not sent to a server. Shared result URLs contain only the five aggregate scores.'
        }
      }
    ],
    axesTitle: { ja: '5つの指標', en: 'The Five Dimensions' },
    axes: [
      {
        title: { ja: '空想と現実の距離', en: 'Fantasy-Practice Distance' },
        poles: { ja: '空想寄り / 実践寄り', en: 'Fantasy-leaning / Practice-leaning' },
        body: {
          ja: '空想として楽しむ欲望と、現実で安全に確かめたい欲望を分けて見ます。',
          en: 'Separates desire that works mainly as imagination from desire the user may want to safely enact.'
        }
      },
      {
        title: { ja: '着火とブレーキ', en: 'Spark-Brake Pattern' },
        poles: { ja: '着火しやすい / 安心重視', en: 'Fast-spark / Guarded-spark' },
        body: {
          ja: '何で気持ちが入りやすいか、何がブレーキになりやすいかを見ます。',
          en: 'Looks at what activates desire and what kinds of pressure, timing, or safety needs inhibit it.'
        }
      },
      {
        title: { ja: '体感と物語', en: 'Body-Story Focus' },
        poles: { ja: '体感寄り / 物語寄り', en: 'Body-focused / Story-focused' },
        body: {
          ja: '身体感覚、見た目、触れ方に惹かれやすいか、設定・言葉・関係性の流れに惹かれやすいかを見ます。',
          en: 'Maps whether desire is pulled more by physical sensation and appearance or by context, language, and narrative.'
        }
      },
      {
        title: { ja: '主導権の向き', en: 'Agency Orientation' },
        poles: { ja: '導く / 委ねる', en: 'Lead-leaning / Yield-leaning' },
        body: {
          ja: '自分から流れを作る方が自然か、信頼できる相手に導かれる方が入りやすいかを見ます。',
          en: 'Looks at whether desire feels more natural when guiding the flow or being invited and led by someone trusted.'
        }
      },
      {
        title: { ja: '深さと変化', en: 'Depth-Variety Orientation' },
        poles: { ja: '深さ寄り / 変化寄り', en: 'Depth-leaning / Variety-leaning' },
        body: {
          ja: '信頼や積み重ねで深まるタイプか、新しさや変化で動きやすいタイプかを見ます。',
          en: 'Maps whether desire deepens through trust and history or is energized by novelty and variation.'
        }
      }
    ],
    caveatTitle: { ja: 'ベータ版の限界', en: 'Beta Limits' },
    caveat: {
      ja: 'V2は研究を参考にした設計ですが、まだ信頼性分析・因子分析・外部妥当性の検証を終えた尺度ではありません。現時点では、自己理解と会話のきっかけとして使うためのエンタメ診断です。',
      en: 'V2 is research-informed, but it has not yet completed reliability testing, factor analysis, or external validation. For now, it should be used as an entertainment profile for self-reflection and conversation.'
    }
  };

  return (
    <div className="glass-card welcome-container v2-welcome-container" style={{ textAlign: 'left' }}>
      <button className="btn-glass" onClick={onBack} style={{ marginBottom: 'var(--spacing-md)' }}>
        <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>✦</span> {t.back[lang]}
      </button>

      <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-main)', fontWeight: '700' }}>
        {t.title[lang]}
      </h2>
      <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: 'var(--spacing-lg)' }}>
        {t.subtitle[lang]}
      </p>

      <div style={{ display: 'grid', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
        {t.sections.map((section) => (
          <section key={section.title.en} className="info-item">
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-secondary)', marginBottom: 'var(--spacing-xs)' }}>{section.title[lang]}</h3>
            <p style={{ color: 'var(--color-text-main)', lineHeight: '1.6' }}>{section.body[lang]}</p>
          </section>
        ))}
      </div>

      <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: 'var(--spacing-md)' }}>{t.axesTitle[lang]}</h3>
      <div className="methodology-axes" style={{ display: 'grid', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
        {t.axes.map((axis, index) => {
          const color = index % 2 === 0 ? 'var(--color-primary)' : 'var(--color-secondary)';
          return (
            <section key={axis.title.en} className="info-item" style={{ borderColor: color }}>
              <h4 style={{ color, fontSize: '1.1rem', marginBottom: 'var(--spacing-xs)' }}>{axis.title[lang]}</h4>
              <p style={{ color: 'var(--color-text-muted)', fontWeight: '700', marginBottom: 'var(--spacing-sm)', fontSize: '0.875rem' }}>{axis.poles[lang]}</p>
              <p style={{ color: 'var(--color-text-main)', lineHeight: '1.6' }}>{axis.body[lang]}</p>
            </section>
          );
        })}
      </div>

      <section className="disclaimer-card" style={{ textAlign: 'left' }}>
        <h3 className="disclaimer-title" style={{ textAlign: 'left', color: 'var(--color-primary)' }}>{t.caveatTitle[lang]}</h3>
        <p style={{ color: 'var(--color-text-main)', lineHeight: '1.6' }}>{t.caveat[lang]}</p>
      </section>
    </div>
  );
}
