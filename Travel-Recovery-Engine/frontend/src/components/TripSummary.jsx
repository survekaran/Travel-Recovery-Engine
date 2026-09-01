function TripSummary({ trip, itinerary }) {
  const totalCost = itinerary.reduce(
    (total, item) => total + item.cost,
    0
  );

  return (
    <div className="trip-summary">
      <div className="trip-header">
        <div>
          <h1>{trip.name}</h1>
          <p>{trip.traveler}</p>
        </div>

        <div className="trip-route">
          Mumbai → Delhi
        </div>
      </div>

      <div className="trip-date">
        {trip.start_date} → {trip.end_date}
      </div>

      <div className="summary-cards">

        <div className="summary-card">
          <h3>{itinerary.length}</h3>
          <p>Bookings</p>
        </div>

        <div className="summary-card">
          <h3>Delhi</h3>
          <p>Destination</p>
        </div>

        <div className="summary-card">
          <h3>₹{totalCost.toLocaleString("en-IN")}</h3>
          <p>Total Cost</p>
        </div>

      </div>
    </div>
  );
}

export default TripSummary;