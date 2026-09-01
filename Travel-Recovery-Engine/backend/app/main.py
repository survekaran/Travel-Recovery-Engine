from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.data_loader import load_itinerary
from app.dependency_graph import build_dependency_graph
from app.impact_analysis import analyze_cascading_impact
from app.recovery_engine import generate_recovery_options


app = FastAPI(
    title="Travel Recovery Engine"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://travel-recovery-engine.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Travel Recovery Engine is running successfully!"
    }


@app.get("/itinerary")
def get_itinerary():
    data = load_itinerary()
    return data


@app.get("/disruptions/flight-delay/{flight_id}")
def simulate_flight_delay(
    flight_id: str,
    delay_minutes: int
):
    itinerary_data = load_itinerary()
    itinerary = itinerary_data["itinerary"]

    graph = build_dependency_graph(itinerary)

    result = analyze_cascading_impact(
        itinerary,
        graph,
        flight_id,
        delay_minutes
    )

    affected_items = []

    for item in result.get("impact", []):
        affected_items.append({
            "item_id": item["item_id"],
            "item_name": item["item_name"],
            "status": item["status"],
            "reason": item["reason"]
        })

    return {
        "flight_id": flight_id,
        "delay_minutes": delay_minutes,
        "new_arrival": result.get("new_arrival"),
        "affected_items": affected_items
    }


@app.get("/recovery/{item_id}")
def get_recovery_options(
    item_id: str,
    cost_weight: float = 0.4,
    time_weight: float = 0.3,
    flexibility_weight: float = 0.3
):
    itinerary_data = load_itinerary()
    itinerary = itinerary_data["itinerary"]

    traveler_preferences = {
        "cost_weight": cost_weight,
        "time_weight": time_weight,
        "flexibility_weight": flexibility_weight
    }

    result = generate_recovery_options(
        itinerary,
        item_id,
        traveler_preferences
    )

    return result