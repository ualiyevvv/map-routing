import osmnx as ox
import geopandas as gpd
import networkx as nx
import pandas as pd
import matplotlib.pyplot as plt
import json

# Указываем местоположение для получения графа дорог
place_name = "Nur-Sultan, Kazakhstan"


# Define the tags for filtering objects
# tags = {'tourism': True, 'amenity': True, 'leisure': True}
tags = {'leisure': True}

# Retrieve all the points of interest (POIs) in the specified place
gdf = ox.geometries.geometries_from_address(place_name, tags, dist=10000)

# Convert GeoDataFrame to a pandas DataFrame to handle NaN values
df = pd.DataFrame(gdf)

# Replace NaN values with None or any other suitable representation
df = df.where(pd.notnull(df), None)

# Create an empty list to store the feature properties
features = []

# Iterate over the rows of the DataFrame
for idx, row in df.iterrows():
    # Extract the properties of each row
    properties = row.drop('geometry').to_dict()
    
    # Create a feature dictionary with properties and geometry
    feature = {
        "type": "Feature",
        "properties": properties,
        "geometry": row['geometry'].__geo_interface__
    }
    
    # Add the feature to the list
    features.append(feature)
# features = []
# nodes_attributes = {}
# # Plot the filtered points of interest
gdf.plot(ax=plt.gca(), color='red', alpha=0.6, markersize=10)
# for idx, row in gdf.iterrows():
#     # Extract the properties of each row
#     properties = row.drop('geometry').to_dict()
    
#     # Create a feature dictionary with properties and geometry
#     feature = {
#         "type": "Feature",
#         "properties": properties,
#         "geometry": row['geometry'].__geo_interface__
#     }
    
#     # Add the feature to the list
#     features.append(feature)

# Create the feature collection dictionary
feature_collection = {
    "type": "FeatureCollection",
    "features": features
}
# Save the GeoJSON data to a file
filename = f"gdf_attributes2.json"
with open(filename, "w") as json_file:
    json.dump(feature_collection, json_file)

# Отображаем карту
plt.show()

# Выводим результат
# print(pois)
# # Показываем граф
# plt.show()



