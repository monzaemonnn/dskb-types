import { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import LoaderScreen from './components/LoaderScreen';
import ResultsDashboard from './components/ResultsDashboard';
import TypeGallery from './components/TypeGallery';
import MethodologyScreen from './components/MethodologyScreen';
import V2WelcomeScreen from './components/V2WelcomeScreen';
import V2ResultsDashboard from './components/V2ResultsDashboard';
import V2ArchetypeGallery from './components/V2ArchetypeGallery';
import V2MethodologyScreen from './components/V2MethodologyScreen';
import { questions } from './data/questions';
import { v2Questions } from './data/v2Questions';
import { decodeV2ResultUrl, encodeV2ResultUrl, scoreV2Answers } from './utils/v2Scoring';

const QUIZ_STORAGE_KEY = 'dskb-quiz-progress';
const V2_QUIZ_STORAGE_KEY = 'dskb-v2-quiz-progress';

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

function getSharedV2ResultFromUrl() {
  if (typeof window === 'undefined') return null;
  return decodeV2ResultUrl(new URLSearchParams(window.location.search));
}

function getInitialViewFromUrl() {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view');
  if (view !== 'v2-gallery' && view !== 'v2-methodology') return null;

  return {
    screen: view,
    lang: params.get('lang') === 'en' ? 'en' : 'ja'
  };
}

function loadSavedQuiz(storageKey = QUIZ_STORAGE_KEY, totalQuestions = questions.length) {
  if (typeof window === 'undefined') return null;

  try {
    const savedProgress = window.localStorage.getItem(storageKey);
    if (!savedProgress) return null;

    const parsedProgress = JSON.parse(savedProgress);
    const answers = parsedProgress?.answers;
    const currentQuestionIdx = Number(parsedProgress?.currentQuestionIdx);

    if (!answers || typeof answers !== 'object') return null;
    if (!Number.isInteger(currentQuestionIdx) || currentQuestionIdx < 0 || currentQuestionIdx >= totalQuestions) return null;

    return {
      answers,
      currentQuestionIdx,
      version: parsedProgress.version,
      lang: parsedProgress.lang === 'en' ? 'en' : 'ja'
    };
  } catch {
    return null;
  }
}

function saveQuizProgress(progress, storageKey = QUIZ_STORAGE_KEY) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey, JSON.stringify(progress));
}

function clearSavedQuiz(storageKey = QUIZ_STORAGE_KEY) {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(storageKey);
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

function publishV2ResultUrl(scores, lang) {
  if (typeof window === 'undefined') return;
  const params = encodeV2ResultUrl(scores, lang);
  window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
}

function isV2DefaultDomain() {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname.toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);
  return (
    hostname.includes('v2') ||
    hostname.includes('desire') ||
    hostname.includes('erosphere') ||
    searchParams.get('v') === '2' ||
    searchParams.get('version') === '2' ||
    searchParams.get('mode') === 'v2'
  );
}

export default function App() {
  const [initialAppState] = useState(() => {
    const sharedV2Result = getSharedV2ResultFromUrl();
    const sharedResult = getSharedResultFromUrl();
    const initialView = getInitialViewFromUrl();
    const savedQuiz = loadSavedQuiz();
    const savedV2Quiz = loadSavedQuiz(V2_QUIZ_STORAGE_KEY, v2Questions.length);

    return {
      sharedV2Result,
      sharedResult,
      initialView,
      savedQuiz,
      savedV2Quiz
    };
  });

  const [currentScreen, setCurrentScreen] = useState(() => {
    if (initialAppState.sharedV2Result) return 'v2-results';
    if (initialAppState.sharedResult) return 'results';
    if (initialAppState.initialView?.screen) return initialAppState.initialView.screen;
    if (isV2DefaultDomain()) return 'v2-welcome';
    return 'welcome';
  }); // welcome, quiz, loader, results, gallery, methodology, v2-welcome, v2-quiz, v2-results, v2-gallery, v2-methodology
  const [lang, setLang] = useState(
    initialAppState.sharedV2Result?.lang || initialAppState.sharedResult?.lang || initialAppState.initialView?.lang || initialAppState.savedQuiz?.lang || initialAppState.savedV2Quiz?.lang || 'ja'
  ); // 'ja' or 'en'
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: value }
  const [savedQuiz, setSavedQuiz] = useState(initialAppState.savedQuiz);
  const [v2QuestionIdx, setV2QuestionIdx] = useState(0);
  const [v2Answers, setV2Answers] = useState({});
  const [savedV2Quiz, setSavedV2Quiz] = useState(initialAppState.savedV2Quiz);

  // Result metrics
  const [typeCode, setTypeCode] = useState(initialAppState.sharedResult?.typeCode || '');
  const [percentages, setPercentages] = useState(initialAppState.sharedResult?.percentages || { dPct: 50, sPct: 50, kPct: 50, bPct: 50 });
  const [v2Scores, setV2Scores] = useState(initialAppState.sharedV2Result?.scores || null);

  // Manage metadata side-effects (SEO & OG Tags) based on screen/domain
  useEffect(() => {
    const isV2 = ['v2-welcome', 'v2-quiz', 'v2-results', 'v2-gallery', 'v2-methodology'].includes(currentScreen);
    
    let title = '';
    let desc = '';
    
    if (isV2) {
      title = lang === 'ja' 
        ? '欲望パターン診断 — Desire Pattern Profile' 
        : 'Desire Pattern Profile — 5-Dimension Relationship Archetype Test';
      desc = lang === 'ja'
        ? '性科学や関係性研究に基づいた30問の性格・相性診断。空想と現実、着火とブレーキ、体感と物語、主導権、深さと変化の5軸から、あなたの欲望パターンと12のアーキタイプを診断します。'
        : 'A 30-item relationship and compatibility profile based on relational research. Discover your desire pattern and relationship archetype through five dimensions.';
    } else {
      title = lang === 'ja'
        ? '16 DSKB Types - 16タイプ性格・相性傾向診断'
        : '16 DSKB Types - 16-Type Relationship Personality Test';
      desc = lang === 'ja'
        ? '16タイプ DSKB(ドスケベ)診断へようこそ！4つの指標（空間・刺激・主導権・向き合い方）であなたの深層心理と相性傾向を分析します。'
        : 'Welcome to the 16 DSKB Types test! Analyze your deep relational preferences and compatibility across 4 main axes.';
    }
    
    document.title = title;
    
    const updateMeta = (selector, attribute, value) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attribute, value);
    };
    
    updateMeta('meta[name="description"]', 'content', desc);
    updateMeta('meta[property="og:title"]', 'content', title);
    updateMeta('meta[property="og:description"]', 'content', desc);
    updateMeta('meta[name="twitter:title"]', 'content', title);
    updateMeta('meta[name="twitter:description"]', 'content', desc);
    
    if (isV2) {
      updateMeta('meta[property="og:image"]', 'content', 'https://dskb-types.vercel.app/og-v2.png');
      updateMeta('meta[name="twitter:image"]', 'content', 'https://dskb-types.vercel.app/og-v2.png');
    } else {
      updateMeta('meta[property="og:image"]', 'content', 'https://dskb-types.vercel.app/og-dskb.png');
      updateMeta('meta[name="twitter:image"]', 'content', 'https://dskb-types.vercel.app/og-dskb.png');
    }
  }, [currentScreen, lang]);

  const persistQuizProgress = (nextAnswers, nextQuestionIdx, nextLang = lang) => {
    const progress = {
      answers: nextAnswers,
      currentQuestionIdx: nextQuestionIdx,
      lang: nextLang
    };

    saveQuizProgress(progress);
    setSavedQuiz(progress);
  };

  const persistV2QuizProgress = (nextAnswers, nextQuestionIdx, nextLang = lang) => {
    const progress = {
      version: 2,
      answers: nextAnswers,
      currentQuestionIdx: nextQuestionIdx,
      lang: nextLang
    };

    saveQuizProgress(progress, V2_QUIZ_STORAGE_KEY);
    setSavedV2Quiz(progress);
  };

  const handleSetLang = (nextLang) => {
    setLang(nextLang);

    if (currentScreen === 'quiz' && Object.keys(answers).length > 0) {
      persistQuizProgress(answers, currentQuestionIdx, nextLang);
    }

    if (currentScreen === 'v2-quiz' && Object.keys(v2Answers).length > 0) {
      persistV2QuizProgress(v2Answers, v2QuestionIdx, nextLang);
    }

    if (currentScreen === 'results' && typeCode) {
      publishResultUrl(typeCode, percentages, nextLang);
    }

    if (currentScreen === 'v2-results' && v2Scores) {
      publishV2ResultUrl(v2Scores, nextLang);
    }
  };

  const handleStartQuiz = () => {
    clearSavedQuiz();
    clearResultUrl();
    setSavedQuiz(null);
    setAnswers({});
    setV2Scores(null);
    setCurrentQuestionIdx(0);
    setCurrentScreen('quiz');
  };

  const handleStartV2Quiz = () => {
    clearSavedQuiz(V2_QUIZ_STORAGE_KEY);
    clearResultUrl();
    setSavedV2Quiz(null);
    setV2Answers({});
    setV2Scores(null);
    setV2QuestionIdx(0);
    setCurrentScreen('v2-quiz');
  };

  const handleContinueQuiz = () => {
    if (!savedQuiz) return;

    clearResultUrl();
    setAnswers(savedQuiz.answers);
    setCurrentQuestionIdx(savedQuiz.currentQuestionIdx);
    setLang(savedQuiz.lang);
    setCurrentScreen('quiz');
  };

  const handleContinueV2Quiz = () => {
    if (!savedV2Quiz) return;

    clearResultUrl();
    setV2Answers(savedV2Quiz.answers);
    setV2QuestionIdx(savedV2Quiz.currentQuestionIdx);
    setLang(savedV2Quiz.lang);
    setCurrentScreen('v2-quiz');
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

  const handleV2Answer = (questionId, value, proceed = false) => {
    const updatedAnswers = { ...v2Answers, [questionId]: value };
    setV2Answers(updatedAnswers);

    if (proceed) {
      if (v2QuestionIdx < v2Questions.length - 1) {
        const nextQuestionIdx = v2QuestionIdx + 1;
        setV2QuestionIdx(nextQuestionIdx);
        persistV2QuizProgress(updatedAnswers, nextQuestionIdx);
      } else {
        clearSavedQuiz(V2_QUIZ_STORAGE_KEY);
        setSavedV2Quiz(null);
        const calculatedScores = scoreV2Answers(updatedAnswers);
        setV2Scores(calculatedScores);
        publishV2ResultUrl(calculatedScores, lang);
        setCurrentScreen('loader');
      }
    } else {
      persistV2QuizProgress(updatedAnswers, v2QuestionIdx);
    }
  };

  const handleV2Back = () => {
    if (v2QuestionIdx > 0) {
      const previousQuestionIdx = v2QuestionIdx - 1;
      setV2QuestionIdx(previousQuestionIdx);
      persistV2QuizProgress(v2Answers, previousQuestionIdx);
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

    // Translate sum [-12, 12] to percentage [0, 100]
    const calculatePct = (score) => {
      // Map -12 to 0 and +12 to 100
      return Math.round(((score - (-12)) / 24) * 100);
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
    setCurrentScreen(v2Scores ? 'v2-results' : 'results');
  };

  const handleReset = () => {
    clearSavedQuiz();
    clearSavedQuiz(V2_QUIZ_STORAGE_KEY);
    clearResultUrl();
    setSavedQuiz(null);
    setSavedV2Quiz(null);
    setAnswers({});
    setV2Answers({});
    setCurrentQuestionIdx(0);
    setV2QuestionIdx(0);
    setTypeCode('');
    setV2Scores(null);
    setPercentages({ dPct: 50, sPct: 50, kPct: 50, bPct: 50 });
    setCurrentScreen(isV2DefaultDomain() ? 'v2-welcome' : 'welcome');
  };

  const handleResetV2 = () => {
    clearSavedQuiz(V2_QUIZ_STORAGE_KEY);
    clearResultUrl();
    setSavedV2Quiz(null);
    setV2Answers({});
    setV2QuestionIdx(0);
    setV2Scores(null);
    setCurrentScreen('v2-welcome');
  };

  const handleLogoClick = () => {
    if (isV2DefaultDomain()) {
      handleResetV2();
    } else {
      handleReset();
    }
  };

  const handleViewGallery = () => {
    clearResultUrl();
    setCurrentScreen('gallery');
  };

  const handleViewMethodology = () => {
    clearResultUrl();
    setCurrentScreen('methodology');
  };

  const handleViewV2 = () => {
    clearResultUrl();
    setCurrentScreen('v2-welcome');
  };

  const handleViewV2Gallery = () => {
    if (!v2Scores && typeof window !== 'undefined') {
      window.history.replaceState(null, '', `${window.location.pathname}?view=v2-gallery&lang=${lang}`);
    }
    setCurrentScreen('v2-gallery');
  };

  const handleViewV2Methodology = () => {
    if (!v2Scores && typeof window !== 'undefined') {
      window.history.replaceState(null, '', `${window.location.pathname}?view=v2-methodology&lang=${lang}`);
    }
    setCurrentScreen('v2-methodology');
  };

  const handleBackFromV2Gallery = () => {
    setCurrentScreen(v2Scores ? 'v2-results' : 'v2-welcome');
  };

  const handleBackFromV2Methodology = () => {
    setCurrentScreen(v2Scores ? 'v2-results' : 'v2-welcome');
  };

  const handleBackToV1 = () => {
    clearResultUrl();
    setV2Scores(null);
    setCurrentScreen('welcome');
  };

  const isV2Screen = ['v2-welcome', 'v2-quiz', 'v2-results', 'v2-gallery', 'v2-methodology'].includes(currentScreen);

  return (
    <div className="app-container">
      {/* App Header */}
      <header className="app-header">
        <div className="logo-container" onClick={handleLogoClick}>
          {isV2DefaultDomain() || isV2Screen ? (
            <>
              <div className="logo-icon" style={{ backgroundColor: '#ff007f', color: '#fff' }}>💋</div>
              <h1 className="logo-text">
                {lang === 'ja' ? '欲望パターン診断' : 'Desire Profile'}
              </h1>
              <span className="logo-badge" style={{ background: 'linear-gradient(135deg, #ff007f, #7f00ff)', border: 'none' }}>
                Desire Map
              </span>
            </>
          ) : (
            <>
              <div className="logo-icon">DS</div>
              <h1 className="logo-text">16 DSKB Types</h1>
              <span className="logo-badge">R-18 Lite</span>
            </>
          )}
        </div>
        
        <div className="header-controls">
          {/* Language Switch */}
          <button 
            className={`btn-glass ${lang === 'ja' ? 'active' : ''}`} 
            onClick={() => handleSetLang('ja')}
          >
            日本語
          </button>
          <button 
            className={`btn-glass ${lang === 'en' ? 'active' : ''}`} 
            onClick={() => handleSetLang('en')}
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
            onViewMethodology={handleViewMethodology}
            onViewV2={handleViewV2}
          />
        )}

        {currentScreen === 'v2-welcome' && (
          <V2WelcomeScreen
            lang={lang}
            onStart={handleStartV2Quiz}
            onContinue={handleContinueV2Quiz}
            hasSavedProgress={Boolean(savedV2Quiz)}
            onBackToV1={handleBackToV1}
            onViewArchetypes={handleViewV2Gallery}
            onViewMethodology={handleViewV2Methodology}
            hideBackToV1={isV2DefaultDomain()}
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

        {currentScreen === 'v2-quiz' && (
          <QuizScreen
            questions={v2Questions}
            currentIdx={v2QuestionIdx}
            answers={v2Answers}
            onAnswer={handleV2Answer}
            onBack={handleV2Back}
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

        {currentScreen === 'v2-results' && v2Scores && (
          <V2ResultsDashboard
            scores={v2Scores}
            lang={lang}
            onReset={handleResetV2}
            onBackToV1={handleBackToV1}
            onViewArchetypes={handleViewV2Gallery}
            onViewMethodology={handleViewV2Methodology}
            hideBackToV1={isV2DefaultDomain()}
          />
        )}

        {currentScreen === 'v2-gallery' && (
          <V2ArchetypeGallery
            lang={lang}
            onBack={handleBackFromV2Gallery}
          />
        )}

        {currentScreen === 'v2-methodology' && (
          <V2MethodologyScreen
            lang={lang}
            onBack={handleBackFromV2Methodology}
          />
        )}

        {currentScreen === 'gallery' && (
          <TypeGallery 
            lang={lang} 
            onBack={handleReset} 
          />
        )}

        {currentScreen === 'methodology' && (
          <MethodologyScreen 
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
