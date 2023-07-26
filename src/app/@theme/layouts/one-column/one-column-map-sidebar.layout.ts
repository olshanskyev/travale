import { Component, OnDestroy } from '@angular/core';
import { NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { Subject, takeUntil } from 'rxjs';
import { MapSidebarService } from 'src/app/@core/service/map-sidebar.service';

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

      <nb-sidebar [class.hide-map]="!showMapOver" [class]="(showMapOver && sizeLessThanXl)? 'map-container-show-over' : 'map-sidebar'"
        tag="map-sidebar" #mapSidebar left="false" responsive="false">
        <ng-content select="travale-leaflet-map-component"></ng-content>
      </nb-sidebar>

      <nb-layout-footer fixed class="footer">
        <travale-footer></travale-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnMapSidebarLayoutComponent implements OnDestroy {

  showMapOver = false;
  sizeLessThanXl = false;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(mapSidebarService: MapSidebarService,
    private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService
    ) {
    mapSidebarService.onShowOver()
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.showMapOver = true;
    });
    mapSidebarService.onHideOver()
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.showMapOver = false;
    });

    const { xl } = this.breakpointService.getBreakpointsMap();

    this.themeService.onMediaQueryChange()
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(([, currentBreakpoint]) => {
        // !currentBreakpoint.width - beacaus of unknows breakpoint. ToDo extend NbSidebarComponent
        this.sizeLessThanXl = (!currentBreakpoint.width || currentBreakpoint.width < xl);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
