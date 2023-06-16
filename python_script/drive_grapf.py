import osmnx as ox
import networkx as nx
import matplotlib.pyplot as plt

# Указываем местоположение для получения графа дорог
place_name = "Nur-Sultan, Kazakhstan"

# Получаем граф дорог для указанного местоположения
graph = ox.graph_from_place(place_name, network_type='all')

# Отображаем ребра графа дорог
fig, ax = ox.plot_graph(graph, edge_color='white', edge_linewidth=0.5, node_size=0, show=False)

# Показываем граф
plt.show()