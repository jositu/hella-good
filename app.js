// define the dimensions of the graph display wrt window
let marginMap = {
    top: 10,
    right: 10,
    bottom: 50,
    left: 120
};
let fullWidthMap = window.innerWidth * .7;
let fullHeightMap = window.innerHeight * .7;
let widthMap = fullWidthMap - marginMap.right - marginMap.left;
let heightMap = fullHeightMap - marginMap.top - marginMap.bottom;

let marginPcoords = {
    top: 90,
    right: 10,
    bottom: 5,
    left: 50
};
let fullWidthPcoords = window.innerWidth * 0.55;
let fullHeightPcoords = window.innerHeight * 0.35;
let widthPcoords = fullWidthPcoords - marginPcoords.right - marginPcoords.left;
let heightPcoords = fullHeightPcoords - marginPcoords.top - marginPcoords.bottom;


var d3_category50 = [
    "#1f77b4", "#aec7e8",
    "#ff7f0e", "#ffbb78",
    "#2ca02c", "#98df8a",
    "#d62728", "#ff9896",
    "#9467bd", "#c5b0d5",
    "#8c564b", "#c49c94",
    "#e377c2", "#f7b6d2",
    "#7f7f7f", "#c7c7c7",
    "#bcbd22", "#dbdb8d",
    "#17becf", "#9edae5",  
    "#b6c528", "#67dbdc",
    "#73f8b5", "#322407",
    "#0ba2ab", "#bce53f",
    "#658a8e", "#08fb7c",
    "#5225b2", "#0543df",
    "#c20fb5", "#640fdd",
    "#aebdcb", "#4f5e6f",
    "#ca6bfc", "#e557ea",
    "#b74de3", "#a22151",
    "#2e3c19", "#727ed4",
    "#2e6aba", "#355644",
    "#a95857", "#dd6a3c",
    "#f1386f", "#ef6cab",
    "#aa3e36", "#88a843",
    "#3923be", "#a85883"
];

let color = d3.scaleOrdinal().range(d3_category50);

d3.csv('data/PoliceKillingsUS.csv', (policedata) => {
    d3.csv('./data/cityData.csv', function (citydata) {
        console.log('police', policedata);
        console.log('city', citydata);

        var heatMap = new HeatMap(d3.select("#map-holder"), policedata,
            
            function () {
                PCoords.update(citydata, heatMap.selectedStates);
                Sankey.update(policedata, heatMap.selectedStates);
            });

        var PCoords = new Parallel_Coords(d3.select("#pcoords-holder"), citydata, policedata, []);

        var Sankey = new SankeyDiagram(d3.select("#sankey-holder"), policedata);

    });
});