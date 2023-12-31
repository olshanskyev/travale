import { Component } from '@angular/core';

@Component({
  selector: 'travale-one-column-layout',
  styleUrls: ['./one-column-map-sidebar.layout.scss'],
  template: `
    <nb-layout>
      <nb-layout-header fixed>
        <travale-header></travale-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive [compactedBreakpoints]="['xs', 'is', 'sm', 'md', 'lg']" [collapsedBreakpoints]="['is', 'xs', 'unknown']">
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed class="footer">
        <travale-footer></travale-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {}
