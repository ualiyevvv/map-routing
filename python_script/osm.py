# # # # import osmnx as ox
# # # # import matplotlib.pyplot as plt

# # # # # Загрузка графа дорог для города Астана (Нур-Султан)
# # # # # city = ox.graph_from_place("Nur-Sultan, Kazakhstan", network_type="all")

# # # # # Визуализация графа дорог
# # # # # ox.plot_graph(ox.project_graph(city))

# # # # # Создание графика
# # # # # fig, ax = ox.plot_graph(city, show=False, close=False)

# # # # # Загрузка графа дорог для улицы в городе Астана (Нур-Султан)
# # # # # street = ox.graph_from_place("Абая, Нур-Султан, Казахстан", network_type="all")

# # # # # Создание графика
# # # # # fig, ax = ox.plot_graph(street, show=False, close=False)


# # # # # # Задайте координаты центра улицы (например, улицы Абая в Нур-Султане)
# # # # # lat = 51.1694
# # # # # lon = 71.4491

# # # # # # Загрузка графа дорог для заданных координат
# # # # # street = ox.graph_from_point((lat, lon), distance=500, network_type="all")

# # # # # # Создание графика
# # # # # fig, ax = ox.plot_graph(street, show=False, close=False)

# # # # # # Отображение графа дорог
# # # # # plt.show()


# # # # # Загрузка графа дорог для города Астана (Нур-Султан)
# # # # city = ox.graph_from_place("Nur-Sultan, Kazakhstan", network_type="all")

# # # # # Выбор нескольких дорог по типу (например, главные дороги и магистрали)
# # # # selected_roads = ox.distance.nearest_edges(city, 51.1605, 71.4704, 3, 'highway')

# # # # # Создание графика
# # # # fig, ax = ox.plot_graph_routes(city, selected_roads, route_linewidth=6, node_size=0, bgcolor='w')

# # # # # Отображение графа дорог с выбранными маршрутами
# # # # plt.show()
# # # import osmnx as ox

# # # # Загрузка графа дорог для города Астана (Нур-Султан)
# # # city = ox.graph_from_place("Nur-Sultan, Kazakhstan", network_type="all")

# # # # Преобразование графа в GeoDataFrame
# # # gdf = ox.graph_to_gdfs(city, nodes=True, edges=False)

# # # # Фильтрация узлов по типу узла (intersection - перекресток)
# # # intersections = gdf[gdf['highway'] == 'intersection']

# # # # Вывод полученных перекрестков
# # # print(intersections)
# # import osmnx as ox

# # # Загрузка графа дорог для указанной области (например, город Астана)
# # city = ox.graph_from_place("Nur-Sultan, Kazakhstan", network_type="all")

# # # Получение узлов из графа
# # nodes = list(city.nodes())

# # # Вывод списка узлов
# # print(nodes)

# import osmnx as ox
# import matplotlib.pyplot as plt

# # Загрузка графа дорог для указанной области (например, город Астана)
# city = ox.graph_from_place("Nur-Sultan, Kazakhstan", network_type="all")

# # Получение узлов из графа
# nodes = list(city.nodes())

# # Создание графика с узлами
# fig, ax = ox.plot_graph_nodes(city, node_color='red', node_size=10, node_alpha=0.8, figsize=(10, 10))

# # Отображение графика с узлами
# plt.show()

# # !!!!!!!
# import osmnx as ox
# import matplotlib.pyplot as plt
# import networkx as nx

# # Load the road graph for the specified area (e.g., Nur-Sultan, Kazakhstan)
# city = ox.graph_from_place("Nur-Sultan, Kazakhstan", network_type="all")

# # Get the nodes from the graph
# nodes = list(city.nodes())

# # Create a plot of the road graph
# fig, ax = ox.plot_graph(city, node_color='red', node_size=10, node_alpha=0.8, figsize=(10, 10), show=False)

# # Add labels with the node counts
# # for node in nodes:
# #     x, y = city.nodes[node]['x'], city.nodes[node]['y']
# #     count = city.nodes[node]['street_count']
# #     ax.text(x, y, count, fontsize=8, color='black', ha='center', va='center')

# # Show the plot
# plt.show()
# import osmnx as ox
# import networkx as nx

# # Загрузка графа дорог для указанной области (например, город Астана)
# city = ox.graph_from_place("Nur-Sultan, Kazakhstan", network_type="all")

# # Получение узлов из графа
# nodes = list(city.nodes())

# # Выбор двух узлов для расчета расстояния
# node1 = nodes[0]
# node2 = nodes[1]

# # Расчет расстояния между узлами
# distance = nx.shortest_path_length(city, node1, node2, weight='length')

# # Вывод расстояния
# print("Расстояние между узлами:", distance, "метров")

# #очень важно, данные с одного узла
# import osmnx as ox

# # Load the road graph for the specified area (e.g., Nur-Sultan, Kazakhstan)
# city = ox.graph_from_place("Nur-Sultan, Kazakhstan", network_type="all")

# # Get a specific node from the graph
# node = list(city.nodes())[0]

# # Print the attributes of the node
# print(city.nodes[node])
# ----------------
import osmnx as ox
import json

# Load the road graph for the specified area (e.g., Nur-Sultan, Kazakhstan)
graph = ox.graph_from_place("Nur-Sultan, Kazakhstan", network_type="all")

# Filter edges based on the desired highway types
desired_highways = ["motorway", "trunk", "primary", "secondary", "tertiary"]
# filtered_graph = graph.edge_subgraph(
#     [edge for edge, attributes in graph.edges(data=True) if attributes["highway"] in desired_highways]
# )
filtered_edges = [edge for edge, attributes in graph.edges.items() if attributes["highway"] in desired_highways]
filtered_graph = graph.edge_subgraph(filtered_edges)

# Create a list to store the GeoJSON features
features = []
counter_of_nodes = 0

# Iterate over the nodes and create GeoJSON features
for idx, (node, data) in enumerate(filtered_graph.nodes(data=True)):
    coordinates = [data['x'], data['y']]  # Get the node's coordinates
    # properties = {
    #     "name": data.get('name', ''),
    #     "description": f"Node {idx}",
    #     "street_count": data.get('street_count', 'undefined')
    # }  # Customize the properties as needed

    # feature = {
    #     "type": "Feature",
    #     "geometry": {
    #         "type": "Point",
    #         "coordinates": coordinates
    #     },
    #     "properties": properties
    # }
    street_count = data.get('street_count', 0)
    
    if street_count >= 3:
        properties = {
            "name": data.get('name', ''),
            "description": f"Node {idx}",
            "street_count": street_count
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
        counter_of_nodes+=1

# Create a GeoJSON FeatureCollection
feature_collection = {
    "type": "FeatureCollection",
    "features": features
}

filename = f"node_attributes_street_count_{counter_of_nodes}.json"
# Save the GeoJSON data to a file
with open(filename, 'w') as file:
    json.dump(feature_collection, file)

# # Get a specific node from the graph
# nodes = city.nodes()
# nodesLen = len(nodes)
# node = list(nodes)[0]

# # Retrieve the attributes of the node
# node_attributes = city.nodes[node]

# # Convert the attributes to JSON
# json_data = json.dumps(node_attributes, indent=4)

# # Save the JSON data to a file
# with open('node_attributes.json', 'w') as file:
#     file.write(json_data)
#     file.write(str(nodesLen))
# import osmnx as ox

# # Define the bounding box coordinates (min_longitude, min_latitude, max_longitude, max_latitude)
# bbox = (71.3187, 51.0917, 71.5922, 51.2371)  # Bounding box coordinates for Astana

# # Load the road graph for the specified bounding box
# graph = ox.graph_from_bbox(bbox[1], bbox[3], bbox[0], bbox[2], network_type="all")

# # Retrieve all nodes within the bounding box
# nodes = list(graph.nodes())

# # Print the number of nodes within the bounding box
# print("Number of nodes within the bounding box:", len(nodes))
