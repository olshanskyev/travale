
import { Injectable } from '@angular/core';
import { Route, RouteInitializer, RouteServiceData } from '../data/route.data';
import { TranslateService } from '@ngx-translate/core';
import { LatLng, LatLngBounds } from 'leaflet';
import { City, CityGeometry } from '../data/cities.data';
import { ObjectStoreSchema, NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';

@Injectable()
export class LocalRouteService implements RouteInitializer, RouteServiceData {

  private static storeName = 'Routes';

  public static store(): string {
    return this.storeName;
  }

  public static storeSchema(): ObjectStoreSchema[] {
    return [
      { name: 'title', keypath: 'title', options: { unique: false } },
      { name: 'subheading', keypath: 'subheading', options: { unique: false } },
      { name: 'generalInfo', keypath: 'generalInfo', options: { unique: false } },
      { name: 'places', keypath: 'places', options: { unique: false } },
      { name: 'routeType', keypath: 'routeType', options: { unique: false } },
      { name: 'cityLatitude', keypath: 'cityLatitude', options: { unique: false } },
      { name: 'cityLongitude', keypath: 'cityLongitude', options: { unique: false } },
      { name: 'cityName', keypath: 'cityName', options: { unique: false } },
      { name: 'country', keypath: 'country', options: { unique: false } },
      { name: 'image', keypath: 'image', options: { unique: false } },
      { name: 'color', keypath: 'color', options: { unique: false } },
      { name: 'boundingBox', keypath: 'boundingBox', options: { unique: false } },
    ];
  }

  public static storeConfig(): {
    keyPath: string | string[];
    autoIncrement: boolean;
    [key: string]: any} {
    return { keyPath: 'id', autoIncrement: false };
  }

  constructor(
    private translateService: TranslateService,
    private dbService: NgxIndexedDBService) {
  }


  initEmptyRoute(city: City, cityGeometry: CityGeometry): Route {
    let cityBoundingBox: LatLngBounds | undefined;
    if (cityGeometry.cityBoundingBox && cityGeometry.cityBoundingBox.length === 4) {
      const southWest = new LatLng(cityGeometry.cityBoundingBox[0], cityGeometry.cityBoundingBox[2]);
      const northEast = new LatLng(cityGeometry.cityBoundingBox[1], cityGeometry.cityBoundingBox[3]);
      cityBoundingBox = new LatLngBounds(southWest, northEast);
    }

    const route: Route =  {
      id: 'route_' + city.name + Math.random(),
      title: this.translateService.instant('createRoute.newRouteIn') + city.name,
      places: [],
      routeType: 'Main Attractions',
      cityLatitude: cityGeometry.lat,
      cityLongitude: cityGeometry.lon,
      cityName: city.name,
      country: city.country,
      color: 'rgb(52, 152, 219)',
      boundingBox: cityBoundingBox
    };
    return route;
  }

  getRouteById(id: string): Observable<Route> {
    return this.dbService.getByID<Route>(LocalRouteService.store(), id);
  }

  saveRoute(route: Route): Observable<Route> {
    return this.dbService.update<Route>(LocalRouteService.store(), route);
  }

  getAllRoutes(): Observable<Route[]> {
    return this.dbService.getAll(LocalRouteService.store());
  }

  deleteRoute(routeId: string): Observable<boolean> {
    return this.dbService.deleteByKey(LocalRouteService.store(), routeId);
  }

}