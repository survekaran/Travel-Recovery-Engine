def get_recovery_options(disrupted_item):
    """
    Generate alternative recovery options
    for a disrupted booking.
    """

    if disrupted_item["type"] == "transfer":

        return [
            {
                "option_id": "REC001",
                "type": "alternative_transfer",
                "name": "Premium Airport Taxi",
                "provider": "Delhi Cab Services",
                "cost": 1800,
                "duration_minutes": 45,
                "departure_flexibility": "high",
                "availability": True
            },
            {
                "option_id": "REC002",
                "type": "alternative_transfer",
                "name": "Airport Shuttle",
                "provider": "Delhi Airport Shuttle",
                "cost": 900,
                "duration_minutes": 60,
                "departure_flexibility": "medium",
                "availability": True
            },
            {
                "option_id": "REC003",
                "type": "alternative_transfer",
                "name": "Hotel Private Transfer",
                "provider": "Delhi Grand Hotel",
                "cost": 1200,
                "duration_minutes": 50,
                "departure_flexibility": "high",
                "availability": True
            }
        ]

    return []


def rank_recovery_options(
    options,
    traveler_preferences=None
):
    """
    Rank recovery options using
    cost, time and flexibility.
    """

    if traveler_preferences is None:
        traveler_preferences = {
            "cost_weight": 0.4,
            "time_weight": 0.3,
            "flexibility_weight": 0.3
        }

    for option in options:

        # Lower cost = better score
        cost_score = max(
            0,
            1 - (option["cost"] / 3000)
        )

        # Shorter duration = better score
        time_score = max(
            0,
            1 - (option["duration_minutes"] / 120)
        )

        # Flexibility score
        flexibility_scores = {
            "high": 1.0,
            "medium": 0.7,
            "low": 0.4
        }

        flexibility_score = flexibility_scores.get(
            option["departure_flexibility"],
            0.5
        )

        # Calculate weighted score
        final_score = (
            cost_score
            * traveler_preferences["cost_weight"]
            +
            time_score
            * traveler_preferences["time_weight"]
            +
            flexibility_score
            * traveler_preferences["flexibility_weight"]
        )

        # Penalize unavailable options
        if not option["availability"]:
            final_score *= 0.1

        option["score"] = round(
            final_score * 100,
            2
        )

    return sorted(
        options,
        key=lambda option: option["score"],
        reverse=True
    )


def generate_recommendation(options):
    """
    Generate an explanation for the
    highest-ranked recovery option.
    """

    if not options:
        return None

    best_option = options[0]

    reasons = []

    if best_option["cost"] <= 1200:
        reasons.append(
            "Cost-effective option"
        )

    if best_option["duration_minutes"] <= 50:
        reasons.append(
            "Short travel duration"
        )

    if best_option["departure_flexibility"] == "high":
        reasons.append(
            "High departure flexibility"
        )

    if best_option["availability"]:
        reasons.append(
            "Currently available"
        )

    return {
        "recommended_option": best_option["option_id"],
        "name": best_option["name"],
        "score": best_option["score"],
        "reasons": reasons
    }


def generate_recovery_options(
    itinerary,
    disrupted_item_id,
    traveler_preferences=None
):
    """
    Find the disrupted booking,
    generate recovery alternatives,
    rank them and recommend the best one.
    """

    disrupted_item = None

    # Find disrupted item
    for item in itinerary:

        if item["id"] == disrupted_item_id:
            disrupted_item = item
            break

    if disrupted_item is None:
        return {
            "error": "Disrupted item not found"
        }

    # Generate alternatives
    options = get_recovery_options(
        disrupted_item
    )

    # Rank alternatives
    ranked_options = rank_recovery_options(
        options,
        traveler_preferences
    )

    # Select best option
    recommendation = generate_recommendation(
        ranked_options
    )

    return {
        "disrupted_item": disrupted_item_id,
        "options": ranked_options,
        "recommendation": recommendation
    }