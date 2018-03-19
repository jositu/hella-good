function HeatMap(container, data, onUpdate) {

    var tooltipMap;

    tooltipMap =
        d3.select('#map-holder')
        .append('div')
        .attr('class', 'tooltipMap')

    var svg = container.append('svg')
        .attr('width', 950)
        .attr('height', 600);
    var path = d3.geoPath();
    //multi-selection for states
    states = new Set();
    this.selectedStates = [];
    var me = this;
    var idToState = {
        1: 'AL',
        2: 'AK',
        4: 'AZ',
        5: 'AR',
        6: 'CA',
        8: 'CO',
        9: 'CT',
        10: 'DE',
        11: 'DC',
        12: 'FL',
        13: 'GA',
        15: 'HI',
        16: 'ID',
        17: 'IL',
        18: 'IN',
        19: 'IA',
        20: 'KS',
        21: 'KY',
        22: 'LA',
        23: 'ME',
        24: 'MD',
        25: 'MA',
        26: 'MI',
        27: 'MN',
        28: 'MS',
        29: 'MO',
        30: 'MT',
        31: 'NE',
        32: 'NV',
        33: 'NH',
        34: 'NJ',
        35: 'NM',
        36: 'NY',
        37: 'NC',
        38: 'ND',
        39: 'OH',
        40: 'OK',
        41: 'OR',
        42: 'PA',
        44: 'RI',
        45: 'SC',
        46: 'SD',
        47: 'TN',
        48: 'TX',
        49: 'UT',
        50: 'VT',
        51: 'VA',
        53: 'WA',
        54: 'WV',
        55: 'WI',
        56: 'WY',
        60: 'AS',
        64: 'FM',
        66: 'GU',
        68: 'MH',
        69: 'MP',
        70: 'PW',
        72: 'PR',
        74: 'UM',
        78: 'VI',
    }
    policeShootings = {};
    let total_shootings = 0;
    for (datum of data) {
        if (!(datum.state in policeShootings)) {
            policeShootings[datum.state] = 1;
        } else {
            policeShootings[datum.state]++;
        }
        total_shootings++;
    }
    var max = d3.max(d3.values(policeShootings));
    var scale = d3.scaleLinear().domain([0, max]).range([0.2, 1]);
    d3.json("data/states.json", function (error, us) {
        if (error) throw error;

        svg.append("g")
            .attr("class", "states")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .enter().append("path")
            .attr("d", path)
            .attr('fill', function (d) {
                return d3.interpolateReds(scale(policeShootings[idToState[parseInt(d.id)]]));
            })
            .on("mousemove", (d) => {
                let state = idToState[parseInt(d['id'])];
                console.log(state);
                console.log(policeShootings);
                tooltipMap
                    .style('left', d3.event.pageX - 50 + 'px')
                    .style('top', d3.event.pageY - 90 + 'px')
                    .style('display', 'inline-block')
                    .html(
                        state 
                        + '<br><span>' + policeShootings[state] + ' killings</span>'
                        + '<br><span>' + (policeShootings[state] / total_shootings * 100).toFixed(2) + '% of killings</span>' 
                         
                    );

            })
            .on("mouseout", (d) => {
                tooltipMap.style('display', 'none');
            });


        svg.append("path")
            .attr("class", "state-borders")
            .attr("d", path(topojson.mesh(us, us.objects.states, function (a, b) {
                return a !== b;
            })));
    });

    var w = 424,
        h = 50;

    var key = d3.select("#legend1")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var legend = key.append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

    legend.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d3.interpolateReds(.2))
        .attr("stop-opacity", 1);

    legend.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", d3.interpolateReds(.6))
        .attr("stop-opacity", 1);

    legend.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d3.interpolateReds(1))
        .attr("stop-opacity", 1);

    key.append("rect")
        .attr("width", w)
        .attr("height", h - 30)
        .style("fill", "url(#gradient)")
        .attr("transform", "translate(10,10)");

    var y = d3.scaleLinear()
        .range([0, 424])
        .domain([0, 424]);

    var yAxis = d3.axisBottom()
        .scale(y)
        .ticks(5);

    key.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(10,30)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("axis title");
}