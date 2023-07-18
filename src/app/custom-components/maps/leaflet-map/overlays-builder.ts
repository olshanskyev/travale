import { CustomFeature, HistoricKeyType, TourismKeyType } from 'src/app/@core/data/poi.data';
import { OverpassapiService } from 'src/app/@core/service/overpassapi.service';
import { LatLng, LatLngBounds, Layer, Marker, geoJSON, marker, GeoJSON } from 'leaflet';
import { Observable, map } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { IconsService } from 'src/app/@core/service/icons.service';
import { CustomGeoJSONLayersMap, CustomGeoJsonLayer, FeaturesMap, LayersFeaturesMap } from './types';

export class OverlaysBuilder {
    overpassapiService: OverpassapiService;
    translateService: TranslateService;
    iconsService: IconsService;
    poiLayersFeaturesMap: LayersFeaturesMap = {}; // has format [layerName][feature.id] => layer
    routesLayersFeaturesMap: LayersFeaturesMap = {}; // has format [layerName][feature.id] => layer

    tourismLayersList: TourismKeyType[] = ['artwork', 'attraction', 'museum', 'viewpoint', 'gallery', 'theme_park', 'information', 'zoo'];
    historicLayersList: HistoricKeyType[] = ['castle', 'castle_wall', 'church', 'city_gate', 'citywalls', 'memorial', 'monument', 'tower'];

    constructor(overpassapiService: OverpassapiService,
        translateService: TranslateService,
        iconsService: IconsService,
        private addToRouteCallback: (feature: CustomFeature)=> void,
        private locale: string) {
        this.overpassapiService = overpassapiService;

        this.translateService = translateService;
        this.iconsService = iconsService;


    }

    private findPois$ = (bbox: LatLngBounds): Observable<FeaturesMap> => {
        return this.overpassapiService.findPois(bbox, this.tourismLayersList, this.historicLayersList, this.locale).pipe(map((allFeatures: CustomFeature[]) => {
            const featuresMap: FeaturesMap = {};
            allFeatures.forEach(item => {
                let key = item.properties?.categories?.['historic'];
                if (key && this.historicLayersList.includes(key as HistoricKeyType)) {
                    if (!featuresMap[key]) {
                        featuresMap[key] = [];
                    }
                    featuresMap[key]?.push(item);
                }
                key = item.properties?.categories?.['tourism'];
                if (key && this.tourismLayersList.includes(key as TourismKeyType)) {
                    if (!featuresMap[key]) {
                        featuresMap[key] = [];
                    }
                    featuresMap[key]?.push(item);
                }

            });
            return featuresMap;
        }));
    };

    private getPoiMarkerByFeature(feature: CustomFeature, latlng: LatLng): Marker {
        const tourismKey = feature.properties?.categories?.['tourism'] as TourismKeyType;
        const historicKey = feature.properties?.categories?.['historic'] as HistoricKeyType;
        let resMarker: Marker;
        const historicIcon = this.iconsService.getDefaultIconByKey(historicKey);
        const tourismIcon = this.iconsService.getDefaultIconByKey(tourismKey);

        if (historicIcon) {
            resMarker = marker(latlng, {icon: historicIcon});
        } else if (tourismIcon) {
            resMarker = marker(latlng, {icon: tourismIcon});
        } else {
            resMarker = marker(latlng);
        }
        return resMarker;
    }

    private getRouteMarkerByFeature(feature: CustomFeature, latlng: LatLng): Marker {
        const icon = this.iconsService.getDefaultRouteIcon(feature.properties?.['route']?.order, 'white', 'rgb(63, 82, 227)');
        return marker(latlng, {icon: icon});
    }

    public createPopupDiv(feature: CustomFeature): any {
        const div = document.createElement('div');
        const historicString = (feature.properties?.categories?.['historic'])?
            '<h6>' + this.translateService.instant('leafletMap.' + feature.properties?.categories?.['historic']) + '</h6>' : '';
        const tourismString = (feature.properties?.categories?.['tourism'])?
            '<h6>' + this.translateService.instant('leafletMap.' + feature.properties?.categories?.['tourism']) + '</h6>' : '';
        const nameString = (feature.properties?.['name'])? `${feature.properties?.['name']}<br><br>`: '';
        div.innerHTML = historicString + tourismString + nameString;

        const button = document.createElement('button');
        button.setAttribute('class', 'btn btn-primary');
        button.setAttribute('style', 'width: 100%; padding: 3px');
        button.innerHTML = 'Add to Route';
        button.onclick = () => this.addToRouteCallback(feature);
        div.appendChild(button);
        return div;
    }

    private onEachPoiFeature(feature: CustomFeature, layer: Layer, layerKey: string) {
        if (!this.poiLayersFeaturesMap[layerKey]) {
            this.poiLayersFeaturesMap[layerKey] = {};
        }
        if (feature.id)
            this.poiLayersFeaturesMap[layerKey][feature.id] = layer;

        if (feature.properties) {
            layer.bindPopup(this.createPopupDiv(feature));
        }
        const tourismKey = feature.properties?.categories?.['tourism'] as HistoricKeyType;
        const historicKey = feature.properties?.categories?.['historic'] as TourismKeyType;

        layer.on('mouseover', (e: any) => {
            const historicIcon = this.iconsService.getMouseOverIconByKey(historicKey);
            const tourismIcon = this.iconsService.getMouseOverIconByKey(tourismKey);
            if (historicIcon)
                e.target.setIcon(historicIcon);
            else if (tourismIcon) {
                    e.target.setIcon(tourismIcon);
            }
            layer.openPopup();
        });
        layer.on('mouseout', (e: any) => {
            const historicIcon = this.iconsService.getDefaultIconByKey(historicKey);
            const tourismIcon = this.iconsService.getDefaultIconByKey(tourismKey);
            if (historicIcon) {
                e.target.setIcon(historicIcon);
            } else if (tourismIcon) {
                    e.target.setIcon(tourismIcon);
            }
        });
    }

    private onEachRouteFeature(feature: CustomFeature, layer: Layer, layerKey: string) {
        if (!this.routesLayersFeaturesMap[layerKey]) {
            this.routesLayersFeaturesMap[layerKey] = {};
        }
        if (feature.id)
            this.routesLayersFeaturesMap[layerKey][feature.id] = layer;

        if (feature.properties) {
            layer.bindPopup(this.createPopupDiv(feature));
        }
    }

    private getSelectAllLayerName(): string {
        const translatedSelectAll = this.translateService.instant('leafletMap.select_all');
        return '<b>' + translatedSelectAll + '</b>';
    }

    private getPoiLayerName(layerName: string) { // build layer name with img and translated name
        const imgStr = '<img src="' + this.iconsService.getIconUrlByKey(layerName) + '" width="24" height="24"/>'
        + this.translateService.instant('leafletMap.' + layerName);
        return imgStr;
    }

    public createSelectAllLayer(): CustomGeoJsonLayer {
        return {
            layer: geoJSON(undefined),
            displayName: this.getSelectAllLayerName()
        };

    }
    createEmptyPoiLayers(): CustomGeoJSONLayersMap {
        const layersMap: CustomGeoJSONLayersMap = {};
        layersMap['select_all_pois'] = this.createSelectAllLayer();
        this.tourismLayersList.forEach( layerName => {
            const translatedLayerName = this.getPoiLayerName(layerName);
            layersMap[layerName] = {
                layer: geoJSON(undefined, {
                    pointToLayer: (feature, latlng ) => this.getPoiMarkerByFeature(feature, latlng),
                    onEachFeature: (feature, layer) => this.onEachPoiFeature(feature, layer, layerName)
                    }),
                displayName: translatedLayerName
            };

        });
        this.historicLayersList.forEach( layerName => {
            const translatedLayerName = this.getPoiLayerName(layerName);

            layersMap[layerName] = {
                layer: geoJSON(undefined, {
                    pointToLayer: (feature, latlng ) => this.getPoiMarkerByFeature(feature, latlng),
                    onEachFeature: (feature, layer) => this.onEachPoiFeature(feature, layer, layerName)
                    }),
                displayName: translatedLayerName
            };
        });
        return layersMap;
    }

    clearPoiLayers(geoJsonLayers: CustomGeoJSONLayersMap) {
        Object.keys(this.poiLayersFeaturesMap).forEach(layerName => {
            Object.keys(this.poiLayersFeaturesMap[layerName]).forEach(itemIdDelete => {
                const feautureToDelete = this.poiLayersFeaturesMap[layerName][itemIdDelete];
                geoJsonLayers[layerName].layer.removeLayer(feautureToDelete);
                delete this.poiLayersFeaturesMap[layerName][itemIdDelete];
            });
        });
    }

    updatePoiLayers(bbox: LatLngBounds, geoJsonLayers: CustomGeoJSONLayersMap) {
        this.findPois$(bbox).subscribe(layersMap => {
            this.clearPoiLayers(geoJsonLayers);
            Object.keys(layersMap).forEach(layerName => {
                layersMap[layerName]?.forEach(itemFeature => {
                    geoJsonLayers[layerName].layer.addData(itemFeature);
                });
            });
        });

    }

    createEmptyRouteLayer(routeId: string, displayName: string): CustomGeoJsonLayer {
        return {
            layer: geoJSON(undefined, {
                pointToLayer: (feature, latlng ) => this.getRouteMarkerByFeature(feature, latlng),
                onEachFeature: (feature, layer) => this.onEachRouteFeature(feature, layer, routeId)
                }),
            displayName: displayName
        };
    }


    clearRouteLayer(routeLayer: GeoJSON, layerName: string) {
       if (!this.routesLayersFeaturesMap[layerName]) return;
        Object.keys(this.routesLayersFeaturesMap[layerName]).forEach(itemIdToDelete => {
            const feautureToDelete = this.routesLayersFeaturesMap[layerName][itemIdToDelete];
            routeLayer.removeLayer(feautureToDelete);
            delete this.routesLayersFeaturesMap[layerName][itemIdToDelete];
        });
    }

    updateRouteLayer(layer: GeoJSON, layerName: string, features: CustomFeature[]) {
        this.clearRouteLayer(layer, layerName);
        features.forEach(itemfeature => {
            layer.addData(itemfeature);
        });
    }

}