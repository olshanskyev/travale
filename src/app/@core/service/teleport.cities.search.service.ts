import { Observable, of, catchError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';
import { CitiesSearch, City } from '../data/cities.data';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class TeleportCitiesSearchService implements CitiesSearch {

    constructor(private _http: HttpClient,
        private toastrService: NbToastrService,
        private translateService: TranslateService) {
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

    findCitiesByPattern(pattern: string): Observable<City[]> {
        const url = environment.citiesTeleportEndpoint + 'cities/?search=' + pattern + '&limit=10';
        return this._http.get<any>(url).pipe(
            catchError((error) => {
                if (error.error.status !== 404) { // no entries found. not an error
                    this.toastrService.danger(
                    this.translateService.instant('restServices.errors.citiesServiceNotAvailable'),
                    this.translateService.instant('common.error')
                    );
                }
                return of(undefined);
              }),
            map((item: any) => {
            return (!item)? []: item._embedded['city:search-results'].map((itemMatch: any) => {
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

}