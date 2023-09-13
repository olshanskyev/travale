// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseEndpoint: 'http://localhost:8081/',
  countriesEndpoint: 'https://restcountries.com/v3.1/',
  citiesEndpoint: 'https://api.teleport.org/api/',
  overpassapiEndpoint: 'https://overpass-api.de/api/interpreter',
  nominatimEndpoint: 'https://nominatim.openstreetmap.org/',
  wikipediaEndpoint: 'https://{{lng}}.wikipedia.org/w/api.php',
  wikidataEndpoint: 'https://www.wikidata.org/w/rest.php/wikibase/v0/',
  photonEndpoint: 'https://photon.komoot.io/api/',
  pastvuEndpoint: 'https://pastvu.com/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
