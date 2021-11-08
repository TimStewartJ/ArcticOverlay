const fields = ['PLAYER','TAG', 'WS', 'FKDR', 'WLR'];

window.players.display('showPlayers', (data) => {
    let table = document.getElementById("main-table");
    table.innerHTML = ''; // reset table
    let headrow = document.createElement('tr');
    fields.forEach(e => {
        headrow.innerHTML += `<th>${e}</th>`;
    })
    table.appendChild(headrow);

    data.forEach(element => {
        let node = document.createElement('tr');
        node.setAttribute('id', element);
        fields.forEach(e => {
            if(e === 'PLAYER') node.innerHTML += `<td>${element}</td>`
            else node.innerHTML += `<td>...</td>`
        })
        table.appendChild(node);
    });
})

window.players.update('updatePlayer', (data) => {
    let playerRow = document.getElementById(data.user);
    playerRow.innerHTML = '';
    fields.forEach(field => {
        let fieldContent;
        switch(field.toLowerCase()) {
            case "player":
                fieldContent = `[${data.nick ? "nick" : Math.trunc(data.stats.bedwars.overall.stars)}] ${data.user}`;
                break;
            case "tag":
                fieldContent = data.nick ? "NICK" : "";
                break;
            default:
                fieldContent = data.nick ? "NICK" : data.stats.bedwars.overall[field.toLowerCase()] || "0";
                break;
        }
        playerRow.innerHTML += `<td>${fieldContent}</td>`
    })
})

document.getElementById('start-reading').addEventListener('click', async () => {
    console.log("Button clicked!");
    await window.reading.start();
    document.getElementById('start-reading').setAttribute('disabled', 'true');
});