function RecoveryCard({ option, recommended = false }) {
  return (
    <div
      className={`recovery-card ${
        recommended ? "recommended" : ""
      }`}
    >
      {recommended && (
        <div className="recommended-badge">
          🥇 BEST MATCH
        </div>
      )}

      <div className="recovery-card-header">

        <div className="recovery-icon">
          🚗
        </div>

        <div className="recovery-title">
          <span className="item-type">
            {option.type.replace("_", " ").toUpperCase()}
          </span>

          <h3>{option.name}</h3>

          <p>{option.provider}</p>
        </div>

        <div className="recovery-score">
          <strong>{option.score}</strong>
          <span>Score</span>
        </div>

      </div>

      <div className="recovery-details">

        <div>
          <span>COST</span>
          <strong>₹{option.cost}</strong>
        </div>

        <div>
          <span>DURATION</span>
          <strong>
            {option.duration_minutes} min
          </strong>
        </div>

        <div>
          <span>FLEXIBILITY</span>
          <strong>
            {option.departure_flexibility}
          </strong>
        </div>

        <div>
          <span>AVAILABILITY</span>

          <strong
            className={
              option.availability
                ? "available"
                : "unavailable"
            }
          >
            {option.availability
              ? "Available"
              : "Unavailable"}
          </strong>
        </div>

      </div>

      <button className="recovery-button">
        Select This Option
      </button>

    </div>
  );
}

export default RecoveryCard;