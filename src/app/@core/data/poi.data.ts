import { LatLng, LatLngBounds } from 'leaflet';
import { Observable } from 'rxjs';
import { Feature, Geometry } from 'geojson';
import { WikiExtraction, WikiPageRef } from './wiki.data';

export type JsonFeatureSource = 'nominatim' | 'overpass';

export type AggregatedFeatureInfo = {
    feature: CustomFeature,
    wikiExtraction?: WikiExtraction,
    wikiPageRef?: WikiPageRef
}

export class CustomFeature implements Feature {
    type: 'Feature';
    geometry: Geometry;
    id?: string | number | undefined;
    properties: {
        source: JsonFeatureSource;
        osm_type: string;
        name?: string;
        name_en?: string;
        name_loc?: string;
        website?: string;
        openingHours?: string;
        phone?: string;
        wikipedia?: string;
        wikidata?: string;
        categories?: {
            [category: string]: string | undefined // category: type
        }
        route?: {
            order: number;
        }
    };
}


export interface PoiServiceData {
    findPois(bounds: LatLngBounds, tourismKey: TourismKeyType[], historicKey: HistoricKeyType[], locale: string): Observable<CustomFeature[]>;
    findPoisNearby(point: LatLng, locale: string): Observable<CustomFeature[]>;
}

export type TourismKeyType = 'alpine_hut' | 'apartment' | 'aquarium' | 'artwork' | 'attraction' | 'camp_pitch' |
    'camp_site' | 'caravan_site' | 'chalet' | 'gallery' | 'guest_house' | 'hostel' | 'hotel' | 'information' |
    'motel' | 'museum' | 'picnic_site' | 'theme_park' | 'viewpoint' | 'wilderness_hut' | 'zoo';

export type HistoricKeyType = 'aircraft' | 'anchor' | '	aqueduct' | 'archaeological_site' | 'battlefield' |
    'bomb_crater' | 'boundary_stone' | 'building' | 'cannon' | 'castle' | 'castle_wall' | 'cattle_crush' |
    'charcoal_pile' | 'church' | 'city_gate' | 'citywalls' | 'creamery' | 'district' | 'farm' | 'fort' |
    'gallows' | 'highwater_mark' | 'locomotive' | 'manor' | 'memorial' | 'milestone' | 'monastery' | 'monument' |
    'ogham_stone' | 'optical_telegraph' | 'pa' | 'pillory' | 'railway_car' | 'road' | 'ruins' | 'rune_stone' |
    'shieling' | 'ship' | 'stone' | 'tank' | 'tomb' | 'tower' | 'vehicle' | 'wayside_cross' | 'wayside_shrine' |
    'wreck';


