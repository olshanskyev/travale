import { Observable } from 'rxjs';
import { Destination } from './common.data';


export abstract class CitiesServiceData {
    abstract findCitiesByPattern(pattern: string): Observable<City[]>;
    abstract getCityGeometry(city: City): Observable<CityGeometry>;
}

export interface CityGeometry {
    cityBoundingBox: number[];
    lat: number;
    lon: number;
}

export class City extends Destination {
    constructor() {
        super('city');
    }
    selfLink: string;
    name: string;
    fullName: string;
    country: string;

}