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
    showStackedTypeHours(ndx);
    showStackedTypeSpend(ndx);
    show_type_selector(ndx);
    showTrainingTypePie(ndx);
    showHoursByMonth(ndx);
    showSpendByMonth (ndx);
    compositeHoursByType(ndx);
    showTotalHours(ndx);
    showTotalSpend(ndx);

    dc.renderAll();

}

function showAvgSpend(ndx){


}

function showAvgHours(ndx){


}

function showTotalHours(ndx){
    var dim = ndx.dimension(dc.pluck('year'));
    var avgHours = dim.groupAll().reduce(
        // Add a fact
        function (p,v){
            p.count++;
            p.total += v.hours;
            p.average = p.total / (p.count/7);
            return p;
        },
        // Remove a Fact
        function (p,v){
            p.count--;
            if (p.count == 0) {
                p.total = 0;
                p.average = 0;
            } else {
                p.total -= v.hours;
                p.average = p.total / (p.count/7);
            }
            return p;
        },
        // Initialise the Reducer
        function (){
            return { count: 0, total: 0, average: 0};
        }
    );

    dc.numberDisplay("#totalHoursNum")
        .valueAccessor(function(d){
            if (d.count == 0){
                return 0;
            }else {
                console.log("avg="+d.average);
                console.log("tot="+d.total);
                console.log("cnt="+d.count);
                return (d.total);
            }
        })
        .formatNumber(d3.format(",.0f"))
        .group(avgHours);

}


function showTotalSpend(ndx){
    var dim = ndx.dimension(dc.pluck('year'));
    var avgHours = dim.groupAll().reduce(
        // Add a fact
        function (p,v){
            p.count++;
            p.total += v.spend;
            p.average = p.total / (p.count/7);
            return p;
        },
        // Remove a Fact
        function (p,v){
            p.count--;
            if (p.count == 0) {
                p.total = 0;
                p.average = 0;
            } else {
                p.total -= v.spend;
                p.average = p.total / (p.count/7);
            }
            return p;
        },
        // Initialise the Reducer
        function (){
            return { count: 0, total: 0, average: 0};
        }
    );

    dc.numberDisplay("#totalSpendNum")
        .valueAccessor(function(d){
            if (d.count == 0){
                return 0;
            }else {
                console.log("avg="+d.average);
                console.log("tot="+d.total);
                console.log("cnt="+d.count);
                if (d.total<1){
                    return 0;
                } else {
                    return (d.total);
                }
            }
        })
        .formatNumber(d3.format("$.,0f"))
        .group(avgHours);

}

function show_year_selector(ndx){
    var dim = ndx.dimension(dc.pluck('year'));
    var group = dim.group();
    dc.selectMenu("#year_selector")
        .dimension(dim)
        .group(group);
}

function show_type_selector(ndx){
    var dim = ndx.dimension(dc.pluck('type'));
    var group = dim.group();
    dc.selectMenu("#type_selector")
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
		.renderVerticalGridLines(true)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .elasticX(true)
        .xAxisLabel("Month")
        .yAxisLabel("Spend on Training Per Month")
        .yAxis().ticks(10);
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
		.renderVerticalGridLines(true)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .elasticX(true)
        .xAxisLabel("Month")
        .yAxisLabel("Hours Per Month")
        .elasticY(true)
        .yAxis().ticks(10);
}

function compositeHoursByType(ndx){
    var date_dim = ndx.dimension(dc.pluck('date'));

    var minDate = date_dim.bottom(1)[0].date;
    var maxDate = date_dim.top(1)[0].date;
    // types: safety, online, academy, ine, internal, external, conference

    function hoursByType (type){
        return function(d){
            if (d.type === type){
                return d.hours;
            }else {
            return 0;
        }
        }
    }

    var safetyHoursByMonth = date_dim.group().reduceSum(hoursByType("safety"));
    var onlineHoursByMonth = date_dim.group().reduceSum(hoursByType("online"));
    var academyHoursByMonth = date_dim.group().reduceSum(hoursByType("academy"));
    var ineHoursByMonth = date_dim.group().reduceSum(hoursByType("ine"));
    var internalHoursByMonth = date_dim.group().reduceSum(hoursByType("internal"));
    var externalHoursByMonth = date_dim.group().reduceSum(hoursByType("external"));
    var confHoursByMonth = date_dim.group().reduceSum(hoursByType("conference"));

    var compositeChart = dc.compositeChart('#composite-chart');
    compositeChart
        .width(900)
        .height(500)
        .dimension(date_dim)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .xAxisLabel("Month")
        .yAxisLabel("Hours Training")
        .margins({top: 40, right: 50, bottom: 50, left: 140})
        .legend(dc.legend().x(35).y(20).itemHeight(13).gap(10))
        .renderHorizontalGridLines(true)
		.renderVerticalGridLines(true)
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


function showStackedTypeHours(ndx){
    var year_dim = ndx.dimension(dc.pluck('year'));

    // types: safety, online, academy, ine, internal, external, conference
    function hoursByType (type){
        return function(d){
            if (d.type === type){
                return d.hours;
            }else {
            return 0;
        }
        }
    }

    var safetyHours = year_dim.group().reduceSum(hoursByType("safety"));
    var onlineHours = year_dim.group().reduceSum(hoursByType("online"));
    var academyHours = year_dim.group().reduceSum(hoursByType("academy"));
    var ineHours = year_dim.group().reduceSum(hoursByType("ine"));
    var internalHours = year_dim.group().reduceSum(hoursByType("internal"));
    var externalHours = year_dim.group().reduceSum(hoursByType("external"));
    var confHours = year_dim.group().reduceSum(hoursByType("conference"));

    dc.barChart('#stackedHours')
        .width(600)
        .height(400)
        .margins({top: 40, right: 50, bottom: 30, left: 140})
        .dimension(year_dim)
        .group(safetyHours, "Safety")
        .stack(onlineHours, "Online")
        .stack(academyHours, "Academy")
        .stack(ineHours, "ine")
        .stack(externalHours, "External")
        .stack(internalHours, "Internal")
        .stack(confHours, "Conference")
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Year")
        .yAxisLabel("Hours Training Complete By Type")
        .elasticY(true)
        .legend(dc.legend().x(35).y(20).itemHeight(13).gap(10))
        .yAxis().ticks(4);
}

function showStackedTypeSpend(ndx){
    var year_dim = ndx.dimension(dc.pluck('year'));

    // types: safety, online, academy, ine, internal, external, conference
    function spendByType (type){
        return function(d){
            if (d.type === type){
                return d.spend;
            }else {
            return 0;
        }
        }
    }

    var safetyHours = year_dim.group().reduceSum(spendByType("safety"));
    var onlineHours = year_dim.group().reduceSum(spendByType("online"));
    var academyHours = year_dim.group().reduceSum(spendByType("academy"));
    var ineHours = year_dim.group().reduceSum(spendByType("ine"));
    var internalHours = year_dim.group().reduceSum(spendByType("internal"));
    var externalHours = year_dim.group().reduceSum(spendByType("external"));
    var confHours = year_dim.group().reduceSum(spendByType("conference"));

    dc.barChart('#stackedSpend')
        .width(600)
        .height(400)
        .margins({top: 40, right: 50, bottom: 30, left: 140})
        .dimension(year_dim)
        .group(safetyHours, "Safety")
        .stack(onlineHours, "Online")
        .stack(academyHours, "Academy")
        .stack(ineHours, "ine")
        .stack(externalHours, "External")
        .stack(internalHours, "Internal")
        .stack(confHours, "Conference")
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Year")
        .yAxisLabel("Training Spend By Type")
        .elasticY(true)
        .legend(dc.legend().x(35).y(20).itemHeight(13).gap(10))
        .yAxis().ticks(4);
}