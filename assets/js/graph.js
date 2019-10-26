//Data visualisation is deferred until the data has been gathered from the requisite location
queue()
    .defer(d3.json, "assets/data/dataset3.json")
    .await(makeGraphs);


function makeGraphs(error, trainingData) {
    var ndx = crossfilter(trainingData);

    show_year_selector(ndx);
    showMonthlySpend(ndx);



    dc.renderAll();
}

function show_year_selector(ndx){
    var dim = ndx.dimension(dc.pluck('year'));
    var group = dim.group();

    dc.selectMenu("#year_selector")
        .dimension(dim)
        .group(group);
}

function showMonthlySpend(ndx){

    console.log("test");




}