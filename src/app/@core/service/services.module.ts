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
import { PastvuService } from './pastvu.service';
import { PixabayService } from './pixabay.service';
import { UserNotificationsService } from './user-notifications.service';
import { TeleportCitiesSearchService } from './teleport.cities.search.service';
import { QweatherCitiesSearchService } from './qweather.cities.search.service';
import { UsersService } from './users.service';


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
  MapFooterService,
  PastvuService,
  PixabayService,
  UserNotificationsService,
  TeleportCitiesSearchService,
  QweatherCitiesSearchService,
  UsersService,
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
