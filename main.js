(function chart() {

  var width = 960,
      height = 500,
      centered;

  var d3_map = d3.map();

  var quantize = d3.scale.quantize()
      .domain([0, 5])
      .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

  var projection = d3.geo.mercator()
            .center([-120.574951, 47.361153])
            .scale(5000)
            .translate([(width) / 2, (height)/2]);

  var path = d3.geo.path()
          .projection(projection);


  var svg = d3.select("#ca-chart").append("svg")
      .attr("width", width)
      .attr("height", height);

  var tooltip = d3.select("#ca-chart").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height)
      .on("click", clicked);

  var g = svg.append("g");

  d3.json("data/wa_zcta.topojson", function (error, zipcode) {

    d3.csv("data/wa_zipcodes_rental_prices.csv", function (error, data) {
      var price = {};

      data.forEach(function (d) {
        var num = Math.round(+d.values * 100) / 100
        price[d.zip.toString()] = num;
        //debugger;
      });

    var features = topojson.feature(zipcode, zipcode.objects.tl_2010_53_zcta510).features;

    g.append("g")
        .attr("class", "state")
      .selectAll("path")
        .data(topojson.feature(zipcode, zipcode.objects.tl_2010_53_zcta510).features)
      .enter().append("path")
        .attr("d", path)
        .attr("stroke", "#333")
        .attr("stroke-width", "1.5px")
        .attr("fill", "#fff");

    g.append("g")
        .attr("class", "zipcodes")
      .selectAll("path")
        .data(features)
      .enter().append("path")
        .attr("class", function(d){
          if(d !== undefined){
             var d = quantize(+price[d.properties.zipcode]);
          } else {
            var d = 0;
          }
          return d;
        })
        .attr("d", path)
        .on("click", clicked)
        .on("mouseover", function(d) {
          
          d3.select(this.parentNode.appendChild(this))
                  .style("stroke", "#F00");

              tooltip.transition()
                  .duration(250)
                  .style("opacity", 1);

              tooltip
                  .html("<p><strong>Zipcode: " + getZip(d) + "<br>Rental Prices: "  + get_numeric_variable(d, price) + "</strong></p>")
                  .style("left", (d3.event.pageX + 25) + "px")
                  .style("top",  (d3.event.pageY - 28) + "px");

         }).on("mouseout", mouseout);
  });
});

  function coalesce(d){
    if(d !== undefined){
       var d = d;
    } else {
      var d = 0;
    }
    return d;
  }

//  function getColorClass(d) {
//    return quantize(price[d.properties.zipcode]);
//  }

  // Get numeric value from dictionary built with csv file
  function get_numeric_variable(d, price) {
    if(d !== undefined){
       var num_var = price[getZip(d)];
    } else {
      var num_var = 0;
    }
    return num_var;
  }


  function getZip(d) {
    return d && d.properties ? d.properties.zipcode : 0;
  }

  function mouseout(d) {
    d3.select(this)
        .style("stroke", null);

    tooltip.transition()
        .duration(250)
        .style("opacity", 0);
  }

  function mouseover(d, price) {
  
    d3.select(this.parentNode.appendChild(this))
        .style("stroke", "#F00");

    tooltip.transition()
        .duration(250)
        .style("opacity", 1);

    tooltip
        .html("<p><strong>Zipcode: " + getZip(d) + "<br>Rental Prices: "  + get_numeric_variable(d, price) + "</strong></p>")
        .style("left", (d3.event.pageX + 25) + "px")
        .style("top",  (d3.event.pageY - 28) + "px");
    }

  function clicked(d) {
    var x, y, k;

    if (d && centered !== d) {
      var centroid = path.centroid(d);
      x = centroid[0];
      y = centroid[1];
      k = 8;    // control zoom depth
      centered = d;
    } else {
      x = width / 2;
      y = height / 2;
      k = 1;
      centered = null;
    }

    g.selectAll("path")
        .classed("active", centered && function(d) { return d === centered; });

    g.transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px");
  }

  d3.select(self.frameElement).style("height", height + "px");

}());
