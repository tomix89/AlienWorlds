let waxAddress = null;
let landAddress = null;

function printLine(line) {
    console.log(line);

    var p = document.createElement("p");
    p.textContent = line;
    document.body.appendChild(p);
}

function setMiner(address) {
    waxAddress = address;
    printLine("Miner is: " + waxAddress);
}

function setLandOwner(address) {
    landAddress = address;
    printLine("Land owner is: " + landAddress);
}

function checkMines() {
    fetch('https://api.alienworlds.io/v1/alienworlds/mines?landowner=' + landAddress + '&miner=' + waxAddress + '&limit=999')
        .then(response => response.json())
        .then(json => {
            let TLMminedSum = 0;
            if (json && json.results && json.results.length > 0) {
                for (let i = 0; i < json.results.length; i++) {
                    let mined = json.results[i].bounty / 10000;
                    let time = json.results[i].block_timestamp;
                    printLine(time.toString() + " -> " + mined.toFixed(4) + " TLM");
                    TLMminedSum += mined;
                }

                printLine("Total mined on " + landAddress + " -> " + TLMminedSum.toString() + " TLM");

            } else {
                printLine("Alien Wolds API is busy, try a few seconds later (reload - F5). Api responded: " + json);
            }
        }).catch(error => {
            console.error("ERR: ", error);
        });
}
