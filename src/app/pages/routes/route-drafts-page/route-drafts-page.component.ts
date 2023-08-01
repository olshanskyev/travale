import { Component, OnInit } from '@angular/core';
import { Route } from 'src/app/@core/data/route.data';
import { LocalRouteService } from 'src/app/@core/service/local.route.service';

@Component({
  selector: 'travale-drafts-page',
  templateUrl: './route-drafts-page.component.html',
  styleUrls: ['./route-drafts-page.component.scss']
})
export class DraftsPageComponent implements OnInit {

  constructor(private localRouteService: LocalRouteService) { }
  routes: Route[] = [];
  ngOnInit(): void {
    this.localRouteService.getAllRoutes().subscribe(routes => {
      this.routes = routes;
    });
  }

  deleteDraft(route: Route, index: number) {
    this.localRouteService.deleteRoute(route.id).subscribe(success => {
      if (success) {
        this.routes.splice(index, 1);
      }
    });
  }

}
