import { Component, OnInit, Output, EventEmitter, Inject, LOCALE_ID } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-control-geocoder';
import { icon, Marker } from 'leaflet';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OverpassapiService } from 'src/app/@core/service/overpassapi.service';
import { OverlaysBuilder } from './overlays-builder';
import { TranslateService } from '@ngx-translate/core';
import { IconsService } from 'src/app/@core/service/icons.service';
import { CustomLayersConfig } from './types';
import { CustomFeature } from 'src/app/@core/data/poi.data';
import { NominatimService } from 'src/app/@core/service/nominatim.service';
import { PopupBuilder } from './popup-builder';

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

@Component({
  selector: 'travale-leaflet-map-component',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss']
})
export class LeafletMapComponent implements OnInit {

  @Output() addToRoute: EventEmitter<CustomFeature> = new EventEmitter();

  map!: L.Map;
  zoom = 12;
  minZoom = 10;
  minZoomToShowFeatures = 15;
  selectPlaceZoom = 16;
  overlayBuilder: OverlaysBuilder;
  geoJsonInitialized: false;
  center: L.LatLng = L.latLng(40.640266, 22.939524);
  cityBoundingBox?: L.LatLngBounds;
  searchPlaceMarker: L.Marker;
  popupBuilder: PopupBuilder;

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
	minZoom: 0,
	maxZoom: 22,
	subdomains: 'abcd',
	accessToken: 'Hz6HhCOMt0OzO6GEVWAEr928fxXqY2D7EtwQEreNGpKhMA25PWXurZeNm9yZanNn'
});

  options = {
    layers: [
      this.baseLayerJawgSunny
    ],
    zoom: this.zoom,
    center: this.center,
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
  };

  constructor(
    private route: ActivatedRoute,
    private overpassapiService: OverpassapiService,
    private nominatimService: NominatimService,
    private translateService: TranslateService,
    private iconsService: IconsService,
    @Inject(LOCALE_ID) public locale: string
    ) {
    this.popupBuilder = new PopupBuilder((feature) => this.onAddToRouteClick(feature), iconsService, translateService);
    this.overlayBuilder = new OverlaysBuilder(
      this.overpassapiService,
      this.translateService,
      this.iconsService,
      this.popupBuilder,
      this.locale);
  }

  public setBoundingBox(bbox: number[]) {
    if (bbox && bbox.length === 4) {
      const southWest = new L.LatLng(bbox[0], bbox[2]);
      const northEast = new L.LatLng(bbox[1], bbox[3]);
      this.cityBoundingBox = new L.LatLngBounds(southWest, northEast);

    }
  }

  public setCityLatLong(lat: number, lon: number) {

    if (lat && lon) {
      this.center = L.latLng(lat, lon);
      if (this.map) {
        this.map.panTo(this.center);
      }
    }
  }
  paramsRead = false;
  ngOnInit(): void {
    this.paramsRead = false;
    this.route.queryParams.subscribe((params: Params) => {
      if (this.paramsRead) // workaround multiple events why?
        return;
      this.paramsRead = true;
      if (params['cityLatitude'] && params['cityLongitude']) {
        this.setCityLatLong(params['cityLatitude'], params['cityLongitude']);
      }
      if (params['cityBoundingBox']) {
        this.setBoundingBox(params['cityBoundingBox']);
      }
      },
    );
  }

  private onAddToRouteClick(feature: CustomFeature) {
    this.addToRoute.emit(feature);
  }

  onDragEnd = () => {
    if (this.zoom >= this.minZoomToShowFeatures)
      this.overlayBuilder.updatePoiLayers(this.map.getBounds(), this.customLayersControl.poiOverlays);
  };

  onZoomEnd = () => {
    if (this.zoom >= this.minZoomToShowFeatures)
      this.overlayBuilder.updatePoiLayers(this.map.getBounds(), this.customLayersControl.poiOverlays);
  };


  public invalidate() {
    this.map.invalidateSize();
  }

  onMapReady($event: L.Map) {
    this.map = $event;
    this.map.setMinZoom(this.minZoom);
    this.map.panTo(this.center);

    this.map.on('zoomend', this.onZoomEnd);
    this.map.on('dragend', this.onDragEnd);

    this.customLayersControl.poiOverlays = this.overlayBuilder.createEmptyPoiLayers();
    if (this.zoom >= this.minZoomToShowFeatures) {
      this.overlayBuilder.updatePoiLayers(this.map.getBounds(), this.customLayersControl.poiOverlays);
    }


  }

  async mapClicked($event: any) {
    const address = await this.nominatimService.getAddress($event.latlng.lat, $event.latlng.lng, this.map.getZoom());
  }

  public updateRouteLayer(routeId: string, routeTitle: string, features: CustomFeature[]) {
    if (!this.customLayersControl.routeOverlays)
      this.customLayersControl.routeOverlays = {};

    if (!this.customLayersControl.routeOverlays['select_all_routes']) {
      this.customLayersControl.routeOverlays['select_all_routes'] = this.overlayBuilder.createSelectAllLayer();
    }
    if (!this.customLayersControl.routeOverlays[routeId]) {
      this.customLayersControl.routeOverlays[routeId] = this.overlayBuilder.createEmptyRouteLayer(routeId, routeTitle);
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
      return;
    }
    this.layerToggled(layer, checked);

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

  private placeMarker(feature: CustomFeature, centeredOnMarker: boolean) {
    if (this.searchPlaceMarker) {
      this.searchPlaceMarker.removeFrom(this.map);
    }
    if (feature.geometry.type === 'Point') {
      const position = new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
      this.searchPlaceMarker = new L.Marker(position);
      this.searchPlaceMarker.bindPopup(this.popupBuilder.buildPopupDiv(feature), PopupBuilder.popUpOptions);
      this.searchPlaceMarker.addTo(this.map);
      if (centeredOnMarker)
        this.map.flyTo(position, this.selectPlaceZoom);
    }

  }
  onPlaceSelect(feature: CustomFeature)  {
    this.placeMarker(feature, true);


  }

  onMouseOverSearchPlace(feature: CustomFeature)  {
    this.placeMarker(feature, false);
  }

}
