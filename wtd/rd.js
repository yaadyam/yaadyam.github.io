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
    document.getElementById("gameversion").innerText =
        "for WTD " + gd.game_version
    document.getElementById("randomize").removeAttribute("disabled") // prevent user from somehow hitting randomize before json object is loaded
    randomize()
}

getData()

function randomize() {
    const accessories = gd["accessories"]
    let chosenacc =
        Object.entries(accessories)[
        Math.floor(Math.random() * Object.keys(accessories).length)
        ]
    const isSummoner = chosenacc[1]["summoner"]
    let accpageslot = document.getElementById("chosenaccessory")
    accpageslot.lastElementChild.innerText = toTitleCase(chosenacc[0])
    accpageslot.querySelector("img").src = "./images/placeholder.jpg"

    const units = gd["units"]
    let chosenindices = [-1, -1, -1, -1, -1]
    for (let i = 0; i < 5 && !isSummoner; i++) {
        let choice
        do {
            choice = Math.floor(Math.random() * Object.keys(units).length)
        } while (chosenindices.includes(choice))
        chosenindices[i] = choice
    }
    for (let i = 1; i <= 5; i++) {
        if (isSummoner) {
            let pageslot = document.getElementById("unit" + i)
            pageslot.querySelector("img").src = "./images/placeholder.jpg"
            pageslot.lastElementChild.innerText = "[none]"
        } else {
            let chosenunit = Object.keys(units)[chosenindices[i - 1]]
            let pageslot = document.getElementById("unit" + i)
            pageslot.querySelector("img").removeAttribute("hidden")
            pageslot.querySelector("img").src = "./images/units/" + chosenunit + ".png"
            pageslot.lastElementChild.innerText = toTitleCase(chosenunit)
        }
    }
}

function toTitleCase(str) {
    str = str.replaceAll("_", " ")
    str = str.toLowerCase().split(" ")
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1)
    }
    return str.join(" ")
}
