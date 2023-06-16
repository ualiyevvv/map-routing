import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from "./map.module.css"

import Button from "../../shared/ui/button/Button"
export default function MapModal({events}){

    mapboxgl.accessToken = 'pk.eyJ1IjoieGNoamp2ZyIsImEiOiJjazd1YmwyOHowMXQwM29tb2dzaHF4c3o3In0.0TsgUa5BnaPGlx5mcGPVFg';
    const accessToken = 'pk.eyJ1IjoieGNoamp2ZyIsImEiOiJjazd1YmwyOHowMXQwM29tb2dzaHF4c3o3In0.0TsgUa5BnaPGlx5mcGPVFg';

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(71.426612);
    const [lat, setLat] = useState(51.126697);
    const [zoom, setZoom] = useState(11);

    useEffect(() => {
        if (map.current) return; // initialize mapPage1 only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom,
            attributionControl: false,

        });


    });
;


    useEffect(() => {
        if (!map.current) return; // wait for mapPage1 to initialize

        map.current.on('load', function() {
            // Загрузите данные GeoJSON
            map.current.addSource('markers-source', {
                type: 'geojson',
                data: events, // Укажите путь к вашему файлу GeoJSON
                cluster: true,
                clusterRadius: 80,
            });

            // Добавьте маркеры на карту
            map.current.addLayer({
                id: 'markers-layer',
                type: 'symbol',
                source: 'markers-source',
                layout: {
                    'icon-image': 'aquarium' // При необходимости настройте значок маркера
                }
            });


        });

        map.current.on('click', 'markers-layer', function(e) {
            const marker = e.features[0];
            const markerInfo = marker.properties; // Получите свойства маркера

            // Обработайте информацию о маркере
            console.log(markerInfo);
        });


        map.current.on('mouseenter', 'markers-layer', () => {
            map.current.getCanvas().style.cursor = 'pointer'
        })
        map.current.on('mouseleave', 'markers-layer', () => {
            map.current.getCanvas().style.cursor = ''
        })

    })



    return (
        <div className={styles['mapPage1-container']}>

            <div ref={mapContainer} style={{width: '100%', height: '100%'}} />


            <div className="modal__btn">
                <div className="modal__title">Информация (логи и т.п)</div>
                <div className="modal__addrssblock">

                </div>
            </div>


        </div>
    );
}