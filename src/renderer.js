const fields = ['PLAYER','TAG', 'WS', 'FKDR', 'WLR'];

const sortTable = (tableName) => {
    const table = document.getElementById(tableName);
    let rows, i, x, y, shouldSwitch;
    let switching = true;
    while(switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[3];
            y = rows[i + 1].getElementsByTagName("TD")[3];
            // Check if the two rows should switch place:
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        }
    }
}

// table updating functions from main

window.players.display('showPlayers', (data) => {
    let table = document.getElementById("main-table");
    table.innerHTML = ''; // reset table
    let headrow = document.createElement('tr');
    fields.forEach(field => {
        headrow.innerHTML += `<th>${field}</th>`;
    })
    table.appendChild(headrow);

    data.forEach(element => {
        let node = document.createElement('tr');
        node.setAttribute('id', element);
        fields.forEach(field => {
            if(field === 'PLAYER') node.innerHTML += `<td>${element}</td>`
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
    sortTable("main-table");
});

window.players.add('addPlayer', (player) => {
    let table = document.getElementById("main-table");
    let node = document.createElement('tr');
    node.setAttribute('id', player);
    fields.forEach(e => {
        if(e === 'PLAYER') node.innerHTML += `<td>${player}</td>`
        else node.innerHTML += `<td>...</td>`
    })
    table.appendChild(node);
});

window.players.delete('deletePlayer', (player) => {
    let row = document.getElementById(player);
    row.parentNode.removeChild(row);
})

// settings functions

window.settings.initSettings('initSettings', (settings) => {
    $(`#${settings.client}`).prop('selected', true);
    $("#autowho").prop('checked', settings.autowho);
})

window.settings.invalidKey('invalidKey', () => {
    $('#notice-text').text("INVALID KEY");
})

window.settings.validKey('validKey', () => {
    $('#notice-text').text("");
})

let settingsClicked = false;

$("#settings-button").click(() => {
    if(settingsClicked) {
        $("#settings-button").removeClass("clicked");
    }
    else {
        $("#settings-button").addClass("clicked");
    }
    settingsClicked = !settingsClicked;
})

$("#client-select").change(async () => {
    await window.settings.clientSelect($('#client-select :selected').val());
})

$("#autowho").change(async (data) => {
    await window.settings.autowhoToggle(data.target.checked);
})