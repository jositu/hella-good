function Parallel_Coords(container, data, policedata, initialStates) {

    var margin = marginPcoords;
    var width = widthPcoords;
    var height = heightPcoords;

    // create the svg canvas
    var svg = container
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // create x and y variables
    var x = d3.scaleBand().range([0, width]).padding(.1);
    var y = {};
    var dragging = {};
    var line = d3.line();

    // find position of an axis
    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    // path of a given data point
    function path(d) {
        return line(dimensions.map(function (p) {
            return [position(p), y[p](d[p])];
        }));
    }

    var legend2 = d3.select("#legend2")
    .append("svg");

    // legend2.append("rect")
    //     .attr("x", 50)
    //     .attr("y", 50)
    //     .attr("width", 20)
    //     .attr("height", 20)
    //     .style("fill", "white");
    //     .style("opacity", +0.5);

    legend2.append("text") 
        .attr("x", 30)
        .attr("y", 30)
        .style("stroke", "#fff")
        // .style("opacity", 1)
        .text("White: cities without shootings");



    this.update = function (data, targetStates) {
        svg.selectAll("*").remove();

        var filteredData = data.filter(function (d) {
            for (i = 0; i < targetStates.length; i++) {
                if (d["Geographic Area"] === targetStates[i])
                    return d;
            }
        });

        var filteredPoliceData = policedata.filter(function (d) {
           for (i = 0; i < targetStates.length; i++) {
               if (d["state"] === targetStates[i])
                return d;
           } 
        });

        var targetCities = new Set();
       filteredPoliceData.forEach(function(d) {
            if (targetCities.has(d.city)) {}
            else targetCities.add(d.city.toLowerCase());
        });

        var targetData = filteredData.filter(function(d) {
            if (targetCities.has(d["City"].toLowerCase())) {
                return d;
            }
        });

        var ftotal = Object.keys(filteredData).length;
        var dtotal = Object.keys(targetData).length;
        var total = Object.keys(data).length;

        // find the dimensions (axes)
        x.domain(dimensions = d3.keys(data[0]).filter(function (d) {
            return d != "Geographic Area" 
                && d != "City" 
                && d != "actual_completed_hs" 
                && d != "actual_poverty_rate" 
                && d != "actual_share_asian" 
                && d != "actual_share_black" 
                && d != "actual_share_hispanic"
                && d != "actual_share_white"
                && d != "actual_share_native_american"
                && d != "population"
                && (y[d] = d3.scaleLinear()
                .domain(d3.extent(data, function (p) {
                    return +p[d];
                }))
                .range([height, 0]));
        }));

        // add lines for all cities in that state (filtered Data)
        var background = svg.append("g")
            .attr("class", "background")
            .selectAll("path")
            .data(filteredData)
            .enter()
            .append("path")
            .attr("d", path)
            // .style("stroke", function(d) {return color(d["Geographic Area"]);})
            .style("opacity", +((total - ftotal) / total) * 0.03);

        // add lines for only cities that had shootings (target Data)
        var foreground = svg.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(targetData)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke", function(d) {return color(d["Geographic Area"]);})
            .style("opacity", +((total - dtotal) / total) * 0.7);

        // add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter()
            .append("g")
            .attr("class", "dimension")
            .attr("transform", function (d) {
                return "translate(" + x(d) + ")";
            });

        // add ticks for axes
        g.append("g")
            .attr("class", "axis")
            .each(function (d) {
                d3.select(this).call(d3.axisLeft(y[d]).ticks(5));
            });

        // add genre labels for each axis
        g.append("text")
            .style("text-anchor", "start")
            .attr("y", -15)
            .attr("x", +0)
            .attr("transform", function(d) {return "rotate(-45)";})
            .attr("font-size", 12)
            .text(function (d) {
                if (d === "percent_completed_hs") {
                    return "% Completed HS";
                }
                if (d === "Median Income") {
                    return "Median Income";
                }
                if (d === "poverty_rate") {
                    return "Poverty Rate";
                }
                if (d === "share_white") {
                    return "% White";
                }
                if (d === "share_black") {
                    return "% Black";
                }
                if (d === "share_native_american") {
                    return "% Native American";
                }
                if (d === "share_asian") {
                    return "% Asian";
                }
                if (d === "share_hispanic") {
                    return "% Hispanic";
                }
            });
    };

    this.update(data, initialStates);
}