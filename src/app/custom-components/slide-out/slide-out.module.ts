import { NgModule } from '@angular/core';
import { SlideOutComponent } from './slide-out.component';
import { CommonModule } from '@angular/common';
import { NbIconModule } from '@nebular/theme';

@NgModule({
    imports: [
        CommonModule,
        NbIconModule
    ],
    declarations: [SlideOutComponent],
    exports: [SlideOutComponent]
})
export class SlideOutModule {}