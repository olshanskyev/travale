// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseEndpoint: 'https://localhost:8199/travale/api/v1/',
  countriesEndpoint: 'https://restcountries.com/v3.1/',
  citiesTeleportEndpoint: 'https://api.teleport.org/api/',
  citiesQWeatherEndpoint: 'https://geoapi.qweather.com/v2/',
  overpassapiEndpoint: 'https://overpass-api.de/api/interpreter',
  nominatimEndpoint: 'https://nominatim.openstreetmap.org/',
  wikipediaEndpoint: 'https://{{lng}}.wikipedia.org/w/api.php',
  wikidataEndpoint: 'https://www.wikidata.org/w/rest.php/wikibase/v0/',
  wikimediaEndpiint: 'https://commons.wikimedia.org/w/',
  photonEndpoint: 'https://photon.komoot.io/api/',
  pastvuEndpoint: 'https://pastvu.com/',
  pixabayEndpoint: 'https://pixabay.com/api/',
  pixabayKey: '39437353-c3c8f978595af484ac5f324c8',
  qWeatherKey: '719622e018634c71b4ec313e851a494a'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
