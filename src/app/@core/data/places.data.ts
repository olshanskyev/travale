import { Observable } from 'rxjs';
import { CustomFeature } from './poi.data';
import { LatLngBounds } from 'leaflet';

export interface PlacesServiceData {
    searchPlace(search: string, bounds: LatLngBounds, locale: string): Observable<CustomFeature[]>;
}
