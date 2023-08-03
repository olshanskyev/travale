import { LatLngBounds } from 'leaflet';
import { City, CityGeometry } from './cities.data';
import { CustomFeature } from './poi.data';
import { Observable } from 'rxjs';
import { WikiPageRef } from './wiki.data';


export type ImageType = {
    src: string,
    thumb: string,
    caption?: string
  }

export interface RouteWithLocalId extends Route {
    localId: string;
}

function genUniqueId(): string {
    const dateStr = Date
      .now()
      .toString(36); // convert num to base 36 and stringify

    const randomStr = Math
      .random()
      .toString(36)
      .substring(2, 8); // start at index 2 to skip decimal point

    return `${dateStr}-${randomStr}`;
}

export default genUniqueId;

export interface Route {
    id: string; // route id
    title: string;
    subheading?: string;
    generalInfo?: string;
    language: string;
    version: string;
    places: Place[];
    cityLatitude: number;
    cityLongitude: number;
    cityName: string;
    country: string;
    image?: ImageType;
    color: string;
    boundingBox?: LatLngBounds;
    lastModifiedAt: number;
    creator: string;
}

export interface Place {
    id?: string | number;
    name: string;
    description?: string;
    images?: ImageType[];
    wikiPageRef?: WikiPageRef;
    geoJson: CustomFeature;
}

export interface RouteInitializer {
    initEmptyRoute(city: City, cityGeometry: CityGeometry): Route;
}

export interface RouteServiceData {
    getRouteById(id: string): Observable<Route>;
    addRoute(route: Route): Observable<Route>;
    updateRoute(id: string, route: Route): Observable<Route>
    getAllRoutes(): Observable<Route[]>;
    deleteRoute(routeId: string): Observable<boolean>;
}
