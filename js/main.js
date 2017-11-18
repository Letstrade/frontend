$( document ).ready(function() {
    render_chart();
});

function render_chart(){
    var stack = d3.layout.stack();
    var dataset = {
                "categories": ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                "series": ["New York","Mumbai","Bengaluru"],
                "colors": ["#3498db","#e74c3c","#2ecc71"],
                "layers": [
                        [
                            {"y":1,"y0":20,"month":"Jan"},
                            {"y":2,"y0":18,"month":"Feb"},
                            {"y":5,"y0":18,"month":"Mar"},
                            {"y":10,"y0":20,"month":"Apr"},
                            {"y":14,"y0":23,"month":"May"},
                            {"y":18,"y0":29,"month":"Jun"},
                            {"y":20,"y0":31,"month":"Jul"},
                            {"y":20,"y0":29,"month":"Aug"},
                            {"y":16,"y0":24,"month":"Sep"},
                            {"y":10,"y0":19,"month":"Oct"},
                            {"y":5,"y0":23,"month":"Nov"},
                            {"y":3,"y0":20,"month":"Dec"}
                        ],
                        [
                            {"y":12,"y0":24,"month":"Jan"},
                            {"y":14,"y0":25,"month":"Feb"},
                            {"y":13,"y0":31,"month":"Mar"},
                            {"y":16,"y0":32,"month":"Apr"},
                            {"y":18,"y0":33,"month":"May"},
                            {"y":19,"y0":29,"month":"Jun"},
                            {"y":20,"y0":27,"month":"Jul"},
                            {"y":18,"y0":26,"month":"Aug"},
                            {"y":20,"y0":31,"month":"Sep"},
                            {"y":17,"y0":29,"month":"Oct"},
                            {"y":18,"y0":26,"month":"Nov"},
                            {"y":14,"y0":24,"month":"Dec"}
                        ],[
                            {"y":8,"y0":24,"month":"Jan"},
                            {"y":14,"y0":26,"month":"Feb"},
                            {"y":12,"y0":31,"month":"Mar"},
                            {"y":15,"y0":33,"month":"Apr"},
                            {"y":18,"y0":37,"month":"May"},
                            {"y":16,"y0":29,"month":"Jun"},
                            {"y":17,"y0":27,"month":"Jul"},
                            {"y":19,"y0":25,"month":"Aug"},
                            {"y":25,"y0":30,"month":"Sep"},
                            {"y":23,"y0":31,"month":"Oct"},
                            {"y":11,"y0":26,"month":"Nov"},
                            {"y":12,"y0":23,"month":"Dec"}
                        ]
                    ]
                }

    n = dataset["series"].length, // Number of Layers
    m = dataset["layers"].length, // Number of Samples in 1 layer

    yGroupMax = d3.max(dataset["layers"], function(layer) { return d3.max(layer, function(d) { return d.y0; }); });
    yGroupMin = d3.min(dataset["layers"], function(layer) { return d3.min(layer, function(d) { return d.y; }); });

    var margin = {top: 50, right: 50, bottom: 50, left: 100},
        width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .domain(dataset["categories"])
        .rangeRoundBands([0, width], .08);

    var y = d3.scale.linear()
        .domain([yGroupMin, yGroupMax])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(5)
        .tickPadding(6)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#chart1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var layer = svg.selectAll(".layer")
        .data(dataset["layers"])
        .enter().append("g")
        .attr("class", "layer");

    var rect = layer.selectAll("rect")
        .data(function(d,i){d.map(function(b){b.colorIndex=i;return b;});return d;})
        .enter().append("rect")
        .transition()
        .duration(500)
        .delay(function(d, i) { return i * 10; })
        .attr("x", function(d, i, j) { return x(d.month) + x.rangeBand() / n * j; })
        .attr("width", x.rangeBand() / n)
        .transition()
        .attr("y", function(d) { return y(d.y0); })
        .attr("height", function(d) { return height - y(d.y0-d.y)})
        .attr("class","bar")
        .style("fill",function(d){return dataset["colors"][d.colorIndex];})

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.select("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.append("text")
        .attr("x", width/3)
        .attr("y", 0)
        .attr("dx", ".71em")
        .attr("dy", "-.71em")
        .text("Min - Max Temperature (Month wise)");

    // add legend
    var legend = svg.append("g")
      .attr("class", "legend")

    legend.selectAll('text')
      .data(dataset["colors"])
      .enter()
      .append("rect")
      .attr("x", width-margin.right)
      .attr("y", function(d, i){ return i *  20;})
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(d) {
        return d;
      })

    legend.selectAll('text')
      .data(dataset["series"])
      .enter()
    .append("text")
    .attr("x", width-margin.right + 25)
    .attr("y", function(d, i){ return i *  20 + 9;})
    .text(function(d){return d});

    var tooltip = d3.select("body")
    .append('div')
    .attr('class', 'tooltip');

    tooltip.append('div')
    .attr('class', 'month');
    tooltip.append('div')
    .attr('class', 'tempRange');

    svg.selectAll("rect")
    .on('mouseover', function(d) {
        if(!d.month)return null;

        tooltip.select('.month').html("<b>" + d.month + "</b>");
        tooltip.select('.tempRange').html(d.y + "&#8451; to " + d.y0 + "&#8451;");

        tooltip.style('display', 'block');
        tooltip.style('opacity',2);

    })
    .on('mousemove', function(d) {

        if(!d.month)return null;

        tooltip.style('top', (d3.event.layerY + 10) + 'px')
        .style('left', (d3.event.layerX - 25) + 'px');
    })
    .on('mouseout', function() {
        tooltip.style('display', 'none');
        tooltip.style('opacity',0);
    });

}