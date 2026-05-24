export default function Navbar() {
  const links = ["Home", "Activity", "Classes", "Flashcards"];

  return (
    <header className="dashboard-navbar">
      <div className="brand-pill">
        <span className="brand-dot">◉</span>
        <span>Wayground</span>
      </div>

      <div className="search-shell">
        <span className="search-icon">⌕</span>
        <input type="text" placeholder="Search quizzes..." aria-label="Search quizzes" />
      </div>

      <nav className="nav-links" aria-label="Main navigation">
        {links.map((link) => (
          <button key={link} className={`nav-link ${link === "Home" ? "active" : ""}`} type="button">
            {link}
          </button>
        ))}
      </nav>

      <div className="nav-actions">
        <button className="btn btn-gradient" type="button">
          + Create a quiz
        </button>
        <button className="btn btn-outline" type="button">
          ✨ Create flashcards
        </button>
        <div className="avatar-circle" aria-label="User avatar">
          T
        </div>
      </div>
    </header>
  );
}
