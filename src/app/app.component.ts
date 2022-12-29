import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Portal';
  constructor(public breakpointObserver: BreakpointObserver) { 
    //console.log(window.innerWidth,window.devicePixelRatio)
    try{
      const params = window.location.pathname.split('/');
      if(params[params.length-1].length>64){
        const vp = document.getElementById('vp');
        vp.setAttribute('content','width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
      }
    }
    catch(e){}
  }

ngOnInit() {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe( (state: BreakpointState) => {
      if (state.breakpoints[Breakpoints.XSmall]) {
           //console.log( 'Matches XSmall viewport');
      }
      if (state.breakpoints[Breakpoints.Small]) {
           //console.log( 'Matches Small viewport');
      }
      if (state.breakpoints[Breakpoints.Medium]) {
           //console.log( 'Matches Medium  viewport');
      }
      if (state.breakpoints[Breakpoints.Large]) {

          //console.log( 'Matches Large viewport');
      }
      if (state.breakpoints[Breakpoints.XLarge]) {

         //console.log( 'Matches XLarge viewport');   
      }
    });
  }
}
