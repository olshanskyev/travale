import { NgModule } from '@angular/core';
import { CountryInfoCardComponent } from './country-info-card/country-info-card.component';
import { CityInfoCardComponent } from './city-info-card/city-info-card.component';
import { RouteCardComponent } from './route-card/route-card.component';
import { PlaceCardComponent } from './place-card/place-card.component';
import { CommonModule } from '@angular/common';
import { NbAccordionModule, NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule, NbListModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { ImgSliderModule } from '../img-slider/ImgSlider.module';
import { FormsModule } from '@angular/forms';
import { NgxFileDropModule } from 'ngx-file-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MarkerIconComponent } from '../marker-icon/marker-icon.component';

@NgModule({
    imports: [
        CommonModule,
        NbButtonModule,
        NbCardModule,
        TranslateModule,
        NbIconModule,
        ImgSliderModule,
        NbFormFieldModule,
        NbInputModule,
        FormsModule,
        NbAccordionModule,
        NbListModule,
        NgxFileDropModule,
        DragDropModule
    ],
    declarations: [
        CountryInfoCardComponent,
        CityInfoCardComponent,
        RouteCardComponent,
        PlaceCardComponent,
        MarkerIconComponent,
    ],
    exports: [
        CountryInfoCardComponent,
        CityInfoCardComponent,
        RouteCardComponent,
        PlaceCardComponent,
        MarkerIconComponent,
    ]
})
export class CardsModule {}