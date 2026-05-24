function getCardTone(color) {
  switch (color) {
    case "mint":
      return "tone-mint";
    case "blue":
      return "tone-blue";
    case "rose":
      return "tone-rose";
    case "gold":
      return "tone-gold";
    case "lavender":
      return "tone-lavender";
    case "sky":
      return "tone-sky";
    default:
      return "tone-mint";
  }
}

export default function StatCard({ mode = "activity", item, onAction }) {
  const tone = getCardTone(item.color);

  if (mode === "template") {
    return (
      <article
        className={`template-card ${tone}`}
        onClick={onAction}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onAction();
          }
        }}
        tabIndex={0}
        role="button"
      >
        <div className="template-head">
          <span className="emoji-circle">{item.emoji}</span>
          <span className="pill tiny">{item.questions} Qs</span>
        </div>

        <div className="template-body">
          <span className="pill category">{item.subject}</span>
          <h4>{item.title}</h4>
          <p>👁 {item.plays}</p>
          <p>👩‍🏫 {item.teacher}</p>
          <button
            type="button"
            className="inline-action"
            onClick={(event) => {
              event.stopPropagation();
              onAction();
            }}
          >
            Use template →
          </button>
        </div>
      </article>
    );
  }

  const progressClass = item.progress === 100 ? "complete" : "default";

  return (
    <article className={`activity-card ${tone}`}>
      <div className="activity-head">
        <div className="subject-wrap">
          <span className="emoji-circle">{item.emoji}</span>
          <span>{item.subject}</span>
        </div>
        <span className="pill tiny">{item.questions} Qs</span>
      </div>

      <div className="activity-body">
        <h4>{item.title}</h4>
        <div className="mini-progress">
          <span className={`mini-progress-fill ${progressClass}`} style={{ width: `${item.progress}%` }} />
        </div>
        <div className="activity-meta">
          <span className={progressClass}>{item.statusText}</span>
          <span>{item.progress}%</span>
        </div>
        <button type="button" className="inline-action" onClick={onAction}>
          {item.actionLabel} →
        </button>
      </div>
    </article>
  );
}
