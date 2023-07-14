import { Injectable } from '@angular/core';
import { PlacesServiceData } from '../data/places.data';
import { Control, LatLngBounds } from 'leaflet';
import { Observable, map } from 'rxjs';
import { CustomFeature } from '../data/poi.data';
import { HttpClient } from '@angular/common/http';
import { AddressServiceData } from '../data/address.data';
import { Nominatim } from 'leaflet-control-geocoder/dist/geocoders';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class NominatimService implements PlacesServiceData, AddressServiceData {

  private geocoder: Nominatim;

  constructor(private _http: HttpClient) {
    this.geocoder = new (Control as any).Geocoder.Nominatim();
  }

  getAddress(lat: number, lng: number, zoom: number): Promise<any> {
    return new Promise((resolve, reject) => {

        this.geocoder.reverse(
            { lat, lng },
            zoom,
            (results: any) => {
              return results.length ? resolve(results[0]) : reject(null);
            }
        );
    });
  }

  private mapItemIntoGeoJsonFeature(item: any): CustomFeature {
    return {
      type: 'Feature',
      geometry: {
        'type': 'Point',
        'coordinates': [item.lon, item.lat]
      },
      id: item.osm_id,
      properties: {
        source: 'nominatim',
        osm_type: item.osm_type,
        name: item.display_name,
        categories: {
          [item.category]: item.type,
        }
      },
    };
  }

  private getBoxStringFromBounds(bounds: LatLngBounds): string {
    return bounds.getSouthWest().lng + ',' + bounds.getSouthWest().lat + ',' + bounds.getNorthEast().lng + ',' + bounds.getNorthEast().lat;
  }

  searchPlace(search: string, bounds: LatLngBounds, locale: string): Observable<CustomFeature[]> {
    const request = environment.nominatimEndpoint + 'search.php?q=' + search + '&polygon_geojson=1&viewbox=' + this.getBoxStringFromBounds(bounds)
    + '&bounded=1&format=jsonv2&accept-language=' + locale + ',en';
    return this._http.get<any>(request).pipe(map(items => items.map((item: any) => this.mapItemIntoGeoJsonFeature(item))));

  }
}
