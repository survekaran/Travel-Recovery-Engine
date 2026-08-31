import networkx as nx

from datetime import datetime, timedelta


def parse_time(time_string):
    return datetime.fromisoformat(time_string)


def calculate_delayed_arrival(item, delay_minutes):
    original_arrival = parse_time(item["end_time"])

    return original_arrival + timedelta(
        minutes=delay_minutes
    )


def check_time_constraint(
    arrival_time,
    dependent_item
):
    dependent_start = parse_time(
        dependent_item["start_time"]
    )

    buffer_minutes = dependent_item.get(
        "buffer_minutes",
        0
    )

    latest_acceptable_arrival = (
        dependent_start
        - timedelta(minutes=buffer_minutes)
    )

    if arrival_time > dependent_start:
        return {
            "status": "affected",
            "reason": (
                "Arrival occurs after the booking starts"
            )
        }

    if arrival_time > latest_acceptable_arrival:
        return {
            "status": "at_risk",
            "reason": (
                f"Only {int((dependent_start - arrival_time).total_seconds() / 60)} "
                "minutes remain before the booking"
            )
        }

    return {
        "status": "safe",
        "reason": "Sufficient time buffer remains"
    }


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

    impact_results = []

    # Process items in dependency order
    affected_ids = list(
        nx.descendants(
            graph,
            disrupted_item_id
        )
    )

    # Keep track of the new effective arrival
    effective_times = {
        disrupted_item_id: new_arrival
    }

    # Continue until all affected items are processed
    remaining = set(affected_ids)

    while remaining:

        progress = False

        for item in itinerary:

            item_id = item["id"]

            if item_id not in remaining:
                continue

            dependencies = item.get(
                "depends_on",
                []
            )

            # We can only process this item
            # after its dependencies have been processed
            dependency_times = []

            dependencies_ready = True

            for dependency_id in dependencies:

                if dependency_id in effective_times:
                    dependency_times.append(
                        effective_times[dependency_id]
                    )
                elif dependency_id in affected_ids:
                    dependencies_ready = False
                    break

            if not dependencies_ready:
                continue

            if not dependency_times:
                continue

            # Latest dependency arrival controls
            # when this item can actually begin
            actual_arrival = max(
                dependency_times
            )

            result = check_time_constraint(
                actual_arrival,
                item
            )

            # Calculate how late this item may now begin
            original_start = parse_time(
                item["start_time"]
            )

            delay_from_original = max(
                0,
                int(
                    (
                        actual_arrival
                        - original_start
                    ).total_seconds() / 60
                )
            )

            # Propagate the delay to downstream items
            original_end = parse_time(
                item["end_time"]
            )

            effective_end = (
                original_end
                + timedelta(
                    minutes=delay_from_original
                )
            )

            effective_times[item_id] = effective_end

            impact_results.append({
                "item_id": item_id,
                "item_name": item["name"],
                "status": result["status"],
                "reason": result["reason"],
                "effective_time": effective_end.isoformat()
            })

            remaining.remove(item_id)
            progress = True

        # Safety check to prevent an infinite loop
        if not progress:
            break

    return {
        "disrupted_item": disrupted_item_id,
        "delay_minutes": delay_minutes,
        "new_arrival": new_arrival.isoformat(),
        "impact": impact_results
    }