import { CUSTOM_ELEMENTS_SCHEMA, Injector, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbGlobalLogicalPosition, NbLayoutModule, NbMenuModule, NbSidebarModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ThemeModule } from './@theme/theme.module';
import { CoreModule } from './@core/core.module';
import { createCustomElement } from '@angular/elements';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import {register} from 'swiper/element/bundle';
import { LocalRouteService } from './@core/service/local.route.service';
import { PoiOnMapPopupComponent } from './custom-components/popups/poi-on-map-popup/poi-on-map-popup.component';
import { NearbyPoisOnMapPopupComponent } from './custom-components/popups/nearby-pois-on-map-popup/nearby-pois-on-map-popup.component';

register();

registerLocaleData(localeRu, 'ru');
const dbConfig: DBConfig  = {
  name: 'Travale',
  version: 1,
  objectStoresMeta: [{
    store: LocalRouteService.store(),
    storeConfig: LocalRouteService.storeConfig(),
    storeSchema: LocalRouteService.storeSchema()
  }]
};

@NgModule({
  declarations: [
    AppComponent
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
    }),
    NgxIndexedDBModule.forRoot(dbConfig)
  ],
  providers: [
    {
      provide: LOCALE_ID, useValue: 'ru'
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {

  constructor(private injector: Injector) {

    const PoiOnMapPopupElement = createCustomElement(PoiOnMapPopupComponent, {injector});
    const NearbyPoiOnMapPopupElement = createCustomElement(NearbyPoisOnMapPopupComponent, {injector});
    // Register the custom element with the browser.
    customElements.define('poi-on-map-element', PoiOnMapPopupElement);
    customElements.define('nearby-pois-on-map-element', NearbyPoiOnMapPopupElement);
  }
}
