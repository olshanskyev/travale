import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {

    //currentLang: string;
    constructor(private router: Router, private toastrService: NbToastrService,
      private translateService: TranslateService) {
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler,
      ): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((err: any) => {
                let errorMsg = '';
                let errorParameters;
                if (err instanceof HttpErrorResponse && err.error) {
                  errorMsg = err.error.errorText;
                  errorParameters = err.error.parameters;
                  if (err.status === 401) {

                    this.toastrService.danger(
                      this.translateService.translations[this.translateService.currentLang].errors.Unauthorized,
                      this.translateService.translations[this.translateService.currentLang].common.error);
                      this.router.navigate(['auth/login']);
                    return throwError(err);
                  }

                }
                if (err.status <= 0) { // connection refused
                  errorMsg = 'serverCommunicationError';
                }

                // translate
                if (errorMsg) {
                  this.translateService.get('errors.' + errorMsg, errorParameters).subscribe(res => {
                    this.toastrService.danger(
                       res,
                       this.translateService.translations[this.translateService.currentLang].common.error);
                  });
                }

                return throwError(err);
            }));

    }

}
