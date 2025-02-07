/*
    For ease of updating the unit stats, all the game data is stored locally on this server as ~/wtd/data.json
    "game_version" is the version number the data is updated for 
*/

let gd // JSON object containing game data
let filter = {
    "summoners": true,
    "credz": true,
    "trophy": true,
    "token": true,
    "special": true,
    "pvp": true,
    "alt": true
}

let exclude = {}

async function getData() {
    const url = "./data.json"
    const response = await fetch(url)
    const json = await response.json()
    gd = json
    document.getElementById("gameversion").innerText = "for WTD " + gd.game_version
    
    let unitdl = document.getElementById("unitdatalist")
    Object.keys(gd["units"]).forEach(unit => {
        let opt = document.createElement("option")
        let opttn = document.createTextNode(unit)
        opt.appendChild(opttn)
        opt.innerText = toTitleCase(unit)
        opt.value = unit
        unitdl.insertBefore(opt, undefined)
    })

    
    var coll = document.getElementsByClassName("collapsible");
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
    
    document.getElementById("randomize").removeAttribute("disabled") // prevent user from somehow hitting randomize before json object is loaded
    randomize()
}

getData()

function randomize() {
    updatefilters()
    const accessories = gd["accessories"]
    let accpool = []
    Object.entries(accessories).forEach(acc => {
        let issummon = acc[1]["summoner"]
        if (!(issummon && !filter["summoners"])) {
            accpool.push(acc);
        }
    })
    let chosenacc = accpool[Math.floor(Math.random() * accpool.length)]
    const isSummoner = chosenacc[1]["summoner"]
    let accpageslot = document.getElementById("chosenaccessory")
    accpageslot.lastElementChild.innerText = toTitleCase(chosenacc[0])

    const units = gd["units"]
    let unitpool = []
    Object.entries(units).forEach(unit => {
        let cat = unit[1]["category"];
        if (filter[cat] == true && exclude[unit[0]] == undefined) {
            unitpool.push(unit)
        }
    })
    if (unitpool.length > 0 && !isSummoner) {
        let chosenindices = []
        for (let i = 0; i < 5; i++) {
            let choice
            do {
                choice = Math.floor(Math.random() * unitpool.length)
            } while (chosenindices.includes(choice))
            chosenindices.push(choice)
        }
        for (let i = 0; i < 5; i++) {
            let chosenunit = unitpool[chosenindices[i]]
            let pageslot = document.getElementById("unit" + (i+1))
            pageslot.querySelector("img").style.display = "inline"
            pageslot.querySelector("img").src = "./images/units/" + chosenunit[0] + ".png"
            pageslot.lastElementChild.innerText = toTitleCase(chosenunit[0])
        }
    } else {
        for (let i = 1; i <= 5; i++) {
            let pageslot = document.getElementById("unit" + i)
            pageslot.querySelector("img").style.display = "none"
            pageslot.lastElementChild.innerText = "[none]"
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

function updatefilters() {
    filter["credz"] = document.getElementById("includecredz").checked
    filter["trophy"] = document.getElementById("includetrophy").checked
    filter["token"] = document.getElementById("includetoken").checked
    filter["special"] = document.getElementById("includespecial").checked
    filter["pvp"] = document.getElementById("includepvp").checked
    filter["alt"] = document.getElementById("includealt").checked
    filter["summoners"] = document.getElementById("includesummon").checked
}

function userexclude() {
    let unitname = document.getElementById("excludeunitinput").value
    if (gd["units"][unitname] != undefined && exclude[unitname] == undefined) {
        exclude[unitname] = true
        let unitexc = document.getElementById("userexcludelist")
        let opt = document.createElement("p")
        let opttn = document.createTextNode(unitname)
        opt.appendChild(opttn)
        opt.innerText = toTitleCase(unitname)
        unitexc.insertBefore(opt, undefined)
    } else {
        console.log("Cannot find unit " + unitname + " or unit already excluded" );
    }
}

function clearuserexclude() {
    exclude = {}
    document.getElementById("userexcludelist").innerHTML = ''
}