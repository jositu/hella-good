// define the dimensions of the graph display wrt window
let marginMap = { top: 10, right: 10, bottom: 50, left: 120 };
let fullWidthMap = 600;
let fullHeightMap = 500;
let widthMap = fullWidthMap - marginMap.right - marginMap.left;
let heightMap = fullHeightMap - marginMap.top - marginMap.bottom;

let marginSankey = { top: 0, right: 0, bottom: 0, left: 0 };
let fullWidthSankey = 900;
let fullHeightSankey = 500;
let widthSankey = fullWidthSankey - marginSankey.right - marginSankey.left;
let heightSankey = fullHeightSankey - marginSankey.top - marginSankey.bottom;

let marginPcoords = { top: 40, right: 20, bottom: 10, left: 50 };
// let fullWidthPcoords = 900;
// let fullHeightPcoords = 500;
let fullWidthPcoords = window.innerWidth * 0.5;
let fullHeightPcoords = window.innerHeight * 0.5;
let widthPcoords = fullWidthPcoords - marginPcoords.right - marginPcoords.left;
let heightPcoords = fullHeightPcoords - marginPcoords.top - marginPcoords.bottom;


d3.csv('./data/cityData.csv',type,function(data){
    //create map
    var heatMap = new HeatMap(d3.select("#map-holder"),data,
    function() {
        PCoords.update(data, heatMap.selectedStates);
    });

	var PCoords = new Parallel_Coords(d3.select("#pcoords-holder"), data, ["AL"]);
})

function type(d) {

}