import { Component, OnInit, ElementRef } from '@angular/core';
declare var d3: any;
declare var TrendChart: any;
declare var refreshGraph: any;
declare var sources: any;
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-d3-component',
  templateUrl: './d3-component.component.html',
  styleUrls: ['./d3-component.component.scss']
})
export class D3ComponentComponent implements OnInit {

  lastDate: any;
  firstObj: any;
  lineArr = [];
  timerID;
  MAX_LENGTH = 900;
  duration = 1000;
  yAxis =[];
  xAxis ={label:"Timestamp",field:"date"};
  cConfig ={
    label:"timestamp",
    field:"t_stamp",
    height:500,
    width:960,
    XticksOrientation:"0",
    LegendsPlacement:"BOTTOM"
  };
  outletO2: any;
  outletCo2: any;
  outletch4: any;

  graphView:any = [
    {view:"view1",legend:"Outlet O2",label:"Gas",color:"red",field:"f0",axis:"y0", unit:"%"},
    {view:"view2",legend:"Outlet CO2",label:"Gas",color:"green",field:"f1",axis:"y1", unit:"%"},
    {view:"view3",legend:"Outlet CH4",label:"Gas",color:"blue",field:"f2",axis:"y2", unit:"%"}
  ];
  realTime: any;
  graphValue: string = "All";
  yAxisData: any = [];
  chartType: any;
  chartId: any;

  constructor(private elementRef: ElementRef, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.chartId = params.chartId;
        this.realTime = params.realtime;
        this.yAxisData = JSON.parse(params.yaxis);
        this.graphValue = this.yAxisData.dataview;
        this.chartType = this.yAxisData.graphTypes;
      }
    );
      console.log(this.chartId);

    for (const graph of this.graphView) {
      if(this.graphValue != "All"){
        if(this.graphValue == graph.view){
          this.yAxis.push({
            legend: this.yAxisData.yaxis,
            color: this.yAxisData.color,
            field: this.yAxisData.field,
            axis: this.yAxisData.axis,
            unit: this.yAxisData.unit,
            label: this.yAxisData.label
          });
          this.xAxis = {label:this.yAxisData.xaxisLabel, field:this.yAxisData.xaxisField};
          this.cConfig = {
            label:"timestamp",
            field:"t_stamp",
            height:500,
            width:960,
            XticksOrientation:this.yAxisData.XticksOrientation,
            LegendsPlacement:this.yAxisData.legendPos
          };
        } 
      }else{
        this.yAxis.push({
          legend: graph.legend,
          color:graph.color,
          field:graph.field,
          axis:graph.axis,
          unit:graph.unit,
          label:graph.label
        });
        this.xAxis = {label:"Timestamp",field:"date"};
        this.cConfig ={
          label:"timestamp",
          field:"t_stamp",
          height:500,
          width:960,
          XticksOrientation:"0",
          LegendsPlacement:"BOTTOM"
        };
      }
    }

    var chart =   TrendChart(this.cConfig, this.xAxis, this.yAxis);
    if (this.realTime == "true" || this.chartType == '1') {
      // start timer
      this.timerID = setInterval(() => this.RefreshLineChart(), 1000);
    } else {
      // stop timer
      window.clearInterval(this.timerID);
      d3.selectAll(".dot0").remove();
      d3.selectAll(".dot1").remove();
      d3.selectAll(".dot2").remove();
    }
    this.seedData(this.graphValue);
    const htmlRef = this.elementRef.nativeElement.querySelector('#chart');
    console.log(htmlRef);
    d3.select(htmlRef).datum(this.lineArr).call(chart);
  }

    RefreshLineChart():any {
      if (typeof(sources) !== "undefined" && (sources !== null )){
        this.lastDate = this.lineArr[this.lineArr.length-1].date;
        this.firstObj = this.lineArr[0]
        //comment out the following line to add incremental batch of data to the grpath
        this.lineArr.shift();
        this.lineArr.push({ date: this.addSeconds(1, this.lastDate),  "f0":this.firstObj.f0 , "f1":this.firstObj.f1, "f2":this.firstObj.f2 });
        refreshGraph(this.lineArr);
      }
    }

    addSeconds(numOfSeconds, date = new Date()) {
      var t = new Date(date.valueOf());
      date.setSeconds(t.getSeconds() + numOfSeconds);
      return date;
    }

    randomNumberBounds(min, max) {
      //return   +((Math.round(Math.floor() * ((max-min) + 1) *100)/100 ).toFixed(2)) + min;
      return  (Math.random() * (max - min + 1) + min)
    }
    seedData(value) {
      var now = new Date();
      this.outletO2 = [0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.109999999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999,0.0999];
      this.outletCo2 = [2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,2.039999962,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052,1.820000052];
      this.outletch4 = [97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.25,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655,97.47989655];
      for (var i = 0; i < this.MAX_LENGTH; ++i) {
        {
          if(this.graphValue != "All"){
            if(value == "view1"){
              this.lineArr.push({
                date: new Date(now.getTime() - ((this.MAX_LENGTH - i) * this.duration)),
                f0:  this.outletO2[i]
              });
            }else if(value == "view2"){
              this.lineArr.push({
                date: new Date(now.getTime() - ((this.MAX_LENGTH - i) * this.duration)),
                f1:  this.outletCo2[i]
              });
            }else if(value == "view3"){
              this.lineArr.push({
                date: new Date(now.getTime() - ((this.MAX_LENGTH - i) * this.duration)),
                f2:  this.outletch4[i]
              });
            }   
          }else{
            this.lineArr.push({
              date: new Date(now.getTime() - ((this.MAX_LENGTH - i) * this.duration)),
              f0:  this.outletO2[i],
              f1:  this.outletCo2[i],
              f2:  this.outletch4[i],
            });
          }    
        }
      }
    }

}