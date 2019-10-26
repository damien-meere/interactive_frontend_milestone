//Data visualisation is deferred until the data has been gathered from the requisite location
queue()
    .defer(d3.json, "assets/data/dataset1.json")
    .await(makeGraphs);


function makeGraphs(error, transactionsData) {
    var ndx = crossfilter(transactionsData);

    //Define Dimensions
    var yearDim = ndx.dimension(function (d) {
        return d["year"];
    });

    //Calculate metrics
    var yearGroup = yearDim.group();

    selectYear = dc.selectMenu('#year-select')
        .dimension(yearDim)
        .group(yearGroup);
}