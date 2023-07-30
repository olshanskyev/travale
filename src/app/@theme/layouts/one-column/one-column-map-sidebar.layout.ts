import { ChangeDetectorRef, Component } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'travale-one-column-map-sidebar-layout',
  styleUrls: ['./one-column-map-sidebar.layout.scss'],
  template: `
    <nb-layout>
      <nb-layout-header fixed>
        <travale-header></travale-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive [compactedBreakpoints]="['xs', 'is', 'sm', 'md', 'lg']" [collapsedBreakpoints]="['is', 'xs', 'unknown']">
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column class="p-0 ps-3">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-sidebar [collapsedBreakpoints]="['sm', 'md', 'lg', 'is', 'xs', 'unknown']" responsive class="map-sidebar"
        tag="map-sidebar" #mapSidebar left="false" responsive>
        <ng-content select="travale-leaflet-map-component"></ng-content>
      </nb-sidebar>

      <nb-layout-footer fixed class="footer map-layout-footer">
        <travale-map-footer></travale-map-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnMapSidebarLayoutComponent {

  constructor(changeDetectionRef: ChangeDetectorRef, nbSidebarService: NbSidebarService) {
    nbSidebarService.onToggle().subscribe((res) => {
      if (res.tag === 'map-sidebar') {
        setTimeout(() => {
          changeDetectionRef.detectChanges();
        }, 500); // workaround beacause of not implemented .map-sidebar style on mobile devices

      }

    });

  }
}
