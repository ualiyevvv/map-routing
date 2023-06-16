import osmnx as ox
import json
import matplotlib.pyplot as plt

# Создайте граф дорожной сети из OpenStreetMap данных
graph = ox.graph_from_place('Nur-Sultan, Kazakhstan', network_type='drive')  # Замените 'Местоположение' на нужное вам место

# Задайте координаты двух точек (широта и долгота)

point1 = ox.distance.nearest_nodes(graph, 71.4375894, 51.1247571)  # Замените значениями реальных координат
point2 = ox.distance.nearest_nodes(graph, 71.36435335414731, 51.19407083146049)  # Замените значениями реальных координат

# Добавьте геометрию (точки) на граф дорожной сети
ox.distance.add_edge_lengths(graph)

# Рассчитайте кратчайший путь и расстояние между точками
route = ox.distance.shortest_path(graph, point1, point2, weight='length')

# Получите длины ребер в маршруте и суммируйте их
distance = sum(ox.utils_graph.get_route_edge_attributes(graph, route, 'length'))

print(f'Расстояние между точкой 1 и точкой 2: {distance} метров')
# Получите геометрию маршрута
route_geom = ox.plot_route_folium(graph, route=route, route_color='blue', route_width=4, edge_width=2)

# # Построить граф дорожной сети и отобразить на нем маршрут
fig, ax = ox.plot_graph_route(graph, route, route_linewidth=4, node_size=0, bgcolor='w')

# Показать график
plt.show()
# distance = ox.distance.total_edge_length(graph, route)
# Добавьте свойства каждого узла в словарь
# Создайте словарь с информацией о пути и его узлах
# path_data = {
#     "path": route,
#     # "distance": distance,
#     "nodes": []
# }
# for node in route:
#     node_data = {
#         "node_id": node,
#     }
#     # Добавьте свойства узла в словарь
#     for key, value in graph.nodes[node].items():
#         node_data[key] = value
#     path_data["nodes"].append(node_data)

# # Запишите словарь в JSON файл
# with open("path_data.json", "w") as json_file:
#     json.dump(path_data, json_file, indent=4)
# print(route)
# # Выведите расстояние между двумя точками
# print(f'Расстояние между точкой 1 и точкой 2: {distance} метров')