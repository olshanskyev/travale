import { NgModule } from '@angular/core';
import { SelectDestinationMapComponent } from './select-destination-map/select-destination-map.component';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';
import { LeafletOfflineMapComponent } from './leaflet-offline-map-component/leaflet-offline-map.component';
import { SearchPlaceComponent } from './leaflet-map/search-place-control/search-place-control.component';
import { CommonModule } from '@angular/common';
import { NbAccordionModule, NbButtonModule, NbCheckboxModule, NbIconModule, NbListModule } from '@nebular/theme';
import { SlideOutModule } from '../slide-out/slide-out.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { TranslateModule } from '@ngx-translate/core';
import { InputsModule } from '../inputs/inputs.module';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
    imports: [
        CommonModule,
        LeafletModule,
        NbButtonModule,
        NbIconModule,
        SlideOutModule,
        NbAccordionModule,
        TranslateModule,
        NbCheckboxModule,
        NbListModule,
        InputsModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
          }),
    ],
    declarations: [
        SelectDestinationMapComponent,
        LeafletMapComponent,
        LeafletOfflineMapComponent,
        SearchPlaceComponent
    ],
    exports: [
        SelectDestinationMapComponent,
        LeafletMapComponent,
        LeafletOfflineMapComponent
    ]
})
export class MapsModule {}