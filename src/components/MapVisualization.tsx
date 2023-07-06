import React, { useLayoutEffect, useRef, useState } from "react";
import { loadModules } from "esri-loader";

interface MapVisualizationProps {
    data: {
      lat: number;
      lng: number;
      name: string;
    }[];
    apiKey: string;
  }

const MapVisualization: React.FC<MapVisualizationProps> = ({ data, apiKey }) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useLayoutEffect(() => {
        loadModules(["esri/Map", "esri/views/MapView", "esri/Graphic", "esri/layers/GraphicsLayer"],).then(([Map, MapView, Graphic, GraphicsLayer]) => {
            const map = new Map({
                basemap: "topo-vector",
            });

            const view = new MapView({
                container: mapRef.current!,
                map: map,
                zoom: 5,
                center: [133.7751, -25.2744], //Australia coordinates
            });

            const graphicsLayer = new GraphicsLayer();

            map.add(graphicsLayer);

            data.forEach((location) => {
                const { lat, lng, name } = location;

                const point = {
                    type: "point",
                    longitude: lng,
                    latitude: lat,
                };

                const markerSymbol = {
                    type: "simple-marker",
                    color: [226,119,40],
                };

                const pointGraphic = new Graphic({
                    geometry: point,
                    symbol: markerSymbol,
                    attributes: {
                        name: name,
                    },
                    popupTemplate: {
                        title: "{name}",
                    },
                });
                graphicsLayer.add(pointGraphic);
            });

            view.when(() => {
                setMapLoaded(true);
            });
        })
        .catch((error) => {
            console.error("Error loading the ArcGIS API for JavaScript:", error);
        });
    }, [data, apiKey]);

    return (
        <div style={{ height: "400px", position: "relative" }}>
            {!mapLoaded && <div>Loading map...</div>}
            <div ref={mapRef} style={{ display: mapLoaded ? "block" : "none", height: "100%" }} />
        </div>
    );
};

export default MapVisualization;