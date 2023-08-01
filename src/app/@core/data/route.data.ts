import { LatLngBounds } from 'leaflet';
import { City, CityGeometry } from './cities.data';
import { CustomFeature } from './poi.data';
import { Observable } from 'rxjs';

export type ImageType = {
    src: string,
    thumb: string,
    caption?: string
  }

export type RouteType = 'Historical' | 'Bar Walk' | 'Main Attractions' | 'Other';

export interface Route {
    id: string;
    title: string;
    subheading?: string;
    generalInfo?: string;
    places: Place[];
    routeType: RouteType;
    cityLatitude: number;
    cityLongitude: number;
    cityName: string;
    country: string;
    image?: ImageType;
    color: string;
    boundingBox?: LatLngBounds;
}

export interface Place {
    id?: string | number;
    name: string;
    description?: string;
    images?: ImageType[];
    geoJson: CustomFeature;
}

export interface RouteInitializer {
    initEmptyRoute(city: City, cityGeometry: CityGeometry): Route;
}

export interface RouteServiceData {
    getRouteById(id: string): Observable<Route>;
    saveRoute(route: Route): Observable<Route>;
    getAllRoutes(): Observable<Route[]>;
    deleteRoute(routeId: string): Observable<boolean>;
}
