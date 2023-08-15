import { NgModule } from '@angular/core';
import { ImgUploaderWindowComponent } from './img-uploader-window/img-uploader-window.component';
import { CitySelectWindowComponent } from './city-select-window/city-select-window.component';
import { EditPlaceWindowComponent } from './edit-place-window/edit-place-window.component';
import { SelectColorWindowComponent } from './select-color-window/select-color-window.component';
import { TranslateModule } from '@ngx-translate/core';
import { NbAccordionModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbDialogModule, NbIconModule } from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { InputsModule } from '../inputs/inputs.module';
import { NgxFileDropModule } from 'ngx-file-drop';
import { CardsModule } from '../cards/cards.module';
import { ImagesSelectorComponent } from './img-uploader-window/images-selector/images-selector.component';
import { ConfirmWindowComponent } from './confirm-window/confirm-window.component';

@NgModule({
    imports: [
        CommonModule,
        NbDialogModule.forChild(),
        TranslateModule,
        NbCardModule,
        NbButtonModule,
        NbAccordionModule,
        InputsModule,
        NbIconModule,
        NgxFileDropModule,
        CardsModule,
        NbCheckboxModule
    ],
    declarations:[
        ImgUploaderWindowComponent,
        CitySelectWindowComponent,
        EditPlaceWindowComponent,
        SelectColorWindowComponent,
        ImagesSelectorComponent,
        ConfirmWindowComponent
    ],
    exports:[
    ],
    entryComponents: [
        ImgUploaderWindowComponent,
        CitySelectWindowComponent,
        EditPlaceWindowComponent,
        SelectColorWindowComponent,
        ConfirmWindowComponent
    ]

})
export class WindowsModule {

}