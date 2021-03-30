
    var svg = d3.select("body")
    .append("svg")
    .attr("width", innerWidth)
    .attr("height", innerHeight);


const countryGroup = svg.selectAll('.countryCircle') //select all elements with class countryCircle. (There currently are none)
    .data(data).enter().append('g')
    .attr('class', 'countryGroup')
    .attr('transform', function (d) { return 'translate(' + xScale(d.destination) + ',' + yScale(d.gdp) + ')' })
    .on('mouseenter', function (d) {

        d3.select(this)
            .select('text')
            .transition()
            .style('opacity', 1)

        // d3.select(this)
        //     .select('countryCircle')
        //     .style('opacity', 1)
    })
    .on('mouseleave', function (d) {

        d3.select(this)
            .select('text')
            .transition()
            .style('opacity', 0)

        // d3.select(this)
        //     .select('countryCircle')
        //     .style('opacity', 0.5)
    });

//append circles to countryGroup
countryGroup.append('circle')
    .attr('class', 'countryCircle')
    .attr('r', 5)
    // .selectAll("circle")
    .attr("fill", d => color(d.incomeGroup))
    .attr("d", d => shape(d.incomeGroup))

d3.selectAll('circle')
    .style('opacity', 0.5)

countryGroup.append('text')
    .attr('class', 'countryText')
    .attr('dx', 10)
    .attr('dy', -10)
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .text(function (d) { return d.name })
    .attr('opacity', 0);



//Axis
const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);
const xAxisGroup = svg.append("g")
    .attr("transform", `translate(0,${innerHeight - margin.bottom})`)
    .attr("class", "x axis") //gives group the classes 'x' and 'axis'
    .call(xAxis)
    .text(data.destination)
    .append("text")
    // .attr("x", width)
    // .attr("y", margin.bottom - 4)
    .attr("fill", "currentColor")
    .attr("text-anchor", "end")
    .text(data.destination);

const yAxisGroup = svg.append("g")
    .attr("class", "y axis")//gives group the classes 'y' and 'axis'
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .append("text")
    // .attr("x", -margin.left)
    // .attr("y", 10)
    .attr("fill", "currentColor")
    .attr("text-anchor", "start")
    .text(data.gdp);