import { NgModule } from '@angular/core';
import { SearchDestinationInputComponent } from './search-destination-input/search-destination-input.component';
import { CommonModule } from '@angular/common';
import { NbListModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '../directives/directives.module';

@NgModule({
    imports: [
        CommonModule,
        NbListModule,
        TranslateModule,
        DirectivesModule
    ],
    declarations: [SearchDestinationInputComponent],
    exports: [SearchDestinationInputComponent],
})
export class InputsModule {}