import { LatLng } from 'leaflet';
import { Observable } from 'rxjs';
import { ImageType } from './route.data';

export interface NearbyPhotos {
    findNearbyPhotos(latlng: LatLng, distance: number): Observable<ImageType[]>;
}
