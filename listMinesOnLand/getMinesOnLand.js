const zeroPad = (num, places) => String(num).padStart(places, '0')

let minerAddress = null;
let landOwnerAddress = null;
let landId = null;
let resultField = null;

let clearOnNext = false;


function checkMines() {

    resultField = document.getElementById("resultField");

    minerAddress = document.getElementById("minerName").value.trim();
    landOwnerAddress = document.getElementById("landOwner").value.trim();
    landId = document.getElementById("landId").value.trim();

    console.log("minerAddress: ", minerAddress);
    console.log("landOwnerAddress", landOwnerAddress);
    console.log("landId", landId);

    if (clearOnNext == true) {
       resultField.textContent = "";
    }

    if ((landOwnerAddress != '') && (landId != '')) {
        resultField.textContent += "Fill in EITHER Land owner OR Lanf ID\n"+
			            "Alien Worlds API can't handle both in one request\n"          
	clearOnNext = false;
        return;
    } else {
        clearOnNext = true;
    }

    resultField.textContent = "Patience, running!";

    let querry = "";
    if (landOwnerAddress != '') {
        querry = 'https://api.alienworlds.io/v1/alienworlds/mines?landowner=' + landOwnerAddress + '&miner=' + minerAddress + '&limit=5000';
    } else {
        querry = 'https://api.alienworlds.io/v1/alienworlds/mines?land_id=' + landId + '&miner=' + minerAddress + '&limit=5000';
    }
    console.log("querry", querry);

    fetch(querry)
        .then(response => response.json())
        .then(json => {
            let TLMminedSum = 0;
            let lines = "";

            if (json && json.results && json.results.length > 0) {
                for (let i = 0; i < json.results.length; i++) {
                    let mined = json.results[i].bounty / 10000;
                    let time = json.results[i].block_timestamp;

                    line = "[" + zeroPad(i, 4) + "] | ";
                    line += time.toString() + " | ";
                    line += "minerAddress: " + json.results[i].miner + " | "
                    line += "landId: " + json.results[i].land_id + " | "
                    line += "landOwnerAddress: " + json.results[i].landowner + " | "
                    line += mined.toFixed(4) + " TLM";
                    lines += line + "\n";
                    TLMminedSum += mined;
                }

                resultField.textContent = lines;

                let totalMinedLabel = document.getElementById("totalMined");
                totalMinedLabel.textContent = TLMminedSum.toString() + " TLM";

            } else {
                resultField.textContent = "Alien Wolds API is busy (or error happened).\nDouble check your input and try a few seconds later (reload - F5). Api responded: " + json;
            }
        }).catch(error => {
            printLine("ERROR: ", error);
        });
}
