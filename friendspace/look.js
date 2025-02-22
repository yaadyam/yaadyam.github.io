function getinputuser() {
    let uid = document.getElementById("userid").value
    console.log(uid)

    // https://create.roblox.com/docs/cloud/legacy/friends/v1#/Friends/get_v1_users__userId__friends
    let friendsreq = new XMLHttpRequest()
    friendsreq.addEventListener("load", (e) => {
        console.log(friendsreq.response)
        listfriends(friendsreq.response)
    })
    friendsreq.open("GET", `https://corsproxy.io/?url=https://friends.roblox.com/v1/users/${uid}/friends`)
    friendsreq.send()

    /* // https://create.roblox.com/docs/cloud/legacy/users/v1#/Users/get_v1_users__userId_
    httpGetAsync(`https://corsproxy.io/?url=https://users.roblox.com/v1/users/${uid}`, (responseText) => {
        console.log(responseText)
        let userinfo = JSON.parse(responseText)
        document.getElementById("inputusername").innerText = `${userinfo.name}'s friends:`
        
    }) */

}

getinputuser()

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