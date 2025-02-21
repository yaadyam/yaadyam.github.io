function getinputuser() {
    let uid = document.getElementById("userid").value
    console.log(uid)

    // https://create.roblox.com/docs/cloud/legacy/friends/v1#/Friends/get_v1_users__userId__friends
    httpGetAsync(`https://corsproxy.io/?url=https://friends.roblox.com/v1/users/${uid}/friends`, (responseText) => {
        console.log(responseText)
        listfriends(responseText)
    })
}

function listfriends(responseText) {
    let friends = JSON.parse(responseText)
    let table = document.getElementById("friendstable")
    friends.data.forEach(user => {
        let row = document.createElement("tr")

        // username (row header)
        let colUsername = document.createElement("th")
        colUsername.innerText = user.name
        row.appendChild(colUsername)

        // user ID
        let colUserID = document.createElement("tr")
        colUserID.setAttribute("class", "monotxt")
        colUserID.innerText = user.id
        row.appendChild(colUserID)
        
        table.querySelector("tbody").appendChild(row)
    });
    table.style.display = "table"
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText)
    }
    xmlHttp.open("GET", theUrl, true) // true for asynchronous 
    xmlHttp.send(null)
}