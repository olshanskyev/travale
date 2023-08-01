import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutesRoutingModule } from './routes-routing.module';
import { DraftsPageComponent } from './route-drafts-page/route-drafts-page.component';
import { CreateRoutePageComponent } from './create-route-page/create-route-page.component';
import { NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { CustomComponentsModule } from 'src/app/custom-components/custom-components.module';


@NgModule({
  imports: [
    CommonModule,
    RoutesRoutingModule,
    NbCardModule,
    CustomComponentsModule,
    NbIconModule,
    NbButtonModule
  ],
  declarations: [
    DraftsPageComponent,
    CreateRoutePageComponent
  ],
})
export class RoutesModule {
}
