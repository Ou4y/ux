import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import AnswerCard from "../components/AnswerCard";
import ProgressBar from "../components/ProgressBar";
import { useQuiz } from "../context/QuizContext";
import { quizQuestions, scoringConfig } from "../data/mockData";

const optionLetters = ["A", "B", "C", "D"];

function isValidQuestion(question) {
  if (!question || typeof question.question !== "string") {
    return false;
  }

  if (!Array.isArray(question.options) || question.options.length < 2) {
    return false;
  }

  if (!question.correctOptionId || typeof question.correctOptionId !== "string") {
    return false;
  }

  return question.options.every(
    (option) => option && typeof option.id === "string" && typeof option.text === "string"
  );
}

export default function QuizPage() {
  const navigate = useNavigate();
  const {
    currentQuestionIndex,
    selectedOptionId,
    showFeedback,
    coinsEarned,
    eliminatedByQuestion,
    session,
    selectOption,
    useFiftyFifty,
    submitAnswer,
    goNext,
    skipQuestion,
  } = useQuiz();

  const [hintVisible, setHintVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const hasQuizData = Array.isArray(quizQuestions) && quizQuestions.length > 0;
  const question = hasQuizData ? quizQuestions[currentQuestionIndex] : null;
  const questionIsValid = isValidQuestion(question);
  const isLastQuestion = hasQuizData && currentQuestionIndex === quizQuestions.length - 1;

  const eliminatedForCurrent = useMemo(() => {
    if (!question || !question.id) {
      return [];
    }
    return eliminatedByQuestion[question.id] || [];
  }, [eliminatedByQuestion, question]);

  useEffect(() => {
    if (!toastVisible) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToastVisible(false), 2200);
    return () => window.clearTimeout(timer);
  }, [toastVisible]);

  const handleNext = () => {
    if (!showFeedback) {
      submitAnswer();
      return;
    }

    if (isLastQuestion) {
      navigate("/result");
      return;
    }

    setHintVisible(false);
    goNext();
  };

  const getCardState = (optionId) => {
    if (!showFeedback) {
      return selectedOptionId === optionId ? "selected" : "default";
    }

    if (!question) {
      return "default";
    }

    if (optionId === question.correctOptionId) {
      return "correct";
    }

    if (selectedOptionId === optionId && optionId !== question.correctOptionId) {
      return "wrong";
    }

    return "default";
  };

  const isOptionDisabled = (optionId) => {
    if (showFeedback) {
      return true;
    }

    return eliminatedForCurrent.includes(optionId);
  };

  const hasSelectedAnswer = Boolean(selectedOptionId);
  const needsSelection = !showFeedback && !hasSelectedAnswer;

  const actionLabel = needsSelection
    ? "Select an answer"
    : !showFeedback
      ? "Check Answer"
      : isLastQuestion
        ? "Finish Quiz"
        : "Next Question";
  const actionStateClass = needsSelection ? "idle" : !showFeedback ? "check" : "advance";
  const maskedJoinCode = session?.joinCode ? "•".repeat(session.joinCode.length) : "Private";

  const currentAnswerIsCorrect = showFeedback && question && selectedOptionId === question.correctOptionId;
  const canSkipQuestion = hasQuizData && currentQuestionIndex < quizQuestions.length - 1;

  if (!hasQuizData) {
    return (
      <div className="quiz-page">
        <header className="quiz-topbar">
          <div className="quiz-top-left">
            <div className="brand-pill">
              <span className="brand-dot">◉</span>
              <span>Wayground</span>
            </div>
          </div>
        </header>

        <main className="quiz-main">
          <section className="quiz-stage quiz-stage-fallback">
            <article className="surface-card quiz-fallback-card">
              <h2>No quiz questions available.</h2>
              <button type="button" className="btn btn-gradient" onClick={() => navigate("/")}>
                Back to Dashboard
              </button>
            </article>
          </section>
        </main>
      </div>
    );
  }

  if (!questionIsValid) {
    return (
      <div className="quiz-page">
        <header className="quiz-topbar">
          <div className="quiz-top-left">
            <div className="brand-pill">
              <span className="brand-dot">◉</span>
              <span>Wayground</span>
            </div>
          </div>
        </header>

        <main className="quiz-main">
          <section className="quiz-stage quiz-stage-fallback">
            <article className="surface-card quiz-fallback-card">
              <h2>This question could not be loaded.</h2>
              <div className="quiz-fallback-actions">
                {canSkipQuestion ? (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setHintVisible(false);
                      skipQuestion();
                    }}
                  >
                    Skip Question
                  </button>
                ) : null}
                <button type="button" className="btn btn-gradient" onClick={() => navigate("/")}>
                  Back to Dashboard
                </button>
              </div>
            </article>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <header className="quiz-topbar">
        <div className="quiz-top-left">
          <div className="brand-pill">
            <span className="brand-dot">◉</span>
            <span>Wayground</span>
          </div>
          <div className="xp-pill">+150 XP</div>
        </div>

        <div className="quiz-top-right">
          <button type="button" className="tiny-icon-btn" aria-label="Fullscreen">
            ⛶
          </button>
          <button type="button" className="tiny-icon-btn" aria-label="Menu">
            ☰
          </button>
        </div>
      </header>

      <main className="quiz-main">
        <section className="quiz-stage">
          <article className="surface-card quiz-details-card">
            <div className="quiz-details-head">
              <h3>Quiz Details</h3>
              <span className="pill tiny">Prototype Session</span>
            </div>
            <div className="quiz-details-grid">
              <p>
                <span>Quiz title</span>
                <strong>{session?.quizTitle || "Science & Coding Practice"}</strong>
              </p>
              <p>
                <span>Join code</span>
                <strong>{maskedJoinCode}</strong>
              </p>
              <p>
                <span>Student</span>
                <strong>{session?.studentName || "Tarek"}</strong>
              </p>
              <p>
                <span>Questions</span>
                <strong>{quizQuestions.length}</strong>
              </p>
              <p>
                <span>Rewards</span>
                <strong>+150 XP, +60 coins</strong>
              </p>
            </div>
            <div className="quiz-details-chips">
              <span className="detail-chip">💡 Hint support</span>
              <span className="detail-chip">☆ 50:50 assistance</span>
              <span className="detail-chip">✅ Instant answer feedback</span>
              <span className="detail-chip">📊 Result breakdown</span>
            </div>
          </article>

          <p className="quiz-counter">
            QUESTION {currentQuestionIndex + 1} OF {quizQuestions.length}
          </p>

          <div className="quiz-progress-wrap">
            <ProgressBar value={currentQuestionIndex + (showFeedback ? 1 : 0)} max={quizQuestions.length} withMarker />
          </div>

          <h1>{question.question}</h1>

          {hintVisible ? <div className="hint-box">💡 Hint: {question.hint}</div> : null}

          {showFeedback ? (
            <div className={`quiz-feedback ${currentAnswerIsCorrect ? "good" : "bad"}`} role="status" aria-live="polite">
              {currentAnswerIsCorrect
                ? "Correct! Nice work."
                : "Not quite. The correct answer is highlighted."}
            </div>
          ) : null}

          <div className="answers-grid">
            {question.options.map((option, index) => (
              <AnswerCard
                key={option.id}
                option={option}
                letter={optionLetters[index] || String.fromCharCode(65 + index)}
                state={getCardState(option.id)}
                disabled={isOptionDisabled(option.id)}
                locked={showFeedback}
                onSelect={() => selectOption(option.id)}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="quiz-footer">
        <div className="quiz-user-card">
          <div className="avatar-circle">T</div>
          <div>
            <p>Tarek</p>
            <span>🪙 {scoringConfig.baseCoins + coinsEarned} coins</span>
          </div>
        </div>

        <div className="quiz-actions">
          <button
            type="button"
            className="quiz-action hint"
            onClick={() => setHintVisible((previous) => !previous)}
          >
            💡 Hint
          </button>
          <button
            type="button"
            className="quiz-action fifty"
            onClick={useFiftyFifty}
            disabled={Boolean(question?.id && eliminatedByQuestion[question.id]) || showFeedback}
          >
            ☆ 50:50
          </button>
          <button
            type="button"
            className="quiz-action class"
            onClick={() => setToastVisible(true)}
            disabled={showFeedback}
          >
            👥 Class
          </button>
        </div>

        <button
          type="button"
          className={`btn next-btn next-btn--${actionStateClass}`}
          onClick={handleNext}
          disabled={needsSelection}
        >
          {actionLabel}
        </button>
      </footer>

      {toastVisible ? <div className="quiz-toast">Class leaderboard coming soon</div> : null}
    </div>
  );
}
