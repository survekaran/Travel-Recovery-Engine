import { useEffect, useState } from "react";
import "./App.css";

import TripSummary from "./components/TripSummary";
import Timeline from "./components/Timeline";
import DisruptionCard from "./components/DisruptionCard";
import RecoveryCard from "./components/RecoveryCard";
import RecommendationCard from "./components/RecommendationCard";

function App() {
  const [recovery, setRecovery] = useState(null);
  const [disruption, setDisruption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRecovery, setSelectedRecovery] = useState(null);
  const [tripData, setTripData] = useState(null);

  const API = "https://travel-recovery-engine.onrender.com";

  // Load itinerary when the application starts
  useEffect(() => {
    fetch(`${API}/itinerary`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load itinerary");
        }

        return response.json();
      })
      .then((data) => {
        setTripData(data);
      })
      .catch((error) => {
        console.error("Error loading itinerary:", error);
      });
  }, []);

  // Simulate a 3-hour flight delay
  const simulateDisruption = async () => {
    setLoading(true);

    // Clear previous results
    setDisruption(null);
    setRecovery(null);
    setSelectedRecovery(null);

    try {
      // Step 1: Detect disruption and analyse impact
      const response = await fetch(
        `${API}/disruptions/flight-delay/FL001?delay_minutes=180`
      );

      if (!response.ok) {
        throw new Error("Failed to simulate disruption");
      }

      const disruptionData = await response.json();

      setDisruption(disruptionData);

      console.log("Disruption:", disruptionData);

      // Step 2: Get recovery options
      const recoveryResponse = await fetch(
        `${API}/recovery/TR001?cost_weight=0.4&time_weight=0.3&flexibility_weight=0.3`
      );

      if (!recoveryResponse.ok) {
        throw new Error("Failed to load recovery options");
      }

      const recoveryData = await recoveryResponse.json();

      setRecovery(recoveryData);

      console.log("Recovery:", recoveryData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset the entire disruption simulation
  const resetSimulation = () => {
    setDisruption(null);
    setRecovery(null);
    setSelectedRecovery(null);
  };

  // Show loading screen until itinerary is loaded
  if (!tripData) {
    return (
      <div className="app">
        <div className="loading-screen">
          Loading trip...
        </div>
      </div>
    );
  }

  // Find the flight from the itinerary
  const flight = tripData.itinerary.find(
    (item) => item.id === "FL001"
  );

  return (
    <div className="app">

      {/* =========================
          HEADER
      ========================= */}

      <header className="header">

        <div>
          <h1>✈️ Travel Recovery Engine</h1>

          <p>
            Intelligent Travel Disruption Recovery
          </p>
        </div>

        <div className="status">
          ● System Online
        </div>

      </header>


      <main className="container">

        {/* =========================
            HERO SECTION
        ========================= */}

        <section className="hero">

          <div>

            <p className="eyebrow">
              SMART TRAVEL RESILIENCE
            </p>

            <h2>
              Your journey,
              <br />
              <span>
                protected from disruption.
              </span>
            </h2>

            <p className="description">
              Detect disruptions, analyse their impact
              and automatically recommend the best
              recovery option.
            </p>

            <button
              className="primary-button"
              onClick={simulateDisruption}
              disabled={loading}
            >
              {loading
                ? "Analysing..."
                : disruption
                ? "Re-run Disruption Analysis"
                : "Simulate 3-Hour Flight Delay"}
            </button>

          </div>


          {/* Flight summary card */}

          {flight && (
            <div className="hero-card">

              <div className="flight-icon">
                ✈️
              </div>

              <h3>
                {flight.id}
              </h3>

              <p>
                {flight.location} → {flight.destination}
              </p>

              <div className="flight-details">

                <span>
                  {new Date(
                    flight.start_time
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                <span>
                  →
                </span>

                <span>
                  {new Date(
                    flight.end_time
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

              </div>

            </div>
          )}

        </section>


        {/* =========================
            TRIP SUMMARY
        ========================= */}

        <TripSummary
          trip={tripData.trip}
          itinerary={tripData.itinerary}
        />


        {/* =========================
            TIMELINE
        ========================= */}

        <Timeline
          itinerary={tripData.itinerary}
          disruption={disruption}
        />


        {/* =========================
            DISRUPTION CARD
        ========================= */}

        <DisruptionCard
          disruption={disruption}
        />


        {/* =========================
            RECOVERY SECTION
        ========================= */}

        {recovery && (
          <section className="section recovery-section">

            {/* Dynamic disruption alert */}

            {disruption && (
              <div className="alert">

                <div className="alert-icon">
                  ⚠️
                </div>

                <div>

                  <strong>
                    Disruption Detected
                  </strong>

                  <p>
                    Flight {disruption.flight_id} is
                    delayed by{" "}
                    {Math.round(
                      disruption.delay_minutes / 60
                    )}{" "}
                    hours.

                    {" "}

                    {disruption.affected_items.length}{" "}
                    downstream bookings are affected.
                  </p>

                </div>

              </div>
            )}


            {/* Disruption summary */}

            {disruption && (
              <div className="disruption-summary">

                <div>
                  <span>
                    FLIGHT
                  </span>

                  <strong>
                    {disruption.flight_id}
                  </strong>
                </div>


                <div>
                  <span>
                    DELAY
                  </span>

                  <strong>
                    +{disruption.delay_minutes} min
                  </strong>
                </div>


                <div>
                  <span>
                    NEW ARRIVAL
                  </span>

                  <strong>
                    {new Date(
                      disruption.new_arrival
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </strong>
                </div>


                <div>
                  <span>
                    AFFECTED
                  </span>

                  <strong>
                    {disruption.affected_items.length}
                  </strong>
                </div>

              </div>
            )}


            {/* Recovery heading */}

            <div className="section-title">

              <div>

                <p className="eyebrow">
                  RECOVERY DECISION
                </p>

                <h2>
                  Recommended Recovery
                </h2>

              </div>

            </div>


            {/* =========================
                RECOMMENDATION
            ========================= */}

            <RecommendationCard
              recommendation={recovery.recommendation}
              options={recovery.options}
              onSelect={setSelectedRecovery}
            />


            {/* =========================
                SELECTION SUCCESS
            ========================= */}

            {selectedRecovery && (
              <div className="selection-success">

                <span className="success-icon">
                  ✓
                </span>

                <div>

                  <strong>
                    Recovery plan selected
                  </strong>

                  <p>
                    Recovery option{" "}
                    {selectedRecovery}{" "}
                    has been selected for this
                    disruption.
                  </p>

                </div>

              </div>
            )}


            {/* =========================
                RECOVERY OPTIONS
            ========================= */}

            <div className="recovery-options-section">

              <div className="options-heading-row">

                <div>

                  <p className="eyebrow">
                    AVAILABLE ALTERNATIVES
                  </p>

                  <h3>
                    Recovery Options
                  </h3>

                </div>

                <span className="badge">
                  {recovery.options.length} options
                </span>

              </div>


              <div className="recovery-options">

                {recovery.options.map(
                  (option, index) => (
                    <RecoveryCard
                      key={option.option_id}
                      option={option}
                      recommended={index === 0}
                    />
                  )
                )}

              </div>

            </div>


            {/* =========================
                RESET
            ========================= */}

            <button
              className="reset-button"
              onClick={resetSimulation}
            >
              Reset Simulation
            </button>

          </section>
        )}

      </main>


      {/* =========================
          FOOTER
      ========================= */}

      <footer>
        Travel Recovery Engine • Intelligent Travel Resilience
      </footer>

    </div>
  );
}

export default App;