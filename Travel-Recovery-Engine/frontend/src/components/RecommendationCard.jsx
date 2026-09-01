function RecommendationCard({
  recommendation,
  options,
  onSelect,
}) {
  if (!recommendation) {
    return null;
  }

  const recommendedOption = options?.find(
    (option) =>
      option.option_id ===
      recommendation.recommended_option
  );

  return (
    <div className="recommendation-card">

      <div className="recommendation-header">

        <div className="recommendation-icon">
          🧠
        </div>

        <div>

          <span className="recommended-label">
            RECOMMENDED RECOVERY
          </span>

          <h2>
            {recommendation.name}
          </h2>

          <p>
            Best match based on your travel priorities
          </p>

        </div>

        <div className="recommendation-score">

          <strong>
            {recommendation.score}
          </strong>

          <span>
            Match Score
          </span>

        </div>

      </div>


      {/* Why this option? */}

      <div className="recommendation-reasoning">

        <div className="reasoning-title">
          Why this option?
        </div>

        <div className="reason-list">

          {recommendation.reasons?.map(
            (reason, index) => (
              <div
                className="reason-item"
                key={index}
              >

                <span className="reason-check">
                  ✓
                </span>

                <span>
                  {reason}
                </span>

              </div>
            )
          )}

        </div>

      </div>


      {/* Recommendation details */}

      {recommendedOption && (
        <div className="recommendation-breakdown">

          <div>

            <span>
              COST
            </span>

            <strong>
              ₹{recommendedOption.cost}
            </strong>

          </div>


          <div>

            <span>
              DURATION
            </span>

            <strong>
              {recommendedOption.duration_minutes} min
            </strong>

          </div>


          <div>

            <span>
              FLEXIBILITY
            </span>

            <strong>
              {recommendedOption.departure_flexibility}
            </strong>

          </div>


          <div>

            <span>
              STATUS
            </span>

            <strong className="available">
              {recommendedOption.availability
                ? "Available"
                : "Unavailable"}
            </strong>

          </div>

        </div>
      )}


      {/* Select button */}

      <button
        className="select-recommendation-button"
        onClick={() =>
          onSelect(
            recommendation.recommended_option
          )
        }
      >
        Select Recovery Plan
      </button>

    </div>
  );
}

export default RecommendationCard;