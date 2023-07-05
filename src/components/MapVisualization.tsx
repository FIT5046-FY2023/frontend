import React, { useEffect } from "react";
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
    useEffect(() => {
        loadModules(["esri/Map", "esri/views/MapView", "esri/layers/GraphicsLayer", "esri/Graphic"], {
            css: true,
        }).then(([Map, MapView, GraphicsLayer, Graphic]) => {
            const map = new Map({
                basemap: "topo-vector",
            });

            const view = new MapView({
                container: "map",
                map: map,
                zoom: 5,
                center: [133.7751, -25.2744], //Australia coordinates
            });

            const graphicsLayer = new GraphicsLayer();

            view.map.add(graphicsLayer);

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
        });
    }, [data, apiKey]);

    return <div id="map" style={{ height: "400px"}}></div>;
};

export default MapVisualization;