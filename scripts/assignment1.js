//Graph Data
//Width and height
// margin = ({ top: 25, right: 30, bottom: 35, left: 60 });
// height = 600;
// width = 800;



//Reading CSV files 

var allText = [];
var allTextLines = [];
var lines = [];
var countriesOrigin = [];
var countriesDestionation = [];
var countriesGDP = [];
var dataGlobal;


var filePathRefugeeOrigin = "scripts/refugee_origin.txt";
var filePathRefueggeDestination = "scripts/refugee_destination.txt";
var filePathCountryGDP = "scripts/GDP_per_capita.txt";

//Fetch txt data
var promise1 = fetch(filePathRefugeeOrigin).then(x => x.text());
var promise2 = fetch(filePathRefueggeDestination).then(x => x.text());
var promise3 = fetch(filePathCountryGDP).then(x => x.text());

//Wait for assync function to return
Promise.all([promise1, promise2, promise3]).then((tablesTxt) => {
    this.handleData(tablesTxt[0], countriesOrigin);
    this.handleData(tablesTxt[1], countriesDestionation);
    this.handleDataGDP(tablesTxt[2], countriesGDP);

    dataGlobal = this.joinData(countriesOrigin, countriesDestionation, countriesGDP);


    this.renderScatterPlot(this.chooseData("Destination country", dataGlobal));
    console.log("OK");
}).catch((e) => {
    console.log(e);
});



function renderScatterPlot(data) {

    //Margin 
    margin = { top: 20, right: 50, bottom: 40, left: 70 }
    outerWidth = 700
    outerHeight = 700
    innerWidth = 620
    innerHeight = 620

    var allGroup = ["Destination country", "Origin country"];

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function (d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button



    //Color and shape
    color = d3.scaleOrdinal(data.map(d => d.incomeGroup), d3.schemeCategory10);
    shape = d3.scaleOrdinal(data.map(d => d.incomeGroup), d3.symbols.map(s => d3.symbol().type(s)()));


    //Scale
    xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.selectedOption)).nice()
        .range([margin.left, innerWidth - margin.right])
    yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.gdp)).nice()
        .range([innerHeight - margin.bottom, margin.top])


    //Axis 
    xAxis = g => g
        .attr("transform", `translate(0,${innerHeight - margin.bottom})`)
        .call(g => g.transition().duration(2000))
        .call(d3.axisBottom(xScale).ticks(innerWidth / 80))
        .call(g => g.select(".domain").remove())
        .call(g => g.select("#axisX").remove())
        .call(g => g
            .append("text")
            .attr("id", "axisX")
            .attr("x", innerWidth)
            .attr("y", margin.bottom - 4)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(data.selectedOption));

    yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(this.yScale))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", -margin.left)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(data.gdp));

    grid = g => g
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.1)
        .call(g => g.selectAll(".xgrid").remove())
        .call(g => g.selectAll(".ygrid").remove())
        .call(g => g.append("g")
            .selectAll("line")
            .data(this.xScale.ticks())
            .join("line")
            .attr("class", "xgrid")
            .attr("x1", d => 0.5 + xScale(d))
            .attr("x2", d => 0.5 + xScale(d))
            .attr("y1", margin.top)
            .attr("y2", innerHeight - margin.bottom))
        .call(g => g.append("g")
            .selectAll("line")
            .data(this.yScale.ticks())
            .join("line")
            .attr("class", "ygrid")
            .attr("y1", d => 0.5 + yScale(d))
            .attr("y2", d => 0.5 + yScale(d))
            .attr("x1", margin.left)
            .attr("x2", innerWidth - margin.right));



    var svg = d3.select("body")
        .append("svg")
        .attr("width", innerWidth)
        .attr("height", innerHeight);


    gX = svg
        .append("g")
        .call(xAxis);

    gY = svg.append("g")
        .call(yAxis);

    gGrid = svg.append("g")
        .call(grid);

    const countryGroup = svg.selectAll('.countryCircle')
        .attr("stroke-width", 1.5)
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .data(data)
        .enter().append('g')
        .attr('class', 'countryGroup')
        .attr("transform", d => `translate(${xScale(d.selectedOption)},${yScale(d.gdp)})`)
        .on('mouseenter', function (d) {

            d3.select(this)
                .select('text')
                .transition()
                .style('opacity', 1)

            d3.select(this)
                .select('circle')
                .style('opacity', 1)
        })
        .on('mouseleave', function (d) {

            d3.select(this)
                .select('text')
                .transition()
                .style('opacity', 0)

            d3.select(this)
                .select('circle')
                .style('opacity', 0.7)
        });

    // //append circles to countryGroup
    countryGroup.append('circle')
        .attr('class', 'countryCircle')
        .attr('r', 5)
        .attr("fill", d => color(d.incomeGroup))

    d3.selectAll('circle')
        .style('opacity', 0.7)

    countryGroup.append('text')
        .attr('class', 'countryText')
        .attr('dx', 10)
        .attr('dy', -10)
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .text(function (d) { return d.name })
        .attr('opacity', 0);


    function update(selectedOption) {

        var newData = this.chooseData(selectedOption, this.dataGlobal);
        data = newData;

        this.xScale = d3.scaleLinear()
            .domain(d3.extent(newData, d => d.selectedOption)).nice()
            .range([margin.left, innerWidth - margin.right])


        // Update circles
        countryGroup
            .data(newData)  // Update with new data
            .transition()  // Transition from old to new
            .duration(1000)  // Length of animation
            .delay(function (d, i) {
                return i / newData.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
            })
            .attr("transform", d => `translate(${xScale(d.selectedOption)},${yScale(d.gdp)})`)


        // Update X Axis
        gX.call(xAxis);
        gGrid.call(grid);

    }


}



/////////////////////////////////Functions////////////////////////////////////

//Function responsible for reading the .txt files
function readTxtFile(filePath) {
    return fetch(filePath).then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status); // Rejects the promise
        }
    });
}


//Function responsible for handling data 
function handleData(allText, array) {

    allTextLines = allText.split(/\r\n|\n/);

    var tabNames = allTextLines[0].split('\t');

    allTextLines.slice(2, 218).forEach(line => {
        var attributes = line.split('\t');
        var country = {};

        attributes.forEach((att, index) => {

            if (tabNames[index] === "2019 [YR2019]") {
                country[tabNames[index]] = parseFloat(att);
            } else {
                country[tabNames[index]] = att;
            }
        });

        array[country["Country Code"]] = country;
    });
}

//Function that handles GDP data
function handleDataGDP(allText, array) {

    allTextLines = allText.split(/\r\n|\n/);

    var tabNames = allTextLines[0].split('\t');

    allTextLines.slice(1).forEach(line => {
        var attributes = line.split('\t');
        var country = {};

        attributes.forEach((att, index) => {
            if (tabNames[index] === "2019 [YR2019]") {
                var gdpPerCapita = parseFloat(att);
                country[tabNames[index]] = gdpPerCapita;
                country["incomeGroup"] = this.incomeGroup(gdpPerCapita);
            } else {
                country[tabNames[index]] = att;
            }
        });

        array[country["Country Code"]] = country;
    });
}

function joinData(origin, destination, gdp) {
    var countriesArray = [];

    for (var countryCode in origin) {
        var country = {};

        var referenceYear = "2019 [YR2019]";
        if (!isNaN(origin[countryCode][referenceYear]) && !isNaN(destination[countryCode][referenceYear]) && gdp[countryCode]["incomeGroup"] != undefined) {
            country["origin"] = origin[countryCode][referenceYear];
            country["destination"] = destination[countryCode][referenceYear];
            country["incomeGroup"] = gdp[countryCode]["incomeGroup"];
            country["gdp"] = gdp[countryCode][referenceYear];
            country["name"] = gdp[countryCode]["Country Name"];

            countriesArray.push(country);
        }

    }


    return countriesArray;
}


//Function that determines incomeType
function incomeGroup(gdpPerCapita) {
    var groupClassification = undefined;

    if (gdpPerCapita < 1026) {
        groupClassification = "Low income";
    } else if (gdpPerCapita >= 1026 && gdpPerCapita <= 3995) {
        groupClassification = "Lower-middle income";
    } else if (gdpPerCapita >= 3996 && gdpPerCapita <= 12375) {
        groupClassification = "Upper-middle income";
    } else if (gdpPerCapita > 12375) {
        groupClassification = "High income";
    }

    return groupClassification;
}


//Function which determines the data displayed
function chooseData(selectedOption, data) {

    var chosenData = data.map(function (d) {
        var dataObject = {
            gdp: d.gdp,
            selectedOption: selectedOption === "Destination country" ? d.destination : d.origin,
            name: d.name
        };
        return dataObject;
    })

    chosenData["gdp"] = "GDP per capita ↑"
    chosenData["selectedOption"] = selectedOption === "Destination country" ? "Refugee population by country or territory of asylum →" : "Refugee population by country or territory of origin →";
    return chosenData;
}
