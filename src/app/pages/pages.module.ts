import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbIconModule, NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { NewDestinationPageComponent } from './destinations/new-destination/new-destination-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AllDestinationsPageComponent } from './destinations/all-destinations/all-destinations-page.component';
import { CustomComponentsModule } from '../custom-components/custom-components.module';
import { MapPageComponent } from './map-page-component/map-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { CreateRouteComponent } from './create-route/create-route.component';

@NgModule({
  imports: [
    CustomComponentsModule,
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbIconModule,
    NbCardModule,
    TranslateModule,
    NbButtonModule
  ],
  declarations: [
    PagesComponent,
    NewDestinationPageComponent,
    HomePageComponent,
    AllDestinationsPageComponent,
    MapPageComponent,
    CreateRouteComponent,
  ],
})
export class PagesModule {
}
