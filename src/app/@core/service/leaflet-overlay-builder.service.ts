import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { Layer, GeoJSON, LatLngBounds, LatLng, Marker, marker, geoJSON, Content } from 'leaflet';
import { Feature } from 'geojson';
import { AggregatedFeatureInfo, CustomFeature, HistoricKeyType, TourismKeyType } from '../data/poi.data';
import { OverpassapiService } from './overpassapi.service';
import { TranslateService } from '@ngx-translate/core';
import { IconsService } from './icons.service';
import { Observable, map, Subject } from 'rxjs';
import { NgElement, WithProperties } from '@angular/elements';
import { PoiOnMapPopupComponent } from 'src/app/custom-components/popups/poi-on-map-popup/poi-on-map-popup.component';
import { NearbyPoisOnMapPopupComponent } from 'src/app/custom-components/popups/nearby-pois-on-map-popup/nearby-pois-on-map-popup.component';

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

export type MAP_MODE = 'CREATE_ROUTE' | 'FOLLOW_ROUTE';


export declare class CustomLayersConfig {
    baseLayers: CustomLayersMap;
    poiOverlays: CustomGeoJSONLayersMap;
    routeOverlays: CustomGeoJSONLayersMap | undefined;
}

@Injectable()
export class LeafletOverlayBuilderService {

    poiLayersFeaturesMap: LayersFeaturesMap = {}; // has format [layerName][feature.id] => layer
    routesLayersFeaturesMap: LayersFeaturesMap = {}; // has format [layerName][feature.id] => layer

    tourismLayersList: TourismKeyType[] = ['artwork', 'attraction', 'museum', 'viewpoint', 'gallery', 'theme_park', 'information', 'zoo'];
    historicLayersList: HistoricKeyType[] = ['castle', 'castle_wall', 'church', 'city_gate', 'citywalls', 'memorial', 'monument', 'tower'];

    private addToRoute$ = new Subject<AggregatedFeatureInfo>;
    private routeItemClick$ = new Subject<CustomFeature>;
    private nearbyPoiSelect$ = new Subject<CustomFeature>;

    public static popupOptions = {
        maxWidth: 350
    };

    constructor(
        private overpassapiService: OverpassapiService,
        private translateService: TranslateService,
        private iconsService: IconsService,
        @Inject(LOCALE_ID) private locale: string) {
    }

    public onAddToRoute(): Observable<AggregatedFeatureInfo> {
        return this.addToRoute$;
    }

    public onRouteItemClick(): Observable<CustomFeature> {
        return this.routeItemClick$;
    }

    public onNearbyPoiSelect(): Observable<CustomFeature> {
        return this.nearbyPoiSelect$;
    }

    private findPois$ = (bbox: LatLngBounds, tourismKey: TourismKeyType[], historicKeys: HistoricKeyType[]): Observable<FeaturesMap> => {
        return this.overpassapiService.findPois(bbox, tourismKey, historicKeys, this.locale).pipe(map((allFeatures: CustomFeature[]) => {
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

    private getRouteMarkerByFeature(feature: CustomFeature, latlng: LatLng, routeColor: string): Marker {
        const icon = this.iconsService.getDefaultRouteIcon(feature.properties?.['route']?.order, 'white', routeColor);
        return marker(latlng, {icon: icon});
    }


    private enlargeIcon(e: any, feature: CustomFeature) {
        const tourismKey = feature.properties?.categories?.['tourism'] as HistoricKeyType;
        const historicKey = feature.properties?.categories?.['historic'] as TourismKeyType;
        const historicIcon = this.iconsService.getMouseOverIconByKey(historicKey);
        const tourismIcon = this.iconsService.getMouseOverIconByKey(tourismKey);
        if (historicIcon)
            e.target.setIcon(historicIcon);
        else if (tourismIcon) {
            e.target.setIcon(tourismIcon);
        }

    }

    public buildPoiPopup(feature: CustomFeature, mapMode: MAP_MODE): Content {
        const popupEl: NgElement & WithProperties<PoiOnMapPopupComponent> = document.createElement('poi-on-map-element') as any;
        // Listen to the close event
        popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
        popupEl.feature = feature;
        popupEl.preferredLanguage = this.locale;
        if (mapMode === 'CREATE_ROUTE')
            popupEl.addToRouteCallback = (res) => this.addToRoute$.next(res);
        else
            popupEl.addToRouteCallback = undefined;
        // Add to the DOM
        document.body.appendChild(popupEl);
        return popupEl;
    }

    public buildNearbyPoiPopup(features: CustomFeature[], position: LatLng, mapMode: MAP_MODE): Content {
        const popupEl: NgElement & WithProperties<NearbyPoisOnMapPopupComponent> = document.createElement('nearby-pois-on-map-element') as any;
        // Listen to the close event
        popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
        popupEl.features = features;
        popupEl.preferredLanguage = this.locale;
        popupEl.position = position;
        if (mapMode === 'CREATE_ROUTE')
            popupEl.addToRouteCallback = (res) => this.addToRoute$.next(res);
        else
            popupEl.addToRouteCallback = undefined;
        popupEl.nearbyPoiSelectedCallback = (res) => this.nearbyPoiSelect$.next(res);
        // Add to the DOM
        document.body.appendChild(popupEl);
        return popupEl;
    }



    private onEachPoiFeature(feature: CustomFeature, layer: Layer, layerKey: string, mapMode: MAP_MODE) {
        if (!this.poiLayersFeaturesMap[layerKey]) {
            this.poiLayersFeaturesMap[layerKey] = {};
        }
        if (feature.id)
            this.poiLayersFeaturesMap[layerKey][feature.id] = layer;

        layer.on('click', (e: any) => {
            this.enlargeIcon(e, feature);
            if (feature.properties) {
                layer.unbindPopup();
                layer.bindPopup(this.buildPoiPopup(feature, mapMode), LeafletOverlayBuilderService.popupOptions);
                layer.openPopup();
            }
        });
        layer.on('mouseover', (e: any) => {
            this.enlargeIcon(e, feature);
        });
        layer.on('mouseout', (e: any) => {
            const tourismKey = feature.properties?.categories?.['tourism'] as HistoricKeyType;
            const historicKey = feature.properties?.categories?.['historic'] as TourismKeyType;
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

        layer.on('click', () => this.routeItemClick$.next(feature));
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
    public createEmptyPoiLayers(mapMode: MAP_MODE): CustomGeoJSONLayersMap {
        const layersMap: CustomGeoJSONLayersMap = {};
        layersMap['select_all_pois'] = this.createSelectAllLayer();
        this.tourismLayersList.forEach( layerName => {
            const translatedLayerName = this.getPoiLayerName(layerName);
            layersMap[layerName] = {
                layer: geoJSON(undefined, {
                    pointToLayer: (feature, latlng ) => this.getPoiMarkerByFeature(feature, latlng),
                    onEachFeature: (feature, layer) => this.onEachPoiFeature(feature, layer, layerName, mapMode)
                    }),
                displayName: translatedLayerName
            };

        });
        this.historicLayersList.forEach( layerName => {
            const translatedLayerName = this.getPoiLayerName(layerName);

            layersMap[layerName] = {
                layer: geoJSON(undefined, {
                    pointToLayer: (feature, latlng ) => this.getPoiMarkerByFeature(feature, latlng),
                    onEachFeature: (feature, layer) => this.onEachPoiFeature(feature, layer, layerName, mapMode)
                    }),
                displayName: translatedLayerName
            };
        });
        return layersMap;
    }

    public clearPoiLayers(geoJsonLayers: CustomGeoJSONLayersMap) {
        Object.keys(this.poiLayersFeaturesMap).forEach(layerName => {
            Object.keys(this.poiLayersFeaturesMap[layerName]).forEach(itemIdDelete => {
                const feautureToDelete = this.poiLayersFeaturesMap[layerName][itemIdDelete];
                geoJsonLayers[layerName].layer.removeLayer(feautureToDelete);
                delete this.poiLayersFeaturesMap[layerName][itemIdDelete];
            });
        });
    }

    public updatePoiLayers(bbox: LatLngBounds, geoJsonLayers: CustomGeoJSONLayersMap) {

        const tourismKeys: TourismKeyType[] = [];
        const historicalKeys: HistoricKeyType[] = [];
        Object.keys(geoJsonLayers).forEach(key => {
            if (geoJsonLayers[key].checked) {
                if (this.tourismLayersList.includes(key as TourismKeyType))
                    tourismKeys.push(key as TourismKeyType);
                if (this.historicLayersList.includes(key as HistoricKeyType))
                    historicalKeys.push(key as HistoricKeyType);
            }

        });
        // update only if at least 1 layer selected
        if ((tourismKeys.length + historicalKeys.length) > 0) {
            this.findPois$(bbox, tourismKeys, historicalKeys).subscribe(layersMap => {
                this.clearPoiLayers(geoJsonLayers);
                Object.keys(layersMap).forEach(layerName => {
                    layersMap[layerName]?.forEach(itemFeature => {
                        geoJsonLayers[layerName].layer.addData(itemFeature);
                    });
                });
            });
        }


    }

    public createEmptyRouteLayer(routeId: string, displayName: string, routeColor: string): CustomGeoJsonLayer {
        return {
            layer: geoJSON(undefined, {
                pointToLayer: (feature, latlng ) => this.getRouteMarkerByFeature(feature, latlng, routeColor),
                onEachFeature: (feature, layer) => this.onEachRouteFeature(feature, layer, routeId)
                }),
            displayName: displayName
        };
    }

    public updateRouteLayerColor(layerToUpdate: GeoJSON, routeId: string, routeColor: string) {
        layerToUpdate.options.pointToLayer = (feature, latlng ) => this.getRouteMarkerByFeature(feature, latlng, routeColor);
        this.updateRouteLayer(layerToUpdate, routeId, layerToUpdate.getLayers().map((item: any) => item.feature as CustomFeature));
    }


    private clearRouteLayer(routeLayer: GeoJSON, layerName: string) {
       if (!this.routesLayersFeaturesMap[layerName]) return;
        Object.keys(this.routesLayersFeaturesMap[layerName]).forEach(itemIdToDelete => {
            const feautureToDelete = this.routesLayersFeaturesMap[layerName][itemIdToDelete];
            routeLayer.removeLayer(feautureToDelete);
            delete this.routesLayersFeaturesMap[layerName][itemIdToDelete];
        });
    }

    public updateRouteLayer(layer: GeoJSON, layerName: string, features: CustomFeature[]) {
        this.clearRouteLayer(layer, layerName);
        features.forEach(itemfeature => {
            layer.addData(itemfeature);
        });
    }
}
