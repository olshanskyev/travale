import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuItem, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NbAuthOAuth2JWTToken, NbAuthService, NbAuthToken } from '@nebular/auth';
import { UsersService } from 'src/app/@core/service/users.service';

@Component({
  selector: 'travale-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly = false;
  isLessThanSm = false;
  authorized = false;
  user: {
    name: string,
    picture: string,
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

  userMenu: NbMenuItem[] = [ { title: 'Profile' ,  link: 'profile'}, { title: 'Log out', link: 'auth/logout'} ];

  constructor(private sidebarService: NbSidebarService,
              private router: Router,
              private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService,
              private menuService: NbMenuService,
              private authService: NbAuthService,
              private usersService: UsersService) {
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    const { xl } = this.breakpointService.getBreakpointsMap();
    const { sm } = this.breakpointService.getBreakpointsMap();

    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint),
        takeUntil(this.destroy$),
      )
      .subscribe(currentBreakpoint => {
            if (currentBreakpoint.width !== undefined) { // using swiper js throwing unknown value
              const isLessThanXl = currentBreakpoint.width < xl;
              this.userPictureOnly = isLessThanXl;
              this.isLessThanSm = currentBreakpoint.width < sm;
            }
    });


    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

      this.menuService.onItemClick().subscribe(() => {
        if (this.isLessThanSm) {
          this.sidebarService.collapse('menu-sidebar');
        }
      });

      this.authService.onTokenChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe((token: NbAuthToken) => {
        if (token.isValid()) {
            this.authorized = true;
            this.user = {
              name: (token as NbAuthOAuth2JWTToken).getAccessTokenPayload().sub,
              picture: '' // ToDo use default picture
            };
            this.usersService.getUserInfo().subscribe(
              userInfo => {
                if (userInfo) {
                  if (userInfo.firstName || userInfo.lastName) {
                    this.user.name = userInfo.firstName + ' ' + userInfo.lastName;
                  }
                  this.user.picture = userInfo.picture;
                }
              }
            );
        } else {
          this.authorized = false;
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
    this.sidebarService.toggle(!this.isLessThanSm, 'menu-sidebar');
    return false;
  }

  navigateHome() {
    this.router.navigate(['/pages/home']);
    return false;
  }
}
