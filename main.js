var margin = {top: 50, right: 20, bottom: 30, left: 80};
var width = 850 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

// pre-cursors
var sizeForCircle = function(d) {
  // Say from .43 to .57 scale to 5 - 20
  return (d.winRate * d.winRate) * 60;
}


//Gets the value of the drop down menu
//var statChoice = document.getElementById('selectElementId');
// load data
d3.csv("league_data_item_realdata.csv", function(error, data) {
  
  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.Role = d["Role"];
    d.Name = d["Champion"];
    d.Gold = +d["Gold Earned"];
    d.winRate = +d["Win Percent"];
    d.playRate = +d["Play Percent"];
    d.Kills = +d.Kills;
    d.Deaths = +d.Deaths;
    d.Assists = +d.Assists;
    d.KDA = +((d.Kills + d.Assists)/d.Deaths);
    d.DMG_Dealt = +d["Damage Dealt"];
    d.DMG_Taken = +d["Damage Taken"];
    d.Minions = +d["Minions Killed"];
    d.Healing = +d["Total Healing"];

    d.FirstItemName = d["FirstItemName"];
    d.SecondItemName = d["SecondItemName"];
    d.ThirdItemName = d["ThirdItemName"];
    d.FourthItemName = d["FourthItemName"];
    d.FifthItemName = d["FifthItemName"];
    d.SixthItemName = d["SixthItemName"];

    d.FirstItemPercent = +d.FirstItemPercent;
    d.SecondItemPercent = +d.SecondItemPercent;
    d.ThirdItemPercent = +d.ThirdItemPercent;
    d.FourthItemPercent = +d.FourthItemPercent;
    d.FifthItemPercent = +d.FifthItemPercent;
    d.SixthItemPercent = +d.SixthItemPercent;

  });

  var scatterplot = d3.select(".scatterplot")
  var selectData = [ { "text" : "Gold" },
                       { "text" : "Kills" },
                       { "text" : "Deaths" },
                       { "text" : "Assists" },
                       { "text" : "DMG_Dealt" },
                       { "text" : "DMG_Taken" },
                       { "text" : "KDA" },
                       { "text" : "Minions" },
                       { "text" : "Healing" },
                     ]
  var selectRoleData = [ { "text" : "Top" },
                       { "text" : "Middle" },
                       { "text" : "Support" },
                       { "text" : "Jungle" },
                       { "text" : "ADC" },
                       { "text" : "Show All" },
                     ]

 // Select Y-axis Variable
  var span = scatterplot.append('span')   
      .text('Select Y-Axis Variable: ')
  var ySelect = scatterplot.append('select')
      .attr('class','ySelect')
      .on('change',yChange)
    .selectAll('option')
      .data(selectData)
      .enter()
    .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;})
  scatterplot.append('br')

  // Select X-axis Variable
  var span = scatterplot.append('span')   
      .text('Select X-Axis Variable: ')
  var xSelect = scatterplot.append('select')
      .attr('class','xSelect')
      .on('change',xChange)
    .selectAll('option')
      .data(selectData)
      .enter()
    .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;})
  scatterplot.append('br')

  //Filter Role
  var span = scatterplot.append('span')
      .text('Select Role to Filter by: ')
  var roleSelect = scatterplot.append('select')
      .attr('class', 'roleSelect')
      .on('change', roleChange)
    .selectAll('option')
      .data(selectRoleData)
      .enter()
    .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;})
  scatterplot.append('br')

  // add the graph canvas to the body of the webpage
  var svg = d3.select(".scatterplot").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        //.call(d3.behavior.zoom().x(xValue).y(yValue).scaleExtent([1, 8]).on("zoom", zoom))
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // add the tooltip area to the webpage
  var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  
  // TODO: DYNAMICALLY CHANGE Y AXIS DEPENDING ON WHAT IS CLICKED
  // setup x
  var xValue = function(d) { return d.Gold;}, // data -> value 
      xScale = d3.scale.linear().domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]).range([0, width]), // value -> display
      xMap = function(d) { return xScale(xValue(d));}, // data -> display
      xAxis = d3.svg.axis().scale(xScale).orient("bottom");

  // setup y
  var yValue = function(d) { return d.Gold;}, // data -> value
      yScale = d3.scale.linear().domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]).range([height, 0]), // value -> display
      yMap = function(d) { return yScale(yValue(d));}, // data -> display
      yAxis = d3.svg.axis().scale(yScale).orient("left");

  // setup fill color
  var cValue = function(d) { return d.Role;},
      color = d3.scale.category10();


  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr('id', 'xAxis')
      .attr("transform", "translate(0," + height + ")")
      .attr("fill", "white")
      .call(xAxis)
    .append("text")
      .attr('id', 'xAxisLabel')
      .attr("x", width)
      .attr("y", -6)
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text("Gold");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .attr('id' , 'yAxis')
      .attr("fill", "white")
      .call(yAxis)
    .append("text")
      .attr('id', 'yAxisLabel')
      .attr("y", -15)
      .attr("x", 20)
      .attr("dy", ".71em")
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text("Gold");



  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", sizeForCircle)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));})
      .style("opacity", .7)
      .on("mouseover", function(d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
          tooltip.html("Champion: " + d.Name + "<br/>"
            + "Role: " + d.Role + "<br/>"
            + "Win Rate: " + (d.winRate*100).toPrecision(3) + "%" + "<br/>"
            + "Play Rate: " + (d.playRate*100).toPrecision(3) + "%")
            .style("left", (d3.event.pageX) +"px")
            .style("top", (d3.event.pageY - 28) +"px");
      })
      .on("mouseout", function(d) {
          // TODO: hide the tooltip
           tooltip.transition()
            .duration(500)
            .style("opacity", 0);
          // TODO: resize the nodes

      })
       .on("click", function(d){
            //redraw dots (erase old halo)
            d3.selectAll('circle').transition().duration(500).style("opacity", .7)
              .style("stroke-width", 0);
              

            //draw halo on selected champ bubble
            d3.select(this).transition()
              .duration(750)
              .style("opacity", 1)
              .style("stroke", "white")
              .style("stroke-width", 1);

            //Erase old pie chart
            d3.select(".piechart").selectAll("svg").remove();

            var w = 400,                        //width
              h = 400,                            //height
              r = 200;                            //radius
              itemData = [{"label": d.FirstItemName, "value":d.FirstItemPercent}, 
                      {"label":d.SecondItemName, "value":d.SecondItemPercent},
                      {"label":d.ThirdItemName, "value":d.ThirdItemPercent},
                      {"label":d.FourthItemName, "value":d.FourthItemPercent},
                      {"label":d.FifthItemName, "value":d.FifthItemPercent},
                      {"label":d.SixthItemName, "value":d.SixthItemPercent}];

            var element = document.getElementById("itemHeader");       
            element.innerHTML = "Item Build Order: " + d.Name;

            
            var vis = d3.select(".piechart")
                .append("svg:svg")              //create the SVG element inside the <body>
                .data([itemData])                   //associate our data with the document
                    .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
                    .attr("height", h)
                .append("svg:g")                //make a group to hold our pie chart
                    .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius
            var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
                .outerRadius(r);
            var pie = d3.layout.pie()           //this will create arc data for us given a list of values
                .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array
            var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
                .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
                .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
                    .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                        .attr("class", "slice");    //allow us to style things in the slices (like text)
                arcs.append("svg:path")
                        .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
                        .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function
                arcs.append("svg:text")                                     //add a label to each slice
                        .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                        //we have to make sure to set these before calling arc.centroid
                        d.innerRadius = 0;
                        d.outerRadius = r;
                        return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
                    })
                    .attr("text-anchor", "middle")                          //center the text on it's origin
                    .text(function(d, i) { return itemData[i].label + ": " + itemData[i].value + "%"; });      //get the label from our original data array
      });

  // Dynamic update y-axis variable
  function yChange() {
    var value = this.value // get the new y value
    var yValue = function(d) { return d[value];};
    yScale // change the yScale
      .domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1])
    yAxis.scale(yScale) // change the yScale
    d3.select('#yAxis') // redraw the yAxis
      .transition().duration(500)
      .call(yAxis)
    d3.select('#yAxisLabel') // change the yAxisLabel
      .text(value)    
    d3.selectAll('circle') // move the circles
      .transition().duration(500)
      .delay(function (d,i) { return i*40})
        .attr('cy',function (d) { return yScale(d[value]) })
  }
  // Dynamic update x-axis variable
  function xChange() {
    var value = this.value // get the new x value
    var xValue = function(d) { return d[value];};
    xScale // change the xScale
      .domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1])
    xAxis.scale(xScale) // change the xScale
    d3.select('#xAxis') // redraw the xAxis
      .transition().duration(500)
      .call(xAxis)
    d3.select('#xAxisLabel') // change the xAxisLabel
      .transition().duration(500)
      .text(value)
    d3.selectAll('circle') // move the circles
      .transition().duration(500)
      .delay(function (d,i) { return i*40})
        .attr('cx',function (d) { return xScale(d[value]) })
  }

// Role Filtering
  function roleChange() {
    var value = this.value
    if (value == "Show All"){
      d3.selectAll("circle")
      .transition().duration(500)
      .delay(function (d,i) { return i*10})
      .attr("visibility", "visible")
    }
    else{
      d3.selectAll("circle")
        .transition().duration(500)
        .delay(function (d,i) { return i*10})
        .attr("visibility", "hidden")
      d3.selectAll("circle")
        .filter( function(d) { return d.Role == value })
          .transition().duration(500)
          .delay(function (d,i) { return i*40})
          .attr("visibility", "visible")
    }
  }

//   function click() {
//     d3.select(this).transition()
//         .duration(750)
//         .style("opacity", 1)
//         .style("stroke", "white"); 
// }

// // action to take on mouse double click
// function dblclick() {
//     d3.select(this).transition()
//         .duration(750)
//         .style("opacity", .7)
//         .style("stroke-width", 0)
//         //.style("stroke", ); 
// }

  // function zoom() {
  //   circle.attr("transform", transform);
  // }

  // function transform(d) {
  //   return "translate(" + xValue(d[0]) + "," + yValue(d[1]) + ")";
  // }

  // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("y", +280)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", +288)
      .attr("dy", ".35em")
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text(function(d) { return d;});

});
