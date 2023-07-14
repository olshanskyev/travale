import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NbActionsModule, NbContextMenuModule, NbIconModule, NbLayoutModule, NbSearchModule, NbSelectModule, NbSidebarModule, NbThemeModule, NbUserModule } from '@nebular/theme';
import { OneColumnLayoutComponent } from './layouts';

import { DEFAULT_THEME } from './styles/theme.default';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { DARK_THEME } from './styles/theme.dark';

const NB_MODULES = [
  NbLayoutModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbActionsModule,
  NbSearchModule,
  NbSelectModule,
  NbIconModule,
];

const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  OneColumnLayoutComponent,
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
            name: 'default',
          },
          [ DEFAULT_THEME, COSMIC_THEME, DARK_THEME ],
        ).providers,
      ],
    };
  }
}
