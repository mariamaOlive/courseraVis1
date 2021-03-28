//Reading CSV files 

var allText = [];
var allTextLines = [];
var lines = [];
var countriesOrigin = [];
var countriesDestionation = [];
var countriesGDP = [];

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

    console.log("OK");
}).catch((e) => {
    console.log(e);
});


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

    allTextLines.slice(1).forEach(line => {
        var attributes = line.split('\t');
        var country = {};

        attributes.forEach((att, index) => {

            if (tabNames[index] === "2019 [YR2019]") {
                country[tabNames[index]] = parseFloat(att);
            } else {
                country[tabNames[index]] = att;
            }
        });

        array.push(country);
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

//Function that determines incomeType
function incomeGroup(gdpPerCapita){
    var groupClassification = undefined;
             
    if(gdpPerCapita < 1026){
        groupClassification = "Low income";
    }else if (gdpPerCapita >= 1026 && gdpPerCapita <= 3995) {
        groupClassification = "Lower-middle income";
    }else if (gdpPerCapita >= 3996 && gdpPerCapita <= 12375){
        groupClassification = "Upper-middle income";
    }else if (gdpPerCapita > 12375){
        groupClassification = "High income";
    }

    return groupClassification;
}