import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountriesService } from './countries.service';
import { CitiesService } from './cities.service';
import { OverpassapiService } from './overpassapi.service';
import { IconsService } from './icons.service';
import { NominatimService } from './nominatim.service';

const SERVICES = [
  CountriesService,
  CitiesService,
  OverpassapiService,
  IconsService,
  NominatimService
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
