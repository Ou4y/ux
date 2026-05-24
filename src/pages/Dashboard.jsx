import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import ProgressBar from "../components/ProgressBar";
import { useQuiz } from "../context/QuizContext";
import { dashboardData } from "../data/mockData";

const VALID_JOIN_CODE = "1234";
const JOIN_LOADING_MS = 500;

export default function Dashboard() {
  const navigate = useNavigate();
  const joinTimerRef = useRef(null);

  const { startQuizSession } = useQuiz();

  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => () => {
    if (joinTimerRef.current) {
      window.clearTimeout(joinTimerRef.current);
    }
  }, []);

  const startQuizFlow = () => {
    startQuizSession({ joinCode: VALID_JOIN_CODE });
    navigate("/quiz");
  };

  const handleJoinSubmit = (event) => {
    event.preventDefault();

    const cleanedCode = joinCode.trim();

    if (!cleanedCode) {
      setJoinError("Please enter a join code.");
      return;
    }

    if (cleanedCode !== VALID_JOIN_CODE) {
      setJoinError("Invalid join code. Please check the code and try again.");
      return;
    }

    setJoinError("");
    setIsJoining(true);

    joinTimerRef.current = window.setTimeout(() => {
      startQuizSession({ joinCode: VALID_JOIN_CODE });
      navigate("/quiz");
    }, JOIN_LOADING_MS);
  };

  const handleJoinCodeChange = (event) => {
    setJoinCode(event.target.value);
    if (joinError) {
      setJoinError("");
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-main">
        <section className="hero-grid">
          <article className="surface-card join-card">
            <h1>Join a quiz</h1>
            <p>Enter a code to join your teacher&apos;s live quiz session</p>

            <form className="join-form" onSubmit={handleJoinSubmit} noValidate>
              <label className="join-label" htmlFor="join-code-input">
                Quiz code
              </label>
              <div className={`join-input ${joinError ? "join-input-error" : ""}`}>
                <span className="join-input-icon">⌨︎</span>
                <input
                  id="join-code-input"
                  type="text"
                  value={joinCode}
                  placeholder="Enter quiz code"
                  aria-label="Enter a join code"
                  aria-invalid={Boolean(joinError)}
                  aria-describedby={joinError ? "join-code-error" : undefined}
                  onChange={handleJoinCodeChange}
                  disabled={isJoining}
                />
              </div>

              {joinError ? (
                <p id="join-code-error" className="join-error-message" role="alert" aria-live="polite">
                  {joinError}
                </p>
              ) : null}

              <button type="submit" className="btn btn-gradient btn-block" disabled={isJoining}>
                {isJoining ? "Joining..." : "Join Now →"}
              </button>
            </form>

            <div className="divider-text">
              <span>or scan QR code</span>
            </div>

            <button type="button" className="btn btn-muted">
              ▦ Scan QR Code
            </button>
            <span className="join-decor top">✨🎮</span>
            <span className="join-decor bottom" />
          </article>

          <aside className="surface-card profile-card">
            <div className="profile-header">
              <h2>Hello, Tarek! 👋</h2>
              <button type="button" className="tiny-icon-btn" aria-label="Edit profile">
                ✎
              </button>
            </div>

            <div className="profile-avatar">T</div>

            <p className="profile-sub">Level 4 · 🔥 12 day streak</p>

            <div className="profile-progress-row">
              <span>XP Progress</span>
              <span>+150 XP</span>
            </div>
            <ProgressBar value={750} max={1200} />
            <p className="profile-xp-copy">750 / 1200 XP to Level 5</p>

            <div className="coin-box">
              <div>
                <p>🪙 600 coins</p>
                <span>Your balance</span>
              </div>
              <span className="coin-badge">💳</span>
            </div>

            <button type="button" className="btn btn-coin">
              🎁 Claim 100 Coins
            </button>
          </aside>
        </section>

        <section className="dashboard-section">
          <article className="surface-card redesign-card">
            <h3>What changed in our redesign?</h3>
            <ul>
              <li>Clearer quiz joining flow with visible join-code validation.</li>
              <li>More readable dashboard cards and progress indicators.</li>
              <li>Improved answer states: selected, correct, wrong, and hover.</li>
              <li>Added learning support tools like Hint, 50:50, and result breakdown.</li>
            </ul>
          </article>
        </section>

        <section className="dashboard-section">
          <div className="section-head">
            <h3>Recent Activity</h3>
            <button className="link-btn" type="button">
              See all →
            </button>
          </div>

          <div className="activity-grid">
            {dashboardData.recentActivity.map((item) => (
              <StatCard key={item.id} item={item} onAction={startQuizFlow} />
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-head">
            <h3>Templates</h3>
            <button className="link-btn" type="button">
              See more →
            </button>
          </div>

          <div className="template-grid">
            {dashboardData.templates.map((item) => (
              <StatCard key={item.id} mode="template" item={item} onAction={startQuizFlow} />
            ))}
          </div>
        </section>

        <section className="bottom-grid">
          <article className="surface-card info-card">
            <div className="section-head">
              <h3>🏆 Leaderboard</h3>
              <button className="link-btn" type="button">
                View all →
              </button>
            </div>

            <div className="leader-list">
              {dashboardData.leaderboard.map((entry) => (
                <div key={entry.id} className={`leader-row ${entry.me ? "is-me" : ""}`}>
                  <div className="leader-left">
                    <span className="medal-badge">{entry.medal}</span>
                    <div className="leader-avatar">{entry.name.includes("You") ? "T" : "👤"}</div>
                    <div>
                      <p>{entry.name}</p>
                      <span>{entry.xp}</span>
                    </div>
                  </div>
                  <span className="leader-gain">{entry.gain}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="surface-card info-card">
            <div className="section-head">
              <h3>📅 Upcoming Quizzes</h3>
              <button className="link-btn" type="button">
                View all →
              </button>
            </div>

            <div className="upcoming-list">
              {dashboardData.upcoming.map((item) => (
                <div key={item.id} className="upcoming-row">
                  <div className="leader-left">
                    <span className="emoji-circle small">{item.emoji}</span>
                    <div>
                      <p>{item.title}</p>
                      <span>{item.meta}</span>
                    </div>
                  </div>
                  <span className={`status-pill ${item.badgeClass}`}>{item.badge}</span>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
