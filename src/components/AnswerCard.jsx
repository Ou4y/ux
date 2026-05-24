const stateLabels = {
  correct: "Correct!",
  wrong: "Try again",
};

export default function AnswerCard({
  option,
  letter,
  state = "default",
  disabled = false,
  locked = false,
  onSelect,
}) {
  const showStatus = state === "correct" || state === "wrong";
  const showSelected = state === "selected" && !locked;
  const isInteractive = !disabled && !locked;

  const className = [
    "answer-card",
    `answer-card--${state}`,
    isInteractive ? "answer-card--interactive" : "",
    disabled ? "answer-card--disabled" : "",
    locked ? "answer-card--locked" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={className}
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={state === "selected"}
    >
      <div className={`answer-icon bubble-${option.bubble}`}>{option.emoji}</div>

      <div className="answer-copy">
        <p>{option.text}</p>
        {showStatus ? <span className="answer-status">{stateLabels[state]}</span> : null}
      </div>

      <span className="answer-letter">{letter}</span>
      {showStatus ? <span className="answer-badge">{state === "correct" ? "✓" : "✕"}</span> : null}
      {showSelected ? <span className="answer-badge answer-badge--selected">Selected</span> : null}
    </button>
  );
}
