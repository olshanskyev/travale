
import { Injectable } from '@angular/core';
import { LeafletMapComponent } from 'src/app/custom-components/maps/leaflet-map/leaflet-map.component';


@Injectable()
export class MapSidebarService {

  private _leafletMap: LeafletMapComponent;

  public set leafletMap(value: LeafletMapComponent) {
    this._leafletMap = value;
  }

  public get leafletMap() {
    return this._leafletMap;
  }

}