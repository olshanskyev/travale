import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NewDestinationPageComponent } from './destinations/new-destination/new-destination-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AllDestinationsPageComponent } from './destinations/all-destinations/all-destinations-page.component';
import { MapPageComponent } from './map-page-component/map-page.component';
import { CreateRouteComponent } from './create-route/create-route.component';


const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'destinations/new-destination',
      component: NewDestinationPageComponent,
    },
    {
      path: 'destinations',
      component: AllDestinationsPageComponent,
    },
    {
      path: 'home',
      component: HomePageComponent,
    },
    {
      path: 'map',
      component: MapPageComponent,
    },
    {
      path: 'create-route',
      component: CreateRouteComponent,
    }


  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class PagesRoutingModule {
}
