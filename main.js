var margin = {top: 50, right: 0, bottom: 30, left: 0};
var width = 900 - margin.left - margin.right;
var height = 800 - margin.top - margin.bottom;

// pre-cursors
var sizeForCircle = function(d) {
  // Say from .43 to .57 scale to 5 - 20
  return (d.winRate * d.winRate) * 60;
}

//Gets the value of the drop down menu
//var statChoice = document.getElementById('selectElementId');
// load data
d3.csv("league_data.csv", function(error, data) {
  
  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.Role = d["Role"];
    d.Name = d["Champion"];
    d.Gold = +d["Gold Earned"];
    d.winRate = +d["Win Percent"];
    d.Kills = +d.Kills;
    d.Deaths = +d.Deaths;
    d.Assists = +d.Assists;
    d.KDA = +((d.Kills + d.Assists)/d.Deaths);
    d.averageDamage = +d["Damage Dealt"];
  });

  var scatterplot = d3.select(".scatterplot")
  var selectData = [ { "text" : "Gold" },
                       { "text" : "Deaths" },
                       { "text" : "Assists" },
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

  // add the graph canvas to the body of the webpage
  var svg = d3.select(".scatterplot").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // add the tooltip area to the webpage
  var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  
  // TODO: DYNAMICALLY CHANGE Y AXIS DEPENDING ON WHAT IS CLICKED
  // setup x
  var xValue = function(d) { return d.Kills;}, // data -> value 
      xScale = d3.scale.linear().domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]).range([0, width]), // value -> display
      xMap = function(d) { return xScale(xValue(d));}, // data -> display
      xAxis = d3.svg.axis().scale(xScale).orient("bottom");

  // setup y
  var yValue = function(d) { return d.Gold;}, // data -> value
      yScale = d3.scale.linear().domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]).range([height, 0]), // value -> display
      yMap = function(d) { return yScale(yValue(d));}, // data -> display
      yAxis = d3.svg.axis().scale(yScale).orient("right");

  // setup fill color
  var cValue = function(d) { return d.Role;},
      color = d3.scale.category10();


  // don't want dots overlapping axis, so add in buffer to data domain
 // xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
 // yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .attr("fill", "white")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text("Kills");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .attr('id' , 'yAxis')
      .attr("fill", "white")
      .call(yAxis)
    .append("text")
      .attr('id', 'yAxisLabel')
      .attr("y", -15)
      .attr("x", 40)
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
          tooltip.html("Champion Name: " + d.Name + "<br/>"
            + "Role: " + d.Role + "<br/>"
            + "Kills: " + d.Kills + "<br/>"
            + "Gold: " + d.Gold + "g")
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
        //TODO
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
      .delay(function (d,i) { return i*50})
        .attr('cy',function (d) { return yScale(d[value]) })
  }

  // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text(function(d) { return d;});



});
