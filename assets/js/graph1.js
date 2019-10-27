//Data visualisation is deferred until the data has been gathered from the requisite location
queue()
    .defer(d3.json, "assets/data/dataset1.json")
    .await(makeGraphs);


function makeGraphs(error, trainingData) {
    var ndx = crossfilter(trainingData);


    showTrainingTypePie(ndx);


    dc.renderAll();
}

function showTrainingTypePie(ndx){

    var type_dim = ndx.dimension(dc.pluck('type'));
    var total_hours_per_type = type_dim.group().reduceSum(dc.pluck('total'));

    dc.pieChart('#pieTest')
        .height(330)
        .radius(90)
        .transitionDuration(1500)
        .dimension(type_dim)
        .group(total_hours_per_type);



}