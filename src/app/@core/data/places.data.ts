import { Observable } from 'rxjs';
import { CustomFeature } from './poi.data';
import { LatLng, LatLngBounds } from 'leaflet';

export interface PlacesInsideBounds {
    // search for a places inside cityBounds
    searchPlace(search: string, cityBounds: LatLngBounds, locale: string): Observable<CustomFeature[]>;
}

export interface PlacesFromPoint {
    // search for a places from point
    searchPlace(search: string, point: LatLng, locale: string): Observable<CustomFeature[]>;
}

export interface PlaceByOSMId {
    getPlace(osmId: string | number, osmType: string, osmCategory: string, locale: string): Observable<CustomFeature>;
}

export function sortByDistanceFromCenter(features: CustomFeature[], viewBoxCenter: LatLng) {
    features.sort((a, b) => {
        if (a.geometry.type === 'Point' && b.geometry.type === 'Point') {

            const aLatLon: LatLng = new LatLng(a.geometry.coordinates[1], a.geometry.coordinates[0]);
            const bLatLon: LatLng = new LatLng(b.geometry.coordinates[1], b.geometry.coordinates[0]);
            return (aLatLon.distanceTo(viewBoxCenter) > bLatLon.distanceTo(viewBoxCenter))? 1: -1;
        }
        else
            return 0;
    });
}

/**
 *
 * @param features list of features to sort
 * @param categories prioritized list of categories. f.e ['castle', 'walls', 'attraction']
 * attraction in this example is most prioritized category.
 * Features with this category will be at the first positions
 */
export function sortByCategoryPriority(features: CustomFeature[], categories: string[]) {
    features.sort((a, b) => {
        let aHighestCategory = -1;
        let bHighestCategory = -1;
        if (a.properties.categories) {
            Object.values(a.properties.categories).forEach(catValue => {
                if (catValue) {
                    const foundIndex = categories.findIndex(item => item === catValue);
                    if (foundIndex > aHighestCategory)
                        aHighestCategory = foundIndex;
                }
            });
        }
        if (b.properties.categories) {
            Object.values(b.properties.categories).forEach(catValue => {
                if (catValue) {
                    const foundIndex = categories.findIndex(item => item === catValue);
                    if (foundIndex > bHighestCategory)
                        bHighestCategory = foundIndex;
                }
            });
        }
        return (aHighestCategory > bHighestCategory)? -1: ((aHighestCategory < bHighestCategory)? 1: 0);
    });
}


