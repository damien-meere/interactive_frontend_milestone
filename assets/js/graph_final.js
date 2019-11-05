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
    });

    // Function calls ordered as per their appearence in the dashboard
    show_year_selector(ndx);
    show_type_selector(ndx);
    showTotalHours(ndx);
    showTotalSpend(ndx);
    showAnnualTotalHours(ndx);
    showAnnualSpend(ndx);
    showStackedTypeHours(ndx);
    showStackedTypeSpend(ndx);
    showTrainingTypePie(ndx);
    compositeHoursByType(ndx);
    showHoursByMonth(ndx);
    showSpendByMonth (ndx);

    // Render all charts
    dc.renderAll();

}

// dc selectMenu used to gather all year values from the data and present to the dashboard user. Used to filter all other charts.
function show_year_selector(ndx){
    var dim = ndx.dimension(dc.pluck('year'));
    var group = dim.group();
    dc.selectMenu("#year_selector")
        .dimension(dim)
        .group(group);
}

// dc selectMenu used to gather all type values from the data and present to the dashboard user. Used to filter all other charts
function show_type_selector(ndx){
    var dim = ndx.dimension(dc.pluck('type'));
    var group = dim.group();
    dc.selectMenu("#type_selector")
        .dimension(dim)
        .group(group);
}

// Function to total all hours for a given year, and display within a dc numberDisplay
function showTotalHours(ndx){
    // Dimension plucks from the 'Year' field in the dataset, this allows us to gather all applicable records for that period
    var dim = ndx.dimension(dc.pluck('year'));
    // Custom Reducer used to gather and total the relevant hours figures
    var avgHours = dim.groupAll().reduce(
        // Add a fact
        function (p,v){
            p.count++;
            // v.hours returns and adds the hours to the p.total value, ultimately giving us the total for that period
            p.total += v.hours;
            return p;
        },
        // Remove a Fact
        function (p,v){
            p.count--;
            if (p.count == 0) {
                p.total = 0;
            } else {
                p.total -= v.hours;
            }
            return p;
        },
        // Initialise the Reducer
        function (){
            return { count: 0, total: 0};
        }
    );

    // Simple Number Display to show the total value
    dc.numberDisplay("#totalHoursNum")
        .valueAccessor(function(d){
            if (d.count == 0){
                return 0;
            }else {
                return (d.total);
            }
        })
        // format set to .0 in order to remove any decimal places. This figure is just a headline value, with specifics shown in the other figures.
        .formatNumber(d3.format(",.0f"))
        .group(avgHours);
}

// Function to total the training spend for a given year, and display within a dc numberDisplay
function showTotalSpend(ndx){
    // Dimension plucks from the 'Year' field in the dataset, this allows us to gather all applicable records for that period
    var dim = ndx.dimension(dc.pluck('year'));
    // Custom Reducer used to gather and total the relevant spend figures (making it different from the customer reducer in showTotalHours)
    var avgHours = dim.groupAll().reduce(
        // Add a fact
        function (p,v){
            p.count++;
            p.total += v.spend;
            return p;
        },
        // Remove a Fact
        function (p,v){
            p.count--;
            if (p.count == 0) {
                p.total = 0;
            } else {
                p.total -= v.spend;
            }
            return p;
        },
        // Initialise the Reducer
        function (){
            return { count: 0, total: 0};
        }
    );

    dc.numberDisplay("#totalSpendNum")
        .valueAccessor(function(d){
            if (d.count == 0){
                return 0;
            }else {
                if (d.total<1){
                    return 0;
                } else {
                    return (d.total);
                }
            }
        })
        // format set to .0 in order to remove any decimal places. This figure is just a headline value, with specifics shown in the other figures.
        .formatNumber(d3.format(",.0f"))
        .group(avgHours);

}

// function to take all hours figures and sum them for display within a barchart
function showAnnualTotalHours(ndx){
    // Dimension plucks from the 'Year' field in the dataset, this allows us to gather all applicable records for that period
    var year_dim = ndx.dimension(dc.pluck('year'));
    // reduceSum to group all 'hours' fugures for that time period specified in the dimension.
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

// function to take all spend figures and sum them for display within a barchart
function showAnnualSpend(ndx){
    // Dimension plucks from the 'Year' field in the dataset, this allows us to gather all applicable records for that period
    var year_dim = ndx.dimension(dc.pluck('year'));
    // reduceSum to group all 'spend' fugures for that time period specified in the dimension.
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

// Function to gather the total hours for each training type, and display them within a stacked bar chart.
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
        };
    }
    // Gather a dimension for each training type
    var safetyHours = year_dim.group().reduceSum(hoursByType("safety"));
    var onlineHours = year_dim.group().reduceSum(hoursByType("online"));
    var academyHours = year_dim.group().reduceSum(hoursByType("academy"));
    var ineHours = year_dim.group().reduceSum(hoursByType("ine"));
    var internalHours = year_dim.group().reduceSum(hoursByType("internal"));
    var externalHours = year_dim.group().reduceSum(hoursByType("external"));
    var confHours = year_dim.group().reduceSum(hoursByType("conference"));
    // dc barchart with additional dimensions stacked within
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

// Function to gather the total spend (€) for each training type, and display them within a stacked bar chart.
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
        };
    }
    // Gather a dimension for each training type
    var safetyHours = year_dim.group().reduceSum(spendByType("safety"));
    var onlineHours = year_dim.group().reduceSum(spendByType("online"));
    var academyHours = year_dim.group().reduceSum(spendByType("academy"));
    var ineHours = year_dim.group().reduceSum(spendByType("ine"));
    var internalHours = year_dim.group().reduceSum(spendByType("internal"));
    var externalHours = year_dim.group().reduceSum(spendByType("external"));
    var confHours = year_dim.group().reduceSum(spendByType("conference"));
    // dc barchart with additional dimensions stacked within
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

// function to take all 'hours' figures and sum them for display within a Pie Chart
function showTrainingTypePie(ndx){
    // Dimension plucks from the 'type' field in the dataset, this allows us to gather all applicable records for that type
    var type_dim = ndx.dimension(dc.pluck('type'));
    // reduceSUm totals the 'hours' fields for all records bound by the dimension
    var total_hours_per_type = type_dim.group().reduceSum(dc.pluck('hours'));
    dc.pieChart('#pieTest')
        .height(500)
        .radius(200)
        .width(400)
        .innerRadius(80)
        .transitionDuration(1500)
        .legend(dc.legend())
        .dimension(type_dim)
        .group(total_hours_per_type);
}

// DC Composite Line chart to present the hours committed to each training type over time
function compositeHoursByType(ndx){
    //Dimension based on 'date' field to allow for the visualisation over time
    var date_dim = ndx.dimension(dc.pluck('date'));
    //gather the highest and lowest date values to set the upper and lower bounds of the line chart
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
        };
    }
    // Gather a dimension for each training type
    var safetyHoursByMonth = date_dim.group().reduceSum(hoursByType("safety"));
    var onlineHoursByMonth = date_dim.group().reduceSum(hoursByType("online"));
    var academyHoursByMonth = date_dim.group().reduceSum(hoursByType("academy"));
    var ineHoursByMonth = date_dim.group().reduceSum(hoursByType("ine"));
    var internalHoursByMonth = date_dim.group().reduceSum(hoursByType("internal"));
    var externalHoursByMonth = date_dim.group().reduceSum(hoursByType("external"));
    var confHoursByMonth = date_dim.group().reduceSum(hoursByType("conference"));
    // Composite chart with the various individual line charts place within. Each line chart is based on one of the dimensions speecified above
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
            //each line chart is added to the composite and given it's own individual colour to set them apart
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

// Function to display a simple line chart visualising the total spend per month over time. Hence we use the 'date' dimension and a simple reduceSum on the 'Spend'
function showSpendByMonth (ndx){
    var date_dim = ndx.dimension(dc.pluck('date'));
    var total_spend_per_month = date_dim.group().reduceSum(dc.pluck('spend'));
    //gather the highest and lowest date values to set the upper and lower bounds of the line chart
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
        .yAxis().ticks(15);
}

// Function to display a simple line chart visualising the total hours committed to training per month over time. Hence we use the 'date' dimension and a simple
// reduceSum on the 'Spend'
function showHoursByMonth (ndx){
    var date_dim = ndx.dimension(dc.pluck('date'));
    var total_hours_per_month = date_dim.group().reduceSum(dc.pluck('hours'));
    //gather the highest and lowest date values to set the upper and lower bounds of the line chart
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
        .yAxis().ticks(15);
}