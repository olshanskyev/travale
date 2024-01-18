import { Observable, of, catchError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';
import { CitiesSearch, City } from '../data/cities.data';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class QweatherCitiesSearchService implements CitiesSearch {

    private apiKey = '719622e018634c71b4ec313e851a494a';
    constructor(private _http: HttpClient,
        private toastrService: NbToastrService,
        private translateService: TranslateService) {
    }

    findCitiesByPattern(pattern: string, locale?: string): Observable<City[]> {
        const url = environment.citiesQWeatherEndpoint + `city/lookup?location=${pattern}&lang=${locale}&key=${this.apiKey}`;
        return this._http.get<any>(url).pipe(
            catchError(() => {
                this.toastrService.danger(
                this.translateService.instant('restServices.errors.citiesServiceNotAvailable'),
                this.translateService.instant('common.error')
                );
                return of(undefined);
              }),
            map((item: any) => {
                if (item.location) {
                    item.location.sort((a: any, b: any) => {
                        return (a.rank > b.rank)? 1: -1;
                    });
                }
                return (!item || item.code === '404')? []:
                    item.location.map((itemMatch: any) => {
                        return {
                            type: 'city',
                            name: itemMatch.name,
                            fullName: itemMatch.name + ', ' + itemMatch.adm1 + ', ' + itemMatch.country,
                            country: itemMatch.country,
                            lat: itemMatch.lat,
                            lon: itemMatch.lon
                        } as City;
            });
        }));
    }

}