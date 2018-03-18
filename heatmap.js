// let marginMap = { top: 10, right: 10, bottom: 50, left: 120 };
// let fullWidthMap = 900;
// let fullHeightMap = 500;
// let widthMap = fullWidthMap - marginMap.right - marginMap.left;
// let heightMap = fullHeightMap - marginMap.top - marginMap.bottom;

function HeatMap(container, data, onUpdate) {

    var boundingBox = container.node().getBoundingClientRect();
    
    var width = boundingBox.width;
    var height = boundingBox.height;

    //console.log(width + ' ' + height);
    var svg = container.append('svg')
        .attr('width',1000)
        .attr('height',1000);

    //var svg = container.append('svg');
    
    var path = d3.geoPath();
    
     var idToState  = {
       1 : 'AL', 
       2 : 'AK', 
       4 : 'AZ', 
       5 : 'AR', 
       6 : 'CA', 
       8 : 'CO', 
       9 : 'CT', 
      10 : 'DE', 
      11 : 'DC', 
      12 : 'FL', 
      13 : 'GA', 
      15 : 'HI', 
      16 : 'ID', 
      17 : 'IL', 
      18 : 'IN', 
      19 : 'IA', 
      20 : 'KS', 
      21 : 'KY', 
      22 : 'LA', 
      23 : 'ME', 
      24 : 'MD', 
      25 : 'MA', 
      26 : 'MI', 
      27 : 'MN', 
      28 : 'MS', 
      29 : 'MO', 
      30 : 'MT', 
      31 : 'NE', 
      32 : 'NV', 
      33 : 'NH', 
      34 : 'NJ', 
      35 : 'NM', 
      36 : 'NY', 
      37 : 'NC', 
      38 : 'ND', 
      39 : 'OH', 
      40 : 'OK', 
      41 : 'OR', 
      42 : 'PA', 
      44 : 'RI', 
      45 : 'SC', 
      46 : 'SD', 
      47 : 'TN', 
      48 : 'TX', 
      49 : 'UT', 
      50 : 'VT', 
      51 : 'VA', 
      53 : 'WA', 
      54 : 'WV', 
      55 : 'WI', 
      56 : 'WY', 
      60 : 'AS', 
      64 : 'FM', 
      66 : 'GU', 
      68 : 'MH', 
      69 : 'MP', 
      70 : 'PW', 
      72 : 'PR', 
      74 : 'UM', 
      78 : 'VI', 
    }
     
    
    d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
      if (error) throw error;
    
      svg.append("g")
          .attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
          .attr("d", path)
        .on('click',function(d) {
            console.log(idToState[parseInt(d.id)]);
        })
    
      svg.append("path")
          .attr("class", "state-borders")
          .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
    });
    

}