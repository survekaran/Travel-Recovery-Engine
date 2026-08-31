import networkx as nx


def build_dependency_graph(itinerary):
    graph = nx.DiGraph()

    # Add every itinerary item as a node
    for item in itinerary:
        graph.add_node(
            item["id"],
            name=item["name"],
            type=item["type"]
        )

    # Add dependency relationships
    for item in itinerary:
        for dependency_id in item.get("depends_on", []):
            graph.add_edge(dependency_id, item["id"])

    return graph


def get_affected_items(graph, disrupted_item_id):
    if disrupted_item_id not in graph:
        return []

    affected_items = list(
        nx.descendants(graph, disrupted_item_id)
    )

    return affected_items