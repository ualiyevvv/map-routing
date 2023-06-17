import osmnx as ox
from geopy.geocoders import Nominatim

def get_address(latitude, longitude):
    geolocator = Nominatim(user_agent="my_geocoder")
    location = geolocator.reverse((latitude, longitude), exactly_one=True)
    return location.address

latitude = 51.12508  # Ваша широта
longitude = 71.435436  # Ваша долгота
address = get_address(latitude, longitude)
print(address)