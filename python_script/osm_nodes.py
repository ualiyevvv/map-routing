import osmnx as ox

# Задаем местоположение для извлечения данных
place_name = "Nur-Sultan, Kazakhstan"

# Извлекаем граф
graph = ox.graph_from_place(place_name, network_type="all")

# Отображаем граф
ox.plot_graph(graph)