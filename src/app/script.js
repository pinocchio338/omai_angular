
function realTimeLineChart(cConfig,xAxis,yAxis) {
    var margin = {top: 20, right: 50, bottom: 50, left: 80},
        width = 1000,
        height = 1000,
        duration = 500,
        color = d3.schemeCategory10;
    //var y0ColName , y1ColName , y2ColName ,xColName ; 
    var lineY0 , lineY1, lineY2 , y0,y1,y2 ;
    var parseTime = d3.timeParse("%m/%d/%Y %H:%M:%S %p");  // Output: 7/21/2020, 10:01:14 AM
    var YFields=[] ;
   // var xAxis ={label:"Timestamp",field:"time",color:"steelblue",label_orientation:270};
    //var cConfig ={ height:400, width:600, color:"indigo"};
    var  width = cConfig.width;
    var height = cConfig.height;

    //var yAxis =[{label:"y0 label",color:"green",field:"f0"} ];
   //yAxis =[{label:"y0 Label",color:"green",field:"f0"},{label:"y1 Label",color:"blue",field:"f1"} ];
   //yAxis =[{label:"y0 label",color:"green",field:"f0"},{label:"y1 label",color:"blue",field:"f1"} , {label:"y2 label",color:"red",field:"f2"} ];

    var yAxiscount =  yAxis.length;
      
   
    function chart(selection) {
      // Based on https://bl.ocks.org/mbostock/3884955
      xColName = xAxis.field;
      if (yAxiscount >= 1)
        YFields.push(yAxis[0].field);
      if (yAxiscount >= 2)
        YFields.push(yAxis[1].field );

      if (yAxiscount >= 3)
        YFields.push( yAxis[2].field);


      selection.each(function(data) {
   
      // dynamic mapping based on the count of y axis passed

        data = YFields.map(function(c) {
          return {
            label: c,
            values: data.map(function(d) {
              return {time: +d.time, value: d[c]};
            })
          };
        }
        );
       

  
        var t = d3.transition().duration(duration).ease(d3.easeLinear);
        var    x0; // = d3.scaleTime().rangeRound([0, width-margin.left-margin.right]);
        // var    y = d3.scaleLinear().rangeRound([height-margin.top-margin.bottom, 0]);
        // var   z = d3.scaleLinear().rangeRound([height-margin.top-margin.bottom, 0]);
            
      //  var   y0 = d3.scaleLinear().rangeRound([height-margin.top-margin.bottom, 0]);
            
            //z = d3.scaleOrdinal(color);
       
        var xMin = d3.min(data, function(c) { return d3.min(c.values, function(d) { return d.time; })});
        var xMax = new Date(new Date(d3.max(data, function(c) { return d3.max(c.values, function(d) { return d.time; })  })).getTime() - (duration*2)); // why multuplying duration with 2
       
        var svg = d3.select(this).selectAll("svg").data([data]);
     

        svg.attr("width", width + margin.left + margin.right);
        svg.attr("height", height + margin.top + margin.bottom);
        var gEnter = svg.enter().append("svg").append("g");
        var r = document.querySelector(':root');
    

        gEnter.append("g").attr("class", "axis x");  // x axis
       
        gEnter.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width-margin.left-margin.right)
        .attr("height", height-margin.top-margin.bottom);
        gLine = gEnter.append("g")
        .attr("class", "lines")             //svg-->g-->g // the lines 
        .attr("clip-path", "url(#clip)");
      
        x0 =getXRange() ;
       
      //legend configuration
      var legendEnter = gEnter.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width-margin.right-margin.left-75) + ",25)");
      legendEnter.append("rect")
        .attr("width", 50)
        .attr("height", 75)
        .attr("fill", "#ffffff")
        .attr("fill-opacity", 0.7);
      legendEnter.selectAll("text")
        .data(data).enter()
        .append("text")
          .attr("y", function(d, i) { return (i*20) + 25; })
          .attr("x", 5)
          .attr("fill", "red" ); // todo needs to match with legend
        //  .attr("fill", function(d) { return z(d.label); });

        var svg = selection.select("svg");
        svg.attr('width', width).attr('height', height);  // root svg element
        var g = svg.select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");    //svg-->g

        xAxisConfiguration();
      


        g.select("defs clipPath rect")
        .transition(t)
        .attr("width", width-margin.left-margin.right)
        .attr("height", height-margin.top-margin.right);

        g.selectAll("g .legend text")
        .data(data)
        .text(function(d) {
          return d.label.toUpperCase() + ": " +  (d.values[d.values.length-1].value);
        });

      

       
  
      r.style.setProperty('--axisX_text_fill', xAxis.color);
      r.style.setProperty('--chart_title_text_fill', cConfig.color);


        if (yAxiscount >= 1)
        {
          r.style.setProperty('--axisY0_line_color', yAxis[0].color);
          r.style.setProperty('--axisY0_text_fill', yAxis[0].color);
          y0 =getY0Range() ;
          lineY0 = getlineY0();
          gEnter.append("g").attr("class", "axis y0"); //y axis
          gLine.append("path").attr("class", "y0data") .select(".y0data").data(data[0]).enter() ;
          y0AxisConfiguration();
          y0Line();
          setY0AxisLabel();

        }

        if (yAxiscount >= 2)
        {
          r.style.setProperty('--axisY1_line_color', yAxis[1].color);
          r.style.setProperty('--axisY1_text_fill', yAxis[1].color);
          y1 =getY1Range() ;
          lineY1 = getlineY1();
          gEnter.append("g").attr("class", "axis y1"); //y1 axis
          gLine.append("path").attr("class", "y1data") .select(".y1data").data(data[1]).enter()  ;
          y1AxisConfiguration();
          y1Line();
          setY1AxisLabel();
        }

        if (yAxiscount >= 3)
        {
          r.style.setProperty('--axisY2_line_color', yAxis[2].color);
          r.style.setProperty('--axisY2_text_fill', yAxis[2].color);
          y2 =getY2Range() ;
          lineY2 = getlineY2();
          gEnter.append("g").attr("class", "axis y2"); //y2 axis
          gLine.append("path").attr("class", "y2data") .select(".y2data").data(data[2]).enter()  ;
          y2AxisConfiguration();
          y2Line();
          setY2AxisLabel();
        }

         //Set Chart Title -- no longer required
        //  gEnter.append("g").attr("class", "chartTitle")
        //   .append("text")
        //  .attr("x", (width-(margin.left+margin.right)) / 2 )
        //  .attr("y",-margin.top/2*.8)
        //  .style("text-anchor", "middle")
        //  .text(cConfig.title.toUpperCase()) ;

        
        
           


          //set x axis label
          gEnter.append("g").attr("class", "xAxislabelText")
          .append("text")
            .attr("x", (width-(margin.left+margin.right)) / 2 )
            .attr("y",height-margin.top-10).style("text-anchor", "middle")
            .text(xAxis.label.toUpperCase()) ;

         

         //Set Y0 axis label
         function setY0AxisLabel()
         {
         gEnter.append("g").attr("class", "axisY0_text")
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -28)
          .attr("x", -200)     
          .text(yAxis[0].label.toUpperCase());
         }

         //Set Y1 axis label
         function setY1AxisLabel()
         {
         gEnter.append("g").attr("class", "axisY1_text")
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 505)
          .attr("x", -200)     
          .text(yAxis[1].label.toUpperCase());
         }
       
        //Set Y2 axis label
        function setY2AxisLabel()
        {
          gEnter.append("g").attr("class", "axisY2_text")
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -62)
          .attr("x", -200)     
          .text(yAxis[2].label.toUpperCase());
        }
        function getXRange(){
          //var containerWidth = $("#streaming-chart-svg").parent().width();
          return d3.scaleTime()
          .range([0, width-margin.left-margin.right])
          .domain(
                  [  d3.min(data[0].values, function (d) { return d.time;     }),
                    d3.max(data[0].values, function (d) { return d.time;     })
                  ]
                  );
        }
        function getY0Range(){
          // var allValues = [];
          // data.forEach(function(v,i){
          //   allValues = allValues.concat(v.values);
          // });
          //var containerHeight = $("#streaming-chart-svg").parent().height();
          return d3.scaleLinear()
          .range([height-margin.top-margin.bottom, 0])
          .domain
            ([0,
             10
             ]
            );
        }
        // d3.max(data[0].values, function (d) {  return d.value;     })
        function getY1Range(){
          // var allValues = [];
          // data.forEach(function(v,i){
          //   allValues = allValues.concat(v.values);
          // });
          //var containerHeight = $("#streaming-chart-svg").parent().height();
          return d3.scaleLinear()
          .range([height-margin.top-margin.bottom, 0])
          .domain
            ([0,
              10
             ]
            );
        }
        // d3.max(data[1].values, function (d) {  return d.value;     })

        function getY2Range(){
          // var allValues = [];
          // data.forEach(function(v,i){
          //   allValues = allValues.concat(v.values);
          // });
          //var containerHeight = $("#streaming-chart-svg").parent().height();
          return d3.scaleLinear()
          .range([height-margin.top-margin.bottom, 0])
          .domain
            ([0,
              10
             ]
            );
        }
       
       //d3.max(data[2].values, function (d) {  return d.value;     })

        function getlineY0(){  
        
          return d3.line()
          .curve(d3.curveBasis)
          .x(function(d) { return x0(d.time); })
          .y(function(d) { return y0(d.value); });
        }
        function getlineY1(){      
          return d3.line()
          .curve(d3.curveBasis)
          .x(function(d) { return x0(d.time); })
          .y(function(d) { return y1(d.value); });

        }
        function getlineY2(){  

          return d3.line()
          .curve(d3.curveBasis)
          .x(function(d) { return x0(d.time); })
          .y(function(d) { return y2(d.value); });
        }

          // .selectAll(".data").data(data).enter()
          //   .append("path")
          //     .attr("class", "data");          //svg-->g-->g-->path
     
  

        function xAxisConfiguration()
        {
          x0.ticks(d3.timeMinute.every(1));
          xAxis.label_orientation= 45;
          if (xAxis.label_orientation == 270)
          {
            dy= '-.55em';
            dx= '-3.55em';
          }
          if (xAxis.label_orientation == 0)
          {
            dy= '0.55em';
            dx= '-1.5em';
          }
          if (xAxis.label_orientation == 45)
          {
            dy= '0.1em';
            dx= '0.6em';
          }
          
          g.select("g.axis.x")   
                                                                   //svg-->g-->g
          .attr("transform", "translate(0," + (height-margin.bottom-margin.top) + ")")
          .transition(t)
          .call(d3.axisBottom(x0))
                  
         // g.selectAll(".tick text")
       
         .selectAll(".tick text")
         
          .attr('dy',dy)
          .attr('dx',dx)

          .attr('transform',"rotate("+xAxis.label_orientation+")")

          .attr('text-anchor','start')

            .attr("class","tickText");
            console.log(x0.ticks().length);

        }
        function y0AxisConfiguration()
        {
          g.select("g.axis.y0")                                                          //svg-->g-->g
            .transition(t)
            .attr("class","axisY0_text")
            //.attr("class", "axis y0")
            .call(d3.axisLeft(y0));
            
        }
        function y1AxisConfiguration()
        {
         g.select("g.axis.y1")                                                           
          .transition(t)
          .attr("class", "axisY1_text")
          .attr("transform", "translate(" + (width-margin.right-margin.left) + ",0)")
          .call(d3.axisRight(y1));
        }
        function y2AxisConfiguration()
        {
          g.select("g.axis.y2")                                                           
          .transition(t)
          .attr("class", "axisY2_text")
          .attr("transform", "translate(" + (-45) + ",0)")
          .call(d3.axisLeft(y2));
        }
   
        
        function y0Line()
        {
          
          g.selectAll("g path.y0data")
          .data(data )
          .style("stroke", function(d) { return yAxis.find(ax => ax.field == (data[0].label)).color ; })   
          .style("stroke-width", 1)
          .style("fill", "none")
          .transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .on("start", tick0)
          .selectAll("text") 
          .style("color", yAxis[0].color)  
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
               

          .attr("transform", "rotate(-65)");
        }
        function y1Line()
        {
          g.selectAll("g path.y1data")
          .data(data )
          .style("stroke", function(d) { return yAxis.find(ax => ax.field == (data[1].label)).color ; })   
          .style("stroke-width", 1)
          .style("fill", "none")
          .transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .on("start", tick1); 
        }
        function y2Line()
        {
          g.selectAll("g path.y2data")
          .data(data )
          .style("stroke", function(d) { return yAxis.find(ax => ax.field == (data[2].label)).color ; })   
          .style("stroke-width", 1)
          .style("fill", "none")
          .transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .on("start", tick2); 
        }

          
        // data.forEach(function(data,index){
        //   if (index==0)
        //   {
        //     d0 = data.values;
        //     g.selectAll("g path.y0data")
        //       .data(d0)
        //     // .style("stroke", function(d) { return z(d.label); })
        //       .style("stroke", "red") // function(d) { return yAxis.find(ax => ax.field == (d.label)).color ; })   
        //       .style("stroke-width", 1)
        //       .style("fill", "none")
        //       .transition()
        //       .duration(duration)
        //       .ease(d3.easeLinear)
        //       .on("start", tick);
        //       }

        //       if (index==1)
        //       {
        //         g.selectAll("g path.y1data")
        //           .data(data.values)
        //         // .style("stroke", function(d) { return z(d.label); })
        //           .style("stroke", "blue") //function(d) { return yAxis.find(ax => ax.field == (d.label)).color ; })   
        //           .style("stroke-width", 1)
        //           .style("fill", "none")
        //           .transition()
        //           .duration(duration)
        //           .ease(d3.easeLinear)
        //           .on("start", tick1);
        //           }
    
        // });

  
        // For transitions https://bl.ocks.org/mbostock/1642874
        function tick0() {
          g.selectAll("g path.y0data")  //d3.select(this)
            .attr("d", function(d) { return lineY0(data[0].values); })
            .attr("transform", null);
          
          var xMinLess = new Date(new Date(xMin).getTime() - duration); // todo need to understand this line
          d3.active(this)
              .attr("transform", "translate(" + x0(xMinLess) + ",0)")
            .transition()
              .on("start", tick0);
              data[0].values.shift();


        }

        function tick1() {
          g.selectAll("g path.y1data")  //d3.select(this)
            .attr("d", function(d) { return lineY1(data[1].values); })
            .attr("transform", null);
  
          var xMinLess = new Date(new Date(xMin).getTime() - duration);
          d3.active(this)
              .attr("transform", "translate(" + x0(xMinLess) + ",0)")
            .transition()
              .on("start", tick1);
              data[1].values.shift();

        }

        function tick2() {
          g.selectAll("g path.y2data")  //d3.select(this)
            .attr("d", function(d) { return lineY2(data[2].values); })
            .attr("transform", null);
  
          var xMinLess = new Date(new Date(xMin).getTime() - duration);
          d3.active(this)
              .attr("transform", "translate(" + x0(xMinLess) + ",0)")
            .transition()
              .on("start", tick2);
              data[2].values.shift();
        }

       



      });
    }
  
    chart.margin = function(_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };
  
    chart.width = function(_) {
      if (!arguments.length) return width;
      width = _;
      return chart;
    };
  
    chart.height = function(_) {
      if (!arguments.length) return height;
      height = _;
      return chart;
    };
  
    chart.color = function(_) {
      if (!arguments.length) return color;
      color = _;
      return chart;
    };
  
    chart.duration = function(_) {
      if (!arguments.length) return duration;
      duration = _;
      return chart;
    };
  
    return chart;
  }