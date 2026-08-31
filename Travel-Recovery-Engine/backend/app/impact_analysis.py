import networkx as nx

from datetime import datetime, timedelta


def parse_time(time_string):
    return datetime.fromisoformat(time_string)


def calculate_delayed_arrival(item, delay_minutes):
    original_arrival = parse_time(item["end_time"])

    new_arrival = original_arrival + timedelta(
        minutes=delay_minutes
    )

    return new_arrival


def analyze_cascading_impact(
    itinerary,
    graph,
    disrupted_item_id,
    delay_minutes
):
    # Find the disrupted item
    disrupted_item = None

    for item in itinerary:
        if item["id"] == disrupted_item_id:
            disrupted_item = item
            break

    if disrupted_item is None:
        return {
            "error": "Item not found"
        }

    # Calculate the new arrival time
    new_arrival = calculate_delayed_arrival(
        disrupted_item,
        delay_minutes
    )

    # Find every item downstream from the disruption
    affected_ids = list(
        nx.descendants(graph, disrupted_item_id)
    )

    impact_results = []

    # Check each affected item
    for item in itinerary:

        if item["id"] not in affected_ids:
            continue

        dependencies = item.get("depends_on", [])

        affected_dependency = None

        for dependency_id in dependencies:

            # Direct dependency on the disrupted item
            if dependency_id == disrupted_item_id:
                affected_dependency = dependency_id
                break

            # Dependency was already identified as affected
            for result in impact_results:
                if result["item_id"] == dependency_id:
                    affected_dependency = dependency_id
                    break

            if affected_dependency:
                break

        if affected_dependency:

            if affected_dependency == disrupted_item_id:
                status = "affected"
                reason = (
                    "Disrupted item can no longer meet "
                    "the booking time"
                )
            else:
                status = "at_risk"
                reason = (
                    f"Dependency {affected_dependency} "
                    "is already affected"
                )

            impact_results.append({
                "item_id": item["id"],
                "item_name": item["name"],
                "status": status,
                "reason": reason
            })

    return {
        "disrupted_item": disrupted_item_id,
        "delay_minutes": delay_minutes,
        "new_arrival": new_arrival.isoformat(),
        "impact": impact_results
    }