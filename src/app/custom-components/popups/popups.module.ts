import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceOnMapPopupComponent } from './place-on-map-popup/place-on-map-popup.component';
import { PoiOnMapPopupComponent } from './poi-on-map-popup/poi-on-map-popup.component';
import { NbButtonModule, NbIconModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DirectivesModule } from '../directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    NbButtonModule,
    NbIconModule,
    TranslateModule,
    PipesModule,
    DirectivesModule
  ],
  declarations: [
    PlaceOnMapPopupComponent,
    PoiOnMapPopupComponent,
  ],
  exports:[
    PlaceOnMapPopupComponent
  ],
  schemas:[ ],
  entryComponents: [

    PoiOnMapPopupComponent
  ]
})
export class PopupsModule {
}
