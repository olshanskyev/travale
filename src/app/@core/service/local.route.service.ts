
import { Injectable } from '@angular/core';
import { Route, RouteInitializer, RouteServiceData, RouteWithLocalId } from '../data/route.data';
import genUniqueId from '../data/route.data';
import { TranslateService } from '@ngx-translate/core';
import { LatLng, LatLngBounds } from 'leaflet';
import { City, CityGeometry } from '../data/cities.data';
import { ObjectStoreSchema, NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, map } from 'rxjs';

@Injectable()
export class LocalRouteService implements RouteInitializer, RouteServiceData {

  private static storeName = 'Routes';

  public static store(): string {
    return this.storeName;
  }

  public static storeSchema(): ObjectStoreSchema[] {
    return [
    ];
  }

  public static storeConfig(): {
    keyPath: string | string[];
    autoIncrement: boolean;
    [key: string]: any} {
    return { keyPath: 'localId', autoIncrement: true };
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
      id: 'route_' + genUniqueId(),
      title: this.translateService.instant('createRoute.newRouteIn') + city.name,
      places: [],
      language: 'ru',
      version: '1.0',
      cityLatitude: cityGeometry.lat,
      cityLongitude: cityGeometry.lon,
      cityName: city.name,
      country: city.country,
      color: 'rgb(52, 152, 219)',
      boundingBox: cityBoundingBox,
      boundingBoxManuallySet: false,
      lastModifiedAt: Date.now(),
      creator: 'not_set'
    };
    return route;
  }

  getRouteById(localId: string): Observable<Route> { // how to synchronize/desynchronize
    return this.dbService.getByID<Route>(LocalRouteService.store(), localId).pipe(map(item => {
      item.boundingBox = new LatLngBounds((item.boundingBox as any)._southWest, (item.boundingBox as any)._northEast);
      return item;
    }));
  }

  addRoute(route: Route): Observable<RouteWithLocalId> {
    const routeWithLocalId: RouteWithLocalId = {
      localId: genUniqueId(),
      ...route
    };
    routeWithLocalId.lastModifiedAt = Date.now();
    return this.dbService.add<RouteWithLocalId>(LocalRouteService.store(), routeWithLocalId);
  }

  updateRoute(localId: string, route: Route): Observable<RouteWithLocalId> {
    const routeWithLocalId: RouteWithLocalId = {
      localId: localId,
      ...route
    };
    routeWithLocalId.lastModifiedAt = Date.now();
    return this.dbService.update<RouteWithLocalId>(LocalRouteService.store(), routeWithLocalId);
  }

  getAllRoutes(): Observable<RouteWithLocalId[]> {
    return this.dbService.getAll(LocalRouteService.store());
  }

  deleteRoute(routeId: string): Observable<boolean> {
    return this.dbService.deleteByKey(LocalRouteService.store(), routeId);
  }

}