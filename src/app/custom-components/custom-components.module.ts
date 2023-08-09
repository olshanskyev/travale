import { NgModule  } from '@angular/core';
import { NbDialogModule } from '@nebular/theme';
import { PopupsModule } from './popups/popups.module';
import { DirectivesModule } from './directives/directives.module';
import { WindowsModule } from './windows/windows.module';
import { InputsModule } from './inputs/inputs.module';
import { CardsModule } from './cards/cards.module';
import { ImgSliderModule } from './img-slider/ImgSlider.module';
import { MapsModule } from './maps/maps.module';
import { SlideOutModule } from './slide-out/slide-out.module';


@NgModule({
  imports: [
    NbDialogModule.forChild(),
    PopupsModule,
    DirectivesModule,
    WindowsModule,
    InputsModule,
    CardsModule,
    ImgSliderModule,
    MapsModule,
    SlideOutModule
  ],
  declarations: [
  ],
  exports:[
  ],
  entryComponents: [
  ]
})
export class CustomComponentsModule {
}
