import { Injectable } from '@angular/core';
import { PlacesFromPoint } from '../data/places.data';
import { LatLng } from 'leaflet';
import { Observable, map } from 'rxjs';
import { CustomFeature } from '../data/poi.data';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable()
export class PhotonService implements PlacesFromPoint {

  private outputLimit = 10;

  constructor(private _http: HttpClient) {
  }

  private mapItemIntoGeoJsonFeature(item: any): CustomFeature {
    return {
      type: item.type,
      geometry: item.geometry,
      id: item.properties.osm_id,
      properties: {
        source: 'photon',
        osm_type: item.properties.osm_type,
        name: item.properties.name,
        address: {
          city: item.properties.city,
          country: item.properties.country,
          street: item.properties.street
        },
        categories: {
          [item.properties.osm_key]: item.properties.osm_value,
        }
      },
    };
  }

  searchPlace(search: string, point: LatLng, locale: string): Observable<CustomFeature[]> {
    const lang =  (['en','de','fr'].includes(locale))? locale: 'en';
    const request = environment.photonEndpoint +
    `?q=${search}&lat=${point.lat}&lon=${point.lng}&limit=${this.outputLimit}&lang=${lang}`;
    return this._http.get<any>(request).pipe(
      map(res => res.features.map((item: any) => this.mapItemIntoGeoJsonFeature(item))));
  }
}
