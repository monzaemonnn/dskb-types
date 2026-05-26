import { useEffect, useState } from 'react';

const steps = {
  en: [
    "Gathering responses...",
    "Profiling distance & spatial preferences...",
    "Analyzing sensory & narrative stimulation...",
    "Mapping dominance & compliance dynamics...",
    "Calculating buddy scope...",
    "Matching with the 16 archetypes...",
    "Generating detailed report..."
  ],
  ja: [
    "回答を集計中...",
    "空間と距離感の好みをプロファイリング中...",
    "肉体とシチュエーション設定の偏向を分析中...",
    "主導と服従のダイナミクスを算出中...",
    "パートナー範囲を計算中...",
    "16タイプの中からあなたに最も近い人格を特定中...",
    "詳細な診断書を作成中..."
  ]
};

export default function LoaderScreen({ onFinished, lang }) {
  const [currentStep, setCurrentStep] = useState(0);

  const loadingText = lang === 'ja' ? '分析中' : 'Analyzing';

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps[lang].length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(onFinished, 600); // Small buffer before finishing
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(interval);
  }, [onFinished, lang]);

  return (
    <div className="glass-card loader-container">
      <div className="loader-spinner"></div>
      <h2 className="loader-title">
        {loadingText}
        <span style={{ display: 'inline-block', width: '24px', textAlign: 'left', animation: 'blink 1.5s infinite' }}>...</span>
      </h2>
      <div className="loader-step">
        {steps[lang][currentStep]}
      </div>
      
      <style>{`
        @keyframes blink {
          0%, 100% { content: ''; }
          33% { content: '.'; }
          66% { content: '..'; }
        }
      `}</style>
    </div>
  );
}
