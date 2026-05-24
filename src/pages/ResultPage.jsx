import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useQuiz } from "../context/QuizContext";
import { quizQuestions, scoringConfig } from "../data/mockData";

const DEFAULT_JOIN_CODE = "1234";

function getOptionLabel(question, optionId) {
  return question.options.find((option) => option.id === optionId)?.text || "No answer";
}

export default function ResultPage() {
  const navigate = useNavigate();
  const { score, xpEarned, coinsEarned, answersHistory, resetQuiz, startQuizSession } = useQuiz();

  const totalQuestions = quizQuestions.length;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const breakdown = useMemo(
    () =>
      answersHistory
        .map((entry) => {
          const question = quizQuestions.find((item) => item.id === entry.questionId);
          if (!question) {
            return null;
          }

          return {
            id: entry.questionId,
            questionText: entry.questionText,
            selectedText: getOptionLabel(question, entry.selectedOptionId),
            correctText: getOptionLabel(question, entry.correctOptionId),
            isCorrect: entry.isCorrect,
          };
        })
        .filter(Boolean),
    [answersHistory]
  );

  const handleBackToDashboard = () => {
    resetQuiz();
    navigate("/");
  };

  const handleTryAgain = () => {
    startQuizSession({ joinCode: DEFAULT_JOIN_CODE });
    navigate("/quiz");
  };

  const hasCompletedQuiz = answersHistory.length === totalQuestions && totalQuestions > 0;

  if (!hasCompletedQuiz) {
    return (
      <div className="result-page">
        <main className="result-shell">
          <article className="surface-card result-card result-empty-card">
            <h1>No completed quiz found.</h1>
            <p>Start a quiz first to see your result breakdown.</p>
            <div className="result-actions">
              <button type="button" className="btn btn-outline" onClick={handleBackToDashboard}>
                Back to Dashboard
              </button>
              <button type="button" className="btn btn-gradient" onClick={handleTryAgain}>
                Start Quiz
              </button>
            </div>
          </article>
        </main>
      </div>
    );
  }

  return (
    <div className="result-page">
      <main className="result-shell">
        <article className="surface-card result-card">
          <div className="result-head">
            <span className="result-badge">🎉 Quiz Completed!</span>
            <h1>{percentage >= 80 ? "Excellent work!" : "Great effort!"}</h1>
            <p>
              You answered {score} out of {totalQuestions} questions correctly.
            </p>
          </div>

          <div className="result-stats">
            <div className="result-stat">
              <span>Score</span>
              <strong>{percentage}%</strong>
            </div>
            <div className="result-stat">
              <span>Correct</span>
              <strong>
                {score}/{totalQuestions}
              </strong>
            </div>
            <div className="result-stat">
              <span>XP Earned</span>
              <strong>
                +{xpEarned}/{scoringConfig.xpPerCorrect * totalQuestions}
              </strong>
            </div>
            <div className="result-stat">
              <span>Coins Earned</span>
              <strong>
                +{coinsEarned}/{scoringConfig.coinsPerCorrect * totalQuestions}
              </strong>
            </div>
          </div>

          <div className="result-actions">
            <button type="button" className="btn btn-outline" onClick={handleBackToDashboard}>
              Back to Dashboard
            </button>
            <button type="button" className="btn btn-gradient" onClick={handleTryAgain}>
              Try Again
            </button>
          </div>
        </article>

        <section className="surface-card breakdown-card">
          <div className="section-head">
            <h3>Question Breakdown</h3>
          </div>

          <div className="breakdown-list">
            {breakdown.map((item, index) => (
              <article key={item.id} className={`breakdown-row ${item.isCorrect ? "good" : "bad"}`}>
                <div className="breakdown-main">
                  <p>
                    {index + 1}. {item.questionText}
                  </p>
                  <span>Your answer: {item.selectedText}</span>
                  {!item.isCorrect ? <span>Correct answer: {item.correctText}</span> : null}
                </div>
                <span className={`status-chip ${item.isCorrect ? "good" : "bad"}`}>
                  {item.isCorrect ? "Correct" : "Wrong"}
                </span>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
