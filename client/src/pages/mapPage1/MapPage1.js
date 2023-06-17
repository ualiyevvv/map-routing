import React, {useEffect, useRef, useState} from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol';
import markerIcon from './images/marker-icon.png';
import markerIcon2x from './images/marker-icon-2x.png';
import jsonData from './json/filtered_nodes_928_1.json';

import styles from './map.module.css'


export default function MapPage1({markersData}) {

    const geoPosition = [51.11170294584818,71.40717028568645]
    const mapContainerRef = useRef();
    const [isReadyToDownload, setIsReadyToDownload] = useState(false);
    const [json, setJson] = useState({});

    async function reverseGeocode(lat, lon) {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data); // Обработка полученных данных
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        reverseGeocode(51.12508, 71.435436);
        // Создание карты и установка начальных координат и масштаба
        const map = L.map(mapContainerRef.current).setView(geoPosition, 11);

        // Добавление тайлового слоя OpenStreetMap
        // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //     attribution: 'Map data &copy; OpenStreetMap contributors',
        // }).addTo(mapPage1);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: false,
        }).addTo(map);

        // Add the geolocation control
        L.control
            .locate({
                position: 'topright',
                locateOptions: {
                    enableHighAccuracy: true,
                },
                markerStyle: {
                    draggable: true,
                    opacity: 0.5,
                },
                circleStyle: {
                    radius: 200,
                    weight: 2,
                    color: 'blue',
                    fillColor: 'blue',
                    fillOpacity: 0.1,
                },
            })
            .addTo(map);


        // Create a marker cluster group
        const markers = L.markerClusterGroup();

        // markersData.forEach((markerData) => {
        //     const { caption, coordinates } = markerData;
        //     const marker = L.marker(coordinates).bindPopup(caption);
        //
        //     marker.on('click', () => {
        //         // Handle the click event here
        //         setSelectedEvent(markerData)
        //         console.log('Marker clicked:', caption);
        //     });
        //
        //     markers.addLayer(marker);
        // });
        // Создание иконки маркера
        const customIcon = L.icon({
            iconUrl: markerIcon,
            iconRetinaUrl: markerIcon2x,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowUrl: null,
            shadowSize: null,
            shadowAnchor: null,
        });

        function getMarkerColor(highway) {
            switch (highway) {
                case 'milestone':
                    return 'red';
                case 'traffic_signals':
                    return 'blue';
                case 'motorway_junction':
                    return 'green';
                // Добавьте дополнительные условия для других типов дорог
                default:
                    return 'gray';
            }
        }
        // Создание стиля маркера
        let markerStyle = {
            radius: 6,
            fillColor: "#ff0000",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        // Загрузка GeoJSON данных
        const geojsonLayer = L.geoJSON(jsonData, {
            pointToLayer: function(feature, latlng) {
                // if (!valueNames.includes(feature.properties.highway))
                //     valueNames.push(feature.properties.highway);
                const color = getMarkerColor(feature.properties.highway);
                markerStyle.fillColor = color;


                return L.circleMarker(latlng, markerStyle);
            },
            onEachFeature: function(feature, layer) {
                // Получение свойств из GeoJSON
                let properties = feature.properties;
                // Создание всплывающей подсказки с данными из GeoJSON
                let popupContent = '';
                for (let key in properties) {
                    popupContent += '<strong>' + key + ':</strong> ' + properties[key] + '<br>';
                }
                console.log(feature)
                popupContent += '<strong>coordinates: </strong> ' + feature.geometry.coordinates + '<br>';
                // Привязка всплывающей подсказки к маркеру
                layer.bindPopup(popupContent);
            }
        });

        // Полигон, заданный набором координат
        const polygonBounds = [
            [51.098086312468126,71.40506845862981],
            [51.13692257363482,71.4149711743988],
            [51.13260246911827,71.4413783580778],
            [51.09479900021634,71.42747209442521],
        ];

        const polygonBoundsSmall = [
            [51.1259340577393,71.41286890981846],
            [51.12321370266267,71.43078415985701],
            [51.10932058988266,71.42574962267682],
            [51.11163207750067,71.410165605781]
        ];
        // const polygon = L.polygon(polygonBoundsSmall, {color: 'red'}).addTo(map);
        const polygon = L.polygon(polygonBounds, {color: 'red'}).addTo(map);

        // Фильтр: маркеры в рамках полигона. Перебор каждого маркера
        geojsonLayer.eachLayer(function(layer) {
            const marker = layer.toGeoJSON();
            const markerLatLng = L.latLng(marker.geometry.coordinates[1], marker.geometry.coordinates[0]);

            if (!polygon.getBounds().contains(markerLatLng)) {
                geojsonLayer.removeLayer(layer);
            }
        });

        // Фильтр: убираем маркеры в радиусе 30 метров. Перебор каждого маркера
        geojsonLayer.eachLayer(function(layer) {
            const marker = layer.toGeoJSON();
            const markerLatLng = L.latLng(marker.geometry.coordinates[1], marker.geometry.coordinates[0]);

            // Перебор остальных маркеров для сравнения расстояния
            geojsonLayer.eachLayer(function(otherLayer) {
                if (otherLayer !== layer) {
                    const otherMarker = otherLayer.toGeoJSON();
                    const otherMarkerLatLng = L.latLng(otherMarker.geometry.coordinates[1], otherMarker.geometry.coordinates[0]);

                    const distance = markerLatLng.distanceTo(otherMarkerLatLng);

                    if (distance < 30) {
                        geojsonLayer.removeLayer(otherLayer);
                    }
                }
            });
        });


        const filteredMarkersLngLat = [];
        let counterFilteredMarkersLngLat = 0;
        // Фильтр: убираем маркеры в радиусе 30 метров. Перебор каждого маркера
        geojsonLayer.eachLayer(function(layer) {
            const marker = layer.toGeoJSON();
            const markerLngLat = [marker.geometry.coordinates[0], marker.geometry.coordinates[1]];

            filteredMarkersLngLat.push(markerLngLat);
            counterFilteredMarkersLngLat++;
        });

        setJson({filteredMarkersLngLat, counterFilteredMarkersLngLat})
        setIsReadyToDownload(true);

        // Добавление слоя GeoJSON в слой с кластеризацией
        // markers.addLayer(geojsonLayer);
        // Add markers to the cluster group
        // const marker1 = L.marker([51.5, -0.09]).bindPopup('Marker 1');
        // const marker2 = L.marker([51.51, -0.1]).bindPopup('Marker 2');
        // const marker3 = L.marker([51.49, -0.08]).bindPopup('Marker 3');
        // markers.addLayers([marker1, marker2, marker3]);

        // Add the marker cluster group to the mapPage1
        map.addLayer(geojsonLayer);
        // map.addLayer(markers);
        // console.log("valueNames", valueNames);
        return () => {
            // Очистка карты при размонтировании компонента
            map.remove();
        };
    }, []);


    const handleSave = () => {
        if (isReadyToDownload) {
            const jsonData = JSON.stringify(json);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'data.json';
            link.click();
            URL.revokeObjectURL(url);
        }
    };

    return (<div style={{height: '100%'}}>
        <div ref={mapContainerRef} style={{ height: '100%' }}></div>

        <div className={styles['legends']} style={{position: 'absolute', bottom: 60, left: 20, width: 'fit-content', padding: 10, background: 'white', zIndex: 1111111}}>
            <div className={styles['legends__item']}><div className={styles['legends__milestone']}></div> milestone</div>
            <div className={styles['legends__item']}><div className={styles['legends__traffic_signals']}></div> traffic_signals</div>
            <div className={styles['legends__item']}><div className={styles['legends__motorway_junction']}></div> motorway_junction</div>
            <div className={styles['legends__item']}><div className={styles['legends__undefined']}></div>undefined</div>
            <div className={styles['legends__item']}><button type={'button'} disabled={!isReadyToDownload} onClick={handleSave}>Download json</button></div>
        </div>
    </div>)
}
