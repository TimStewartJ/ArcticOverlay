const fields = ['PLAYER', 'TAG', 'WS', 'FKDR', 'FINAL', 'WLR', 'BBLR'];

let mode;

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
            x = rows[i].getElementsByTagName('TD')[3];
            y = rows[i + 1].getElementsByTagName('TD')[3];
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
};

// table updating functions from main

// create a new row for the player and populate it with the default ...
const createPlayerRow = (name) => {
    const node = document.createElement('tr');
    node.setAttribute('id', name.toLowerCase());
    node.classList.add('player');
    fields.forEach(field => {
        if(field === 'PLAYER') node.innerHTML += `<td class="player-name">${name}</td>`;
        else node.innerHTML += '<td class=\"centered\">...</td>';
    });
    return node;
};

// reset the table and show the players in the provided input
const showPlayers = (players) => {
    const table = document.getElementById('main-table');
    table.innerHTML = ''; // reset table
    // create the header row and add the field titles to it
    const headrow = document.createElement('tr');
    fields.forEach(field => {
        headrow.innerHTML += `<th>${field}</th>`;
    });
    table.appendChild(headrow);

    players.forEach(player => { // for each player, create a row and populate each field with ...
        table.appendChild(createPlayerRow(player));
    });
};

window.players.display('showPlayers', (players) => {
    showPlayers(players);
});

window.players.update('updatePlayer', (data) => {
    // if we are receiving sniper data
    if(data.sniperData) {
        $(`#${data.user.toLowerCase()} td:nth-child(${2})`).text('SNIPER');
        return;
    }

    const playerRow = document.getElementById(data.user.toLowerCase()); // find the player row
    playerRow.innerHTML = ''; // reset the player row's data

    //if the player is not a nick, color them according to their threat level
    if(!data.nick) {
        const rgb = data.stats.bedwars[mode].color;
        $(`#${data.user.toLowerCase()}`).css('color', `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`);
    }
    else {
        playerRow.classList.add('nick');
    }

    // populate each field with the necessary data
    fields.forEach(field => {
        let fieldContent;
        switch(field.toLowerCase()) {
        case 'player':
            fieldContent = `${data.nick ? `${data.user}` : `${data.coloredstar} ${data.displayName}`}`;
            break;
        case 'tag':
            fieldContent = data.nick ? 'NICK' : '';
            break;
        default:
            fieldContent = data.nick ? 'NICK' : data.stats.bedwars[mode][field.toLowerCase()] || '0';
            break;
        }
        playerRow.innerHTML += `<td${field !== 'PLAYER' ? ' class=\"centered\"' : ' class="player-name"'}>${fieldContent}</td>`;
    });
    sortTable('main-table'); // re sort the table
});

window.players.add('addPlayer', (player) => {
    if($(`#${player.toLowerCase()}`).length) return;
    const table = document.getElementById('main-table');
    table.appendChild(createPlayerRow(player));
});

window.players.delete('deletePlayer', (player) => {
    // find the row corresponding to the player, and if it exists, delete it
    const row = document.getElementById(player.toLowerCase());
    if(row) row.parentNode.removeChild(row);
});

// settings functions

window.settings.initSettings('initSettings', (settings) => {
    $(`#${settings.client}`).prop('selected', true);
    $('#autowho').prop('checked', settings.autowho);
    $(`#${settings.mode}`).prop('selected', true);
    mode = settings.mode;
});

window.settings.invalidKey('invalidKey', () => {
    $('#notice-text').text('INVALID KEY');
});

window.settings.validKey('validKey', () => {
    $('#notice-text').text('');
});

window.settings.noticeText('noticeText', (text) => {
    $('#notice-text').text(text);
});

let settingsClicked = false;
let transitioning = false;

$('#settings-button').click(() => {
    const transitionLength = 500;
    if(!transitioning) {
        transitioning = true;
        if(settingsClicked) {
            $('#settings-button').removeClass('clicked');
            $('#settings-button').css('transform','rotate(0deg)');
            $('#settings').animate({top: '-15em'}, transitionLength);
        }
        else {
            $('#settings-button').addClass('clicked');
            $('#settings-button').css('transform','rotate(180deg)');
            $('#settings').animate({top: '5em'}, transitionLength);
        }
    }
    setTimeout(() => {
        transitioning = false;
        settingsClicked = !settingsClicked;
    }, transitionLength);
});

$('#client-select').change(async () => {
    await window.settings.clientSelect($('#client-select :selected').val());
});

$('#autowho').change(async (data) => {
    await window.settings.autowhoToggle(data.target.checked);
});

$('#mode-select').change(async () => {
    mode = $('#mode-select :selected').val();
    const players = [];
    $('.player').each(function () {
        players.push($(this).attr('id'));
    });
    await window.settings.modeSelect({
        mode: mode,
        players: players,
    });
});

$('#darkmode').change(async (data) => {
    if(data.target.checked) {
        document.body.classList.add('dark-mode');
        document.getElementById('misc-footer').classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        document.getElementById('misc-footer').classList.remove('light-mode');
    }
    else {
        document.body.classList.remove('dark-mode');
        document.getElementById('misc-footer').classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        document.getElementById('misc-footer').classList.add('light-mode');
    }
});

// misc functions

// $('#lookup-submit').click(async () => {
//     await window.misc.manualLookup($('#manual-lookup').val());
// });

$('#clear-table').click(async () => {
    // await window.misc.clearTable();
    showPlayers([]);
});

$('#lookup-form').submit((e) => {
    e.preventDefault();
    const lookupName = $('#manual-lookup').val();
    $('#manual-lookup').val('');
    window.misc.manualLookup(lookupName);
});