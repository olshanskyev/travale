/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RussianLanguage } from 'src/lang/russian.language';

@Component({
  selector: 'travale-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {

  constructor(
    private translateService: TranslateService,
    @Inject(LOCALE_ID) public locale: string
    ) {
      this.translations();
      this.translateService.setDefaultLang(locale);
      this.translateService.use(locale);
  }

  private translations() {
    this.translateService.setTranslation(this.locale, RussianLanguage.getTranslations());
  }

}