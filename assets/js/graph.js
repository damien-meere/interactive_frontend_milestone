//Data visualisation is deferred until the data has been gathered from the requisite location
queue()
    .defer(d3.json, "assets/data/dataset3.json")
    .await(makeGraphs);


function makeGraphs(error, trainingData) {
    var ndx = crossfilter(trainingData);

    show_year_selector(ndx);
    showAnnualSpend(ndx);

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
    var total_spend_per_year = year_dim.group().reduceSum(dc.pluck('month_spend'));

    dc.barChart('#annualSpend')
        .width(500)
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