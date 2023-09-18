import { Component, OnDestroy } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { Subject, takeUntil } from 'rxjs';
import { Place } from 'src/app/@core/data/route.data';
import { MapFooterService } from 'src/app/@core/service/map-footer.service';
import { MapSidebarService } from 'src/app/@core/service/map-sidebar.service';

@Component({
  selector: 'travale-map-footer',
  styleUrls: ['./map-footer.component.scss'],
  template: `
      <div class="popup-place" [class.popup-show-over]="showPopup">
            <travale-place-on-map-popup [place]="popupPlace"></travale-place-on-map-popup>
            <div class="position-absolute top-0 end-0 pt-1 pe-1">
                <button nbButton size="tiny" shape="round" (click)="showPopup = false"><nb-icon icon="close-outline"></nb-icon></button>
            </div>
      </div>
      <div class="toggle-map-button-container">
        <button nbButton status="primary" shape="round" (click)="toggleMapClicked()"><nb-icon icon="map-outline"></nb-icon>{{'leafletMap.toggleMap' | translate}}</button>
      </div>
  `,
})
export class MapFooterComponent implements OnDestroy {

  showPopup = false;
  popupPlace: Place;
  destroy$: Subject<void> = new Subject();

  constructor(
    private sidebarService: NbSidebarService,
    private mapSidebarService: MapSidebarService,
    private mapFooterService: MapFooterService) {
      mapFooterService.onShowPlaceInfo().pipe(takeUntil(this.destroy$)).subscribe(place => {
        this.popupPlace = place;
        this.showPopup = true;
      });
  }

  toggleMapClicked() {
    this.sidebarService.toggle(false, 'map-sidebar');
    setTimeout(() => { this.mapSidebarService.leafletMap.invalidate();}, 10);
    this.showPopup = false;
    this.mapFooterService.mapToggled();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
