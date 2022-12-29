import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  constructor() { }
  showEsterEgg: boolean = false;
  ngOnInit(): void {
  //   setTimeout(()=>{
  //     // this.showEsterEgg = true;
  //     setTimeout(()=>{
  //       this.showEsterEgg = false;
  //     },500)
  //   },5000)
  }

}
