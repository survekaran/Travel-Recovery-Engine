const API_BASE = "https://travel-recovery-engine.onrender.com";

// Fetch complete itinerary
export async function getItinerary() {
  const res = await fetch(`${API_BASE}/itinerary`);
  return await res.json();
}

// Simulate flight delay
export async function simulateFlightDelay(flightId, delayMinutes = 180) {
  const res = await fetch(
    `${API_BASE}/disruptions/flight-delay/${flightId}?delay_minutes=${delayMinutes}`
  );
  return await res.json();
}

// Fetch recovery options
export async function getRecoveryOptions(itemId) {
  const res = await fetch(
    `${API_BASE}/recovery/${itemId}?cost_weight=0.4&time_weight=0.3&flexibility_weight=0.3`
  );
  return await res.json();
}