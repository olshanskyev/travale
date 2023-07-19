import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../@theme/theme.module';
import { SearchDestinationInputComponent } from './inputs/search-destination-input/search-destination-input.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NbAccordionModule, NbAutocompleteModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbDialogModule, NbFormFieldModule, NbIconModule, NbInputModule, NbListModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { SelectDestinationMapComponent } from './maps/select-destination-map/select-destination-map.component';
import { LeafletMapComponent } from './maps/leaflet-map/leaflet-map.component';
import { SlideOutComponent } from './slide-out/slide-out.component';
import { CountryInfoCardComponent } from './cards/country-info-card/country-info-card.component';
import { CityInfoCardComponent } from './cards/city-info-card/city-info-card.component';
import { LeafletOfflineMapComponent } from './maps/leaflet-offline-map-component/leaflet-offline-map.component';
import { RouteCardComponent } from './cards/route-card/route-card.component';
import { PlaceCardComponent } from './cards/place-card/place-card.component';
import { ImgSliderComponent } from './img-slider/img-slider.component';
import { SwiperDirective } from './img-slider/img-slider-directive';
import { LightboxModule } from 'ngx-lightbox';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MarkerIconComponent } from './marker-icon/marker-icon.component';
import { ImgUploaderWindowComponent } from './windows/img-uploader-window/img-uploader-window.component';
import { ImagesSelectorComponent } from './windows/img-uploader-window/images-selector/images-selector.component';
import { SearchPlaceComponent } from './maps/leaflet-map/search-place-control/search-place-control.component';
import { CitySelectWindowComponent } from './windows/city-select-window/city-select-window.component';
import { EditPlaceWindowComponent } from './windows/edit-place-window/edit-place-window.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    NbAutocompleteModule,
    NbInputModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    NbCardModule,
    LeafletModule,
    NbIconModule,
    NbButtonModule,
    NbListModule,
    DragDropModule,
    SwiperDirective,
    LightboxModule,
    NgxFileDropModule,
    FormsModule,
    NbFormFieldModule,
    NbAccordionModule,
    NbCheckboxModule,
    NbDialogModule.forChild(),
  ],
  declarations: [
    SearchDestinationInputComponent,
    SelectDestinationMapComponent,
    LeafletMapComponent,
    SlideOutComponent,
    CountryInfoCardComponent,
    CityInfoCardComponent,
    LeafletOfflineMapComponent,
    RouteCardComponent,
    PlaceCardComponent,
    ImgSliderComponent,
    MarkerIconComponent,
    ImgUploaderWindowComponent,
    ImagesSelectorComponent,
    SearchPlaceComponent,
    CitySelectWindowComponent,
    EditPlaceWindowComponent,

  ],
  exports:[
    SearchDestinationInputComponent,
    SelectDestinationMapComponent,
    LeafletMapComponent,
    SlideOutComponent,
    CountryInfoCardComponent,
    CityInfoCardComponent,
    RouteCardComponent,
    PlaceCardComponent,
    ImgSliderComponent,
    MarkerIconComponent
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA ],
  entryComponents: [
    ImgUploaderWindowComponent,
    CitySelectWindowComponent,
    EditPlaceWindowComponent,
  ]
})
export class CustomComponentsModule { }
