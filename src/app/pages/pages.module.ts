import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbIconModule, NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { HomePageComponent } from './home-page/home-page.component';
import { CustomComponentsModule } from '../custom-components/custom-components.module';
import { MapPageComponent } from './map-page/map-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { ShortUrlPipe } from '../pipes/short-domain.pipe';

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
    HomePageComponent,
    MapPageComponent,
    ShortUrlPipe
  ],
})
export class PagesModule {
}
