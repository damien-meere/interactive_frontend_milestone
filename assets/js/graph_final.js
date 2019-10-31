//Data visualisation is deferred until the data has been gathered from the requisite location
queue()
    .defer(d3.json, "assets/data/data_consol.json")
    .await(makeGraphs);


function makeGraphs(error, trainingData) {
    var ndx = crossfilter(trainingData);

    // Make sure the date is formatted int he correct format
    var parseDate = d3.time.format("%d/%m/%Y").parse;
    trainingData.forEach(function(d){
        d.date = parseDate(d.date);
    })


    show_year_selector(ndx);
    showAnnualSpend(ndx);
    showAnnualTotalHours(ndx);
    show_type_selector(ndx);
    showTrainingTypePie(ndx);
    showHoursByMonth(ndx);
    showSpendByMonth (ndx);
    compositeHoursByType(ndx);

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
    var date_dim = ndx.dimension(dc.pluck('date'));
    var total_hours_per_month = date_dim.group().reduceSum(dc.pluck('hours'));

    var minDate = date_dim.bottom(1)[0].date;
    var maxDate = date_dim.top(1)[0].date;

    dc.lineChart("#hours-per-month")
        .width(1000)
        .height(500)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(date_dim)
        .group(total_hours_per_month)
        .transitionDuration(500)
        .renderHorizontalGridLines(true)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .elasticX(true)
        .xAxisLabel("Month")
        .yAxisLabel("Hours Per Month")
        .elasticY(true)
        .yAxis().ticks(4);
}

function showSpendByMonth (ndx){
    var date_dim = ndx.dimension(dc.pluck('date'));
    var total_spend_per_month = date_dim.group().reduceSum(dc.pluck('spend'));

    var minDate = date_dim.bottom(1)[0].date;
    var maxDate = date_dim.top(1)[0].date;

    dc.lineChart("#spend-per-month")
        .width(1000)
        .height(500)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(date_dim)
        .group(total_spend_per_month)
        .transitionDuration(500)
        .renderHorizontalGridLines(true)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .elasticX(true)
        .xAxisLabel("Month")
        .yAxisLabel("Spend on Training Per Month")
        .yAxis().ticks(4);
}

function compositeHoursByType(ndx){
    var date_dim = ndx.dimension(dc.pluck('month'));

    //var minDate = date_dim.bottom(1)[0].date;
    //var maxDate = date_dim.top(1)[0].date;

    // types: safety, online, academy, ine, internal, external, conference

    var safetyHoursByMonth = date_dim.group().reduceSum(function(d){
        if (d.type === 'safety'){
            return +d.hours;
        }else {
            return 0;
        }
    });
    var onlineHoursByMonth = date_dim.group().reduceSum(function(d){
        if (d.type === 'online'){
            return +d.hours;
        }else {
            return 0;
        }
    });
    var academyHoursByMonth = date_dim.group().reduceSum(function(d){
        if (d.type === 'academy'){
            return +d.hours;
        }else {
            return 0;
        }
    });
    var ineHoursByMonth = date_dim.group().reduceSum(function(d){
        if (d.type === 'ine'){
            return +d.hours;
        }else {
            return 0;
        }
    });
    var internalHoursByMonth = date_dim.group().reduceSum(function(d){
        if (d.type === 'internal'){
            return +d.hours;
        }else {
            return 0;
        }
    });
    var externalHoursByMonth = date_dim.group().reduceSum(function(d){
        if (d.type === 'external'){
            return +d.hours;
        }else {
            return 0;
        }
    });
    var confHoursByMonth = date_dim.group().reduceSum(function(d){
        if (d.type === 'conference'){
            return +d.hours;
        }else {
            return 0;
        }
    });

    var compositeChart = dc.compositeChart('#composite-chart');

    compositeChart
        .width(900)
        .height(500)
        .dimension(date_dim)
        .x(d3.scale.linear().domain([1,12]))
        .yAxisLabel("Hours Training")
        .legend(dc.legend().x(80).y(20).itemHeight(13).gap(10))
        .renderHorizontalGridLines(true)
        .compose([
            dc.lineChart(compositeChart)
                .colors('green')
                .group(safetyHoursByMonth, 'Safety'),
            dc.lineChart(compositeChart)
                .colors('red')
                .group(onlineHoursByMonth, 'Online'),
            dc.lineChart(compositeChart)
                .colors('orange')
                .group(academyHoursByMonth, 'Academy'),
            dc.lineChart(compositeChart)
                .colors('blue')
                .group(ineHoursByMonth, 'INE'),
            dc.lineChart(compositeChart)
                .colors('indigo')
                .group(internalHoursByMonth, 'Internal'),
            dc.lineChart(compositeChart)
                .colors('violet')
                .group(externalHoursByMonth, 'External'),
            dc.lineChart(compositeChart)
                .group(confHoursByMonth, 'Conferences'),
        ])
        .brushOn(false);



}