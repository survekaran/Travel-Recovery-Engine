from fastapi import FastAPI

from app.data_loader import load_itinerary

from app.dependency_graph import (
    build_dependency_graph,
    get_affected_items
)

from app.impact_analysis import (
    analyze_cascading_impact
)

from app.recovery_engine import (
    generate_recovery_options
)


app = FastAPI(
    title="Travel Disruption Recovery Engine",
    description="Prototype for intelligent travel disruption recovery",
    version="0.1.0"
)


@app.get("/")
def home():
    return {
        "message": "Travel Recovery Engine is running!"
    }


@app.get("/itinerary")
def get_itinerary():
    return load_itinerary()


@app.get("/itinerary/{item_id}/affected")
def get_affected_bookings(item_id: str):
    data = load_itinerary()

    graph = build_dependency_graph(
        data["itinerary"]
    )

    affected_ids = get_affected_items(
        graph,
        item_id
    )

    return {
        "disrupted_item": item_id,
        "affected_items": affected_ids
    }


@app.get("/disruptions/flight-delay/{flight_id}")
def simulate_flight_delay(
    flight_id: str,
    delay_minutes: int
):
    data = load_itinerary()

    graph = build_dependency_graph(
        data["itinerary"]
    )

    result = analyze_cascading_impact(
        data["itinerary"],
        graph,
        flight_id,
        delay_minutes
    )

    return result

@app.get("/recovery/{item_id}")
def get_recovery_options(
    item_id: str,
    cost_weight: float = 0.4,
    time_weight: float = 0.3,
    flexibility_weight: float = 0.3
):

    data = load_itinerary()

    traveler_preferences = {
        "cost_weight": cost_weight,
        "time_weight": time_weight,
        "flexibility_weight": flexibility_weight
    }

    result = generate_recovery_options(
        data["itinerary"],
        item_id,
        traveler_preferences
    )

    return result