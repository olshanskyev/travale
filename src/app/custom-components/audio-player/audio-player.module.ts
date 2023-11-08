import { NgModule } from '@angular/core';
import { AudioPlayerComponent } from './audio-player.component';
import { NbButtonModule, NbIconModule } from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@NgModule(
    {
        imports: [
            CommonModule,
            NbButtonModule,
            NbIconModule,
            TranslateModule
        ],
        declarations: [
            AudioPlayerComponent
        ],
        exports: [
            AudioPlayerComponent
        ]
    }
)
export class AudioPlayerModule {

}