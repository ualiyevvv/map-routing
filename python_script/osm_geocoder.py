import osmnx as ox
from geopy.geocoders import Nominatim

def get_address(latitude, longitude):
    geolocator = Nominatim(user_agent="my_geocoder")
    # location = geolocator.reverse((latitude, longitude), exactly_one=True)
    location = geolocator.reverse((latitude, longitude))
    return location.address

geolocator = Nominatim(user_agent="my_geocoder")
location_list = geolocator.geocode("улица Достык", exactly_one=False)

for location in location_list:
    address = location.address
    print(address)

# latitude = 51.12508  # Ваша широта
# longitude = 71.435436  # Ваша долгота
# address = get_address(latitude, longitude)