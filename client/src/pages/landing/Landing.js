import React, { Fragment, useEffect, useState } from 'react';

import Button from '../../shared/ui/button/Button'
import {useNavigate} from "react-router-dom";

import styles from './landing.module.css'
export default function Landing({}){

    const navigate = useNavigate();

    return (<div className={styles['landing']}>
        <div className={styles['landingButtons']}>
            <Button bottom={10} onClick={e => navigate('/mapPage1')}>1st Map</Button>
            <Button bottom={10} onClick={e => navigate('/mapPage2')}>2nd Map</Button>
            <Button bottom={10} onClick={e => navigate('/mapboxPage')}>Mapbox</Button>
        </div>
    </div>)
}