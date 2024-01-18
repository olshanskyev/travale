import { Observable, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';
import { CitiesGeometry, CitiesSearch, City, CityGeometry } from '../data/cities.data';
import { TeleportCitiesSearchService } from './teleport.cities.search.service';
import { QweatherCitiesSearchService } from './qweather.cities.search.service';


@Injectable()
export class CitiesService implements CitiesGeometry, CitiesSearch {

    private useTeleportService = false;

    constructor(private _http: HttpClient,
        private teleportCitiesSearch: TeleportCitiesSearchService,
        private qWeatherCitiesSearch: QweatherCitiesSearchService) {
    }

    findCitiesByPattern(pattern: string, locale?: string): Observable<City[]> {
       return (this.useTeleportService) ?
        this.teleportCitiesSearch.findCitiesByPattern(pattern):
        this.qWeatherCitiesSearch.findCitiesByPattern(pattern, locale);
    }

    private getGeometryFromNominativ(lat: number, lon: number): Observable<CityGeometry> {
        const _urlNominatim = environment.nominatimEndpoint + 'reverse?lat=' + lat + '&lon=' + lon + '&format=json&zoom=10';
        return this._http.get<any>(_urlNominatim).pipe(map( itemFromNom => {

            return {
                cityBoundingBox: itemFromNom.boundingbox,
                lat: itemFromNom.lat,
                lon: itemFromNom.lon
            } as CityGeometry;
        }));
    }

    getCityGeometry(city: City): Observable<CityGeometry> {

        if (this.useTeleportService && city.selfLink)
            return this._http.get<any>(city.selfLink).pipe(switchMap( (item: any) => {
                return this.getGeometryFromNominativ(item.location.latlon.latitude, item.location.latlon.longitude);
            }));
        else if (!this.useTeleportService && city.lat && city.lon) {
            return this.getGeometryFromNominativ(city.lat, city.lon);
        } else {
            throw new Error('Unexpected behavior');
        }
      }

}