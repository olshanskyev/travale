import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { SwiperDirective } from './img-slider-directive';
import { LightboxModule } from 'ngx-lightbox';
import { ImgThumbsSliderComponent } from './img-thumbs-slider/img-thumbs-slider.component';
import { ImgCarouselSliderComponent } from './img-carousel-slider/img-carousel-slider.component';
import { TranslateModule } from '@ngx-translate/core';
import { ExpandableTextAreaModule } from '../expandable-textarea/expandable-textarea.module';

@NgModule({
    imports: [
        CommonModule,
        NbButtonModule,
        NbCardModule,
        SwiperDirective,
        LightboxModule,
        NbIconModule,
        TranslateModule,
        ExpandableTextAreaModule
    ],
    declarations: [
        ImgCarouselSliderComponent,
        ImgThumbsSliderComponent
    ],
    schemas:[ CUSTOM_ELEMENTS_SCHEMA ],
    exports: [
        ImgCarouselSliderComponent,
        ImgThumbsSliderComponent
    ]
})
export class ImgSlidersModule {}