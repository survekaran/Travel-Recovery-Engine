import { useEffect, useState } from "react";
import api from "./services/api";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Connecting...");

  useEffect(() => {
    api
      .get("/")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error(error);
        setMessage("Backend connection failed");
      });
  }, []);

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div>
          <h1>Travel Recovery</h1>
          <p>AI-powered flight disruption management</p>
        </div>

        <div className="profile">VP</div>
      </header>

      {/* HERO */}
      <section className="hero-card">
        <div>
          <span className="eyebrow">RECOVERY INTELLIGENCE</span>

          <h2>
            Good evening <span>👋</span>
          </h2>

          <p>
            Monitor flight disruptions and discover the best recovery options.
          </p>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          System Online
        </div>
      </section>

      {/* STATS */}
      <section className="stats-grid">
        <div className="stat-card">
          <p>Active Flights</p>
          <h3>24</h3>
        </div>

        <div className="stat-card">
          <p>Disruptions</p>
          <h3>3</h3>
        </div>

        <div className="stat-card">
          <p>Recovery Options</p>
          <h3>12</h3>
        </div>
      </section>

      {/* BACKEND CONNECTION */}
      <section className="backend-card">
        <div className="backend-icon">✈️</div>

        <div>
          <h3>Travel Recovery Engine</h3>
          <p>{message}</p>
        </div>

        <span className="connected-badge">Connected</span>
      </section>
    </div>
  );
}

export default App;