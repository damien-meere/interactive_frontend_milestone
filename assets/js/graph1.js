//Data visualisation is deferred until the data has been gathered from the requisite location
queue()
    .defer(d3.json, "assets/data/dataset1.json")
    .await(makeGraphs);


function makeGraphs(error, trainingData) {
    var ndx = crossfilter(trainingData);


    showTrainingTypePie(ndx);
    show_year_selector2(ndx);

    dc.renderAll();
}

function show_year_selector2(ndx){
    var dim = ndx.dimension(dc.pluck('year'));
    var group = dim.group();
    dc.selectMenu("#year_selector2")
        .dimension(dim)
        .group(group);
}

function showTrainingTypePie(ndx){

    var type_dim = ndx.dimension(dc.pluck('type'));
    var total_hours_per_type = type_dim.group().reduceSum(dc.pluck('total'));

    dc.pieChart('#pieTest')
        .height(600)
        .radius(200)
        .transitionDuration(1500)
        .dimension(type_dim)
        .group(total_hours_per_type);



}