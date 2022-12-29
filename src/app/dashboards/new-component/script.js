 
var sources;
var main_x , mini_x , focus, main_y0 , main_y1 , main_y2 ,  mini_y0 , mini_y1 , mini_y2;
var main, context   , color;
var xAxis , yAxis ;
var main_line0 ,  main_line1 , main_line2;
var  mini_line0 ,mini_line1 ;
var xFieldName , y0FieldName , y1FieldName , y2FieldName ; 
var yAXisMeasures ;
var SingleYaxis , DualYaxis, MultipleYaxis ;
var yAxiscount ;
 
var tooltip0 , tooltip1 , tooltip2 ;
// var refreshGraph = function refreshGraph(data)
// {
//   this.refreshChart(data);

// }
function TrendChart(cConfig, xAxisConfig, yAxisConfig) {

  var myBrush;
  var timerID;
  var r = document.querySelector(':root');
  var legendSpace ;

  yAxis =yAxisConfig;
  xAxis =xAxisConfig;
  cConfig = cConfig
  //this.sources =sources;
 //cConfig ={XticksOrientation:"0",LegendsPlacement:"BOTTOM",height:500, width:960};

  //yAxis =[{label:"This is Label 1 ",color:"red",field:"f0",axis:"y0"},
  // {label:"This is Label 2   ",color:"green",field:"f1",axis:"y1"}, 
  // {label:"This is Label 3",color:"blue",field:"f2",axis:"y0"}];
  
  // yAxis =[{label:"L1",color:"red",field:"f0",axis:"y0"}, {label:"L1",color:"green",field:"f1",axis:"y1"}, {label:"L1",color:"blue",field:"f2",axis:"y2"}];
//   yAxis =[{label:"L1",color:"red",field:"f0",axis:"y0"}, {label:"L1",color:"green",field:"f1",axis:"y1"} ];
 
 //xAxis ={label:"timestamp",field:"date"};
 tooltip0 = d3.select("#chart").append("div")
 .attr('id', 'div_y0')
 .attr('class', 'tooltip')
 .style('position', 'absolute');

 tooltip1 = d3.select("#chart").append("div")
 .attr('id', 'div_y1')
 .attr('class', 'tooltip')
 .style('position', 'absolute');
 
 tooltip2 = d3.select("#chart").append("div")
 .attr('id', 'div_y2')
 .attr('class', 'tooltip')
 .style('position', 'absolute');

 yAxiscount =  yAxis.length;
 

 xFieldName =xAxis.field;

 //xAxis ={label:"Timestamp",field:"date"};

  var margin = { top: 15, right: 30, bottom: 100, left: 80 },
    margin2 = { top: 430, right: 30, bottom: 40, left: 80 },
    main_width = cConfig.width - margin.left - margin.right,
    main_height = cConfig.height - margin.top - margin.bottom,
    mini_height = cConfig.height - margin2.top - margin2.bottom;
    


  color = d3.scaleOrdinal(d3.schemeCategory10);
 var formatDate = d3.timeFormat("%I:%M:%S %p");
var formatOutput = function(d, yfield) { return formatDate(d[xFieldName]) + " - " + d[yfield] ; }

  var parseDate = d3.timeParse("%Y%m");/* */

  var y0Measures = [] ,y1Measures = [] , y2Measures = [] ;
  for(var i = 0; i < yAxis.length; i++) {
    var obj = yAxis[i];
    if (obj.axis.toUpperCase().trim() == "Y0")
      y0Measures.push (obj.field);
    if (obj.axis.toUpperCase().trim() == "Y1")
      y1Measures.push(obj.field);
    if (obj.axis.toUpperCase().trim() == "Y2")
      y2Measures.push(obj.field);
    }

    yAXisMeasures = [{axis:"y0" , fields:y0Measures}, {axis:"y1" , fields:y1Measures} , {axis:"y2" , fields:y2Measures}] ;

    if (yAxiscount>=1)
 {
    //  y0 = d3.scaleLinear().range([main_height , 0]);
     r.style.setProperty('--axisY0_line_color', yAxis[0].color);
     r.style.setProperty('--axisY0_text_fill', yAxis[0].color);
     y0FieldName = yAxis[0].field ; 

 }
 if (yAxiscount>=2)
 {  
   //  y1 = d3.scaleLinear().range([main_height, 0]);
     r.style.setProperty('--axisY1_line_color', yAxis[1].color);
     r.style.setProperty('--axisY1_text_fill', yAxis[1].color);
     y1FieldName = yAxis[1].field ; 

 }
 if (yAxiscount ==3)  
 {
   //  mini_y0 = d3.scaleLinear().range([main_height, 0]);
     r.style.setProperty('--axisY2_line_color', yAxis[2].color);
     r.style.setProperty('--axisY2_text_fill', yAxis[2].color);
     y2FieldName = yAxis[2].field ; 

 }


    main_x = d3.scaleTime().range([0, main_width]), 
    main_y0 = d3.scaleLinear().range([main_height, 0]),
    main_y1 = d3.scaleLinear().range([main_height, 0]),
    main_y2 = d3.scaleLinear().range([main_height, 0]),


    mini_y0 = d3.scaleLinear().range([mini_height, 0]),
    mini_y1 = d3.scaleLinear().range([mini_height, 0]),
    mini_y2 = d3.scaleLinear().range([mini_height, 0]),
     
    mini_x = d3.scaleTime().range([0, main_width]);

 
  

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", main_width + margin.left + margin.right)
    .attr("height", main_height + margin.top + margin.bottom);

  svg
    .append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", main_width)
    .attr("height", main_height);

  

    function chart(selection) {
var  bisectDate = d3.bisector(function(d) { return d[xFieldName]; }).left ;
    main_line0 = d3.line()
              .x(function (d) { return main_x(d[xFieldName]); })
              .y(function (d) { return main_y0(d.value);    })
              .defined(function (d) { return !isNaN(d.value);   })
              .curve(d3.curveLinear);

    main_line1 = d3.line()
              .x(function (d) { return main_x(d[xFieldName]); })
              .y(function (d) { return main_y1(d.value);    })
              .defined(function (d) { return !isNaN(d.value);   })
              .curve(d3.curveLinear);            
    main_line2 = d3.line()
              .x(function (d) { return main_x(d[xFieldName]); })
              .y(function (d) { return main_y2(d.value);    })
              .defined(function (d) { return !isNaN(d.value);   })
              .curve(d3.curveLinear); 

    mini_line0 = d3.line()
              .x(function (d) { return mini_x(d[xFieldName]);})
              .y(function (d) { return mini_y0(d.value); })
              .defined(function (d) { return !isNaN(d.value); })
              .curve(d3.curveLinear);

    mini_line1 = d3.line()
    .x(function (d) { return mini_x(d[xFieldName]);})
    .y(function (d) { return mini_y1(d.value); })
    .defined(function (d) { return !isNaN(d.value); })
    .curve(d3.curveLinear);

    mini_line2 = d3.line()
    .x(function (d) { return mini_x(d[xFieldName]);})
    .y(function (d) { return mini_y2(d.value); })
    .defined(function (d) { return !isNaN(d.value); })
    .curve(d3.curveLinear);

    main = svg
              .append("g")
              .attr("id","main")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   context = svg
              .append("g")
              .attr("id","mini")
              .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


  selection.each(function(data) {



    color.domain(
      Object.keys(data[0]).filter(function (key) {
        return key !== xAxis.field;
      })
    );
 

      data.forEach(function (d) {
        d[xFieldName] = new Date(d[xFieldName]);
      });

      color.domain(
        Object.keys(data[0]).filter(function (key) {
          return key !== xAxis.field;
        })
      );

      sources = color.domain().map(function (name) {
        return {
          name: name,
          values: data.map(function (d) {
            return { date: d[xFieldName], value: +d[name] };
          })
        };
      });

      legendSpace = main_width/sources.length; 
      var legendDiv = d3.select("body").append("div").attr("id","legend");
      var textElement ;
      if (  cConfig.LegendsPlacement == "TOP" )
      {
        legendDiv.style("position","absolute");
        legendDiv.style("left", margin.left+"px" );
        legendDiv.style("top", margin.top+7+ "px" );
        textElement = "SPAN";
      }
      if (cConfig.LegendsPlacement == "BOTTOM"  )
      {
        legendDiv.style("position","absolute");
        legendDiv.style("left", margin.left+"px" );
        legendDiv.style("top",cConfig.height+20 +"px" );
        textElement = "SPAN";
      }

      if (cConfig.LegendsPlacement == "RIGHT"  )
      {
        legendSpace = 'main_height'/sources.length;
        legendDiv.style("position","absolute");
        legendDiv.style("left", cConfig.width+5 +"px" );
        legendDiv.style("top",margin.top + 20+"px" );
        textElement = "DIV";
      }
              
      sources.forEach(function (d, i) {

        // Add the Legend
        legendDiv.append(textElement)
            // .attr("x", function(){  var ret_value ;
            //                         if (cConfig.LegendsPlacement == "BOTTOM" || cConfig.LegendsPlacement == "TOP" )
            //                         {
            //                           legendSpace = main_width/sources.length;
            //                           if ( i == 0 )
            //                           {
            //                             ret_value =  (legendSpace/2)+i*legendSpace ;
            //                           }
            //                           else
            //                           {
            //                             ret_value = (legendSpace/2)+  + (i * 30);

            //                           }
            //                         }
            //                         if (cConfig.LegendsPlacement == "RIGHT")
            //                            ret_value = main_width+margin.left +margin.right;
                                   
            //                         return ret_value;
                                   
            //                      })  // space legend
            // .attr("y", function(){ var ret_value ;
            //                        if (cConfig.LegendsPlacement == "BOTTOM")
            //                        {
            //                         ret_value =  main_height + (margin.bottom)+margin2.bottom - 25;
            //                        }
            //                        if (cConfig.LegendsPlacement == "TOP")
            //                        {
            //                         ret_value =  margin.top;
            //                        }

            //                       if (cConfig.LegendsPlacement == "RIGHT")
            //                       {
            //                         legendSpace = main_height/sources.length;
            //                         ret_value =  (legendSpace/2)+i*legendSpace ;
            //                       }
            //                       return ret_value;
            //                      })
            .attr("class", "legend")    // style the legend
            .style("color", function() { // Add the colours dynamically
                    return yAxis.find(ax => ax.field==d.name).color ; })
            .on("click", function(){
                 labelColor =  yAxis.find(ax => ax.field==d.name).color ;
                toggleLineColor(d.name);

                 function toggleLineColor(id)
                 {
                    var element =  document.querySelector('[field="'+id+'"]').style ;
                    if (typeof(element) != 'undefined' && element != null)
                    {
                      lineColor = element.stroke;
                      if (lineColor == labelColor )
                      {
                        opacity = element.opacity;
                        newOpacity = opacity == 1 ? 0 : 1; 
                        element.opacity = newOpacity ;
                        d3.select("#"+id)
                                          .transition().duration(100) ;
                      }
                    }
                    }
                })  
            .text(function() { return yAxis.find(ax => ax.field==d.name).label.toUpperCase() ; }); 
           if ( cConfig.LegendsPlacement == "RIGHT")
               legendDiv.append("p")
    });


      main_x.domain(
        d3.extent(data, function (d) {
          return d[xFieldName];
        })
      );
      // main_y0.domain([
      //   d3.min(sources, function (c) {
      //     return d3.min(c.values, function (v) {
      //       return v.value;
      //     });
      //   }),
      //   d3.max(sources, function (c) {
      //     return d3.max(c.values, function (v) {
      //       return v.value;
      //     });
      //   })
      // ]);

      // main_y1.domain([
      //   d3.min(sources, function (c) {
      //     return d3.min(c.values, function (v) {
      //       return v.value;
      //     });
      //   }),
      //   d3.max(sources, function (c) {
      //     return d3.max(c.values, function (v) {
      //       return v.value;
      //     });
      //   })
      // ]);

      // main_y2.domain([
      //   d3.min(sources, function (c) {
      //     return d3.min(c.values, function (v) {
      //       return v.value;
      //     });
      //   }),
      //   d3.max(sources, function (c) {
      //     return d3.max(c.values, function (v) {
      //       return v.value;
      //     });
      //   })
      // ]);
      mini_x.domain(main_x.domain());
     // mini_y0.domain(main_y0.domain());
     // mini_y1.domain(main_y1.domain());
     // mini_y2.domain(main_y2.domain());



      // var mn  = main.selectAll("#main").data([sources]);
      // var g_Enter_Main = mn.enter().append("svg").append("g");

          // to get individual y axis domain use
      //d3.max(sources[2].values, function(d) {return Math.max(d.value); }) 
      // filter source on the basis of measures for y0 axis
      if (yAXisMeasures.length >= 1 && yAXisMeasures[0].fields.length > 0)
      {
        filtered_sources = sources.filter(element => yAXisMeasures[0].fields.includes(element.name));
        main_y0.domain([
          d3.min(filtered_sources, function (c) {
            return d3.min(c.values, function (v) {
              return v.value;
            });
          }),
          d3.max(filtered_sources, function (c) {
            return d3.max(c.values, function (v) {
              return v.value;
            });
          })
        ]);
        mini_y0.domain(main_y0.domain());
        
        var focuslineGroups = main
        .selectAll("#y0g")
        .data(filtered_sources)
        .enter()
        .append("g")
        .attr("id","y0g")
        ;

      var focuslines = focuslineGroups
        .append("path")
        .attr("id","y0data")
        .attr("class", "line")
        .attr("field", function(d) {return d.name})
        .style("stroke", function(d) { 
          return yAxis.find(ax => ax.field== d.name).color ;
         })
         .style("opacity",1)
         .attr("clip-path", "url(#clip)")
        
        .attr("d", function (d) {
          return main_line0(d.values);
        })
        .attr("clip-path", "url(#clip)")
        .selectAll("#y0data").data(filtered_sources).enter();  // added
       
        main
        .append("g")
        .attr("id","y0Axis")
        .attr("class", "y axis")
        .call(d3.axisLeft(main_y0));

        var contextlineGroups = context
        .selectAll("#y0g")
        .data(filtered_sources)
        .enter()
        .append("g")
        .attr("id","y0g")
        ;

        var contextLines = contextlineGroups
        .append("path")
        .attr("id","y0data")
        .attr("class", "line")
        .style("stroke", function(d) { 
          return yAxis.find(ax => ax.field== d.name).color ;
         })
         .style("opacity",1)
         .attr("clip-path", "url(#clip)")
        
        .attr("d", function (d) {
          return mini_line0(d.values);
        })
        .attr("clip-path", "url(#clip)")
        .selectAll("#y0data").data(filtered_sources).enter();  // added

      }

     

      if (yAXisMeasures.length >= 2  && yAXisMeasures[1].fields.length > 0)
      {
        filtered_sources = sources.filter(element => yAXisMeasures[1].fields.includes(element.name));
        main_y1.domain([
          d3.min(filtered_sources, function (c) {
            return d3.min(c.values, function (v) {
              return v.value;
            });
          }),
          d3.max(filtered_sources, function (c) {
            return d3.max(c.values, function (v) {
              return v.value;
            });
          })
        ]);
        mini_y1.domain(main_y1.domain());

        focuslineGroups = main
        .selectAll("y1g")
        .data(filtered_sources)
        .enter()
        .append("g")
        .attr("id","y1g")
        ;

        focuslines = focuslineGroups
        .append("path")
        .attr("id","y1data")
        .attr("class", "line")
        .attr("field", function(d) {return d.name})
        .style("stroke", function(d) { 
          return yAxis.find(ax => ax.field== d.name).color ;
          })
        .style("opacity",1)
      
        .attr("clip-path", "url(#clip)")
        
        .attr("d", function (d) {
          return main_line1(d.values);
        })
        .attr("clip-path", "url(#clip)")
        .selectAll("#y1data").data(filtered_sources).enter();  // added

        main
        .append("g")
        .attr("id","y1Axis")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (main_width ) + ",0)")
        .call(d3.axisRight(main_y1));

        var contextlineGroups = context
        .selectAll("#y1g")
        .data(filtered_sources)
        .enter()
        .append("g")
        .attr("id","y1g")
        ;

        var contextLines = contextlineGroups
        .append("path")
        .attr("id","y1data")
        .attr("class", "line")
        .style("stroke", function(d) { 
          return yAxis.find(ax => ax.field== d.name).color ;
         })
        .style("opacity",1)
        .attr("clip-path", "url(#clip)")
        .attr("d", function (d) {
          return mini_line1(d.values);
        })
        .attr("clip-path", "url(#clip)")
        .selectAll("#y1data").data(filtered_sources).enter();  // added

      } 

       
        if (yAXisMeasures.length >= 3 && yAXisMeasures[2].fields.length > 0 )
        {
          filtered_sources = sources.filter(element => yAXisMeasures[2].fields.includes(element.name));
          main_y2.domain([
            d3.min(filtered_sources, function (c) {
              return d3.min(c.values, function (v) {
                return v.value;
              });
            }),
            d3.max(filtered_sources, function (c) {
              return d3.max(c.values, function (v) {
                return v.value;
              });
            })
          ]);
          mini_y2.domain(main_y2.domain());

          focuslineGroups = main
          .selectAll("y2g")
          .data(filtered_sources)
          .enter()
          .append("g")
          .attr("id","y2g")
          ;
  
          focuslines = focuslineGroups
          .append("path")
          .attr("id","y2data")
          .attr("class", "line")
          .attr("field", function(d) {return d.name})
          .style("stroke", function(d) { 
            return yAxis.find(ax => ax.field== d.name).color ;
           })
          .style("opacity",1)
          .attr("clip-path", "url(#clip)")
          .attr("d", function (d) {
            return main_line2(d.values);
          })
          .attr("clip-path", "url(#clip)")
          .selectAll("#y2data").data(filtered_sources).enter();  // added

          main
          .append("g")
          .attr("id","y2Axis")
          .attr("class", "y axis")
          .attr("transform", "translate(" + (- 50 ) + ",0)")
          .call(d3.axisLeft(main_y2));

        var contextlineGroups = context
        .selectAll("#y2g")
        .data(filtered_sources)
        .enter()
        .append("g")
        .attr("id","y2g")
        ;

        var contextLines = contextlineGroups
        .append("path")
        .attr("id","y2data")
        .attr("class", "line")
        .style("stroke", function(d) { 
          return yAxis.find(ax => ax.field== d.name).color ;
         })
         .attr("clip-path", "url(#clip)")
        
        .attr("d", function (d) {
          return mini_line2(d.values);
        })
        .attr("clip-path", "url(#clip)")
        .selectAll("#y2data").data(filtered_sources).enter();  // added

        } 

      main
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + main_height + ")")
        .call(d3.axisBottom(main_x));

   

  

      // var contextlineGroups = context
      //   .selectAll("g")
      //   .data(sources)
      //   .enter()
      //   .append("g");


      //   //mini area config
      // var contextLines = contextlineGroups
      //   .append("path")
      //   .attr("class", "line")
      //   .attr("d", function (d) {
      //     return mini_line0(d.values);
      //     })
      //   // .style("stroke", function (d) {
      //   //   return color(d.name);
      //   // })
      //   .style("stroke", function(d) { 
      //     return yAxis.find(ax => ax.field == d.name).color ;
      //    })
      //   .attr("clip-path", "url(#clip)");

      context
        .append("g")
        .attr("class", "x axis2")
        .attr("transform", "translate(0," + mini_height + ")")
        .call(d3.axisBottom(mini_x));

      myBrush = d3
        .brushX()
        .extent([[mini_x.range()[0], 0], [mini_x.range()[1], mini_height]])
        //.on("start brush end", brushed);
        .on("brush end", brushed);

      // This was used before being changed to set an initial brush selection
      // context
      //   .append("g")
      //   .attr("class", "x brush")
      //   .call(myBrush)
      //   .selectAll("rect")
      //   .attr("y", -7)
      //   .attr("height", height2 + 7);

      // Set initial brush selection
      var begin = mini_x(new Date(mini_x.invert(mini_x.range()[1]).valueOf() - 1000 * 365 * 8 * 24 * 60 * 60));
      var begin = mini_x(new Date(mini_x.invert(mini_x.range()[1])));
      
      //var begin = 0;
      var end = mini_x.range()[1];
      context.append("g")
        .attr("class", "x brush")
        .call(myBrush);
       // .call(myBrush.move, [begin, end]);
       
       focus = main.append("g")
       .attr("class", "focus")
       .style("display", "none");

       focus.append("line")
      .attr("class", "x")
      .attr("y1", main_y0(0) - 6)
      .attr("y2", main_y0(0) + 6);

      focus.append("line")
      .attr("class", "y0")
      .attr("x1", main_width - 6)  
      .attr("x2", main_width + 6);  

      focus.append("line")
      .attr("class", "y1")
      .attr("x1", main_width - 6)
      .attr("x2", main_width + 6);

      
      focus.append("line")
      .attr("class", "y2")
      .attr("x1", main_width - 6)
      .attr("x2", main_width + 6);

      focus.append("circle")
       .attr("class", "y0")
        .attr("r", 4);

    

      focus.append("circle")
        .attr("class", "y1")
        .attr("r", 4);

        focus.append("circle")
        .attr("class", "y2")
        .attr("r", 4);

      //   focus.append("div")
      //   .attr("id", "div_y0")
      //   .attr("class", "div_y0")

      //   .style("position","absolute")
      //   .style("display","block")

      //  // .style("padding","6px")
      //   .style("background-color","black")
      //  // .style("opacity","1")
      //  // .style("display","block")
      //   .style("top","100px")
      //   .style("left","100px")
      //   .style("font-size","10px")

      tooltip0.append("text")
        .attr("class", "y0")
        .attr("dy", "-1em");


        // .append("text")
        // .attr("class", "y0")
        // .attr("dy", "-1em");

        tooltip1.append("text")
        .attr("class", "y1")
        .attr("dy", "-1em")
        ;

        tooltip2.append("text")
        .attr("class", "y2")
        .attr("dy", "-1em");

        main.append("rect")
        .attr("class", "overlay")
        .attr("width", main_width)
        .attr("height", main_height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

        function mousemove() {
          var x0 = main_x.invert(d3.pointer(event)[0]),
              i = bisectDate(data, x0, 1),
              d0 = data[i - 1],
              d1 = data[i],
              d = x0 - d0.date > d1.date - x0 ? d1 : d0;
              var xTranslate =  main_x(d[xFieldName]) ;
              if (xTranslate > 775 )
                  xTranslate = 775;
              focus.select(".x").attr("transform", "translate(" + main_x(d[xFieldName]) + ",0)");
              var suffix  = 0;
          //this bloc is for singly y axis with multiple measures
            //tooltip for Y0
            if (yAXisMeasures.length >= 1)
            {
              
               for (var i = 0; i < yAXisMeasures[0].fields.length; i++) 
               {
                let yField = yAXisMeasures[0].fields[i];
                focus.select("circle.y"+suffix).attr("transform", "translate(" + main_x(d[xFieldName]) + "," + main_y0(d[yField]) + ")");
                focus.select(".y"+suffix).attr("transform", "translate(" + main_width  + ", " + main_y0(d[yField]) + ")").attr("x2", main_width + main_x(d[xFieldName]));
                var element =  document.getElementById('div_y'+suffix) ;
                element.style.left = xTranslate+margin.left+5+"px";
                element.style.top =  main_y0(d[yField])+ margin.top+ 7+ "px";
                d3.select("text.y"+suffix).text(formatOutput(d, yField));

                // if (i==0)
                // {
                //   //focus.select("text.y"+suffix).text(formatOutput(d, yField));
                //   var element =  document.getElementById('div_y0') ;
                // //  element.setAttribute("transform", "translate(" + xTranslate + "," + main_y0(d[yField]) + ")"); 
                // element.style.left = xTranslate+margin.left+5+"px";
                // element.style.top =  main_y0(d[yField])+ margin.top+5+ "px";
                // d3.select("text.y"+suffix).text(formatOutput(d, yField));

                  
                // }
                // else
                // focus.select("text.y"+suffix).attr("transform", "translate(" + xTranslate + "," + main_y0(d[yField]) + ")").text(formatOutput(d, yField));

                suffix ++;
                
              }
             
              //  if (yAXisMeasures[0].fields.length >= 1)
              //  {
              //   focus.select("circle.y0").attr("transform", "translate(" + xTranslate + "," + main_y0(d.f0) + ")");
              //   focus.select("text.y0").attr("transform", "translate(" + xTranslate + "," + main_y0(d.f0) + ")").text(formatOutput0(d));
              //   focus.select(".y0").attr("transform", "translate(" + main_width  + ", " + main_y0(d.f0) + ")").attr("x2", main_width + main_x(d[xFieldName]));
              //  }
              //  if (yAXisMeasures[0].fields.length >= 2)
              //  {
              //   focus.select("circle.y0").attr("transform", "translate(" + xTranslate + "," + main_y0(d.f1) + ")");
              //   focus.select("text.y0").attr("transform", "translate(" + xTranslate + "," + main_y0(d.f1) + ")").text(formatOutput1(d));
              //   focus.select(".y0").attr("transform", "translate(" + main_width  + ", " + main_y0(d.f1) + ")").attr("x2", main_width + main_x(d[xFieldName]));
              //  }
              //  if (yAXisMeasures[0].fields.length >= 3)
              //  {
              //   focus.select("circle.y0").attr("transform", "translate(" + xTranslate + "," + main_y0(d.f2) + ")");
              //   focus.select("text.y0").attr("transform", "translate(" + xTranslate + "," + main_y0(d.f2) + ")").text(formatOutput2(d));
              //   focus.select(".y0").attr("transform", "translate(" + main_width * -1 + ", " + main_y0(d.f2) + ")").attr("x2", main_width + main_x(d[xFieldName]));
              //  }  
            }

          //tooltip for Y1
          if (yAXisMeasures.length >= 2)
          {
            for (var i = 0; i < yAXisMeasures[1].fields.length; i++) 
            {
             let yField = yAXisMeasures[1].fields[i];
             focus.select("circle.y"+suffix).attr("transform", "translate(" + main_x(d[xFieldName]) + "," + main_y1(d[yField]) + ")");
             focus.select("text.y"+suffix).attr("transform", "translate(" + xTranslate + "," + main_y1(d[yField]) + ")").text(formatOutput(d, yField));
             focus.select(".y"+suffix).attr("transform", "translate(" + main_width  + ", " + main_y1(d[yField]) + ")").attr("x2", main_width + main_x(d[xFieldName]));
             var element =  document.getElementById('div_y'+suffix) ;
             element.style.left = xTranslate+margin.left+5+"px";
             element.style.top =  main_y1(d[yField])+ margin.top+7+ "px";
             d3.select("text.y"+suffix).text(formatOutput(d, yField));

             suffix++;
            }
          
            // if (yAXisMeasures[1].fields.length >= 1)
            // {
            //  focus.select("circle.y1").attr("transform", "translate(" + xTranslate + "," + main_y1(d.f1) + ")");
            //  focus.select("text.y1").attr("transform", "translate(" + xTranslate + "," + main_y1(d.f1) + ")").text(formatOutput1(d));
            //  focus.select(".y1").attr("transform", "translate(" + main_width * -1 + ", " + main_y1(d.f1) + ")").attr("x2", main_width + main_x(d[xFieldName]));
            // }

            // if (yAXisMeasures[1].fields.length >= 2)
            // {
            //  focus.select("circle.y2").attr("transform", "translate(" + xTranslate + "," + main_y2(d.f2) + ")");
            //  focus.select("text.y2").attr("transform", "translate(" + xTranslate + "," + main_y2(d.f2) + ")").text(formatOutput2(d));
            //  focus.select(".y1").attr("transform", "translate(" + main_width * -1 + ", " + main_y2(d.f2) + ")").attr("x2", main_width + main_x(d[xFieldName]));
            // }

         
          }

          if (yAXisMeasures.length >= 3)
          {
            for (var i = 0; i < yAXisMeasures[2].fields.length; i++) 
            {
             let yField = yAXisMeasures[2].fields[i];
             focus.select("circle.y"+suffix).attr("transform", "translate(" + main_x(d[xFieldName]) + "," + main_y2(d[yField]) + ")");
             focus.select("text.y"+suffix).attr("transform", "translate(" + xTranslate + "," + main_y2(d[yField]) + ")").text(formatOutput(d, yField));
             focus.select(".y"+suffix).attr("transform", "translate(" + main_width  + ", " + main_y2(d[yField]) + ")").attr("x2", main_width + main_x(d[xFieldName]));
             var element =  document.getElementById('div_y'+suffix) ;
                element.style.left = xTranslate+margin.left+5+"px";
                element.style.top =  main_y2(d[yField])+ margin.top+ 7+"px";
                d3.select("text.y"+suffix).text(formatOutput(d, yField));
             suffix++;
            }
         
            // if (yAXisMeasures[2].fields.length >= 1)
            // {
            //  focus.select("circle.y2").attr("transform", "translate(" + xTranslate + "," + main_y2(d.f2) + ")");
            //  focus.select("text.y2").attr("transform", "translate(" + xTranslate + "," + main_y2(d.f2) + ")").text(formatOutput2(d));
            //  focus.select(".y2").attr("transform", "translate(" + main_width * -1 + ", " + main_y2(d.f2) + ")").attr("x2", main_width + main_x(d[xFieldName]));
            // }
          }
          //tooltip for Y2
          // focus.select("circle.y2").attr("transform", "translate(" + xTranslate + "," + main_y0(d.f2) + ")");
          // focus.select("text.y2").attr("transform", "translate(" + xTranslate + "," +  main_y0(d.f2) + ")").text(formatOutput2(d));
          // focus.select(".y2").attr("transform", "translate(" + main_width * -1 + ", " + main_y0(d.f2) + ")").attr("x2", main_width + main_x(d[xFieldName]));
   
        //todo bynamic positioning for multiple y axis 
     

      }
      this.refreshChart = function () {
        console.log("this should not be called");
        // sources.forEach(s => {
        //   var lastDate = s.values[s.values.length - 1].date.addMonths(1);
        //   var temperature = s.values.shift().temperature;
        //   s.values.push({ date: lastDate, temperature: temperature });
        // });

        // mini_x.domain([
        //   d3.min(sources, function (c) {
        //     return d3.min(c.values, function (v) {
        //       return v.date;
        //     });
        //   }),
        //   d3.max(sources, function (c) {
        //     return d3.max(c.values, function (v) {
        //       return v.date;
        //     });
        //   })
        // ]);
        main_x.domain(
          d3.extent(data, function (d) {
            return d[xFieldName];
          })
        );
        main_y0.domain([
          d3.min(sources, function (c) {
            return d3.min(c.values, function (v) {
              return v.value;
            });
          }),
          d3.max(sources, function (c) {
            return d3.max(c.values, function (v) {
              return v.value;
            });
          })
        ]);
        
        mini_y0.domain([
          d3.min(sources, function (c) {
            return d3.min(c.values, function (v) {
              return v.temperature;
            });
          }),
          d3.max(sources, function (c) {
            return d3.max(c.values, function (v) {
              return v.temperature;
            });
          })
        ]);
        var bs = d3.brushSelection(d3.select(".x.brush").node());
        if (bs) {
          main_x.domain([mini_x.invert(bs[0]), mini_x.invert(bs[1])]);
        } else {
          main_x.domain(mini_x.domain());
        }
        main_y0.domain(mini_y0.domain());

        var updateFocusData = main.selectAll("path.line").data(sources);
        updateFocusData
          .enter()
          .append("path")
          .attr("class", "line")
          .style("stroke", function (d) {
            return color(d.name);
          })
          .attr("clip-path", "url(#clip)")
          .merge(updateFocusData)
          .attr("d", function (d) {
            return main_line0(d.values);
          });

        updateFocusData.exit().remove();

        var updateContextData = context.selectAll("path.line").data(sources);
        updateContextData
          .enter()
          .append("path")
          .attr("class", "line")
          .style("stroke", function (d) {
            return color(d.name);
          })
          .attr("clip-path", "url(#clip)")
          .merge(updateContextData)
          .attr("d", function (d) {
            return mini_line0(d.values);
          });

        updateContextData.exit().remove();
       
        main.select(".x.axis").call(d3.axisBottom(main_x));
        main.select(".y.axis").call(d3.axisLeft(main_y0));
        context.select(".x.axis2").call(d3.axisBottom(mini_x));

       

      }; // end refreshChart

      
      
        

      // Trigger event
      d3.select("#liveData").dispatch("click");
//    } // lcosing of function error, data
//  );// closing of d3.csv


  function brushed(event) {
    var s = event.selection;

    main_x.domain(
      s === null
        ? mini_x.domain()
        : [mini_x.invert(s[0]), mini_x.invert(s[1])]
    );

    // main.selectAll("path.line").attr("d", function (d) {
    //   return main_line0(d.values);
    // });
    
    var element = document.getElementById("y0Axis");
    if( typeof(element) != 'undefined' && element != null)
    {
      main.selectAll("#y0data").attr("d", function (d) {return main_line0(d.values);  });
      main.select("#y0Axis").call(d3.axisLeft(main_y0));
    }
    element = document.getElementById("y1Axis");
    if( typeof(element) != 'undefined' && element != null)
    {
      main.selectAll("#y1data").attr("d", function (d) { return main_line1(d.values);  });
      main.select("#y1Axis")
      .attr("transform", "translate(" + (main_width ) + ",0)")
      .call(d3.axisRight(main_y1));
    }
    element = document.getElementById("y2Axis");
    if( typeof(element) != 'undefined' && element != null)
    {
      main.selectAll("#y2data").attr("d", function (d) {return main_line2(d.values);  });
      main.select("#y2Axis").call(d3.axisLeft(main_y2));
    }
    main.selectAll(".x.axis").call(d3.axisBottom(main_x));
  
  }

  // Date.prototype.addMonths = function (months) {
  //   var dat = new Date(this.valueOf());
  //   dat.setMonth(dat.getMonth() + months);
  //   return dat;
  // };

}); // selection for each close
//refreshGraph(null);
    } // function chart clsoe

   

    this.refreshGraph = function refreshGraph(arr)
    {
      
      // color.domain(
      //   Object.keys(arr[0]).filter(function (key) {
      //     return key !== "date";
      //   })
      // );
    //   svg
    // .append('defs')
    // .append('marker')
    // .attr('id', 'dot')
    // .attr('viewBox', [0, 0, 20, 20])
    // .attr('refX', 10)
    // .attr('refY', 10)
    // .attr('markerWidth', 10)
    // .attr('markerHeight', 10)
    // .append('circle')
    // .attr('cx', 10)
    // .attr('cy', 10)
    // .attr('r', 10)
    // .style('fill', 'green');

      if (arr != null)
      {
        sources = color.domain().map(function (name) {
          return {
            name: name,
            values: arr.map(function (d) {
              return { date: d[xFieldName], value: +d[name] };
            })
          };
        });
      }
      
      //refreshChart();
      //this.refreshChart();
      var updateFocusData ;
      var updateContextData;
 
    
      mini_x.domain([
        d3.min(sources, function (c) {
          return d3.min(c.values, function (v) {
            return v.date;
          });
        }),
        d3.max(sources, function (c) {
          return d3.max(c.values, function (v) {
            return v.date;
          });
        })
      ]);
       

      var bs = d3.brushSelection(d3.select(".x.brush").node());
      if (bs) {
        main_x.domain([mini_x.invert(bs[0]), mini_x.invert(bs[1])]);
      } else {
        main_x.domain(mini_x.domain());
      }
     
      svg.selectAll(".dot0").remove();
      if (yAXisMeasures.length >= 1 && yAXisMeasures[0].fields.length > 0)
      {
        filtered_sources = sources.filter(element => yAXisMeasures[0].fields.includes(element.name));

        mini_y0.domain([
          d3.min(filtered_sources, function (c) {
            return d3.min(c.values, function (v) {
              return v.value;
            });
          }),
          d3.max(filtered_sources, function (c) {
            return d3.max(c.values, function (v) {
              return v.value;
            });
          })
        ]);
        main_y0.domain(mini_y0.domain());

         main.selectAll("#y0g").data(filtered_sources);
         updateFocusData = main.selectAll("#y0data").data(filtered_sources);

         updateFocusData
          .enter()
          .append("path")
          .attr("id","y0data")
          .attr("class", "line")
          .style("stroke", function (d) { return color(d.name); })
          .style("opacity",1)
          .attr("clip-path", "url(#clip)")
          .merge(updateFocusData)
          .attr("d", function (d) { return main_line0(d.values); });
      
      

          updateFocusData.exit().remove();
          context.selectAll("#y0g").data(filtered_sources);
          updateContextData = context.selectAll("#y0data").data(filtered_sources);
          updateContextData
            .enter()
            .append("path")
            .attr("id","y0data")
            .attr("class", "line")
            .style("stroke", function (d) {   return color(d.name);   })
            .attr("clip-path", "url(#clip)")
            .merge(updateContextData)
            .attr("d", function (d) {   return mini_line0(d.values);   });

          updateContextData.exit().remove();
          main.select("#y0Axis").call(d3.axisLeft(main_y0));


          main.select(".x.axis").call(d3.axisBottom(main_x));
          context.select(".x.axis2").call(d3.axisBottom(mini_x));

        

          for(var i = 0; i < filtered_sources.length; i++)
          {
              //.style("stroke", function() {  return yAxis.find(ax => ax.field== d.name).color ;   })
               circleColor = function() {  return yAxis.find(ax => ax.field== filtered_sources[i].name).color ;  }
              svg.selectAll("#dot0"+i)
              .data(filtered_sources[i].values.slice(-1)  )
              .enter().append("circle") // Uses the enter().append() method
              .attr("class", "dot0") // Assign a class for styling
              .attr("id","dot0"+i)
              .style("stroke",circleColor)
              .style("fill",circleColor)
              .attr("cx", function(d, i) { return main_x(d.date) +margin.left-5 })
              .attr("cy", function(d) { return main_y0(d.value) +margin.top})
              .attr("r", 5);
          }
      }

      svg.selectAll(".dot1").remove();

      if (yAXisMeasures.length >= 2 && yAXisMeasures[1].fields.length > 0)
      {
        filtered_sources = sources.filter(element => yAXisMeasures[1].fields.includes(element.name));
        mini_y1.domain([
          d3.min(filtered_sources, function (c) {
            return d3.min(c.values, function (v) {
              return v.value;
            });
          }),
          d3.max(filtered_sources, function (c) {
            return d3.max(c.values, function (v) {
              return v.value;
            });
          })
        ]);
        main_y1.domain(mini_y1.domain());
         main.selectAll("#y1g").data(filtered_sources);
         updateFocusData = main.selectAll("#y1data").data(filtered_sources);

         updateFocusData
          .enter()
          .append("path")
          .attr("id","y1data")
          .attr("class", "line")
          .style("stroke", function (d) { return color(d.name); })
          .style("opacity",1)
          .attr("clip-path", "url(#clip)")
          .merge(updateFocusData)
          .attr("d", function (d) { return main_line1(d.values); });

            updateFocusData.exit().remove();
            context.selectAll("#y1g").data(filtered_sources);
            updateContextData = context.selectAll("#y1data").data(filtered_sources);
            updateContextData
              .enter()
              .append("path")
              .attr("id","y1data")
              .attr("class", "line")
              .style("stroke", function (d) {   return color(d.name);   })
              .attr("clip-path", "url(#clip)")
              .merge(updateContextData)
              .attr("d", function (d) {   return mini_line1(d.values);   });

            updateContextData.exit().remove();
            main.select("#y1Axis").call(d3.axisRight(main_y1));

            main.select(".x.axis").call(d3.axisBottom(main_x));
            context.select(".x.axis2").call(d3.axisBottom(mini_x));
            
         for(var i = 0; i < filtered_sources.length; i++)
          {
               circleColor = function() {  return yAxis.find(ax => ax.field== filtered_sources[i].name).color ;  }
              svg.selectAll("#dot1"+i)
              .data(filtered_sources[i].values.slice(-1)  )
              .enter().append("circle") // Uses the enter().append() method
              .attr("class", "dot1") // Assign a class for styling
              .attr("id","dot1"+i)
              .style("stroke",circleColor)
              .style("fill",circleColor)
              .attr("cx", function(d, i) { return main_x(d.date) +margin.left-5})
              .attr("cy", function(d) { return main_y1(d.value) +margin.top})
              .attr("r", 5);
          }

      }
      svg.selectAll(".dot2").remove();
      if (yAXisMeasures.length >= 3 && yAXisMeasures[2].fields.length > 0)
      {
        filtered_sources = sources.filter(element => yAXisMeasures[2].fields.includes(element.name));
        mini_y2.domain([
          d3.min(filtered_sources, function (c) {
            return d3.min(c.values, function (v) {
              return v.value;
            });
          }),
          d3.max(filtered_sources, function (c) {
            return d3.max(c.values, function (v) {
              return v.value;
            });
          })
        ]);
        main_y2.domain(mini_y2.domain());

         main.selectAll("#y2g").data(filtered_sources);
         updateFocusData = main.selectAll("#y2data").data(filtered_sources);

         updateFocusData
          .enter()
          .append("path")
          .attr("id","y2data")
          .attr("class", "line")
          .style("stroke", function (d) { return color(d.name); })
          .style("opacity",1)
          .attr("clip-path", "url(#clip)")
          .merge(updateFocusData)
          .attr("d", function (d) { return main_line2(d.values); });
      
      

            updateFocusData.exit().remove();
            context.selectAll("#y2g").data(filtered_sources);
            updateContextData = context.selectAll("#y2data").data(filtered_sources);
            updateContextData
              .enter()
              .append("path")
              .attr("id","y2data")
              .attr("class", "line")
              .style("stroke", function (d) {   return color(d.name);   })
              .attr("clip-path", "url(#clip)")
              .merge(updateContextData)
              .attr("d", function (d) {   return mini_line2(d.values);   });

            updateContextData.exit().remove();
            main.select("#y2Axis").call(d3.axisLeft(main_y2));

            for(var i = 0; i < filtered_sources.length; i++)
            {
                 circleColor = function() {  return yAxis.find(ax => ax.field== filtered_sources[i].name).color ;  }
                svg.selectAll("#dot2"+i)
                .data(filtered_sources[i].values.slice(-1)  )
                .enter().append("circle") // Uses the enter().append() method
                .attr("class", "dot1") // Assign a class for styling
                .attr("id","dot2"+i)
                .style("stroke",circleColor)
                .style("fill",circleColor)
                .attr("cx", function(d, i) { return main_x(d.date) +margin.left-5})
                .attr("cy", function(d) { return main_y2(d.value) +margin.top})
                .attr("r", 5);
            }

           
      }

    
    
    }
  
    return chart;
  
}// trendchart function  close