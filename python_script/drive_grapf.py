import osmnx as ox
import networkx as nx
import matplotlib.pyplot as plt

# Указываем местоположение для получения графа дорог
place_name = "Nur-Sultan, Kazakhstan"

# Получаем граф дорог для указанного местоположения
graph = ox.graph_from_place(place_name, network_type='all')

# Создайте копию графа
filtered_graph = graph.copy()

# Итерируйтесь по каждому ребру графа
for u, v, k, data in graph.edges(keys=True, data=True):
    # Проверьте тип дороги на пешеходные тропы
    if "footway" not in data["highway"] and "path" not in data["highway"]:
        # Если тип дороги не является пешеходной тропой, удаляем ребро из графа
        filtered_graph.remove_edge(u, v, k)

# Отображаем ребра графа дорог
fig, ax = ox.plot_graph(filtered_graph, edge_color='white', edge_linewidth=0.5, node_size=0, show=False)

# Показываем граф 
plt.show()