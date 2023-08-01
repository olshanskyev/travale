import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreateRoutePageComponent } from './create-route-page/create-route-page.component';
import { DraftsPageComponent } from './route-drafts-page/route-drafts-page.component';


const routes: Routes = [{
  path: '',
  children: [
    {
      path: 'create',
      component: CreateRoutePageComponent,
    },
    {
      path: 'drafts',
      component: DraftsPageComponent,
    }

  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class RoutesRoutingModule {
}
