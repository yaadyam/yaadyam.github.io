/*
    For ease of updating the unit stats, all the game data is stored locally on this server as ~/wtd/data.json
    "game_version" is the version number the data is updated for 
*/

let gd // JSON object containing game data

async function getData() {
    const url = "./data.json"
    const response = await fetch(url)
    const json = await response.json()
    gd = json
    document.getElementById("gameversion").innerText = "for WTD " + gd.game_version
    document.getElementById("randomize").removeAttribute("disabled") // prevent user from somehow hitting randomize before json object is loaded
}

getData()

function randomize() {
    const units = gd["units"]
    let chosenindices = []
    for (let i = 0; i < 5; i++) {
        let choice;
        do {
            choice = Math.floor(Math.random() * Object.keys(units).length )
        } while (chosenindices.includes(choice))
        chosenindices.push(choice)
    }
    for (let i = 1; i <= 5; i++) {
        let chosenunit = Object.keys(units)[chosenindices[i-1]];
        let pageslot = document.getElementById("unit" + i);
        pageslot.lastElementChild.innerText = chosenunit.charAt(0).toUpperCase() + chosenunit.slice(1)
    }
}