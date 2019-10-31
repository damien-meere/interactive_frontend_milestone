//Data visualisation is deferred until the data has been gathered from the requisite location
queue()
    .defer(d3.json, "assets/data/data_consol.json")
    .await(makeGraphs);


function makeGraphs(error, trainingData) {
    var ndx = crossfilter(trainingData);

    show_year_selector(ndx);
    showAnnualSpend(ndx);
    showAnnualTotalHours(ndx);
    show_type_selector(ndx);
    showTrainingTypePie(ndx);

    dc.renderAll();
}

function show_year_selector(ndx){
    var dim = ndx.dimension(dc.pluck('year'));
    var group = dim.group();
    dc.selectMenu("#year_selector")
        .dimension(dim)
        .group(group);
}

function showAnnualSpend(ndx){
    // Dimension = Column of data we want to use
    var year_dim = ndx.dimension(dc.pluck('year'));
    // Group = accessing the value from the dimension
    var total_spend_per_year = year_dim.group().reduceSum(dc.pluck('spend'));

    dc.barChart('#annualSpend')
        .width(600)
        .height(400)
        .margins({top: 40, right: 50, bottom: 30, left: 100})
        .dimension(year_dim)
        .group(total_spend_per_year)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Year")
        .yAxisLabel("Total Training Spend")
        .yAxis().ticks(4);
}

function showAnnualTotalHours(ndx){

    var year_dim = ndx.dimension(dc.pluck('year'));
    var total_hours_per_year = year_dim.group().reduceSum(dc.pluck('hours'));

    dc.barChart('#annualHours')
        .width(600)
        .height(400)
        .margins({top: 40, right: 50, bottom: 30, left: 100})
        .dimension(year_dim)
        .group(total_hours_per_year)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Year")
        .yAxisLabel("Total Hours Training Complete")
        .elasticY(true)
        .yAxis().ticks(4);
}

function show_type_selector(ndx){
    var dim = ndx.dimension(dc.pluck('type'));
    var group = dim.group();
    dc.selectMenu("#type_selector")
        .dimension(dim)
        .group(group);
}

function showTrainingTypePie(ndx){
    var type_dim = ndx.dimension(dc.pluck('type'));
    var total_hours_per_type = type_dim.group().reduceSum(dc.pluck('hours'));
    dc.pieChart('#pieTest')
        .height(400)
        .radius(200)
        .width(400)
        .innerRadius(80)
        .transitionDuration(1500)
        .legend(dc.legend())
        .dimension(type_dim)
        .group(total_hours_per_type);


}

function showHoursByMonth (ndx){

    var parseDate = d3.time.format("%d/%m/%Y").parse;



}