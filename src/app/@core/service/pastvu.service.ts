import { Injectable } from '@angular/core';
import { NearbyPhotos } from '../data/photos.data';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { LatLng } from 'leaflet';
import { environment } from '../../../environments/environment';
import { ImageType } from '../data/route.data';

@Injectable()
export class PastvuService implements NearbyPhotos {

  constructor(private _http: HttpClient) { }

  private mapItemImageType(item: any): ImageType {
    return {
      src: environment.pastvuEndpoint + '_p/a/' + item.file,
      thumb: environment.pastvuEndpoint + '_p/h/' + item.file,
      caption: `${item.title}, ${item.year}`,
      latlng: new LatLng(item.geo[0], item.geo[1]),
      source: 'PASTVU'
    };
  }

  findNearbyPhotos(latlng: LatLng, distance: number, pageSize: number, pageNumber: number): Observable<ImageType[]> {
    const skip = (pageNumber - 1 ) * pageSize;
    const request = environment.pastvuEndpoint +
    `api2?method=photo.giveNearestPhotos&params={"geo":[${latlng.lat},${latlng.lng}],"distance":${distance},"limit":${pageSize}, "skip": ${skip}}`;
    return this._http.get<any>(request).pipe(
      map(res => res.result.photos.map((item: any) => this.mapItemImageType(item))));
  }
}
