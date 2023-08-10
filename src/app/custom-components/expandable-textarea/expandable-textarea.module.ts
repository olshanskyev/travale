import { NgModule } from '@angular/core';
import { ExpandableTextareaComponent } from './expandable-textarea.component';
import { NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { TextAreaWindowComponent } from './textarea-window/textarea-window.component';


@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        NbInputModule,
        NbFormFieldModule,
        NbButtonModule,
        NbIconModule,
        NbCardModule
    ],
    declarations: [
        ExpandableTextareaComponent,
        TextAreaWindowComponent
    ],
    exports: [
        ExpandableTextareaComponent
    ],
    entryComponents: [
        TextAreaWindowComponent
    ]
})
export class ExpandableTextAreaModule {}