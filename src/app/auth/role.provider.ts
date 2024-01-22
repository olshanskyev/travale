import { Injectable } from '@angular/core';

import { Observable, map } from 'rxjs';
import { NbAuthService, NbAuthOAuth2JWTToken, NbAuthToken } from '@nebular/auth';
import { NbRoleProvider } from '@nebular/security';

@Injectable()
export class RoleProvider implements NbRoleProvider {

  constructor(private authService: NbAuthService) {
  }

  getRole(): Observable<string[]> {
    return this.authService.onTokenChange()
      .pipe(
        map((token: NbAuthToken) => {
          if (token.isValid() && token instanceof NbAuthOAuth2JWTToken) {
            const roles: string[] = token.getAccessTokenPayload()['roles'];
            return roles;
          } else {
            return ['ROLE_USER'];
          }

        }),
      );
  }
}
