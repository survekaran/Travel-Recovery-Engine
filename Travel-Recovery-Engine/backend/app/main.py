from fastapi import FastAPI

from app.data_loader import load_itinerary


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