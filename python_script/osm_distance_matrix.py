import osmnx as ox
import json

# Загрузка данных из файла JSON
with open('./json/filtered_points_example.json', 'r') as file:
    data = json.load(file)
    points = data["filteredMarkersLngLat"]

# Преобразование координат точек в числа
for i in range(len(points)):
    points[i] = [float(coord) for coord in points[i]]

# Создание графа дорожной сети из OpenStreetMap данных
graph = ox.graph_from_place('Nur-Sultan, Kazakhstan', network_type='drive')

ox.distance.add_edge_lengths(graph)

# Функция для рассчета расстояния между двумя точками
def calculate_distance(graph, point1, point2):
    route = ox.distance.shortest_path(graph, point1, point2, weight='length')
    # distance = sum(ox.utils_graph.get_route_edge_attributes(graph, route, 'length')) osm_distance_matrix.py:22: UserWarning: The `get_route_edge_attributes` function has been deprecated and will be removed in a future release. Use the `route_to_gdf` function instead.
    distance = sum(ox.utils_graph.get_route_edge_attributes(graph, route, 'length'))
    return distance

# Рассчет расстояний от каждой точки до всех остальных точек
distances = []
for i, point in enumerate(points):
    point_coords = point
    point_node = ox.distance.nearest_nodes(graph, point_coords[0], point_coords[1])
    distances.append([])
    for j, other_point in enumerate(points):
        other_point_coords = other_point
        other_point_node = ox.distance.nearest_nodes(graph, other_point_coords[0], other_point_coords[1])
        distance = calculate_distance(graph, point_node, other_point_node)
        distances[i].append(distance)

# Сохранение результатов в виде матрицы расстояний в новый JSON-файл
output_data = {'distances': distances}
with open('./json/output_distance_matrix_example.json', 'w') as output_file:
    json.dump(output_data, output_file)

print("Матрица расстояний сохранена в файле 'output_distance_matrix.json' в папке json.")