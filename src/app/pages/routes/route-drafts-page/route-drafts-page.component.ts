import { Component, OnInit } from '@angular/core';
import { RouteWithLocalId } from 'src/app/@core/data/route.data';
import { LocalRouteService } from 'src/app/@core/service/local.route.service';

@Component({
  selector: 'travale-drafts-page',
  templateUrl: './route-drafts-page.component.html',
  styleUrls: ['./route-drafts-page.component.scss']
})
export class DraftsPageComponent implements OnInit {

  constructor(private localRouteService: LocalRouteService) { }
  routes: RouteWithLocalId[];
  ngOnInit(): void {
    this.localRouteService.getAllRoutes().subscribe(routes => {
      this.routes = routes;
    });
  }

  deleteDraft(route: RouteWithLocalId, index: number) {
    this.localRouteService.deleteRoute(route.localId).subscribe(success => {
      if (success) {
        this.routes.splice(index, 1);
      }
    });
  }

}
