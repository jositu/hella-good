function Parallel_Coords(container, data, initialStates) {

    var margin = marginPcoords;
    var width = widthPcoords;
    var height = heightPcoords;

    // create the svg canvas
    var svg = d3.select('#pcoords-holder')
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

    function transition(g) {
        return g.transition().duration(200);
    }

    // path of a given data point
    function path(d) {
        return line(dimensions.map(function (p) { return [position(p), y[p](d[p])]; }));
    }
    this.update = function (data, targetStates) {
        svg.selectAll("*").remove();

            var filteredData = data.filter(function (d) {
                for (i = 0; i < targetStates.length; i++) {
                    if (d["Geographic Area"] === targetStates[i])
                        return d;
                }
            });

            var ftotal = Object.keys(filteredData).length;

            var total = Object.keys(data).length;

            // find the dimensions (axes)
            x.domain(dimensions = d3.keys(data[0]).filter(function (d) {
                return d != "Geographic Area" && d != "City" && (y[d] = d3.scaleLinear()
                    .domain(d3.extent(data, function (p) { return +p[d]; }))
                    .range([height, 0]));
            }));

            // add blue lines for selection (filtered data)
            var foreground = svg.append("g")
                .attr("class", "foreground")
                .selectAll("path")
                .data(filteredData)
                .enter()
                .append("path")
                .attr("d", path)
                .style("opacity", +((total - ftotal) / total) * 0.05);

            // add a group element for each dimension.
            var g = svg.selectAll(".dimension")
                .data(dimensions)
                .enter()
                .append("g")
                .attr("class", "dimension")
                .attr("transform", function (d) { return "translate(" + x(d) + ")"; });
                // ability to switch axes
                // .call(d3.drag()
                //     .on("start", function (d) {
                //         dragging[d] = x(d);
                //         background.attr("visibility", "hidden");
                //     })
                //     .on("drag", function (d) {
                //         dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                //         foreground.attr("d", path);
                //         dimensions.sort(function (a, b) { return position(a) - position(b); });
                //         x.domain(dimensions);
                //         g.attr("transform", function (d) { return "translate(" + position(d) + ")"; })
                //     })
                //     .on("end", function (d) {
                //         delete dragging[d];
                //         transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                //         transition(foreground).attr("d", path);
                //         background.attr("d", path)
                //             .transition()
                //             .delay(500)
                //             .duration(0)
                //             .attr("visibility", null);
                //     }));

            // add ticks for axes
            g.append("g")
                .attr("class", "axis")
                .each(function (d) { d3.select(this).call(d3.axisLeft(y[d]).ticks(5)); });

            // add genre labels for each axis
            g.append("text")
                .style("text-anchor", "middle")
                .attr("y", -20)
                .attr("font-size", 12)
                .text(function(d) {
                    if (d === "percent_completed_hs") {return "% Completed High School";}
                    if (d === "Median Income") {return "Median Income";}
                    if (d === "poverty_rate") {return "Poverty Rate";}
                    if (d === "share_white") {return "% White";}
                    if (d === "share_black") {return "% Black";}
                    if (d === "share_native_american") {return "% Native American";}
                    if (d === "share_asian") {return "% Asian";}
                    if (d === "share_hispanic") {return "% Hispanic";}
                });
    };

    this.update(data, initialStates);

}