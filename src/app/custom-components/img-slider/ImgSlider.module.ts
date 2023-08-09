import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ImgSliderComponent } from './img-slider.component';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { SwiperDirective } from './img-slider-directive';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
    imports: [
        CommonModule,
        NbButtonModule,
        NbCardModule,
        SwiperDirective,
        LightboxModule,
        NbIconModule
    ],
    declarations: [ImgSliderComponent],
    schemas:[ CUSTOM_ELEMENTS_SCHEMA ],
    exports: [ImgSliderComponent]
})
export class ImgSliderModule {}