export default function MethodologyScreen({ lang, onBack }) {
  const t = {
    title: {
      en: "Scientific Methodology & Psychometrics",
      ja: "科学的方法論と計量心理学"
    },
    back: {
      en: "Back to Home",
      ja: "ホームに戻る"
    },
    intro: {
      en: "This assessment transcends standard internet personality quizzes by mapping the DSKB framework to validated psychological and sexological instruments. We use a 24-item psychometric inventory designed with strict methodological rules to ensure measurement validity, reliability, and bias reduction.",
      ja: "この診断は、単なるインターネット上のクイズを超え、DSKBのフレームワークを実際の心理学および性科学の研究指標にマッピングしています。測定の妥当性、信頼性を確保しバイアスを軽減するため、厳密な方法論に基づいた24項目の計量心理学的インベントリを使用しています。"
    },
    mathTitle: {
      en: "Scoring Mathematics",
      ja: "スコアリングの計算式"
    },
    mathDesc: {
      en: "Each of the 4 axes uses 6 items (3 positively keyed, 3 negatively keyed). The Likert scale provides values from -2 (Strongly Disagree) to +2 (Strongly Agree).",
      ja: "4つの各軸は6つの質問（ポジティブ・ネガティブ各3問）で構成されます。リッカート尺度は -2（強く反対）から +2（強く賛成）までの値を持ちます。"
    },
    mathCode: {
      en: `Score Contribution = Answer_Value × Polarity_Multiplier
Axis Sum = Σ (Score Contributions)  // Range: -12 to +12
Axis Percentage = ((Axis Sum + 12) / 24) × 100

If Percentage ≥ 50% → Uppercase Type (e.g., 'D')
If Percentage < 50% → Lowercase Type (e.g., 'd')`,
      ja: `スコア寄与度 = 回答値 × 極性乗数（ポジティブなら+1、ネガティブなら-1）
軸の合計値 = Σ (スコア寄与度)  // 範囲: -12 から +12
軸のパーセンテージ = ((軸の合計値 + 12) / 24) × 100

パーセンテージが 50% 以上 → 大文字タイプ (例: 'D')
パーセンテージが 50% 未満 → 小文字タイプ (例: 'd')`
    },
    methodologyRulesTitle: {
      en: "Item Design Methodology",
      ja: "質問設計のルール"
    },
    methodologyRules: {
      en: [
        "Single-Construct Measurement: Strict avoidance of double-barreled questions.",
        "Balanced Keying: 50% positive and 50% negative statements per axis to prevent acquiescence bias.",
        "Neutral Phrasing: Reducing social desirability bias.",
        "Blind Testing: Axis tags are hidden during the quiz to prevent expectation bias."
      ],
      ja: [
        "単一構成概念の測定: ダブルバーレル質問（2つの意味を持つ質問）の厳格な排除。",
        "バランスの取れたスコアリング: 「すべて同意する」などの迎合バイアスを防ぐため、各軸の質問をポジティブ・ネガティブで50%ずつに分割。",
        "中立的な表現: 社会的望ましさによる回答バイアスを軽減。",
        "ブラインドテスト: 期待バイアスを防ぐため、回答中はどの軸を測定しているかを非表示に。"
      ]
    },
    axesMappingTitle: {
      en: "Construct Validation & Mapping",
      ja: "構成概念の妥当性とマッピング"
    },
    axesData: [
      {
        axis: "D-Axis: Distance & Space",
        axisJa: "D軸：空間と距離感",
        instrument: "Sexual Sensation Seeking Scale (SSSS) — Kalichman & Rompa, 1995",
        alpha: "0.70–0.87",
        construct: {
          en: "Dispositional need for varied, novel, complex sexual experiences; willingness to take social/physical risks for enhanced sensation.",
          ja: "多様で新しい複雑な性的体験への欲求。感覚を高めるために社会的・身体的リスクを冒す傾向。"
        },
        upper: {
          en: "D (uppercase): High sensation seeking: thrill of transgression, exhibitionistic tendencies, excitement from risk of discovery.",
          ja: "D (大文字): 高い感覚探求。背徳感のスリル、露出傾向、発見されるリスクからの興奮。"
        },
        lower: {
          en: "d (lowercase): Low sensation seeking: preference for safe, private, immersive, sealed environments; deep focus over external stimulation.",
          ja: "d (小文字): 低い感覚探求。安全でプライベートな密室環境への選好。外部刺激よりも深い没入を重視。"
        }
      },
      {
        axis: "S-Axis: Stimulus Modality",
        axisJa: "S軸：刺激の方向性",
        instrument: "Sexual Excitation/Inhibition Scales (SES/SIS) — Bancroft & Janssen, 2002",
        alpha: "0.75–0.88",
        construct: {
          en: "Dual Control Model measuring whether arousal is primarily driven by physical/visual stimuli or psychological/narrative context.",
          ja: "興奮の引き金が視覚的・肉体的な刺激か、心理的・物語的な文脈かを測定するデュアルコントロールモデル。"
        },
        upper: {
          en: "S (uppercase): Sensory-excitation dominant: arousal driven by direct physical, visual, or tactile stimuli (body, clothing, aesthetics).",
          ja: "S (大文字): 感覚的興奮が優位。直接的な肉体、視覚、触覚刺激（身体、衣服、美学）によって興奮が引き起こされる。"
        },
        lower: {
          en: "s (lowercase): Context-excitation dominant: arousal driven by narrative, scenario, relationship dynamics, verbal tension.",
          ja: "s (小文字): 文脈的興奮が優位。物語、シチュエーション、関係性のダイナミクス、言葉の緊張感によって興奮が引き起こされる。"
        }
      },
      {
        axis: "K-Axis: Kinetics & Dominance",
        axisJa: "K軸：主導権と関係性",
        instrument: "Trait Dominance-Submissiveness Scale (TDS) — Mehrabian",
        alpha: "0.95 (KR-20)",
        construct: {
          en: "Preference for active agency (controlling, directing, orchestrating) versus receptive agency (yielding, serving, surrendering) in intimate contexts.",
          ja: "親密な状況における能動的エージェンシー（支配、指示、調整）と受容的エージェンシー（屈服、奉仕、服従）の選好。"
        },
        upper: {
          en: "K (uppercase): Dominant orientation: satisfaction from initiative, control, authority, and designing scenarios.",
          ja: "K (大文字): 支配的志向。主導権、コントロール、権威、シチュエーションの設計から満足感を得る。"
        },
        lower: {
          en: "k (lowercase): Submissive orientation: comfort in yielding, being led, devotion, and placing oneself in the partner's hands.",
          ja: "k (小文字): 服従的志向。委ねること、導かれること、献身、パートナーに身を任せることに安心感を得る。"
        }
      },
      {
        axis: "B-Axis: Bond & Exclusivity",
        axisJa: "B軸：パートナー関係範囲",
        instrument: "Revised Sociosexual Orientation Inventory (SOI-R) — Penke & Asendorpf, 2008",
        alpha: "0.74–0.83",
        construct: {
          en: "Willingness to engage in fluid or plural connections (unrestricted sociosexuality) versus deep, exclusive, singular devotion (restricted sociosexuality).",
          ja: "流動的または複数の繋がりに対する開放性（非制限的社会性）と、深く排他的で単一の献身（制限的社会性）。"
        },
        upper: {
          en: "B (uppercase): Unrestricted: openness to multiple connections, group dynamics, fluid arrangements, variety.",
          ja: "B (大文字): 非制限的。複数のつながり、グループダイナミクス、流動的な関係、多様性に対する開放性。"
        },
        lower: {
          en: "b (lowercase): Restricted: deep singular devotion, exclusive attachment, possessive one-on-one bonds.",
          ja: "b (小文字): 制限的。深く単一の献身、排他的な愛着、独占的な一対一の絆。"
        }
      }
    ]
  };

  return (
    <div className="glass-card welcome-container" style={{ maxWidth: '850px', textAlign: 'left', padding: '40px' }}>
      <button className="btn-glass" onClick={onBack} style={{ marginBottom: '25px' }}>
        <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>✦</span> {t.back[lang]}
      </button>

      <h2 style={{ fontSize: '2.2rem', marginBottom: '20px', color: 'var(--text-main)', fontWeight: '800' }}>
        {t.title[lang]}
      </h2>
      
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '40px', fontSize: '1.1rem' }}>
        {t.intro[lang]}
      </p>

      {/* Rules Section */}
      <div style={{ marginBottom: '40px', background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)', padding: '25px', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--color-s)', marginBottom: '15px' }}>
          {t.methodologyRulesTitle[lang]}
        </h3>
        <ul style={{ listStyleType: 'disc', paddingLeft: '25px', color: 'var(--text-main)', lineHeight: '1.8' }}>
          {t.methodologyRules[lang].map((rule, idx) => (
            <li key={idx} style={{ marginBottom: '8px' }}>{rule}</li>
          ))}
        </ul>
      </div>

      {/* Math Section */}
      <div style={{ marginBottom: '40px', background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)', padding: '25px', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--color-b)', marginBottom: '15px' }}>
          {t.mathTitle[lang]}
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '15px', lineHeight: '1.6' }}>
          {t.mathDesc[lang]}
        </p>
        <pre style={{ background: '#090712', padding: '15px', borderRadius: '8px', border: '1px solid var(--panel-border)', overflowX: 'auto', color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.5' }}>
          <code>{t.mathCode[lang]}</code>
        </pre>
      </div>

      {/* Axes Mapping Section */}
      <h3 style={{ fontSize: '1.6rem', color: 'var(--color-d)', marginBottom: '20px', marginTop: '20px' }}>
        {t.axesMappingTitle[lang]}
      </h3>
      <div className="methodology-axes" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {t.axesData.map((data, idx) => {
          const colors = ['var(--color-d)', 'var(--color-s)', 'var(--color-k)', 'var(--color-b)'];
          const color = colors[idx];
          return (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}40`, padding: '25px', borderRadius: '12px', boxShadow: `0 4px 20px ${color}10` }}>
              <h4 style={{ color: color, fontSize: '1.3rem', marginBottom: '20px', borderBottom: `1px solid ${color}40`, paddingBottom: '10px' }}>
                {lang === 'ja' ? data.axisJa : data.axis}
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', fontSize: '0.95rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px' }}>
                  <strong style={{ color: 'var(--text-muted)' }}>Instrument:</strong>
                  <span style={{ color: 'var(--text-main)' }}>{data.instrument}</span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px' }}>
                  <strong style={{ color: 'var(--text-muted)' }}>Cronbach's α:</strong>
                  <span style={{ color: 'var(--text-main)' }}>{data.alpha}</span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px' }}>
                  <strong style={{ color: 'var(--text-muted)' }}>Construct:</strong>
                  <span style={{ color: 'var(--text-main)', lineHeight: '1.5' }}>{data.construct[lang]}</span>
                </div>
                
                <div style={{ marginTop: '10px', paddingTop: '15px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                  <div style={{ marginBottom: '10px', lineHeight: '1.5' }}>
                    <strong style={{ color: color }}>{data.upper[lang].split(':')[0]}:</strong>
                    <span style={{ color: 'var(--text-main)' }}>{data.upper[lang].substring(data.upper[lang].indexOf(':') + 1)}</span>
                  </div>
                  <div style={{ lineHeight: '1.5' }}>
                    <strong style={{ color: color }}>{data.lower[lang].split(':')[0]}:</strong>
                    <span style={{ color: 'var(--text-main)' }}>{data.lower[lang].substring(data.lower[lang].indexOf(':') + 1)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
