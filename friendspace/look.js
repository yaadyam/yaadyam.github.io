async function getinputuser() {
    let uid = document.getElementById("userid").value
    if (!(/^\d+$/.test(uid))) {
        alert("Numbers only")
        return
    }

    const rsp = await getuserfriends(uid).catch((err) => {
        document.getElementById("friendstable").style.display = "none"
        alert(err)
        return
    })
        
    listfriends(rsp)
}

function getuserfriends(userID) {
    // https://create.roblox.com/docs/cloud/legacy/friends/v1#/Friends/get_v1_users__userId__friends
    return new Promise((resolve, reject) => {
        let friendsreq = new XMLHttpRequest()
        friendsreq.addEventListener("load", (e) => {
            if (friendsreq.status >= 200 && friendsreq.status < 300) {
                let response = JSON.parse(friendsreq.response)
                if (response.data === undefined) { 
                    reject(`Failed to fetch info for UID ${userID}`)
                } else {
                    document.getElementById("inputusername").innerText = ''
                    resolve(friendsreq.response)
                }
            } else {
                console.error(`HTTP request for friends of UID ${userID} failed with code`, friendsreq.status, friendsreq.statusText);
            }
        })
        friendsreq.open("GET", `https://corsproxy.io/?url=https://friends.roblox.com/v1/users/${userID}/friends`)
        friendsreq.send()
    })
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