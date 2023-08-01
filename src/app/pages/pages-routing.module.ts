import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';

import { HomePageComponent } from './home-page/home-page.component';
import { MapPageComponent } from './map-page/map-page.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'home',
      component: HomePageComponent,
    },
    {
      path: 'map',
      component: MapPageComponent,
    },
    {
      path: 'routes',
      loadChildren: () => import('./routes/routes.module')
        .then(m => m.RoutesModule),
    },


  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class PagesRoutingModule {
}
