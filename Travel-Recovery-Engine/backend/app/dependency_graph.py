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