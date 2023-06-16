import React, {useEffect, useState} from 'react';

import {Link, Routes, Route, Navigate, useSearchParams, useNavigate, useLocation} from "react-router-dom";
import Landing from "./pages/landing/Landing";
import MapPage1 from "./pages/mapPage1/MapPage1";
import MapPage2 from "./pages/mapPage2/MapPage2";
import MapboxPage from "./pages/mapboxPage/MapboxPage";

export default function Router(){

	return (
		<Routes>
			<Route path={'/'} element={<Landing />}/>
			<Route path={'/mapPage1'} element={<MapPage1 />}/>
			<Route path={'/mapPage2'} element={<MapPage2 />}/>
			<Route path={'/mapboxPage'} element={<MapboxPage />}/>
		</Routes>
	);
}

/*
▄───▄
█▀█▀█
█▄█▄█
─███──▄▄
─████▐█─█
─████───█
─▀▀▀▀▀▀▀
*/