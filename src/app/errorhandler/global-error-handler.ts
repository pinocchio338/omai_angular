import { ErrorHandler, Injectable } from "@angular/core";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor() {}

  handleError(error: Error) {
    //console.log(error);
    // this.alertService.openAlert(
    //   error.message || "Undefined client error"
    // );
  }
}