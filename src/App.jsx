import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import LoaderScreen from './components/LoaderScreen';
import ResultsDashboard from './components/ResultsDashboard';
import TypeGallery from './components/TypeGallery';
import { questions } from './data/questions';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome'); // welcome, quiz, loader, results, gallery
  const [lang, setLang] = useState('ja'); // 'ja' or 'en'
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: value }

  // Result metrics
  const [typeCode, setTypeCode] = useState('');
  const [percentages, setPercentages] = useState({ dPct: 50, sPct: 50, kPct: 50, bPct: 50 });

  const handleStartQuiz = () => {
    setAnswers({});
    setCurrentQuestionIdx(0);
    setCurrentScreen('quiz');
  };

  const handleAnswer = (questionId, value, proceed = false) => {
    const updatedAnswers = { ...answers, [questionId]: value };
    setAnswers(updatedAnswers);

    if (proceed) {
      if (currentQuestionIdx < questions.length - 1) {
        setCurrentQuestionIdx(currentQuestionIdx + 1);
      } else {
        // Quiz finished! Calculate results
        calculateResults(updatedAnswers);
        setCurrentScreen('loader');
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
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

    setPercentages({ dPct, sPct, kPct, bPct });

    // Determine type code (uppercase if >= 50, lowercase if < 50)
    const dLetter = dPct >= 50 ? 'D' : 'd';
    const sLetter = sPct >= 50 ? 'S' : 's';
    const kLetter = kPct >= 50 ? 'K' : 'k';
    const bLetter = bPct >= 50 ? 'B' : 'b';

    const calculatedCode = `${dLetter}${sLetter}${kLetter}${bLetter}`;
    setTypeCode(calculatedCode);
  };

  const handleLoaderFinished = () => {
    setCurrentScreen('results');
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentQuestionIdx(0);
    setCurrentScreen('welcome');
  };

  const handleViewGallery = () => {
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
            onClick={() => setLang('ja')}
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            日本語
          </button>
          <button 
            className={`btn-glass ${lang === 'en' ? 'active' : ''}`} 
            onClick={() => setLang('en')}
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
            lang={lang} 
            setLang={setLang}
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
