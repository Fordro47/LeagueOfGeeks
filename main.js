var margin = {top: 50, right: 20, bottom: 30, left: 60};
var width = 700 - margin.left - margin.right;
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

  // setup fill bubble color
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
              var canvasWidth = 500, //width
                  canvasHeight = 500,   //height
                  outerRadius = 180;   //radius

            // Draw new sub-title
            var element = document.getElementById("itemHeader");       
            element.innerHTML = "                      Item Build Order: " + d.Name;

              var dataSet = [
                  {"legendLabel": d.FirstItemName, "magnitude":d.FirstItemPercent}, 
                  {"legendLabel":d.SecondItemName, "magnitude":d.SecondItemPercent},
                  {"legendLabel":d.ThirdItemName, "magnitude":d.ThirdItemPercent},
                  {"legendLabel":d.FourthItemName, "magnitude":d.FourthItemPercent},
                  {"legendLabel":d.FifthItemName, "magnitude":d.FifthItemPercent},
                  {"legendLabel":d.SixthItemName, "magnitude":d.SixthItemPercent}];

            
            var vis = d3.select(".piechart")
              .append("svg:svg") //create the SVG element inside the <body>
                .data([dataSet]) //associate our data with the document
                .attr("width", canvasWidth) //set the width of the canvas
                .attr("height", canvasHeight) //set the height of the canvas
                .append("svg:g") //make a group to hold our pie chart
                  .attr("transform", "translate(" + 1.5*outerRadius + "," + 1.5*outerRadius + ")") // relocate center of pie to 'outerRadius,outerRadius'

            // This will create <path> elements for us using arc data...
            var arc = d3.svg.arc()
              .outerRadius(outerRadius);

            var pie = d3.layout.pie() //this will create arc data for us given a list of values
              .value(function(d) { return d.magnitude; }) // Binding each value to the pie
              .sort( function(d) { return null; } );

            // Select all <g> elements with class slice (there aren't any yet)
            var arcs = vis.selectAll("g.slice")
              // Associate the generated pie data (an array of arcs, each having startAngle,
              // endAngle and value properties) 
              .data(pie)
              // This will create <g> elements for every "extra" data element that should be associated
              // with a selection. The result is creating a <g> for every object in the data array
              .enter()
              // Create a group to hold each slice (we will have a <path> and a <text>
              // element associated with each slice)
              .append("svg:g")
              .attr("class", "slice");    //allow us to style things in the slices (like text)

            arcs.append("svg:path")
              //set the color for each slice to be chosen from the color function defined above
              .attr("fill", function(d, i) { return color(i); } )
              //this creates the actual SVG path using the associated data (pie) with the arc drawing function
              .attr("d", arc);

            // Add a legendLabel to each arc slice...

            arcs.append("svg:text")
              .attr("transform", function(d) { //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                d.outerRadius = outerRadius + 50; // Set Outer Coordinate
                d.innerRadius = outerRadius + 45; // Set Inner Coordinate
                return "translate(" + arc.centroid(d) + ")";
              })
              .attr("text-anchor", "middle") //center the text on it's origin
              .style("fill", "white")
              .style("font", "bold 12px Arial")
              .text(function(d, i) { return dataSet[i].legendLabel; }); //get the label from our original data array

            // Add a magnitude value to the larger arcs, translated to the arc centroid and rotated.
            var count = 0;  
            arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("svg:text")
              .attr("dy", ".35em")
              .attr("text-anchor", "middle")
              //.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
              .attr("transform", function(d) { //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                d.outerRadius = outerRadius; // Set Outer Coordinate
                d.innerRadius = outerRadius/2; // Set Inner Coordinate
                return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
              })
              .style("fill", "White")
              .style("font", "bold 12px Arial")
              .text(function(d) { count++; return "Item " + count; });

            // Computes the angle of an arc, converting from radians to degrees.
            function angle(d) {
              var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
              return a > 90 ? a - 180 : a;
            }
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

  // draw line graph legend
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
