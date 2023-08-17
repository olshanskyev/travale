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
import { MapFooterService } from './map-footer.service';
import { PhotonService } from './photon.service';


const SERVICES = [
  CountriesService,
  CitiesService,
  OverpassapiService,
  IconsService,
  NominatimService,
  PhotonService,
  MapSidebarService,
  WikiService,
  LocalRouteService,
  LeafletOverlayBuilderService,
  MapFooterService
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
