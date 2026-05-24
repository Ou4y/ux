export default function ProgressBar({ value, max, withMarker = false }) {
  const ratio = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
      <div className="progress-fill" style={{ width: `${ratio}%` }} />
      {withMarker ? <span className="progress-marker" style={{ left: `calc(${ratio}% - 12px)` }}>⭐</span> : null}
    </div>
  );
}
