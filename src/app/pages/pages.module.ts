import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbIconModule, NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { HomePageComponent } from './home-page/home-page.component';
import { CustomComponentsModule } from '../custom-components/custom-components.module';
import { MapPageComponent } from './map-page/map-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { CardsModule } from '../custom-components/cards/cards.module';
import { MapsModule } from '../custom-components/maps/maps.module';
import { SlideOutModule } from '../custom-components/slide-out/slide-out.module';

@NgModule({
  imports: [
    CustomComponentsModule,
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbIconModule,
    NbCardModule,
    TranslateModule,
    NbButtonModule,
    CardsModule,
    MapsModule,
    SlideOutModule
  ],
  declarations: [
    PagesComponent,
    HomePageComponent,
    MapPageComponent
  ],
})
export class PagesModule {
}
