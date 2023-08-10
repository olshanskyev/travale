import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { Subject, takeUntil, map } from 'rxjs';

@Component({
  selector: 'travale-one-column-map-sidebar-layout',
  styleUrls: ['./one-column-map-sidebar.layout.scss'],
  template: `
    <nb-layout>
      <nb-layout-header fixed>
        <travale-header></travale-header>
      </nb-layout-header>

      <nb-sidebar class="map-sidebar" tag="map-sidebar" #mapSidebar [fixed]="isMapFixed" >
        <ng-content select="travale-leaflet-map-component"></ng-content>
      </nb-sidebar>
      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" state="collapsed" [fixed]="isMenuFixed">
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>
      <nb-layout-column class="p-0 ps-3">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>
      <nb-layout-footer fixed class="footer map-layout-footer">
        <travale-map-footer class="w-100"></travale-map-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnMapSidebarLayoutComponent implements OnDestroy, OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  isMenuFixed = true;
  isMapFixed = true;
  constructor(
    private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService,
    private sidebarService: NbSidebarService
    ) {
  }

  ngOnInit(): void {
    // thats all is workaround, because using of swiper js is throwing unknown breakpoint
    // and using sidebar with responsive is not possible
    const { xl } = this.breakpointService.getBreakpointsMap();
    const { sm } = this.breakpointService.getBreakpointsMap();

    this.themeService.onMediaQueryChange().pipe(
      map(([, currentBreakpoint]) => currentBreakpoint),
      takeUntil(this.destroy$)
    ).subscribe(
      currentBreakpoint => {

          if (currentBreakpoint.width !== undefined) {
            if (currentBreakpoint.width < sm) {
              setTimeout(() => {
                this.sidebarService.collapse('menu-sidebar');
                this.sidebarService.collapse('map-sidebar');
              }, 0);
              this.isMenuFixed = true;
              this.isMapFixed = true;
            }
            else if (currentBreakpoint.width < xl) {
              setTimeout(() => {
                this.sidebarService.compact('menu-sidebar');
                this.sidebarService.collapse('map-sidebar');
              }, 0);
              this.isMenuFixed = false;
              this.isMapFixed = true;
            }
            else {
              setTimeout(() => {
                this.sidebarService.expand('menu-sidebar');
                this.sidebarService.expand('map-sidebar');
              }, 0);
              this.isMenuFixed = false;
              this.isMapFixed = false;
            }
          }
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
