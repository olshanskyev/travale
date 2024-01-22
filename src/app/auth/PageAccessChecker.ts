import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { NbAccessChecker } from '@nebular/security';
import { tap } from 'rxjs/operators';

@Injectable()
export class PageAccessChecker implements CanActivate {

  constructor(private router: Router, private accessChecker: NbAccessChecker) {
  }

  canActivate(route: ActivatedRouteSnapshot) {
        return this.accessChecker.isGranted(route.data['permission'], route.data['resource']).
        pipe(tap(granted => {
          if (!granted) {
            this.router.navigate(['pages/news']);
          }
        }));
  }
}
