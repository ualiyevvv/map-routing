import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import styles from "./map.module.css"

import Button from "../../shared/ui/button/Button"
export default function MapModal({}){

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
    const [data, setData] = useState(null);
    const [points, setPoints] = useState([])


    // done TO DO переписать этот фетч (вроде отправляются лишние запросы) и вроде вначале возвращает null, короче проверить событие mapPage1.on(dragend)
    const handleDrag = (abortController) => async () => {
        // get coordinates

        // fetch
        // const response = await fetch(
        //     `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latMap},${lngMap}&language=ru&key=AIzaSyA7HnzfPaZIgTHI07f6wqFc478xQ4RZEu8`,
        //     {signal: abortController.signal}
        // );

        // console log data
        // const resJson = await response.json();

        // set state
        // setData(resJson.results[0]);
    };

    function addMarkers(e) {
        console.log('click on the mapPage1', e.lngLat)

        const marker = new mapboxgl.Marker({ color: 'black', rotation: 45 })
            .setLngLat(e.lngLat)
            .addTo(map.current)

        const lng = e.lngLat.lng
        const lat = e.lngLat.lat

        setPoints(prevPoints => prevPoints.concat(`${lng},${lat}`))
    }

    function handleOnMapClick() {
        map.current.on('click', addMarkers);

    }

    function handleOffMapClick() {
        map.current.off('click', addMarkers)
        console.log('is adding', false)
        console.log(points)
    }

    async function getRoute(coordinates) {
        const coordinatesString = coordinates.join(';')
        const query = await fetch(
            `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinatesString}?geometries=geojson&access_token=${accessToken}`,
            { method: 'GET' }
        );
        const json = await query.json();
        console.log(json)
        const data = json.trips[0];
        console.log(data)
        const route = data.geometry.coordinates;
        const waypoints = json.waypoints;
        console.log(route)

        const geojson = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: route
            }
        };
        // if the route already exists on the mapPage1, we'll reset it using setData
        if (map.current.getSource('route')) {
            map.current.getSource('route').setData(geojson);
        }
        // otherwise, we'll make a new request
        else {
            map.current.addLayer({
                id: 'route',
                type: 'line',
                source: {
                    type: 'geojson',
                    data: geojson
                },
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#3887be',
                    'line-width': 5,
                    'line-opacity': 0.75
                }
            });
        }
    }

    async function getMatrix(coordinates) {
        const coordinatesString = coordinates.join(';')
        const query = await fetch(
            `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coordinatesString}?annotations=duration,distance&access_token=${accessToken}`,
            { method: 'GET' }
        );
        const json = await query.json();
        console.log(json)
    }

    async function handleCompute() {
        console.log('computing...')
        // построить маршрут
        await getRoute(points)

        // получить матрицу расстояний
        await getMatrix(points)
    }

    useEffect(() => {
        if (!map.current) return; // wait for mapPage1 to initialize


    })


    // useEffect(() => {
    //     if (!mapPage1.current) return; // wait for mapPage1 to initialize
    //
    //     const abortController = new AbortController();
    //
    //     // слушать события карты
    //     mapPage1.current.on('click', e => handleClick(e, abortController));
    //
    //     // отключить слушатель событий карты
    //     return () => {
    //         mapPage1.current.off('dragend', handleClick(abortController))
    //         abortController.abort();
    //     }
    // }, []);





    return (
        <div className={styles['mapPage1-container']}>

            <div ref={mapContainer} style={{width: '100%', height: '100%'}} />


            <div className="modal__btn">
                <div className="modal__title">Информация (логи и т.п)</div>
                <div className="modal__addrssblock">

                </div>
                <Button onClick={handleOnMapClick} bottom={10}>set points</Button>
                <Button onClick={handleOffMapClick} bottom={10}>save points</Button>
                <Button onClick={handleCompute}>compute</Button>
            </div>


        </div>
    );
}