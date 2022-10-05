// This code is largely inspired by Intructor Dom's tutorial for Homework 14.
console.log('This is app.js');

// Define a global variable to hold the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function DrawBargraph(sampleId)
{
    console.log(`DrawBargraph(${sampleId})`);

    d3.json(url).then(data => {
        console.log(data);

        let samples = data.samples;
        let resultArray = samples.filter(s => s.id == sampleId);
        let result = resultArray[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        let yticks = otu_ids.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();

        //Create a trace object
        let barData = {
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            type: 'bar',
            text: otu_labels.slice(0, 10).reverse(),
            orientation: 'h'
        };

        // Put the trace object into an array
        let barArray = [barData];

        // Create a layout object
        let barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 30, l: 150}
        };

        // Call the Plotly function
        Plotly.newPlot("bar", barArray, barLayout);
    });
}

function DrawBubblechart(sampleId)
{
    console.log(`DrawBubblechart(${sampleId})`);

    d3.json(url).then(data => {

        let samples = data.samples;
        let resultArray = samples.filter(s => s.id == sampleId);
        let result = resultArray[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        // Create a trace
        let bubbleData = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Put the trace into an array
        let bubbleArray = [bubbleData];

        // Create a layout object
        let bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: {t: 30},
            hovermode: "closet",
            xaxis: { title: "OTU ID"}
        };

        // Call Plotly
        Plotly.newPlot("bubble", bubbleArray, bubbleLayout);

        
    });
}

function DrawGauge(sampleId)
{
    console.log(`DrawGauge(${sampleId})`);

    d3.json(url).then(data => {

        let metadata = data.metadata;
        console.log(metadata);
        let resultArray = metadata.filter(s => s.id == sampleId);
        let result = resultArray[0];
        let wfreq = result.wfreq;

        
  
        var data = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: wfreq,
          title: { text: "<b>Wash Frequency</b><br><i>Scrubs per week</i>"},
          type: "indicator",
          mode: "gauge+number+range",
          gauge: {
            axis: { range: [0, 10] },
            bar: {color: "darkblue"},
            steps: [
              { range: [0, 1], color: "rgb(204,214,204)" },
              { range: [1, 2], color: "rgb(186,206,186)" },
              { range: [2, 3], color: "rgb(168,199,168)" },
              { range: [3, 4], color: "rgb(150,191,150)" },
              { range: [4, 5], color: "rgb(132,184,132)" },
              { range: [5, 6], color: "rgb(114,176,114)" },
              { range: [6, 7], color: "rgb(96,168,96)" },
              { range: [7, 8], color: "rgb(78,161,78)" },
              { range: [8, 9], color: "rgb(60,153,60)" },
              { range: [9, 10], color: "rgb(42,146,42)" }
            ],
            threshold: {
                line: { color: "red", width: 4 },
                thickness: 0.75,
                value: 10
            }
            }
        }
    ]

        // Create layout
        var gaugelayout = { width: 600, height: 450, margin: { t: 30, b: 50 } };
        

        // Call Plotly
        Plotly.newPlot('gauge', data, gaugelayout);
    });
}

function ShowMetadata(sampleId)
{
    console.log(`ShowMetadata(${sampleId})`);

    d3.json(url).then((data) => {

        let metadata = data.metadata;
        console.log(metadata);

        // Filter data
        let result = metadata.filter(meta => meta.id == sampleId)[0];
        let demographicInfo = d3.select('#sample-metadata');

        // Clear existing data in demographicInfo
        demographicInfo.html('');

        // Add key and value pair to the demographicInfo panel
        Object.entries(result).forEach(([key, value]) => {
            demographicInfo.append('h6').text(`${key}: ${value}`);
        });
    });
}

function optionChanged(sampleId)
{
    console.log(`optionChanged, new value: ${sampleId}`);

    DrawBargraph(sampleId);
    DrawBubblechart(sampleId);
    ShowMetadata(sampleId);
    DrawGauge(sampleId);
}


function InitDashboard()
{
    console.log('InitDashboard()');

    // Get a handle to the dropdown
    let selector = d3.select("#selDataset");

    d3.json(url).then(data => {
        console.log("Here's the data:", data);

        let sampleNames = data.names;
        console.log("Here are the sample names:", sampleNames);

        // Populate the dropdown box
        for (let i = 0; i < sampleNames.length; i++) {
            let sampleId = sampleNames[i];
            selector.append("option").text(sampleId).property("value", sampleId);
        };

        // Read the current value from the dropdown
        let initialId = selector.property("value");
        console.log(`initialId = ${initialId}`);

        // Draw the bargraph for the selected sample id
        DrawBargraph(initialId);
        // Draw the bubblechart for the selected sample id
        DrawBubblechart(initialId);
        // Show the metadata for the selected sample id
        ShowMetadata(initialId);
        // Show the gauge
        DrawGauge(initialId);
    });
}

InitDashboard();
