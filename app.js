// define the dimensions of the graph display wrt window

d3.csv('./data/cityData.csv',type,function(data){
    //create map
    var heatMap = new HeatMap(d3.select("#map-holder"),data,
    function() {

    });





})

function type(d) {

}