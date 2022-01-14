const fields = ['PLAYER', 'TAG', 'WS', 'FKDR', 'WLR', 'BBLR', 'FINAL'];
const ratios = ['FKDR', 'WLR', 'BBLR'];

let mode;

let playerData = {};

let statColor = false;

const sortTable = (tableName) => {
    console.time('sort');
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
            x = rows[i].getAttribute('id');
            y = rows[i + 1].getAttribute('id');

            // Check if the two rows should switch place:
            if (playerData[x].sortPriority < playerData[y].sortPriority) {
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
    console.timeEnd('sort');
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

    // add blank player to playerData
    playerData[name.toLowerCase()] = {sortPriority: -1};

    return node;
};

// reset the table and show the players in the provided input
const showPlayers = (players) => {
    const table = document.getElementById('main-table');

    table.innerHTML = ''; // reset table
    playerData = {}; // reset player data structure

    // create the header row and add the field titles to it
    const headrow = document.createElement('tr');
    fields.forEach(field => {
        let classText = '';
        if(field === 'PLAYER') classText = ' class="playerName"';
        headrow.innerHTML += `<th${classText}>${field}</th>`;
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

    playerData[data.user.toLowerCase()] = data; // set the player's data in the dictionary

    //if the player is not a nick, color them according to their threat level
    if(!data.nick) {
        // if we are on statsify color mode
        if(statColor)
        {
            const rgb = data.stats.bedwars[mode].colors.overall;
            $(`#${data.user.toLowerCase()}`).css('color', `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`);
        }
        
        playerData[data.user.toLowerCase()].sortPriority = data.stats.bedwars[mode].fkdr;
    }
    else {
        playerRow.classList.add('nick');
        playerData[data.user.toLowerCase()].sortPriority = 1000;
    }

    // populate each field with the necessary data
    fields.forEach(field => {
        const fieldNode = document.createElement('td');
        let fieldContent;
        switch(field.toLowerCase()) {
        case 'player':
            fieldContent = `${data.nick ? `${data.user}` : `${data.coloredstar} ${data.displayName}`}`;
            break;
        case 'tag':
            fieldContent = data.nick ? 'NICK' : '';
            break;
        default:
            fieldContent = data.nick ? 'NICK' : ratios.includes(field) ? data.stats.bedwars[mode][field.toLowerCase()].toFixed(2) : data.stats.bedwars[mode][field.toLowerCase()];
            if(!data.nick && !statColor)
            {
                const fieldColor = data.stats.bedwars[mode].colors[field.toLowerCase()];
                fieldNode.style.color = `rgb(${fieldColor[0]},${fieldColor[1]},${fieldColor[2]})`;
            }   
            break;
        }
        fieldNode.innerHTML = fieldContent;
        field !== 'PLAYER' ? fieldNode.classList.add('centered') : fieldNode.classList.add('player-name');
        playerRow.appendChild(fieldNode);
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

    // remove the player from playerData
    delete playerData[player.toLowerCase()];
});

// settings functions

window.settings.initSettings('initSettings', (settings) => {
    $(`#${settings.client}`).prop('selected', true);
    $('#autowho').prop('checked', settings.autowho);
    $('#darkmode').prop('checked', settings.darkmode);
    $('#statColor').prop('checked', settings.statColor);
    $(`#${settings.mode}`).prop('selected', true);
    mode = settings.mode;
    statColor = settings.statColor;
    themeChange(settings.darkmode);
});

window.settings.noticeText('noticeText', (text) => {
    $('#notice-text').text(text);
});

let settingsClicked = false;
let transitioning = false;

const settingsTransition = () => {
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
};

$('#settings-button').click(() => {
    settingsTransition();
});

$('#client-select').change(async () => {
    await window.settings.updateSettings({ type: 'client', client: $('#client-select :selected').val() });
});

$('#autowho').change(async (data) => {
    await window.settings.updateSettings({ type: 'autowho', autowho: data.target.checked });
});

$('#mode-select').change(async () => {
    mode = $('#mode-select :selected').val();
    const players = [];
    $('.player').each(function () {
        players.push($(this).attr('id'));
    });
    await window.settings.updateSettings({ type: 'modeSelect', modeSelect: {
        mode: mode,
        players: players,
    }});
});

const themeChange = (darkmode) => {
    if(darkmode) {
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
};

$('#darkmode').change(async (data) => {
    themeChange(data.target.checked);
    await window.settings.updateSettings({ type: 'darkmode', darkmode: data.target.checked });
});

$('#statColor').change(async (data) => {
    statColor = data.target.checked;
    await window.settings.updateSettings({ type: 'statColor', statColor: data.target.checked });
});

// misc functions

$('#lookup-form').submit((e) => {
    e.preventDefault();
    const lookupName = $('#manual-lookup').val();
    $('#manual-lookup').val('');
    window.misc.manualLookup(lookupName);
});

$('#exit-button').click(async () => {
    if(settingsClicked) settingsTransition();
    else window.misc.exit();
});