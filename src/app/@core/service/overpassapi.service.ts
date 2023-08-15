
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CustomFeature, HistoricKeyType, PoiServiceData, TourismKeyType } from '../data/poi.data';
import { Observable, map } from 'rxjs';
import { LatLng, LatLngBounds } from 'leaflet';
import { PlacesServiceData } from '../data/places.data';

@Injectable()
export class OverpassapiService implements PoiServiceData, PlacesServiceData {

    private outputLimit = 50;
    private requestTimeout = 10;
    private aroundMeters = 15;
    constructor(private _http: HttpClient) {
    }

    private categoryValue(value: string | undefined, categoryName: string): string | undefined {
      return (value && value === 'yes')? categoryName: value;
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
            openingHours: item.tags?.opening_hours,
            phone: item.tags?.phone,
            wikipedia: item.tags?.wikipedia,
            wikidata: item.tags?.wikidata,
            categories: {
              'tourism': this.categoryValue(item.tags?.tourism, 'tourism'),
              'historic': this.categoryValue(item.tags?.historic, 'historic'),
              'amenity': this.categoryValue(item.tags?.amenity, 'amenity'),
              'building': this.categoryValue(item.tags?.building, 'building'),
              'leisure': this.categoryValue(item.tags?.leisure, 'leisure')
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
        const request = `[timeout:${this.requestTimeout}][out:json];(
          nwr[historic~"^(${historicKeyString})$"](${boxString});
          nwr[tourism~"^(${tourismKeyString})$"](${boxString});
        );out center;`;
        return this._http.post<any>(environment.overpassapiEndpoint, request).pipe(map(items => items.elements.map((item: any) => this.mapItemIntoGeoJsonFeature(item, locale))));

    }

    findPoisNearby(point: LatLng, locale: string): Observable<CustomFeature[]> {
      const requestNearby = `[timeout:${this.requestTimeout}][out:json];(
        node(around:${this.aroundMeters},${point.lat},${point.lng})(if:count_tags()>0);
        way(around:${this.aroundMeters},${point.lat},${point.lng})(if:count_tags()>0);
      );out center;
      is_in(${point.lat},${point.lng})->.a;way(pivot.a);out center;`;


      return this._http.post<any>(environment.overpassapiEndpoint, requestNearby).pipe(map(items => items.elements.map((item: any) => this.mapItemIntoGeoJsonFeature(item, locale))));
    }

    searchPlace(search: string, cityBounds: LatLngBounds, locale: string): Observable<CustomFeature[]> {
        const boxString = this.getBoxStringFromBounds(cityBounds);
        const request = `[out:json];nwr[~"^name.*$"~"${search}", i](${boxString});out center ${this.outputLimit};`;
        return this._http.post<any>(environment.overpassapiEndpoint, request).pipe(
          map(items => items.elements.map((item: any) => this.mapItemIntoGeoJsonFeature(item, locale))));
    }


}