async function getinputuser() {
    document.getElementById("getinfobutton").setAttribute("disabled", true)
    let uid = document.getElementById("userid").value
    if (!(/^\d+$/.test(uid))) {
        alert("Numbers only")
        document.getElementById("getinfobutton").removeAttribute("disabled")
    } else {
        makerequest(`https://corsproxy.io/?url=https://friends.roblox.com/v1/users/${uid}/friends`, listfriends) // https://create.roblox.com/docs/cloud/legacy/friends/v1#/Friends/get_v1_users__userId__friends
            .then(() => makerequest(`https://corsproxy.io/?url=https://users.roblox.com/v1/users/${uid}`, liststats)) // https://create.roblox.com/docs/cloud/legacy/users/v1#/Users/get_v1_users__userId_
            .then(() => {
                document.getElementById("userinfo").style.display = "flex"
                document.getElementById("getinfobutton").removeAttribute("disabled")
            }).catch((error) => {
                alert(JSON.parse(error.currentTarget.response).errors[0].message)
                document.getElementById("getinfobutton").removeAttribute("disabled")
            })
    }
}

/* Make request to `url`, if successful use it as a parameter to call `callback` */
function makerequest(url, callback) {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest()
        req.addEventListener("load", (e) => {
            if (req.status >= 200 && req.status < 300) {
                callback(JSON.parse(req.responseText))
                resolve()
            } else {
                reject(e)
            }
        })
        req.open("GET", url)
        setTimeout(req.send(), 500) // Prevent HTTP Error 429 "Too Many Requests"
    });
}

/* List all friends contained within JSON object */
function listfriends(response) {
    let table = document.getElementById("friendstable")
    let tbody = table.querySelector("tbody")
    tbody.innerHTML = ''
    response.data.forEach(user => {
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
    document.getElementById("numfriends").innerText = `Friends (${response.data.length})`
    table.style.display = "table"
}

/* List stats contained within user JSON object */
function liststats(response) {
    
    document.getElementById("statsusername").innerText = response.name
    
    document.getElementById("statsdisplayname").innerText = response.displayName
    
    let dateCreated = parseISOLocal(response.created)
    document.getElementById("statsdatecreated").innerText = dateCreated.toLocaleString(undefined)
    
    let accountAge = Date.now() - dateCreated
    document.getElementById("statsaccountage").innerText = (accountAge / (1000*60*60*24)).toLocaleString(undefined, { "maximumFractionDigits": 2 }) + " days"

    let status = document.getElementById("statsaccountstatus")
    if (response.isBanned) {
        status.innerText = "Banned"
        status.style.color = "rgb(200, 20, 20)"
    } else {
        status.innerText = "Active"
        status.style.color = "rgb(20, 120, 20)"
    }

    console.log(response)
}

function parseISOLocal(s) {
    var b = s.split(/\D/);
    return new Date(b[0], b[1]-1, b[2], b[3], b[4], b[5]);
}