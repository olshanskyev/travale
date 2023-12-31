import { Component,Inject, LOCALE_ID, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';
import { CustomLayersConfig } from './types';
import { CustomFeature } from 'src/app/@core/data/poi.data';
import { LeafletOverlayBuilderService, MAP_MODE } from 'src/app/@core/service/leaflet-overlay-builder.service';
import { Place } from 'src/app/@core/data/route.data';
import 'leaflet.locatecontrol';
import 'leaflet-editable';
import 'leaflet.path.drag';
import { TranslateService } from '@ngx-translate/core';
import { OverpassapiService } from 'src/app/@core/service/overpassapi.service';
import { Subject, takeUntil } from 'rxjs';
import { IconsService } from 'src/app/@core/service/icons.service';
// workaround marker-shadow not found
const iconRetinaUrl = 'assets/img/markers/marker-icon-2x.png';
const iconUrl = 'assets/img/markers/marker-icon.png';
const shadowUrl = 'assets/img/markers/marker-shadow.png';
const iconDefault = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
Marker.prototype.options.icon = iconDefault;
// workaround marker-shadow not found
export type Location = {
  latlng: L.LatLng;
  accuracy: number;
}

@Component({
  selector: 'travale-leaflet-map-component',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss']
})
export class LeafletMapComponent implements OnInit, OnDestroy, OnChanges {

  @Input() mode: MAP_MODE = 'FOLLOW_ROUTE';
  @Output() locationChange: EventEmitter<{previousLocation?: Location, currentLocation: Location}> = new EventEmitter();
  @Output() cityBoundingBoxChange: EventEmitter<L.LatLngBounds> = new EventEmitter();

  map!: L.Map;
  private destroy$: Subject<void> = new Subject<void>();
  private previousLocation?: Location;

  zoom = 12;
  minZoom = 7;
  selectPlaceZoom = 16;
  geoJsonInitialized: false;
  cityBoundingBox?: L.LatLngBounds;
  searchPlaceMarker: L.Marker;
  nearbyPoisMarker: L.Marker;
  nearbyItemMarker: L.Marker;
  acceptBbMarker: L.Marker;
  popupPlace: Place;
  showBB = false;

  baseLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  baseLayerHotosm = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
  });

  baseLayerAlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  });

  baseLayerJawgSunny = L.tileLayer('https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=Hz6HhCOMt0OzO6GEVWAEr928fxXqY2D7EtwQEreNGpKhMA25PWXurZeNm9yZanNn', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	maxZoom: 22,
	subdomains: 'abcd',
	accessToken: 'Hz6HhCOMt0OzO6GEVWAEr928fxXqY2D7EtwQEreNGpKhMA25PWXurZeNm9yZanNn'
});

  options = {
    layers: [
      this.baseLayerJawgSunny
    ],
    zoom: this.zoom,
    editable: true,
  };

  locateOptions = {
    flyTo: false,
    position: 'topleft',
    showPopup: false,
    keepCurrentZoomLevel: true,
    strings: {
      title: this.translateService.instant('location.showMeWhereIam'),
    },
    locateOptions: {
      enableHighAccuracy: true
    }
  };

  customLayersControl: CustomLayersConfig = {
    baseLayers: {
      'MapDefaultStyle': {
        layer: this.baseLayer,
        displayName: 'Map Default Style'
      }
    },
    poiOverlays: {},
    routeOverlays: undefined,
    cityBoundingBoxLayer: undefined
  };

  constructor(
    private overpassService: OverpassapiService,
    @Inject(LOCALE_ID) public locale: string,
    private overlayBuilder: LeafletOverlayBuilderService,
    private translateService: TranslateService,
    private iconService: IconsService,
    ) {}


  ngOnInit(): void {
    this.overlayBuilder.onNearbyPoiSelect().pipe(takeUntil(this.destroy$)).subscribe(res => this.placeNearbyItemMarker(res));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showBB'] && changes['showBB'].currentValue) {
      this.showBB = changes['showBB'].currentValue;
    }
  }

  public initGeometry(latCenter: number, lonCenter: number, showBoundingBox: boolean, bbox?: L.LatLngBounds) {
    if (bbox) {
      this.cityBoundingBox = bbox;
    }
    this.showBB = showBoundingBox;
    this.map.panTo(L.latLng(latCenter, lonCenter));
    this.showBondingBoxToggled();
  }

  public invalidate() {
    this.map.invalidateSize({
      debounceMoveend: true,
      pan: true
    });
  }

  locationFound(event: any) {
    // check if location changed
    if (!this.previousLocation ||
      this.previousLocation.latlng.lat !== event.latitude ||
      this.previousLocation.latlng.lng !== event.longitude ||
      this.previousLocation.accuracy !== event.accuracy) { //ToDo reload pois?
        const currentLocation = {
          latlng: event.latlng,
          accuracy: event.accuracy
        };
        this.locationChange.emit({
          previousLocation: this.previousLocation,
          currentLocation: currentLocation
        });
        this.previousLocation = currentLocation;
      }
  }

  onMapReady($event: L.Map) {
    this.map = $event;
    this.map.setMinZoom(this.minZoom);

    this.map.on('zoomend', () => this.overlayBuilder.updatePoiLayers(this.map.getBounds(), this.customLayersControl.poiOverlays, this.zoom));
    this.map.on('dragend', () => this.overlayBuilder.updatePoiLayers(this.map.getBounds(), this.customLayersControl.poiOverlays, this.zoom));

    this.customLayersControl.poiOverlays = this.overlayBuilder.createEmptyPoiLayers(this.mode);

    //geolocation
    L.control.locate(this.locateOptions).addTo(this.map);
    this.map.on('locationfound', (event: any) => this.locationFound(event));

  }

  private placeNearbyItemMarker(feature: CustomFeature) {
    if (this.nearbyItemMarker) {
      this.nearbyItemMarker.removeFrom(this.map);
    }
    if (feature.geometry.type === 'Point') {
      const position = new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
      this.nearbyItemMarker = new L.Marker(position, {interactive: false});
      this.nearbyItemMarker.addTo(this.map);
    }

  }

  private placeNearbyPoisMarker(features: CustomFeature[], position: L.LatLng) {
    if (this.nearbyPoisMarker) {
      this.nearbyPoisMarker.removeFrom(this.map);
    }
    this.nearbyPoisMarker = new L.Marker(position, {
      icon: icon({
        iconUrl: 'assets/map_icons/placeholder-question-mark-svgrepo-com.svg',
        shadowUrl: 'assets/img/markers/marker-shadow.png',
        iconSize: [42,42],
        iconAnchor: [21, 42],
        shadowSize: [41,41],
        shadowAnchor: [12, 42],
        popupAnchor:  [0, -48],
        className: 'icon-class',
      })
    });
    this.nearbyPoisMarker.addTo(this.map);
    this.nearbyPoisMarker.bindPopup(this.overlayBuilder.buildNearbyPoiPopup(features, position, this.mode),
    {
      ...LeafletOverlayBuilderService.popupOptions,
      className: 'nearbyPopupStyle'
    }).openPopup();

    this.nearbyPoisMarker.getPopup()?.on('remove', () => {
      this.nearbyPoisMarker.removeFrom(this.map);
      if (this.nearbyItemMarker)
        this.nearbyItemMarker.removeFrom(this.map);
    });

  }

  onMapClicked(event: any) {
    this.overpassService.findPoisNearby(event.latlng as L.LatLng, this.locale).subscribe(features => { //ToDo add spinner
      this.placeNearbyPoisMarker(features, event.latlng as L.LatLng);
    }); // todo add error handling
  }

  public updateRouteLayer(routeId: string, routeTitle: string, routeColor: string, features: CustomFeature[]) {
    if (!this.customLayersControl.routeOverlays)
      this.customLayersControl.routeOverlays = {};

    if (!this.customLayersControl.routeOverlays['select_all_routes']) {
      this.customLayersControl.routeOverlays['select_all_routes'] = this.overlayBuilder.createSelectAllLayer();
    }
    if (!this.customLayersControl.routeOverlays[routeId]) {
      this.customLayersControl.routeOverlays[routeId] = this.overlayBuilder.createEmptyRouteLayer(routeId, routeTitle, routeColor);
      this.customLayersControl.routeOverlays[routeId].checked = true;
      this.routeLayerToggled(this.customLayersControl.routeOverlays[routeId].layer, true, routeId);
    }

    this.overlayBuilder.updateRouteLayer(this.customLayersControl.routeOverlays[routeId].layer, routeId, features);
  }

  public updateRouteLayerName(routeId: string, routeTitle: string) {
    if (!this.customLayersControl.routeOverlays)
      return;
    if (!this.customLayersControl.routeOverlays[routeId])
      return;

    this.customLayersControl.routeOverlays[routeId].displayName = routeTitle;
  }

  public updateRouteColor(routeId: string, routeColor: string) {
    if (!this.customLayersControl.routeOverlays)
      return;
    if (!this.customLayersControl.routeOverlays[routeId])
      return;
    this.overlayBuilder.updateRouteLayerColor(this.customLayersControl.routeOverlays[routeId].layer, routeId, routeColor);
  }

  public keepOriginalOrder = (a: any) => a.key;

  private layerToggled(layer: L.Layer, checked: boolean) {
    (checked)? this.map.addLayer(layer): this.map.removeLayer(layer);
  }

  poiLayerToggled(layer: L.Layer, checked: boolean, layerName: string) {

    if (layerName === 'select_all_pois') {
      Object.keys(this.customLayersControl.poiOverlays).forEach(itemLayerName => {
        const itemLayer = this.customLayersControl.poiOverlays[itemLayerName]?.layer;
        if (checked && !this.map.hasLayer(itemLayer)) {
          this.map.addLayer(itemLayer);
        }
        if (!checked && this.map.hasLayer(itemLayer)) {
          this.map.removeLayer(itemLayer);
        }

        this.customLayersControl.poiOverlays[itemLayerName].checked = checked;
      });
    } else {
      this.customLayersControl.poiOverlays[layerName].checked = checked;
      this.layerToggled(layer, checked);
    }
    if (checked)
      this.overlayBuilder.updatePoiLayers(this.map.getBounds(), this.customLayersControl.poiOverlays, this.zoom);

  }

  routeLayerToggled(layer: L.Layer, checked: boolean, layerName: string) {
    if (layerName === 'select_all_routes') {

      if (this.customLayersControl.routeOverlays) {
        const overlays = this.customLayersControl.routeOverlays;
        Object.keys(this.customLayersControl.routeOverlays).forEach(itemLayerName => {
          const itemLayer = overlays[itemLayerName].layer;
          if (checked && !this.map.hasLayer(itemLayer)) {
            this.map.addLayer(itemLayer);
          }
          if (!checked && this.map.hasLayer(itemLayer)) {
            this.map.removeLayer(itemLayer);
          }

          overlays[itemLayerName].checked = checked;
        });
      }
      return;

    }
    this.layerToggled(layer, checked);
  }

  private hideAcceptBbMarker() {
    if (this.acceptBbMarker)
      this.acceptBbMarker.removeFrom(this.map);
  }

  private setAcceptBbMarker() {
    const position = this.cityBoundingBox?.getCenter();
    if (position) {
      if (!this.acceptBbMarker) {
        this.acceptBbMarker = new L.Marker(position, {
          icon: this.iconService.craeteBoundingBoxIcon()
        });
        this.acceptBbMarker.addTo(this.map);
        this.acceptBbMarker.on('click', () => {
          this.showBB = false;
          this.removeBbLayerFromMap();
          this.cityBoundingBoxChange.emit(this.cityBoundingBox);
        });
      } else { // change position
        this.acceptBbMarker.setLatLng(position);
        if (!this.map.hasLayer(this.acceptBbMarker)) {
          this.acceptBbMarker.addTo(this.map);
        }

      }
    }
  }

  private addBbLayerToMap() {
    if (this.cityBoundingBox) {
      this.customLayersControl.cityBoundingBoxLayer = L.rectangle([
        [this.cityBoundingBox.getNorthEast().lat, this.cityBoundingBox.getNorthEast().lng],
        [this.cityBoundingBox.getSouthWest().lat, this.cityBoundingBox.getSouthWest().lng]
      ]);
      this.map.addLayer(this.customLayersControl.cityBoundingBoxLayer);
      if (this.mode === 'CREATE_ROUTE') {
        this.customLayersControl.cityBoundingBoxLayer.enableEdit();
        this.setAcceptBbMarker();
        this.customLayersControl.cityBoundingBoxLayer.on('editable:dragend editable:editing', () => {
          this.cityBoundingBox = this.customLayersControl.cityBoundingBoxLayer?.getBounds();
          this.cityBoundingBoxChange.emit(this.cityBoundingBox);
          this.setAcceptBbMarker();
        });

        this.customLayersControl.cityBoundingBoxLayer.on('editable:dragstart', () => {
          this.hideAcceptBbMarker();
        });

      }

    }

  }

  private removeBbLayerFromMap() {
    if (this.customLayersControl.cityBoundingBoxLayer) {
      this.map.removeLayer(this.customLayersControl.cityBoundingBoxLayer);
      this.hideAcceptBbMarker();
    }

  }

  showBondingBoxToggled() {
      (this.showBB)? this.addBbLayerToMap() : this.removeBbLayerFromMap();
  }

  private placeSearchMarker(feature: CustomFeature, centeredOnMarker: boolean) {
    if (this.searchPlaceMarker) {
      this.searchPlaceMarker.removeFrom(this.map);
    }
    if (feature.geometry.type === 'Point') {
      const position = new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
      this.searchPlaceMarker = new L.Marker(position);
      this.searchPlaceMarker.on('click', () => {
        if (feature.properties) {
          this.searchPlaceMarker.unbindPopup();
          this.searchPlaceMarker.bindPopup(this.overlayBuilder.buildPoiPopup(feature, this.mode), LeafletOverlayBuilderService.popupOptions);
          this.searchPlaceMarker.openPopup();
        }
      });
      this.searchPlaceMarker.addTo(this.map);
      if (centeredOnMarker)
        this.map.flyTo(position, this.selectPlaceZoom);
    }

  }
  onPlaceSelect(feature: CustomFeature)  {
    this.placeSearchMarker(feature, true);
  }

  onMouseOverSearchPlace(feature: CustomFeature)  {
    this.placeSearchMarker(feature, false);
  }

  onSearchPlaceCleared() {
    if (this.searchPlaceMarker) {
      this.searchPlaceMarker.removeFrom(this.map);
    }
  }

}
