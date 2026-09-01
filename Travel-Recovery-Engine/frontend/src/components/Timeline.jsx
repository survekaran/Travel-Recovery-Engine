function Timeline({ itinerary, disruption }) {
  const getStatus = (item) => {
    if (!disruption) {
      return {
        label: "Scheduled",
        className: "timeline-status scheduled",
      };
    }

    const affectedItem = disruption.affected_items?.find(
      (affected) => affected.item_id === item.id
    );

    if (affectedItem) {
      return {
        label:
          affectedItem.status === "affected"
            ? "Affected"
            : affectedItem.status === "at_risk"
            ? "At Risk"
            : "Scheduled",
        className: `timeline-status ${affectedItem.status}`,
      };
    }

    if (item.id === disruption.flight_id) {
      return {
        label: "Delayed",
        className: "timeline-status delayed",
      };
    }

    return {
      label: "Scheduled",
      className: "timeline-status scheduled",
    };
  };

  const formatTime = (time) => {
    const date = new Date(time);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="section timeline-section">

      <div className="section-title">
        <div>
          <p className="eyebrow">TRIP TIMELINE</p>
          <h2>Journey Flow</h2>
        </div>

        <span className="badge">
          {itinerary.length} stages
        </span>
      </div>

      <div className="timeline">

        {itinerary.map((item, index) => {
          const status = getStatus(item);

          return (
            <div className="timeline-item" key={item.id}>

              <div className="timeline-marker">
                <span>
                  {item.type === "flight"
                    ? "✈️"
                    : item.type === "transfer"
                    ? "🚗"
                    : item.type === "hotel"
                    ? "🏨"
                    : "📍"}
                </span>
              </div>

              {index < itinerary.length - 1 && (
                <div className="timeline-line"></div>
              )}

              <div className={`timeline-card ${status.className}`}>

                <div className="timeline-card-top">

                  <div>
                    <span className="item-type">
                      {item.type}
                    </span>

                    <h3>{item.name}</h3>

                    <p>
                      {item.location}
                      {item.destination &&
                        item.destination !== item.location &&
                        ` → ${item.destination}`}
                    </p>
                  </div>

                  <span className={status.className}>
                    ● {status.label}
                  </span>

                </div>

                <div className="timeline-details">

                  <div>
                    <span>START</span>
                    <strong>
                      {formatTime(item.start_time)}
                    </strong>
                  </div>

                  <div>
                    <span>END</span>
                    <strong>
                      {formatTime(item.end_time)}
                    </strong>
                  </div>

                  <div>
                    <span>COST</span>
                    <strong>
                      ₹{item.cost}
                    </strong>
                  </div>

                </div>

                {item.depends_on &&
                  item.depends_on.length > 0 && (
                    <div className="dependency">
                      Depends on:{" "}
                      {item.depends_on.join(", ")}
                    </div>
                  )}

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}

export default Timeline;