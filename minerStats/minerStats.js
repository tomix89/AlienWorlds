const zeroPad = (num, places) => String(num).padStart(places, '0')

var histChart = null;
var mineChart = null;

var minerAddress = null;

function getToolAndShow(assetId, bagPosition) {

    let query = 'https://wax.api.atomicassets.io/atomicmarket/v1/assets/' + assetId;
    console.log("query", query);

    fetch(query)
        .then(response => response.json())
        .then(json => {

            if (json && json.data) {

                let image = json.data.collection.img;
                let shine = json.data.data.shine;
                let name = json.data.data.name;

                resultField.textContent += 'bag[' + (bagPosition + 1) + ']  ' + name + " - " + shine + '\n';

            } else {
                resultField.textContent = "AtomicAssets API is busy (or error happened).\nDouble check your input and try a few seconds later (reload - F5). Api responded: " + json;
            }
        }).catch(error => {
            console.log(error);
            resultField.textContent += "ERROR: " + error;
        });
}


function checkBag() {

    let query = 'https://api.alienworlds.io/v1/alienworlds/mines?miner=' + minerAddress + '&limit=2';
    console.log("query", query);

    fetch(query)
        .then(response => response.json())
        .then(json => {

            if (json && json.results && json.results.length > 0) {

                let bag = json.results[0].bag_items;
                console.log(bag);

                resultField.textContent += '\n' + "Tools in the bag: " + bag.length + '\n';

                for (let i = 0; i < bag.length; i++) {
                    getToolAndShow(bag[i], i);
                }


            } else {
                resultField.textContent += "Alien Wolds API is busy (or error happened).\nDouble check your input and try a few seconds later (reload - F5). Api responded: " + json;
            }
        }).catch(error => {
            resultField.textContent += "ERROR: " + error;
        });
}


function checkMiner() {
    document.getElementById("btnMinerBag").style.display = "none";

    let minedSum = 0;
    let mineCount = 0;
    let lines = "";

    var deltas = [];
    var timeAmountArr = [];

    let resultField = document.getElementById("resultField");
    minerAddress = document.getElementById("minerName").value.trim();
    // console.log("minerAddress: ", minerAddress);
    let daysLookBack = document.getElementById("daysLookBack").value.trim();
    // console.log("daysLookBack: ", daysLookBack);


    // clear the charts
    if (mineChart != null) {
        mineChart.destroy();
    }

    if (histChart != null) {
        histChart.destroy();
    }

    var currDate = new Date().getTime();
    console.log(currDate);
    var targetDate = currDate - (daysLookBack * 24 * 60 * 60 * 1000);
    console.log(targetDate);
    // create the ISO string
    var isoDate = new Date(targetDate).toISOString();

    let query = 'https://api.alienworlds.io/v1/alienworlds/mines?miner=' + minerAddress + '&limit=5000' + '&from=' + isoDate;
    console.log("query", query);

    var lastMine_ms = null;

    resultField.textContent = "Patience, running!";
    fetch(query)
        .then(response => response.json())
        .then(json => {

            if (json && json.results && json.results.length > 0) {
                for (let i = 0; i < json.results.length; i++) {
                    let mined = json.results[i].bounty / 10000;
                    let timeRaw = json.results[i].block_timestamp;

                    minedSum += mined;
                    mineCount++;

                    var cooldown_s = json.results[i].params.delay;
                    var currMine_ms = new Date(timeRaw).getTime();

                    timeAmountArr.push({
                        x: currMine_ms,
                        y: mined
                    });

                    if (lastMine_ms != null) {
                        var realDelta_s = (lastMine_ms - currMine_ms) / 1000.0;
                        //    console.log('realDelta_s', realDelta_s);
                        //    console.log('dlt', realDelta_s - cooldown_s);

                        deltas.push(realDelta_s - cooldown_s);
                    }

                    lastMine_ms = currMine_ms;
                }

                // to maximize the timespan of the mine chart
                timeAmountArr.unshift({
                    x: currDate,
                    y: 0
                }); // stretch data from 'Now'
                if (mineCount < 5000) {
                    timeAmountArr.push({
                        x: targetDate,
                        y: 0
                    }); // stretch data to target - only if not limited by API
                }

                createHistAndPlot(deltas);
                plotMines(timeAmountArr);
                document.getElementById("btnMinerBag").style.display = "inline";

                lines += "Total mined: " + minedSum.toFixed(4) + " TLM" + "\n";
                lines += "Average TLM / mine: " + (minedSum / mineCount).toFixed(4) + " TLM" + "\n";
                lines += "Total mine count: " + mineCount + "x" + "\n";
                lines += "Avg mine count / day: " + (mineCount / daysLookBack) + "x" + "\n";
                // add rig setups
                // add lands + owners

                if (mineCount == 5000) {
                    lines += "\n" + "WARNING, data not complete, you hit the api limit of 5000 results" + "\n";
                    lines += "your real end of data is: " + new Date(lastMine_ms).toUTCString() + " instead of: " + new Date(targetDate).toUTCString() + "\n";
                }

                resultField.textContent = lines;

            } else {
                resultField.textContent = "Alien Wolds API is busy (or error happened).\nDouble check your input and try a few seconds later (reload - F5). Api responded: " + json;
            }
        }).catch(error => {
            resultField.textContent = "ERROR: " + error;
        });
}


function plotMines(timeAmountArr) {

    var maxY = 0;

    var i;
    for (i = 0; i < timeAmountArr.length; i++) {

        if (timeAmountArr[i].y > maxY) {
            maxY = timeAmountArr[i].y;
        }

        var daySplitters = [];

        const oneDay_ms = 24 * 60 * 60 * 1000;
        var startDay_ms = timeAmountArr[timeAmountArr.length - 1].x;
        startDay_ms = Math.floor(startDay_ms / oneDay_ms) * oneDay_ms;

        var splitDate_ms = startDay_ms + oneDay_ms;


        while (splitDate_ms < timeAmountArr[0].x) {

            daySplitters.push({
                x: splitDate_ms,
                y: maxY
            });

            splitDate_ms = splitDate_ms + oneDay_ms;
        }
    }

    const data = {
        datasets: [{
                label: 'Mined TLM by time',
                data: timeAmountArr,
                //borderColor: 'black',
                backgroundColor: 'green',
                //  borderWidth: 1,
                //  barPercentage: 1,
                //  categoryPercentage: 1,
                barThickness: 3,
            },
            {
                label: 'Day splitter',
                data: daySplitters,
                backgroundColor: 'red',
                barThickness: 1,
            }
        ],
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            // the below 2 options assures the right max-width behaviour
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',

                    min: timeAmountArr[timeAmountArr.length - 1].x,
                    max: timeAmountArr[0].x,

                    ticks: {
                        minRotation: 20, // angle in degrees
                        callback: function(value, index, values) {
                            return moment(value).utc().format("YYYY-MM-DD HH:mm");
                        }
                    }
                }
            }
        }
    };

    // plot to canvas --------------
    var ctx = document.getElementById('chartMines').getContext('2d');
    mineChart = new Chart(ctx, config);

}

function createHistAndPlot(dataIn) {

    var divisions_s = [];
    var divisions_txt = [];
    var limit_s = 1.0;

    // limit is 8 hour
    var maxTime_s = 8 * 60 * 60;
    while (limit_s < maxTime_s) {
        divisions_s.push(limit_s);
        divisions_txt.push('<' + formatTime(limit_s));
        limit_s = limit_s * 1.45;
    }

    divisions_txt.push('>' + formatTime(maxTime_s));

    var histogram = new Array(divisions_txt.length).fill(0);

    // create the actual histogram
    var i;
    for (i = 0; i < dataIn.length; i++) {

        var j;
        for (j = 0; j < divisions_s.length; j++) {
            if (dataIn[i] < divisions_s[j]) {
                histogram[j] = histogram[j] + 1;
                break;
            }
        }
        // last bar
        histogram[j] = histogram[j] + 1;
    }

    // plot to canvas --------------
    var ctx = document.getElementById('chartHistogram').getContext('2d');
    histChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: divisions_txt,
            datasets: [{
                label: 'Histogram of \'delays\' (time between mines excluding cooldown time)',
                data: histogram,
            }]
        },
        options: {
            // the below 2 options assures the right max-width behaviour
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}



function formatTime(time_s) {

    var hours = Math.floor(time_s / 60 / 60);
    time_s = time_s - hours * 60 * 60;

    var minutes = Math.floor(time_s / 60);
    time_s = time_s - minutes * 60;


    if ((hours == 0) && (minutes == 0)) {
        return time_s.toFixed(1);
    }

    if (hours == 0) {
        return minutes.toString() + ':' + zeroPad(time_s.toFixed(0), 2);
    }

    return hours.toString() + ':' + zeroPad(minutes, 2) + ':' + zeroPad(time_s.toFixed(0), 2);

}