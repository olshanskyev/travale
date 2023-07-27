
import { Observable } from 'rxjs';
import { Destination } from './destination.data';


export abstract class CountriesServiceData {
    abstract getAllCountries(): Observable<Country[]>;
    abstract getCountryByCommonName(name: string): Observable<Country>;
    abstract findCountriesByPattern(pattern: string): Observable<Country[]>;
    abstract getCountryNameTranslation(country: Country, locale: string): string;
    abstract getCountryNameByCountryCode(code: string): Observable<string>;

}

export class Country extends Destination {
    constructor() {
        super('country');
    }
    capital: string[];
    cca2: string;
    cca3: string;
    maps: {
        googleMaps: string,
        openStreetMaps: string,
    };
    name: {
        common: string,
        official: string,
        nativeName: any
    };
    translations: any;
}