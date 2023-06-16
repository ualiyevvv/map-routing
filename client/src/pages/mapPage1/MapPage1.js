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
    const eventsInfo = {
        caption: 'Митап для QA инженеров от KoronaPay',
        description: `🌟 Meetup: "Визуализация данных при помощи WebGL"
⠀
🔍 Хочешь погрузиться в мир визуализации данных в вебе? Тогда этот митап именно для тебя! Присоединяйся к нам и узнай все об особенностях и применении WebGL.
⠀
🎙Эксперт в этой области – Роман Башарин поделится практическими примерами применения WebGL в проектах из сферы drug research.
⠀
Роман уже более 10 лет в IT, работал над десятками приложений в сферах от e-commerce до фондов благотворительности. Написал 5 собственных фреймворков, прежде чем достиг просветления и начал использовать готовые.
⠀
🏢 Quantori — ведущая международная IT-компания в области здравоохранения и медицинской биологии, создает интеллектуальные проекты, применяя инновационные технологии и научную экспертизу.
⠀
Не упусти шанс узнать о популярных способах визуализации данных в web, научиться работать с 3D и WebGL, а также погрузиться в мир Life Science разработки.
⠀
❗️ Регистрируйся на митап по ссылке https://forms.amocrm.ru/rrdwvxm`,
        start_date: '21 сентября',
        address: "Astana Hub (Астана, пр-т. Мангилик Ел. 55/8, павильон С4.6), зал Event hall",
        end_date: '31 октября',
        registration_deadline: '',
        cost: null
    }

    const geoPosition = [51.11170294584818,71.40717028568645]
    const mapContainerRef = useRef();
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
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

        // const valueNames = [];
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
                // Привязка всплывающей подсказки к маркеру
                layer.bindPopup(popupContent);
            }
        });

        // Перебор каждого маркера
        geojsonLayer.eachLayer(function(layer) {
            var marker = layer.toGeoJSON();
            var markerLatLng = L.latLng(marker.geometry.coordinates[1], marker.geometry.coordinates[0]);

            // Перебор остальных маркеров для сравнения расстояния
            geojsonLayer.eachLayer(function(otherLayer) {
                if (otherLayer !== layer) {
                    var otherMarker = otherLayer.toGeoJSON();
                    var otherMarkerLatLng = L.latLng(otherMarker.geometry.coordinates[1], otherMarker.geometry.coordinates[0]);

                    var distance = markerLatLng.distanceTo(otherMarkerLatLng);

                    if (distance < 30) {
                        geojsonLayer.removeLayer(otherLayer);
                    }
                }
            });
        });
        // Добавление слоя GeoJSON в слой с кластеризацией
        // markers.addLayer(geojsonLayer);
        // Add markers to the cluster group
        // const marker1 = L.marker([51.5, -0.09]).bindPopup('Marker 1');
        // const marker2 = L.marker([51.51, -0.1]).bindPopup('Marker 2');
        // const marker3 = L.marker([51.49, -0.08]).bindPopup('Marker 3');
        // markers.addLayers([marker1, marker2, marker3]);

        // Add the marker cluster group to the mapPage1
        map.addLayer(geojsonLayer);
        // mapPage1.addLayer(markers);
        // console.log("valueNames", valueNames);
        return () => {
            // Очистка карты при размонтировании компонента
            map.remove();
        };
    }, []);

    return (<div style={{height: '100%'}}>
        <div ref={mapContainerRef} style={{ height: '100%' }}></div>

        <div className={styles['legends']} style={{position: 'absolute', bottom: 60, left: 20, width: 'fit-content', padding: 10, background: 'white', zIndex: 1111111}}>
            <div className={styles['legends__item']}><div className={styles['legends__milestone']}></div> milestone</div>
            <div className={styles['legends__item']}><div className={styles['legends__traffic_signals']}></div> traffic_signals</div>
            <div className={styles['legends__item']}><div className={styles['legends__motorway_junction']}></div> motorway_junction</div>
            <div className={styles['legends__item']}><div className={styles['legends__undefined']}></div>undefined</div>
        </div>
    </div>)
}
