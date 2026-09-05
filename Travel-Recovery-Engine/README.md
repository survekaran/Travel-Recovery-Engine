# Travel Recovery Engine

Travel Recovery Engine is a full-stack application that simulates a flight disruption, traces its effect through dependent itinerary bookings, and ranks recovery options based on a traveller's preferences.

## Features

- Displays a trip itinerary and its dependent bookings.
- Simulates a configurable flight delay.
- Identifies downstream bookings as `safe`, `at_risk`, or `affected`.
- Generates and scores transfer recovery options using cost, duration, and departure flexibility.
- Provides a React dashboard backed by a FastAPI API.

## Project structure

```text
Travel-Recovery-Engine/
|- backend/
|  |- app/                 # FastAPI API and recovery logic
|  |- data/itinerary.json  # Sample trip and dependency data
|  |- requirements.txt     # Python dependencies
|- frontend/
|  |- src/                 # React application
|  |- package.json         # Frontend dependencies and scripts
|- README.md               # Project documentation (this file)
```

## Technology

- Backend: Python, FastAPI, Uvicorn, NetworkX, Pydantic
- Frontend: React 19 and Vite

## Run locally

### Prerequisites

- Python 3.12 or later
- Node.js 20 or later with npm

### Backend

From the project root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API starts at `http://127.0.0.1:8000`.

### Frontend

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Vite serves the dashboard at `http://localhost:5173` by default.

> **Note:** The frontend currently uses the deployed API URL in `frontend/src/services/api.js` and `frontend/src/App.jsx`. Change those values to `http://127.0.0.1:8000` when working against a local backend.

## API reference

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Health/status message. |
| `GET` | `/itinerary` | Returns the trip and its itinerary items. |
| `GET` | `/disruptions/flight-delay/{flight_id}?delay_minutes=180` | Simulates a delay and returns the new flight arrival plus effects on dependent bookings. |
| `GET` | `/recovery/{item_id}?cost_weight=0.4&time_weight=0.3&flexibility_weight=0.3` | Returns scored recovery choices and the recommended option for an itinerary item. |

Example:

```text
GET /disruptions/flight-delay/FL001?delay_minutes=180
```

### API documentation

FastAPI automatically publishes interactive API documentation while the backend is running:

- [Swagger UI (interactive API explorer)](http://127.0.0.1:8000/docs)
- [ReDoc (reference documentation)](http://127.0.0.1:8000/redoc)
- [OpenAPI schema](http://127.0.0.1:8000/openapi.json)

## How impact analysis works

1. The backend loads the itinerary from `backend/data/itinerary.json`.
2. It creates a directed dependency graph: each `depends_on` item must finish before the current booking can begin.
3. A delay changes the disrupted flight's arrival time.
4. The engine walks downstream bookings, propagates delayed end times, and compares each effective arrival with its start time and configured buffer.
5. Each booking is classified as:
   - `safe`: its buffer remains intact;
   - `at_risk`: it can still start, but the buffer is reduced; or
   - `affected`: arrival occurs after the booking begins.

## Recovery scoring

Recovery choices are scored from 0 to 100. The default weighting is:

- Cost: `0.4`
- Time: `0.3`
- Flexibility: `0.3`

The endpoint accepts different weights through query parameters so a caller can prioritize lower cost, shorter duration, or more flexible departures.

## Itinerary data

The sample data lives in [`backend/data/itinerary.json`](backend/data/itinerary.json). Every itinerary item uses fields such as:

```json
{
  "id": "TR001",
  "type": "transfer",
  "name": "Airport to Hotel Transfer",
  "start_time": "2026-09-10T16:30:00",
  "end_time": "2026-09-10T17:30:00",
  "buffer_minutes": 15,
  "depends_on": ["FL001"]
}
```

`depends_on` defines the dependency graph and `buffer_minutes` determines how much time is required before the booking starts.

## Further documentation

- Backend dependencies: [`backend/requirements.txt`](backend/requirements.txt)
- Backend entry point and endpoint definitions: [`backend/app/main.py`](backend/app/main.py)
- Dependency graph: [`backend/app/dependency_graph.py`](backend/app/dependency_graph.py)
- Impact-analysis rules: [`backend/app/impact_analysis.py`](backend/app/impact_analysis.py)
- Recovery generation and ranking: [`backend/app/recovery_engine.py`](backend/app/recovery_engine.py)
- Frontend scripts and dependencies: [`frontend/package.json`](frontend/package.json)
- Frontend application entry: [`frontend/src/App.jsx`](frontend/src/App.jsx)
- Frontend API client: [`frontend/src/services/api.js`](frontend/src/services/api.js)

## Available scripts

From `frontend/`:

```text
npm run dev      # Start the Vite development server
npm run build    # Create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build
```
