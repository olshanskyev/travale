import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NbActionsModule, NbButtonModule, NbContextMenuModule, NbIconModule, NbLayoutModule, NbSearchModule, NbSelectModule, NbSidebarModule, NbThemeModule, NbUserModule } from '@nebular/theme';
import { OneColumnLayoutComponent } from './layouts';

import { DEFAULT_THEME } from './styles/theme.default';
import { GRAY_THEME } from './styles/theme.gray';
import { OneColumnMapSidebarLayoutComponent } from './layouts/one-column/one-column-map-sidebar.layout';
import { MapFooterComponent } from './components/footer/map-footer.component';
import { TranslateModule } from '@ngx-translate/core';

const NB_MODULES = [
  NbLayoutModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbActionsModule,
  NbSearchModule,
  NbSelectModule,
  NbIconModule,
  NbButtonModule,
  TranslateModule
];

const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  MapFooterComponent,
  OneColumnLayoutComponent,
  OneColumnMapSidebarLayoutComponent
];


@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, ...NB_MODULES],
  exports: [CommonModule, ...COMPONENTS],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ...<[]>NbThemeModule.forRoot(
          {
            name: 'gray',
          },
          [ DEFAULT_THEME, GRAY_THEME ],
        ).providers,
      ],
    };
  }
}
