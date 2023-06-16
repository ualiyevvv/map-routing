import osmnx as ox
import networkx as nx
import json

place_name = "Nur-Sultan, Kazakhstan"  # Замените на свое название места
graph = ox.graph_from_place(place_name, network_type="drive")


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
nodes_attributes = {}
    
# Iterate over the filtered nodes and create GeoJSON features
for node_id, node_data in filtered_graph.nodes(data=True):
    nodes_attributes[node_id] = node_data
    
    # if street_count >= 4:
    #     properties = {
    #         "name": data.get('name', ''),
    #         "description": f"Node {node}",
    #         "street_count": street_count
    #     }  # Customize the properties as needed

    #     feature = {
    #         "type": "Feature",
    #         "geometry": {
    #             "type": "Point",
    #             "coordinates": coordinates
    #         },
    #         "properties": properties
    #     }

    #     features.append(feature)
    nodes_counter+=1


# Save the GeoJSON data to a file
filename = f"nodes_attributes_count_nodes_{nodes_counter}.json"
with open(filename, "w") as json_file:
    json.dump(nodes_attributes, json_file)