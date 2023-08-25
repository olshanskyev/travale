import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { RouteWithLocalId } from 'src/app/@core/data/route.data';
import { LocalRouteService } from 'src/app/@core/service/local.route.service';
import { ConfirmWindowComponent } from 'src/app/custom-components/windows/confirm-window/confirm-window.component';

@Component({
  selector: 'travale-drafts-page',
  templateUrl: './route-drafts-page.component.html',
  styleUrls: ['./route-drafts-page.component.scss']
})
export class DraftsPageComponent implements OnInit {

  constructor(private localRouteService: LocalRouteService,
    private dialogService: NbDialogService,
    private translateService: TranslateService) { }
  routes: RouteWithLocalId[];
  ngOnInit(): void {
    this.localRouteService.getAllRoutes().subscribe(routes => {
      this.routes = routes;
    });
  }

  deleteDraft(route: RouteWithLocalId, index: number) {

    this.dialogService.open(ConfirmWindowComponent, {
      context: {
        text: this.translateService.instant('drafts.deleteDraft', {route: route.title})
      },
      dialogClass: 'animated-dialog'
    }).onClose.subscribe(isOk => {
      if (isOk) {
        this.localRouteService.deleteRoute(route.localId).subscribe(success => {
          if (success) {
            this.routes.splice(index, 1);
          }
        });
      }

      //this.route?.places.splice(index, 1);
      //this.placesSequenceChanged.emit(this.route);
    });


  }

}
