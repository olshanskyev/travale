import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { PhotosByTitle } from '../data/photos.data';
import { ImageType } from '../data/route.data';
import { environment } from 'src/environments/environment';

@Injectable()
export class PixabayService implements PhotosByTitle {

  constructor(private _http: HttpClient) { }

  private mapItemImageType(item: any): ImageType {
    return {
      src: item.largeImageURL,
      thumb: item.previewURL,
      source: 'PIXABAY',
      originalPageUrl: item.pageURL,
    };
  }

  findPhotosByTitle(title: string, pageSize: number, pageNumber: number): Observable<ImageType[]> {
    const request = environment.pixabayEndpoint +
    `?key=${environment.pixabayKey}&q=${title}&image_type=photo&page=${pageNumber}&per_page=${pageSize}`;
    return this._http.get<any>(request).pipe(
      map(res => res.hits.map((item: any) => this.mapItemImageType(item))));
  }

}
