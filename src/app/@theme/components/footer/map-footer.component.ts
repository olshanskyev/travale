import { ChangeDetectorRef, Component } from '@angular/core';
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

  constructor(private sidebarService: NbSidebarService, private mapSidebarService: MapSidebarService, private changeDetectionRef: ChangeDetectorRef) {
  }

  toggleMapClicked() {
    this.sidebarService.toggle(false, 'map-sidebar');
    setTimeout(() => { this.mapSidebarService.leafletMap.invalidate();}, 10);
    setTimeout(() => this.changeDetectionRef.detectChanges(), 500); // workaround beacause of not implemented .map-sidebar style on mobile devices
  }
}
