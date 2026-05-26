import { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import LoaderScreen from './components/LoaderScreen';
import ResultsDashboard from './components/ResultsDashboard';
import TypeGallery from './components/TypeGallery';
import { questions } from './data/questions';

const QUIZ_STORAGE_KEY = 'dskb-quiz-progress';

function clampPercentage(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return null;
  return Math.min(100, Math.max(0, Math.round(numericValue)));
}

function getSharedResultFromUrl() {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const resultCode = params.get('result');
  if (!resultCode || !/^[dD][sS][kK][bB]$/.test(resultCode)) return null;

  const dPct = clampPercentage(params.get('d'));
  const sPct = clampPercentage(params.get('s'));
  const kPct = clampPercentage(params.get('k'));
  const bPct = clampPercentage(params.get('b'));

  if ([dPct, sPct, kPct, bPct].some((value) => value === null)) return null;

  const urlLang = params.get('lang');

  return {
    typeCode: resultCode,
    percentages: { dPct, sPct, kPct, bPct },
    lang: urlLang === 'en' ? 'en' : 'ja'
  };
}

function loadSavedQuiz() {
  if (typeof window === 'undefined') return null;

  try {
    const savedProgress = window.localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!savedProgress) return null;

    const parsedProgress = JSON.parse(savedProgress);
    const answers = parsedProgress?.answers;
    const currentQuestionIdx = Number(parsedProgress?.currentQuestionIdx);

    if (!answers || typeof answers !== 'object') return null;
    if (!Number.isInteger(currentQuestionIdx) || currentQuestionIdx < 0 || currentQuestionIdx >= questions.length) return null;

    return {
      answers,
      currentQuestionIdx,
      lang: parsedProgress.lang === 'en' ? 'en' : 'ja'
    };
  } catch {
    return null;
  }
}

function saveQuizProgress(progress) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(progress));
}

function clearSavedQuiz() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(QUIZ_STORAGE_KEY);
}

function clearResultUrl() {
  if (typeof window === 'undefined') return;
  window.history.replaceState(null, '', window.location.pathname);
}

function publishResultUrl(typeCode, percentages, lang) {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams({
    result: typeCode,
    d: String(percentages.dPct),
    s: String(percentages.sPct),
    k: String(percentages.kPct),
    b: String(percentages.bPct),
    lang
  });

  window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
}

export default function App() {
  const [initialAppState] = useState(() => {
    const sharedResult = getSharedResultFromUrl();
    const savedQuiz = loadSavedQuiz();

    return {
      sharedResult,
      savedQuiz
    };
  });

  const [currentScreen, setCurrentScreen] = useState(initialAppState.sharedResult ? 'results' : 'welcome'); // welcome, quiz, loader, results, gallery
  const [lang, setLang] = useState(initialAppState.sharedResult?.lang || initialAppState.savedQuiz?.lang || 'ja'); // 'ja' or 'en'
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: value }
  const [savedQuiz, setSavedQuiz] = useState(initialAppState.savedQuiz);

  // Result metrics
  const [typeCode, setTypeCode] = useState(initialAppState.sharedResult?.typeCode || '');
  const [percentages, setPercentages] = useState(initialAppState.sharedResult?.percentages || { dPct: 50, sPct: 50, kPct: 50, bPct: 50 });

  const persistQuizProgress = (nextAnswers, nextQuestionIdx, nextLang = lang) => {
    const progress = {
      answers: nextAnswers,
      currentQuestionIdx: nextQuestionIdx,
      lang: nextLang
    };

    saveQuizProgress(progress);
    setSavedQuiz(progress);
  };

  const handleSetLang = (nextLang) => {
    setLang(nextLang);

    if (currentScreen === 'quiz' && Object.keys(answers).length > 0) {
      persistQuizProgress(answers, currentQuestionIdx, nextLang);
    }

    if (currentScreen === 'results' && typeCode) {
      publishResultUrl(typeCode, percentages, nextLang);
    }
  };

  const handleStartQuiz = () => {
    clearSavedQuiz();
    clearResultUrl();
    setSavedQuiz(null);
    setAnswers({});
    setCurrentQuestionIdx(0);
    setCurrentScreen('quiz');
  };

  const handleContinueQuiz = () => {
    if (!savedQuiz) return;

    clearResultUrl();
    setAnswers(savedQuiz.answers);
    setCurrentQuestionIdx(savedQuiz.currentQuestionIdx);
    setLang(savedQuiz.lang);
    setCurrentScreen('quiz');
  };

  const handleAnswer = (questionId, value, proceed = false) => {
    const updatedAnswers = { ...answers, [questionId]: value };
    setAnswers(updatedAnswers);

    if (proceed) {
      if (currentQuestionIdx < questions.length - 1) {
        const nextQuestionIdx = currentQuestionIdx + 1;
        setCurrentQuestionIdx(nextQuestionIdx);
        persistQuizProgress(updatedAnswers, nextQuestionIdx);
      } else {
        // Quiz finished! Calculate results
        clearSavedQuiz();
        setSavedQuiz(null);
        calculateResults(updatedAnswers);
        setCurrentScreen('loader');
      }
    } else {
      persistQuizProgress(updatedAnswers, currentQuestionIdx);
    }
  };

  const handleBack = () => {
    if (currentQuestionIdx > 0) {
      const previousQuestionIdx = currentQuestionIdx - 1;
      setCurrentQuestionIdx(previousQuestionIdx);
      persistQuizProgress(answers, previousQuestionIdx);
    }
  };

  const calculateResults = (finalAnswers) => {
    const axes = { D: 0, S: 0, K: 0, B: 0 };
    
    // Group and calculate sum for each axis
    questions.forEach((q) => {
      const answerVal = finalAnswers[q.id] !== undefined ? finalAnswers[q.id] : 0; // default to neutral if missing
      const rawValue = q.type === '+' ? answerVal : -answerVal;
      axes[q.axis] += rawValue;
    });

    // Translate sum [-8, 8] to percentage [0, 100]
    const calculatePct = (score) => {
      // Map -8 to 0 and +8 to 100
      return Math.round(((score - (-8)) / 16) * 100);
    };

    const dPct = calculatePct(axes.D);
    const sPct = calculatePct(axes.S);
    const kPct = calculatePct(axes.K);
    const bPct = calculatePct(axes.B);

    const calculatedPercentages = { dPct, sPct, kPct, bPct };

    setPercentages(calculatedPercentages);

    // Determine type code (uppercase if >= 50, lowercase if < 50)
    const dLetter = dPct >= 50 ? 'D' : 'd';
    const sLetter = sPct >= 50 ? 'S' : 's';
    const kLetter = kPct >= 50 ? 'K' : 'k';
    const bLetter = bPct >= 50 ? 'B' : 'b';

    const calculatedCode = `${dLetter}${sLetter}${kLetter}${bLetter}`;
    setTypeCode(calculatedCode);
    publishResultUrl(calculatedCode, calculatedPercentages, lang);
  };

  const handleLoaderFinished = () => {
    setCurrentScreen('results');
  };

  const handleReset = () => {
    clearSavedQuiz();
    clearResultUrl();
    setSavedQuiz(null);
    setAnswers({});
    setCurrentQuestionIdx(0);
    setTypeCode('');
    setPercentages({ dPct: 50, sPct: 50, kPct: 50, bPct: 50 });
    setCurrentScreen('welcome');
  };

  const handleViewGallery = () => {
    clearResultUrl();
    setCurrentScreen('gallery');
  };

  return (
    <div className="app-container">
      {/* App Header */}
      <header className="app-header">
        <div className="logo-container" onClick={handleReset}>
          <div className="logo-icon">DS</div>
          <h1 className="logo-text">16 DSKB Types</h1>
          <span className="logo-badge">R-18 Lite</span>
        </div>
        
        <div className="header-controls">
          {/* Language Switch */}
          <button 
            className={`btn-glass ${lang === 'ja' ? 'active' : ''}`} 
            onClick={() => handleSetLang('ja')}
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            日本語
          </button>
          <button 
            className={`btn-glass ${lang === 'en' ? 'active' : ''}`} 
            onClick={() => handleSetLang('en')}
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            English
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {currentScreen === 'welcome' && (
          <WelcomeScreen 
            onStart={handleStartQuiz} 
            onContinue={handleContinueQuiz}
            lang={lang} 
            hasSavedProgress={Boolean(savedQuiz)}
            onViewGallery={handleViewGallery}
          />
        )}
        
        {currentScreen === 'quiz' && (
          <QuizScreen 
            questions={questions}
            currentIdx={currentQuestionIdx}
            answers={answers}
            onAnswer={handleAnswer}
            onBack={handleBack}
            lang={lang}
          />
        )}
        
        {currentScreen === 'loader' && (
          <LoaderScreen 
            onFinished={handleLoaderFinished} 
            lang={lang} 
          />
        )}
        
        {currentScreen === 'results' && (
          <ResultsDashboard 
            typeCode={typeCode}
            dPct={percentages.dPct}
            sPct={percentages.sPct}
            kPct={percentages.kPct}
            bPct={percentages.bPct}
            lang={lang}
            onReset={handleReset}
            onViewGallery={handleViewGallery}
          />
        )}

        {currentScreen === 'gallery' && (
          <TypeGallery 
            lang={lang} 
            onBack={handleReset} 
          />
        )}
      </main>

      {/* App Footer */}
      <footer className="app-footer">
        <p>© 2026 16 DSKB Types Redesign. Built with React & Vite.</p>
        <p style={{ marginTop: '5px', opacity: 0.6 }}>
          Disclaimer: This is a parodic personality test designed for adult entertainment and compatibility analysis. 
          No explicit visual content. Original concept inspired by <a href="https://novelgame.jp/games/show/13811" target="_blank" rel="noopener noreferrer">karoooome's original novel game</a>.
        </p>
      </footer>
    </div>
  );
}
