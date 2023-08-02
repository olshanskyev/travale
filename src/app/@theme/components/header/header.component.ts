import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'travale-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();

  userPictureOnly = false;
  hideMenuOnClick = false;

  user: {
    name: string,
    picture: string
  } = {
    name: 'Evgenii Olshanskii',
    picture: ''
  };

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'gray',
      name: 'Gray',
    }
  ];

  currentTheme = 'default';

  userMenu = [ { title: 'Profile' }, { title: 'Log out' } ];

  constructor(private sidebarService: NbSidebarService,
              private router: Router,
              private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService,
              private menuService: NbMenuService) {
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    const { xl } = this.breakpointService.getBreakpointsMap();
    const { is } = this.breakpointService.getBreakpointsMap();

    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) =>/* !currentBreakpoint.width || currentBreakpoint.width < xl*/ currentBreakpoint),
        takeUntil(this.destroy$),
      )
      //.subscribe((isLessThanXl: boolean) => {this.userPictureOnly = isLessThanXl;});
      .subscribe(currentBreakpoint => {
        const isLessThanXl = !currentBreakpoint.width || currentBreakpoint.width < xl;
        this.userPictureOnly = isLessThanXl;
        this.hideMenuOnClick = currentBreakpoint.width <= is;
      });
    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

      this.menuService.onItemClick().subscribe(() => {
        if (this.hideMenuOnClick) {
          this.sidebarService.collapse('menu-sidebar');
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  navigateHome() {
    this.router.navigate(['/pages/home']);
    return false;
  }
}
