import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutesRoutingModule } from './routes-routing.module';
import { DraftsPageComponent } from './route-drafts-page/route-drafts-page.component';
import { CreateRoutePageComponent } from './create-route-page/create-route-page.component';
import { NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { CardsModule } from 'src/app/custom-components/cards/cards.module';


@NgModule({
  imports: [
    CommonModule,
    RoutesRoutingModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    TranslateModule,
    CardsModule

  ],
  declarations: [
    DraftsPageComponent,
    CreateRoutePageComponent
  ],
})
export class RoutesModule {
}
