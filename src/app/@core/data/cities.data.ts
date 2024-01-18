import { Observable } from 'rxjs';
import { Destination } from './destination.data';

export interface CitiesSearch {
    findCitiesByPattern(pattern: string, locale?: string): Observable<City[]>;
}

export interface CitiesGeometry {
    getCityGeometry(city: City): Observable<CityGeometry>;
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
    selfLink?: string; // comes from teleport api used to get city geometry
    lat?: number;
    lon?: number;
    name: string;
    fullName: string;
    country: string;

}