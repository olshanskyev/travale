import { LatLng } from 'leaflet';
import { Observable } from 'rxjs';
import { ImageType } from './route.data';

export interface NearbyPhotos {
    /**
     *
     * @param latlng lat lon position
     * @param distance in meters
     * @param page > 0
     */
    findNearbyPhotos(latlng: LatLng, distance: number, pageSize: number, page: number): Observable<ImageType[]>;
}
