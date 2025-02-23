

function getinputuser() {
    let uid = document.getElementById("userid").value
    console.log(uid)

    // https://create.roblox.com/docs/cloud/legacy/friends/v1#/Friends/get_v1_users__userId__friends
    let friendsreq = new XMLHttpRequest()
    friendsreq.addEventListener("load", (e) => {
        let response = JSON.parse(friendsreq.response)
        if (response.data === undefined) {
            document.getElementById("friendstable").style.display = "none"
            document.getElementById("inputusername").innerText = `Failed to fetch info for UID ${uid}`
        } else {
            document.getElementById("inputusername").innerText = ``
            listfriends(friendsreq.response)
        }
    })
    friendsreq.open("GET", `https://corsproxy.io/?url=https://friends.roblox.com/v1/users/${uid}/friends`)
    friendsreq.send()

}

function listfriends(response) {
    let friends = JSON.parse(response)
    let table = document.getElementById("friendstable")
    let tbody = table.querySelector("tbody")
    tbody.innerHTML = ''
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