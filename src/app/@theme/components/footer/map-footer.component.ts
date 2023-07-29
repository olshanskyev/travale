import { Component } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { MapSidebarService } from 'src/app/@core/service/map-sidebar.service';

@Component({
  selector: 'travale-map-footer',
  styleUrls: ['./map-footer.component.scss'],
  template: `
    <div class="toggle-map-button-container">
      <button nbButton status="primary" shape="round" (click)="toggleMapClicked()"><nb-icon icon="map-outline"></nb-icon>{{'leafletMap.toggleMap' | translate}}</button>
    </div>
  `,
})
export class MapFooterComponent {

  constructor(private sidebarService: NbSidebarService, private mapSidebarService: MapSidebarService) {
  }

  toggleMapClicked() {
    this.sidebarService.toggle(false, 'map-sidebar');
    setTimeout(() => { this.mapSidebarService.leafletMap.invalidate();}, 500);
  }
}
