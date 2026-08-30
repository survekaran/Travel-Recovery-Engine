import json
from pathlib import Path


DATA_FILE = Path(__file__).parent.parent / "data" / "itinerary.json"


def load_itinerary():
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)