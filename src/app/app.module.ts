import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbGlobalLogicalPosition, NbLayoutModule, NbMenuModule, NbSidebarModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ThemeModule } from './@theme/theme.module';
import { CoreModule } from './@core/core.module';

import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

import {register} from 'swiper/element/bundle';

register();

registerLocaleData(localeRu, 'ru');

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    BrowserAnimationsModule,
    ThemeModule.forRoot(),
    NbLayoutModule,
    NbEvaIconsModule,
    CoreModule.forRoot(),
    TranslateModule.forRoot(),
    HttpClientModule,
    NbToastrModule.forRoot( {
      position: NbGlobalLogicalPosition.TOP_END,
      duration: 5000
    })
  ],
  providers: [
    {
      provide: LOCALE_ID, useValue: 'ru'
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
