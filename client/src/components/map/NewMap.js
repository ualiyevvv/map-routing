import React, { useRef, useEffect, useState } from 'react';
import MapGL, {Marker} from "react-map-gl";

import styles from "./map.module.css"

import Button from "../../shared/ui/button/Button"
export default function MapModal({}){

    const accessToken = 'pk.eyJ1IjoieGNoamp2ZyIsImEiOiJjazd1YmwyOHowMXQwM29tb2dzaHF4c3o3In0.0TsgUa5BnaPGlx5mcGPVFg';
    const [viewState, setViewState] = useState({
        longitude: 71.426612,
        latitude: 51.126697,
        zoom: 11
    });

    useEffect(()=> {
        console.log(MapGL)
    })


    return (
        <div className="map">
            <MapGL
                {...viewState}
                onMove={event => setViewState(event.viewState)}
                style={{width: 800, height: 600}}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={accessToken}
            >
                <Marker longitude={71.426612} latitude={51.126697}> <div>You are here</div></Marker>
            </MapGL>
        </div>
    );
}