import {
    HttpHandler,
    HttpRequest,
    HttpEvent,
    HttpErrorResponse,
    HttpInterceptor
  } from "@angular/common/http";
  import { Observable, throwError } from "rxjs";
  import { catchError, finalize } from "rxjs/operators";
   import { Injectable } from "@angular/core";
  
  @Injectable()
  export class HttpErrorInterceptor implements HttpInterceptor {
    constructor() {}
  
    intercept(
      request: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      //this.loadingDialogService.openDialog();
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
         //console.log(error);
          return throwError(error);
        }),
        finalize(() => {
          //this.loadingDialogService.hideDialog();
        })
      ) as Observable<HttpEvent<any>>;
    }
  }