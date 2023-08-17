import { Injectable } from '@angular/core';
import { PlaceByOSMId, PlacesInsideBounds } from '../data/places.data';
import { LatLngBounds } from 'leaflet';
import { Observable, map } from 'rxjs';
import { CustomFeature } from '../data/poi.data';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable()
export class NominatimService implements PlacesInsideBounds, PlaceByOSMId {

  private outputLimit = 10;

  constructor(private _http: HttpClient) {
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
        website: item.extratags?.website,
        wikidata: item.extratags?.wikidata,
        wikipedia: item.extratags?.wikipedia,
        image: item.extratags?.image,
        address: {
          city: item.address?.city,
          country: item.address?.country,
          street: item.address?.road
        },
        categories: {
          [item.category]: item.type,
        }
      },
    };
  }

  private getBoxStringFromBounds(bounds: LatLngBounds): string {
    return bounds.getSouthWest().lng + ',' + bounds.getSouthWest().lat + ',' + bounds.getNorthEast().lng + ',' + bounds.getNorthEast().lat;
  }
  // there is q= <> near lat,lon search possibility, but near word should be translated to loc language
  searchPlace(search: string, cityBounds: LatLngBounds, locale: string): Observable<CustomFeature[]> {
    const request = environment.nominatimEndpoint +
    `search.php?q=${search}&polygon_geojson=1&viewbox=${this.getBoxStringFromBounds(cityBounds)}
    &bounded=1&format=jsonv2&limit=${this.outputLimit}&extratags=1&addressdetails=1&accept-language=${locale},en`;
    return this._http.get<any>(request).pipe(
      map(items => items.map((item: any) => this.mapItemIntoGeoJsonFeature(item))));
  }

  private mapGetPlaceIntoJsonFeature(item: any): CustomFeature {
    return {
      type: 'Feature',
      geometry: item.geometry,
      id: item.osm_id,
      properties: {
        source: 'nominatim',
        osm_type: item.osm_type,
        name: item.localname,
        website: item.extratags?.website,
        wikidata: item.extratags?.wikidata,
        wikipedia: item.extratags?.wikipedia,
        image: item.extratags?.image,
        categories: {
          [item.category]: item.type,
        }
      },
    };
  }
  getPlace(osmId: string | number, osmType: string, osmCategory: string, locale: string): Observable<CustomFeature> {
     const request = environment.nominatimEndpoint +
    `details.php?osmtype=${osmType}&osmid=${osmId}&class=${osmCategory}&format=json&accept-language=${locale},en`;
    return this._http.get<any>(request).pipe(
      map(item => this.mapGetPlaceIntoJsonFeature(item)));
  }
}
