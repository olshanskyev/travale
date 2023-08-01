import { Component, OnInit, ViewChild } from '@angular/core';
import { NbIconLibraries, NbMenuItem } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';

import { MENU_ITEMS } from './pages-menu';
import {  Router } from '@angular/router';
import { LeafletMapComponent } from '../custom-components/maps/leaflet-map/leaflet-map.component';
import { MapSidebarService } from '../@core/service/map-sidebar.service';

@Component({
  selector: 'travale-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <travale-one-column-map-sidebar-layout *ngIf="router.url.includes('routes/create'); else simpleLayout">
      <nb-menu [items]="menu"></nb-menu>
      <travale-leaflet-map-component #leafletMap>
      </travale-leaflet-map-component>
      <router-outlet>
      </router-outlet>
    </travale-one-column-map-sidebar-layout>
    <ng-template #simpleLayout>
      <travale-one-column-layout>
        <nb-menu [items]="menu"></nb-menu>
        <router-outlet>
        </router-outlet>
      </travale-one-column-layout>
    </ng-template>
  `,
})
export class PagesComponent implements OnInit {


  @ViewChild('leafletMap', {static: false}) set leafletMap(content: LeafletMapComponent) {
      if (content) { // initially setter gets called with undefined
          this.mapSidebarService.leafletMap = content;
      }
  }

  menu = MENU_ITEMS;
  private currentLang: string;

  constructor(private translateService: TranslateService,
    iconsLibrary: NbIconLibraries,
    protected router: Router,
    private mapSidebarService: MapSidebarService
    ) {
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
