// define the dimensions of the graph display wrt window

d3.csv('./data/cityData.csv',type,function(data){
    //create map
    var heatMap = new HeatMap(d3.select(".vis2"),data,
    function() {

    });





})

function type(d) {

}