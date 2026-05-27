import { useEffect, useRef, useState } from 'react';

export default function QuizScreen({ questions, currentIdx, answers, onAnswer, onBack, lang }) {
  const currentQuestion = questions[currentIdx];
  const progressPct = ((currentIdx) / questions.length) * 100;
  const currentSelectedValue = answers[currentQuestion.id] !== undefined ? answers[currentQuestion.id] : null;
  const [pendingSelection, setPendingSelection] = useState(null);
  const advanceTimerRef = useRef(null);
  const displayedSelectedValue = pendingSelection?.questionId === currentQuestion.id
    ? pendingSelection.value
    : currentSelectedValue;
  const questionNumber = currentIdx + 1;

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, [currentQuestion.id]);

  const handleSelectOption = (value) => {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
    }

    setPendingSelection({ questionId: currentQuestion.id, value });
    onAnswer(currentQuestion.id, value);

    advanceTimerRef.current = window.setTimeout(() => {
      setPendingSelection(null);
      onAnswer(currentQuestion.id, value, true);
    }, 220);
  };

  const handleBackClick = () => {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
    }

    setPendingSelection(null);
    onBack();
  };

  const t = {
    progress: {
      en: `Question ${currentIdx + 1} of ${questions.length}`,
      ja: `質問 ${currentIdx + 1} / ${questions.length}`
    },
    back: {
      en: "Back",
      ja: "戻る"
    },
    next: {
      en: "Next",
      ja: "次へ"
    },
    scale: {
      agreeStrong: { en: "Strongly Agree", ja: "強く賛成" },
      agree: { en: "Agree", ja: "賛成" },
      neutral: { en: "Neutral", ja: "どちらでもない" },
      disagree: { en: "Disagree", ja: "反対" },
      disagreeStrong: { en: "Strongly Disagree", ja: "強く反対" }
    },
    scaleShort: {
      agreeStrong: { en: "Strong Yes", ja: "強く賛成" },
      agree: { en: "Yes", ja: "賛成" },
      neutral: { en: "Neutral", ja: "中立" },
      disagree: { en: "No", ja: "反対" },
      disagreeStrong: { en: "Strong No", ja: "強く反対" }
    }
  };

  // Likert options definition
  const options = [
    { value: -2, label: t.scaleShort.disagreeStrong[lang], ariaLabel: t.scale.disagreeStrong[lang], className: "disagree-strong", size: "large" },
    { value: -1, label: t.scaleShort.disagree[lang], ariaLabel: t.scale.disagree[lang], className: "disagree", size: "medium" },
    { value: 0, label: t.scaleShort.neutral[lang], ariaLabel: t.scale.neutral[lang], className: "neutral", size: "small" },
    { value: 1, label: t.scaleShort.agree[lang], ariaLabel: t.scale.agree[lang], className: "agree", size: "medium" },
    { value: 2, label: t.scaleShort.agreeStrong[lang], ariaLabel: t.scale.agreeStrong[lang], className: "agree-strong", size: "large" }
  ];

  return (
    <div className="glass-card quiz-container">
      {/* Progress header */}
      <div className="quiz-header">
        <span className="quiz-progress-text">{t.progress[lang]}</span>
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progressPct}%` }}></div>
        </div>
      </div>

      {/* Main question card */}
      <div className="question-card">
        <div>
          <div className="question-meta-row blind-question-meta">
            <span className="question-index-chip">
              {lang === 'ja' ? '設問' : 'Item'} {String(questionNumber).padStart(2, '0')}
            </span>
          </div>
          <h2 className="question-text">
            {currentQuestion.text[lang]}
          </h2>
        </div>

        {/* Likert Scale input */}
        <div className="likert-scale">
          {options.map((opt) => {
            const isSelected = displayedSelectedValue === opt.value;
            return (
              <div
                key={opt.value}
                className={`likert-option ${opt.className} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectOption(opt.value)}
                role="button"
                tabIndex={0}
                aria-label={opt.ariaLabel}
                aria-pressed={isSelected}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectOption(opt.value);
                  }
                }}
              >
                <div className="likert-circle-slot">
                  <div className={`likert-circle ${opt.size}`}>
                    {isSelected && (
                      <div style={{
                        width: opt.size === 'large' ? '18px' : opt.size === 'medium' ? '14px' : '10px',
                        height: opt.size === 'large' ? '18px' : opt.size === 'medium' ? '14px' : '10px',
                        borderRadius: '50%',
                        background: '#fff',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                      }} />
                    )}
                  </div>
                </div>
                <span className="likert-label">{opt.label}</span>
              </div>
            );
          })}
        </div>

        {/* Navigation Footer */}
        <div className="quiz-footer">
          {currentIdx > 0 ? (
            <button className="btn-glass" onClick={handleBackClick}>
              <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>✦</span> {t.back[lang]}
            </button>
          ) : (
            <div></div> // empty spacer
          )}

          <button
            className="btn-primary"
            onClick={() => onAnswer(currentQuestion.id, currentSelectedValue, true)} // proceed
            disabled={currentSelectedValue === null}
            style={{
              opacity: currentSelectedValue !== null ? 1 : 0.4,
              cursor: currentSelectedValue !== null ? 'pointer' : 'not-allowed',
              padding: '10px 24px',
              borderRadius: '8px',
              fontSize: '0.95rem'
            }}
          >
            {t.next[lang]} ✦
          </button>
        </div>
      </div>
    </div>
  );
}
