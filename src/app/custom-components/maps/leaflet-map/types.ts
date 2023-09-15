import { Layer, GeoJSON, Rectangle } from 'leaflet';
import { Feature } from 'geojson';

export type CustomGeoJsonLayer = {
    layer: GeoJSON,
    displayName: string,
    checked?: boolean
}

export type CustomGeoJSONLayersMap = {
    [name: string]: CustomGeoJsonLayer
}

export type CustomLayersMap = {
    [name: string]: {
        layer: Layer,
        displayName: string,
    },
}

export type LayersFeaturesMap = {
    [name: string]: {
        [id: string]: Layer
    },
}

export type FeaturesMap = {
    [name: string]: Feature[];
}


export declare class CustomLayersConfig {
    baseLayers: CustomLayersMap;
    poiOverlays: CustomGeoJSONLayersMap;
    routeOverlays?: CustomGeoJSONLayersMap;
    cityBoundingBoxLayer?: Rectangle;
}