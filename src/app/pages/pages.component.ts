import { Component, OnInit } from '@angular/core';
import { NbIconLibraries, NbMenuItem } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';

import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'travale-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <travale-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet>
      </router-outlet>
    </travale-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {

  menu = MENU_ITEMS;
  private currentLang: string;

  constructor(private translateService: TranslateService,
    iconsLibrary: NbIconLibraries) {
    this.currentLang = this.translateService.currentLang;
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
    iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
  }

  ngOnInit(): void {
    this.menu.forEach(item => { //translate
      this.translateMenuItem(item);
    });
  }


  // translating menu items
  translateMenuItem(menuItem: NbMenuItem) {
    const key = menuItem.title;
    const value = this.translateService.translations[this.currentLang].menu[key];
    if (value) {
      menuItem.title = value; // translate menu item
    }
    if (menuItem.children) {
      menuItem.children.forEach(item => this.translateMenuItem(item));
    }
  }

}
