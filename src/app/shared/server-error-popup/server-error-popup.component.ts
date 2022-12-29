import { Component, Input, OnInit, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { AuthService } from '../../auth.service'

@Component({
  selector: 'app-server-error-popup',
  templateUrl: './server-error-popup.component.html',
  styleUrls: ['./server-error-popup.component.scss']
})
export class ServerErrorPopupComponent implements OnInit, OnChanges {
  @Input() message: string ='';
  constructor(private authService: AuthService) { }
  readonly timerMillis = 5000;
  timerHandle = null;
  errorMessage='';
  ngOnInit(): void {
    this.authService.errorData.subscribe(data=>{
      if(data == 'User is not authorized to access this resource with an explicit deny'){
        window.location.href = window.location.origin;
        return;
      }
      if(data !== this.errorMessage){
        this.errorMessage = data;
        this.startTimer();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes['message']['currentValue'] !== changes['message']['previousValue'] && changes['message']['currentValue'] && changes['message']['currentValue'].length) {
      
    // }
  }

  startTimer(){
    clearTimeout(this.timerHandle)
      this.timerHandle = setTimeout(() => {
      this.authService.updateErrorMessage('')
    }, this.timerMillis)
  }
  
  close(){
    clearTimeout(this.timerHandle)
    this.message = '';
    this.authService.updateErrorMessage('')
  }

  isErrorMessageValid(){
    // console.error(this.errorMessage)
    // console.error(typeof((this.errorMessage)=='object' , (typeof(this.errorMessage)=='string' && !this.errorMessage.length)))
    if(typeof(this.errorMessage)=='object' || typeof(this.errorMessage)=='undefined' || (typeof(this.errorMessage)=='string' && !this.errorMessage.length))
      return false;
    return true;
  }
}
