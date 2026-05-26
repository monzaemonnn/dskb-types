export default function MethodologyScreen({ lang, onBack }) {
  const t = {
    title: {
      en: "Scientific Methodology",
      ja: "科学的方法論と根拠"
    },
    back: {
      en: "Back to Home",
      ja: "ホームに戻る"
    },
    intro: {
      en: "This quiz transcends standard internet personality tests by mapping the DSKB meme to validated psychological and sexological instruments. We use a 24-item psychometric inventory (6 questions per axis) designed with strict methodological rules to prevent bias and ensure measurement validity.",
      ja: "この診断は、単なるインターネット上のミーム（お遊び）を超え、DSKBの4つの指標を実際の心理学および性科学の研究指標にマッピングして作成されています。バイアスを防ぎ測定の妥当性を高めるため、厳密な方法論に基づいた24の質問（各軸6問）で構成されています。"
    },
    methodologyRulesTitle: {
      en: "Item Design Methodology",
      ja: "質問設計のルール"
    },
    methodologyRules: {
      en: [
        "Single-Construct Measurement: Avoiding double-barreled questions.",
        "Balanced Keying: Mixing positive and negative statements to prevent acquiescence bias.",
        "Neutral Phrasing: Reducing social desirability bias.",
        "Blind Testing: Axis tags are hidden during the quiz to prevent expectation bias."
      ],
      ja: [
        "単一構成概念の測定: 複数の意味を含む質問（ダブルバーレル質問）を排除。",
        "バランスの取れたスコアリング: 「すべて同意する」といった迎合バイアスを防ぐため、ポジティブ・ネガティブな質問を混在。",
        "中立的な表現: 社会的望ましさによる回答バイアスを軽減。",
        "ブラインドテスト: 期待バイアスを防ぐため、回答中はどの軸を測定しているかを非表示に。"
      ]
    },
    axisD: {
      title: { en: "D-Axis: Distance & Space", ja: "D軸：空間と距離感" },
      desc: {
        en: "Scientific Basis: Sexual Sensation Seeking Scale (SSSS) by Kalichman & Rompa (1995). Measures dispositional need for varied, novel experiences and willingness to take risks for enhanced sensation (Exhibitionism vs. Isolation).",
        ja: "科学的根拠: 性的感覚探求尺度（SSSS / Kalichman & Rompa, 1995）。多様で新しい体験への欲求や、感覚を高めるためのリスク許容度（露出・スリル vs 密室・没入）を測定します。"
      }
    },
    axisS: {
      title: { en: "S-Axis: Stimulus Modality", ja: "S軸：刺激の方向性" },
      desc: {
        en: "Scientific Basis: Dual Control Model (Bancroft & Janssen, 2002) and Sexual Excitation/Inhibition Scales (SES/SIS). Measures whether arousal is primarily driven by physical/visual stimuli (Shape) or psychological/narrative context (Story).",
        ja: "科学的根拠: デュアル・コントロール・モデル（Bancroft & Janssen, 2002）および性的興奮・抑制尺度（SES/SIS）。興奮の引き金が視覚的・肉体的な刺激（Shape）か、文脈や心理的な物語（Story）かを測定します。"
      }
    },
    axisK: {
      title: { en: "K-Axis: Kinetics & Dominance", ja: "K軸：主導権と関係性" },
      desc: {
        en: "Scientific Basis: Mehrabian Trait Dominance-Submissiveness Scale adapted for intimate contexts (Wismeijer & van Assen, 2013). Measures preference for active agency (directing, controlling) versus receptive agency (yielding, serving).",
        ja: "科学的根拠: メラビアンの支配-服従特性尺度（Wismeijer & van Assen, 2013 等のBDSM研究を親密な文脈に応用）。主導的・能動的な欲求（コントロール・監修）と、受動的・委ねる欲求（奉仕・服従）を測定します。"
      }
    },
    axisB: {
      title: { en: "B-Axis: Bond & Exclusivity", ja: "B軸：パートナー関係範囲" },
      desc: {
        en: "Scientific Basis: Revised Sociosexual Orientation Inventory (SOI-R) by Penke & Asendorpf (2008). Measures continuous willingness to engage in fluid/plural connections (Unrestricted) versus deep, exclusive, singular devotion (Restricted).",
        ja: "科学的根拠: 改訂版社会性的志向インベントリ（SOI-R / Penke & Asendorpf, 2008）。多様な繋がりや流動的な関係に対する開放性（非制限的）と、一対一の排他的で深い執着（制限的）を測定します。"
      }
    }
  };

  return (
    <div className="glass-card welcome-container" style={{ maxWidth: '800px', textAlign: 'left', padding: '40px' }}>
      <button className="btn-glass" onClick={onBack} style={{ marginBottom: '25px' }}>
        <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>✦</span> {t.back[lang]}
      </button>

      <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--text-main)' }}>
        {t.title[lang]}
      </h2>
      
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '35px', fontSize: '1.05rem' }}>
        {t.intro[lang]}
      </p>

      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.3rem', color: 'var(--color-s)', marginBottom: '15px' }}>
          {t.methodologyRulesTitle[lang]}
        </h3>
        <ul style={{ listStyleType: 'disc', paddingLeft: '25px', color: 'var(--text-main)', lineHeight: '1.8' }}>
          {t.methodologyRules[lang].map((rule, idx) => (
            <li key={idx} style={{ marginBottom: '8px' }}>{rule}</li>
          ))}
        </ul>
      </div>

      <div className="methodology-axes" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {['axisD', 'axisS', 'axisK', 'axisB'].map((axisKey, idx) => {
          const colors = ['var(--color-d)', 'var(--color-s)', 'var(--color-k)', 'var(--color-b)'];
          return (
            <div key={axisKey} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
              <h4 style={{ color: colors[idx], fontSize: '1.15rem', marginBottom: '10px' }}>
                {t[axisKey].title[lang]}
              </h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                {t[axisKey].desc[lang]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
