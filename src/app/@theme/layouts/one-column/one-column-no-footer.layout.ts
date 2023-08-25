import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'travale-one-column-no-footer-layout',
  styleUrls: ['./one-column-map-sidebar.layout.scss'],
  template: `
    <nb-layout>
      <nb-layout-header fixed>
        <travale-header></travale-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" state="collapsed" [fixed]="isMenuFixed">
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>


    </nb-layout>
  `,
})
export class OneColumnNoFooterLayoutComponent implements OnDestroy, OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  isMenuFixed = true;

  currBreakpointName?: string = undefined;
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

      takeUntil(this.destroy$)
    ).subscribe(
      ([, currentBreakpoint]) => {
          if (currentBreakpoint.width !== undefined && this.currBreakpointName !== currentBreakpoint.name) {
            this.currBreakpointName = currentBreakpoint.name;
            if (currentBreakpoint.width < sm) {
              setTimeout(() => {
                this.sidebarService.collapse('menu-sidebar');
              }, 0);
              this.isMenuFixed = true;
            }
            else if (currentBreakpoint.width < xl) {
              setTimeout(() => {
                this.sidebarService.compact('menu-sidebar');
              }, 0);
              this.isMenuFixed = false;
            }
            else {
              setTimeout(() => {
                this.sidebarService.expand('menu-sidebar');
              }, 0);
              this.isMenuFixed = false;
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
