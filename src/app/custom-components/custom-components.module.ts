import { NgModule  } from '@angular/core';
import { NbDialogModule } from '@nebular/theme';
import { PopupsModule } from './popups/popups.module';
import { DirectivesModule } from './directives/directives.module';
import { WindowsModule } from './windows/windows.module';
import { InputsModule } from './inputs/inputs.module';
import { CardsModule } from './cards/cards.module';
import { ImgSlidersModule } from './img-slider/Img-sliders.module';
import { MapsModule } from './maps/maps.module';
import { SlideOutModule } from './slide-out/slide-out.module';
import { ExpandableTextAreaModule } from './expandable-textarea/expandable-textarea.module';


@NgModule({
  imports: [
    NbDialogModule.forChild(),
    PopupsModule,
    DirectivesModule,
    WindowsModule,
    InputsModule,
    CardsModule,
    ImgSlidersModule,
    MapsModule,
    SlideOutModule,
    ExpandableTextAreaModule
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
