import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceOnMapPopupComponent } from './place-on-map-popup/place-on-map-popup.component';
import { PoiOnMapPopupComponent } from './poi-on-map-popup/poi-on-map-popup.component';
import { NbButtonModule, NbIconModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DirectivesModule } from '../directives/directives.module';
import { ImgSlidersModule } from '../img-slider/Img-sliders.module';
import { ExpandableTextAreaModule } from '../expandable-textarea/expandable-textarea.module';
import { PoiItemComponent } from './poi-on-map-popup/poi-item/poi-item.component';
import { NearbyPoisOnMapPopupComponent } from './nearby-pois-on-map-popup/nearby-pois-on-map-popup.component';
import { SwiperDirective } from '../img-slider/img-slider-directive';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AudioPlayerModule } from '../audio-player/audio-player.module';

@NgModule({
  imports: [
    CommonModule,
    NbButtonModule,
    NbIconModule,
    TranslateModule,
    PipesModule,
    DirectivesModule,
    ImgSlidersModule,
    ExpandableTextAreaModule,
    SwiperDirective,
    AudioPlayerModule,
  ],
  declarations: [
    PlaceOnMapPopupComponent,
    PoiOnMapPopupComponent,
    PoiItemComponent,
    NearbyPoisOnMapPopupComponent,
  ],
  exports:[
    PlaceOnMapPopupComponent,
  ],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA ],
  entryComponents: [

    PoiOnMapPopupComponent,
    NearbyPoisOnMapPopupComponent,
  ]
})
export class PopupsModule {
}
