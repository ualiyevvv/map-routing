import React, {useEffect, useRef} from "react";
// import WE from 'webglearth2_npm_package';
import './webglearh'
export default function Earth() {
    const earthRef = useRef(null);

    useEffect(() => {
        const earth = new WE.map(earthRef.current);
        // Здесь вы можете настроить параметры карты, добавить слои и т.д.
        // Например:
        // earth.setView([0, 0], 2);
        earth.setView([0, 0], 2);

        // Получение геоданных для тепловой карты (пример данных)
        let heatData = [
            { lat: 40.7128, lon: -74.0060, intensity: 0.8 },
            { lat: 51.5074, lon: -0.1278, intensity: 0.6 },
            // Другие данные...
        ];

        // Создание слоя тепловой карты
        let heatLayer = WE.createHeatmapLayer('heatLayer', {
            radius: 15,
            gradient: {
                0.4: 'blue',
                0.6: 'yellow',
                0.8: 'red'
            },
            maxOpacity: 0.8,
            scaleRadius: true
        });

        // Привязка данных к слою тепловой карты
        heatLayer.setData(heatData);

        // Добавление слоя на карту
        earth.addLayer(heatLayer);

        // Отображение тепловой карты
        earth.update();


        // Очистка ресурсов при размонтировании компонента
        return () => {
            earth.destroy();
        };
    }, []);

    return (
        <div ref={earthRef} style={{ width: '100%', height: '400px' }}>

        </div>
    )

}