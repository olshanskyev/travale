
import { Observable, catchError, map, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Country, CountriesServiceData } from '../data/countries.data';


@Injectable()
export class CountriesService extends CountriesServiceData {

  private translationLocaleMap: Map<string, string> = new Map([
    ['cz', 'ces'],
    ['cy', 'cym'],
    ['de', 'deu'],
    ['et', 'est'],
    ['fi', 'fin'],
    ['fr', 'fra'],
    ['hr', 'hrv'],
    ['hu', 'hun'],
    ['it', 'ita'],
    ['jp', 'jpn'],
    ['ko', 'kor'],
    ['no', 'nld'],
    ['fa', 'per'],
    ['pl', 'pol'],
    ['pt', 'por'],
    ['ru', 'rus'],
    ['sk', 'slk'],
    ['es', 'spa'],
    ['sv', 'swe'],
    ['ur', 'urd'],
    ['zh', 'zho'],
  ]);

  constructor(private _http: HttpClient) {
    super();
  }

  override getAllCountries(): Observable<Country[]> {
    const url = environment.countriesEndpoint + 'all';
    return this._http.get<Country[]>(url);
  }

  override getCountryByCommonName(name: string): Observable<Country> {
    const url = environment.countriesEndpoint + 'name/' + name + '?fullText=true';
    return this._http.get<Country[]>(url).pipe(map(countries => countries[0]));
  }


  override findCountriesByPattern(pattern: string): Observable<Country[]> {
    const url = environment.countriesEndpoint + 'translation/' + pattern;
    return this._http.get<Country[]>(url).pipe(catchError(() => {
      return of([]);
    }));
  }

  override getCountryNameTranslation(country: Country, locale: string): string {
    const translation = this.translationLocaleMap.get(locale); // convert ru => rus
    if (translation && country.translations[translation])
        return country.translations[translation].common;

    return country.name.common;
  }

  override getCountryNameByCountryCode(code: string): Observable<string> {
    const url = environment.countriesEndpoint + 'alpha/' + code;
    return this._http.get<any>(url).pipe(map(founds => {
      if (founds && founds.length > 0) {
        return founds[0].name.common;
      }
    }));
  }

}