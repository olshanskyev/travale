import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreateRoutePageComponent } from './create-route-page/create-route-page.component';
import { DraftsPageComponent } from './route-drafts-page/route-drafts-page.component';
import { FollowRoutePageComponent } from './follow-route-page/follow-route-page.component';
import { PageAccessChecker } from 'src/app/auth/PageAccessChecker';


const routes: Routes = [{
  path: '',
  children: [
    {
      path: 'create',
      component: CreateRoutePageComponent,
      data: {
        permission: 'view_page',
        resource: 'routes/create',
      },
    },
    {
      path: 'follow/:source/:id', //source drafts or saved
      component: FollowRoutePageComponent,
      data: {
        permission: 'view_page',
        resource: 'routes/follow',
      },
    },
    {
      path: 'drafts',
      component: DraftsPageComponent,
      canActivate: [PageAccessChecker], // Check rights
      data: {
        permission: 'view_page',
        resource: 'routes/drafts',
      },
    }

  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class RoutesRoutingModule {
}
