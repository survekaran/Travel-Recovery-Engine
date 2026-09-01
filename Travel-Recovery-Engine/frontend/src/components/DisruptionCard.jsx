function DisruptionCard({ disruption }) {
  if (!disruption) {
    return null;
  }

  return (
    <section className="section disruption-section">

      <div className="disruption-card">

        <div className="disruption-icon">
          ⚠️
        </div>

        <div className="disruption-content">

          <div className="disruption-header">
            <div>
              <p className="eyebrow">DISRUPTION DETECTED</p>

              <h2>
                Flight {disruption.flight_id} Delayed
              </h2>
            </div>

            <div className="delay-badge">
              +{disruption.delay_minutes / 60} HOURS
            </div>
          </div>

          <p className="disruption-message">
            Your flight has been delayed by{" "}
            <strong>
              {disruption.delay_minutes / 60} hours
            </strong>
            . The new arrival time is{" "}
            <strong>
              {new Date(
                disruption.new_arrival
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </strong>
            .
          </p>

          <div className="impact-summary">

            <div>
              <strong>
                {disruption.affected_items?.length || 0}
              </strong>

              <span>
                Bookings affected
              </span>
            </div>

            <div>
              <strong>
                {disruption.affected_items?.filter(
                  (item) => item.status === "affected"
                ).length || 0}
              </strong>

              <span>
                Directly affected
              </span>
            </div>

            <div>
              <strong>
                {disruption.affected_items?.filter(
                  (item) => item.status === "at_risk"
                ).length || 0}
              </strong>

              <span>
                At risk
              </span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default DisruptionCard;