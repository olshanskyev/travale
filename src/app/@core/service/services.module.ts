import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountriesService } from './countries.service';
import { CitiesService } from './cities.service';
import { OverpassapiService } from './overpassapi.service';
import { IconsService } from './icons.service';
import { NominatimService } from './nominatim.service';
import { MapSidebarService } from './map-sidebar.service';
import { WikiService } from './wiki.service';
import { LocalRouteService } from './local.route.service';
import { LeafletOverlayBuilderService } from './leaflet-overlay-builder.service';


const SERVICES = [
  CountriesService,
  CitiesService,
  OverpassapiService,
  IconsService,
  NominatimService,
  MapSidebarService,
  WikiService,
  LocalRouteService,
  LeafletOverlayBuilderService
];

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ...SERVICES,
  ],
})
export class ServiceModule {
  static forRoot(): ModuleWithProviders<ServiceModule> {
    return {
      ngModule: ServiceModule,
      providers: [
        ...SERVICES,
      ],
    };
  }
}
