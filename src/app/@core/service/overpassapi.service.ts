
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CustomFeature, HistoricKeyType, PoiServiceData, TourismKeyType } from '../data/poi.data';
import { Observable, map } from 'rxjs';
import { LatLngBounds } from 'leaflet';
import { PlacesServiceData } from '../data/places.data';

@Injectable()
export class OverpassapiService implements PoiServiceData, PlacesServiceData {

    constructor(private _http: HttpClient) {
    }

    private mapItemIntoGeoJsonFeature(item: any, locale: string): CustomFeature {
        return {
          type: 'Feature',
          geometry: {
            'type': 'Point',
            'coordinates': (item.type === 'node')? [item.lon, item.lat]: [item.center.lon, item.center.lat]
          },
          id: item.id,
          properties: {
            source: 'overpass',
            osm_type: item.type,
            name: item.tags?.name,
            name_en: item.tags?.['name:en'],
            name_loc: item.tags?.[`name:${locale}`],
            website: item.tags?.website,
            categories: {
              'tourism': item.tags?.tourism,
              'historic': item.tags?.historic,
              'amenity': item.tags?.amenity,
            }
          },
        };
    }

    private getBoxStringFromBounds(bounds: LatLngBounds): string {
      return bounds.getSouthWest().lat + ',' + bounds.getSouthWest().lng + ',' + bounds.getNorthEast().lat + ',' + bounds.getNorthEast().lng;
    }

    findPois(bounds: LatLngBounds, tourismKey: TourismKeyType[], historicKey: HistoricKeyType[], locale: string): Observable<CustomFeature[]> {
        const boxString = this.getBoxStringFromBounds(bounds);
        const tourismKeyString = tourismKey.join('|');
        const historicKeyString = historicKey.join('|');
        const request = '[out:json];(nwr[historic~"^(' + historicKeyString + ')$"](' + boxString + '); nwr[tourism~"^(' + tourismKeyString + ')$"](' + boxString + '););out center;';
        return this._http.post<any>(environment.overpassapiEndpoint, request).pipe(map(items => items.elements.map((item: any) => this.mapItemIntoGeoJsonFeature(item, locale))));

    }

    searchPlace(search: string, bounds: LatLngBounds, locale: string): Observable<CustomFeature[]> {
        const boxString = this.getBoxStringFromBounds(bounds);
        const request = '[out:json];nwr[~"^name.*$"~"' + search + '", i](' + boxString + ');out center;';
        return this._http.post<any>(environment.overpassapiEndpoint, request).pipe(map(items => items.elements.map((item: any) => this.mapItemIntoGeoJsonFeature(item, locale))));
    }


}