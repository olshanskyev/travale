import { Observable, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';
import { CitiesServiceData, City, CityGeometry } from '../data/cities.data';


@Injectable()
export class CitiesService extends CitiesServiceData {

    constructor(private _http: HttpClient) {
        super();
    }

    private getCountryNameFromFullname(fullName: string): string {
        const lastCommaPosition = fullName.lastIndexOf(',');
        if (lastCommaPosition !== -1) {
            const countrySection = fullName.substring(lastCommaPosition + 1);
            const brIndex = countrySection.indexOf('(');

            if (brIndex !== -1)
                return countrySection.substring(0, brIndex).trim();
            else
                return countrySection.trim();
        } else {
            return fullName;
        }
    }

    private getCityNameFromFullName(fullName: string): string {
        return fullName.substring(0, fullName.indexOf(',')).trim();
    }

    override findCitiesByPattern(pattern: string): Observable<City[]> {
        const url = environment.citiesEndpoint + 'cities/?search=' + pattern + '&limit=5';
        return this._http.get<any>(url).pipe(map((item: any) => {
            return item._embedded['city:search-results'].map((itemMatch: any) => {
                return {
                    type: 'city',
                    selfLink: itemMatch._links['city:item'].href,
                    name: this.getCityNameFromFullName(itemMatch.matching_full_name),
                    fullName: itemMatch.matching_full_name,
                    country: this.getCountryNameFromFullname(itemMatch.matching_full_name)
                } as City;
            });
        }));
    }


    override getCityGeometry(city: City): Observable<CityGeometry> {

        return this._http.get<any>(city.selfLink).pipe(switchMap( (item: any) => {
            const lat = item.location.latlon.latitude;
            const lon = item.location.latlon.longitude;
            const _urlNominatim = environment.nominatimEndpoint + 'reverse?lat=' + lat + '&lon=' + lon + '&format=json&zoom=10';
            return this._http.get<any>(_urlNominatim).pipe(map( itemFromNom => {

                return {
                    cityBoundingBox: itemFromNom.boundingbox,
                    lat: itemFromNom.lat,
                    lon: itemFromNom.lon
                } as CityGeometry;
            }));
        }));
      }

}