
import { Injectable } from '@angular/core';
import { LeafletMapComponent } from 'src/app/custom-components/maps/leaflet-map/leaflet-map.component';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class MapSidebarService {

  private showOver$ = new Subject<void>();
  private hideOver$ = new Subject<void>();

  public onShowOver(): Observable<void> {
    return this.showOver$;
  }

  public onHideOver(): Observable<void> {
    return this.hideOver$;
  }

  private _leafletMap: LeafletMapComponent;

  public set leafletMap(value: LeafletMapComponent) {
    this._leafletMap = value;
  }

  public get leafletMap() {
    return this._leafletMap;
  }

  public showMapOver() {
    this.showOver$.next();
  }

  public hideMapOver() {
    this.hideOver$.next();
  }

}