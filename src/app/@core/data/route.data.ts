import { CustomFeature } from './poi.data';

export abstract class RoutesServiceData {

}

export type ImageType = {
    src: string,
    thumb: string,
    caption?: string
  }

export type RouteType = 'Historical' | 'Bar Walk' | 'Main Attractions' | 'Other';

export interface Route {
    id: string;
    title: string;
    subheading?: string;
    generalInfo?: string;
    places: Place[];
    routeType: RouteType;
    cityLatitude: number;
    cityLongitude: number;
    cityName: string;
    country: string;
    image?: ImageType;
    color: string;
}

export interface Place {
    id?: string | number;
    name: string;
    description?: string;
    images?: ImageType[];
    geoJson: CustomFeature;
}