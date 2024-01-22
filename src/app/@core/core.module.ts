import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthModule, NbAuthOAuth2JWTToken, NbPasswordAuthStrategy } from '@nebular/auth';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { ServiceModule } from './service/services.module';
import { environment } from 'src/environments/environment';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { RoleProvider } from '../auth/role.provider';
import { PageAccessChecker } from '../auth/PageAccessChecker';
import { AuthGuard } from '../auth/AuthGuard';

export const NB_CORE_PROVIDERS = [
  ...<[]>ServiceModule.forRoot().providers,
  ...<[]>NbAuthModule.forRoot({

    strategies: [
      NbPasswordAuthStrategy.setup({
        name: 'email',
        baseEndpoint: environment.baseEndpoint + 'auth/',
        token: {
          class: NbAuthOAuth2JWTToken,
          key: 'token', // token api
        },
        login: {
          endpoint: 'login',
          redirect: {
            success: '/pages/home',
            failure: '/auth/login',
          },
          defaultMessages: ['login.successMessage']
        },
        logout: {
          endpoint: 'logout',
          redirect: {
            success: '/pages/home',
            failure: '/pages/home',
          },

        },
        register: {
          requireValidToken: false,
          redirect: {
            success: null,
            failure: null,
          },
          defaultMessages: ['register.successMessage']
        },
        refreshToken: {
          endpoint: 'refresh-token',
          method: 'post',
          requireValidToken: true,
        },
        resetPass: {
          resetPasswordTokenKey: 'token',
          defaultMessages: ['resetPass.successMessage']
        },
        requestPass: {
          defaultMessages: ['requestPass.successMessage']
        },
      }),
    ],
  }).providers,
  ...<[]>NbSecurityModule.forRoot({
    accessControl: {
      ROLE_USER: {
        view_page: [''],
      },
      ROLE_ADMIN: {
        parent: 'ROLE_USER',
        view_page: ['*'],
        read: ['*'],
        create: ['*'],
        edit: ['*'],
        remove: ['*'],
      },
    },
  }).providers,
  {
    provide: NbRoleProvider, useClass: RoleProvider,
  },
  AuthGuard,
  PageAccessChecker,
  RoleProvider,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
