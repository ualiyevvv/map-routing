import osmnx as ox
import networkx as nx
import json

# Load the road graph for the specified area (e.g., Nur-Sultan, Kazakhstan)
graph = ox.graph_from_place("Nur-Sultan, Kazakhstan", network_type="drive")

# Define the desired highway types
desired_highways = ["motorway", "trunk", "primary", "secondary", "tertiary"]

# Create a list to store the filtered nodes
filtered_nodes = []

# Iterate over the edges and add the intersecting nodes to the filtered list
for u, v, data in graph.edges(data=True):
    if data["highway"] in desired_highways:
        filtered_nodes.append(u)
        filtered_nodes.append(v)

# Convert the list of filtered nodes to a set to remove duplicates
filtered_nodes = set(filtered_nodes)

# Create a list to store the filtered nodes
filtered_nodes = []

# Iterate over the edges and add the intersecting nodes to the filtered list
for u, v, data in graph.edges(data=True):
    if data["highway"] in desired_highways:
        filtered_nodes.append(u)
        filtered_nodes.append(v)

# Convert the list of filtered nodes to a set to remove duplicates
filtered_nodes = set(filtered_nodes)

# Create a subgraph from the original graph using the filtered nodes
filtered_graph = graph.subgraph(filtered_nodes)

# Create a list to store the GeoJSON features
features = []
nodes_counter=0

# Iterate over the filtered nodes and create GeoJSON features
for node, data in filtered_graph.nodes(data=True):
    coordinates = [data['x'], data['y']]  # Get the node's coordinates
    street_count = data.get('street_count', 0)

    if street_count >= 4:
        properties = {
            "name": data.get('name', ''),
            "description": f"Node {node}",
            "street_count": street_count,
            "highway": data.get('highway', 0)
        }  # Customize the properties as needed

        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": coordinates
            },
            "properties": properties
        }

        features.append(feature)
        nodes_counter+=1

# Create a GeoJSON FeatureCollection
feature_collection = {
    "type": "FeatureCollection",
    "features": features
}

# Save the GeoJSON data to a file
filename = f"filtered_nodes_{nodes_counter}.json"
with open(filename, 'w') as file:
    json.dump(feature_collection, file)