import React, { Fragment } from 'react';

import Box from '../../shared/ui/box/Box'
import Map from "../../components/map/Map";
export default function MapboxPage({}){

    return (<div style={{
        height: '80%',
        width: '100%',
    }}>
        <Map />
    </div>)
}