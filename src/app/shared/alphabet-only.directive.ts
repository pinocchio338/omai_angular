import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[formControlName][appAlphabetOnly]'
})

export class AlphabetOnlyDirective {
  key;
  @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
    this.key = event.keyCode;
    //console.log(event.key);
   // let regex = /[a-zA-Z ]+/
   let regex = /[a-zA-Z0-9 ]+/
    if(!regex.test (event.key)){
      event.preventDefault();

    }
    // if ((this.key >= 15 && this.key <= 64) || (this.key >= 123) || (this.key >= 96 && this.key <= 105)) {
    //   event.preventDefault();
    // }
  }
}
