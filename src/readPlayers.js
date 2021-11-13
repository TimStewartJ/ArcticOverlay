const { read, write } = require('./settings');
const { fetchPlayer, validKey, getDisplayName } = require('./fetchPlayers.js');

// this will call upon the api to get the player data and then update it on the front end
const fetchAndUpdatePlayer = async (player, win, key) => {
    if(key) {
        const playerData = await fetchPlayer(player, key);
        if(!playerData.error) win.webContents.send('updatePlayer', playerData);
        // else console.log(`${player  } ${  playerData}`);
    }
};

exports.manualLookup = async (player, win, key) => {
    win.webContents.send('addPlayer', player);
    fetchAndUpdatePlayer(player, win, key);
};

exports.refreshPlayers = async (players, win, key) => {
    win.webContents.send('showPlayers', players);
    players.forEach( async (player) => {
        fetchAndUpdatePlayer(player, win, key);
    });
};

exports.readFromFile = async (path, win, key) => {
    // this is where the latest.log is read
    // we used to use fs's watchfile to watch with a 20ms interval and grab the last line using read-last-lines
    // because multiple lines could be written in the same moment, we now manually read off the newest bytes with fs
    // this is the fastest method so far, but further experimentation is required
    // the package `always-tail` works but is not very fast

    const buffSize = 2056;

    const fs = require('fs');

    const ks = require('node-key-sender');
    ks.setOption('startDelayMillisec', 25);

    const keyfetch = await validKey(key);

    let user;
    
    if(!read('key') || !keyfetch.success) {
        win.webContents.send('invalidKey');
    }
    else {
        user = await getDisplayName(key, keyfetch.record.owner);
    }

    let autowho = false;

    let logData;
    try {
        logData = fs.statSync(path);
    }
    catch(err) {
        win.webContents.send('noticeText', 'INVALID CLIENT - make sure your client is set properly and restart the overlay!');
        return err;
    }

    let filesize = logData.size;

    let file;

    fs.open(path, 'r', (err, fd) => {
        file = fd;
    });

    fs.watchFile(path, {interval: 20}, () => {
        fs.read(file, Buffer.alloc(buffSize), 0, buffSize, filesize, (err, bytecount, buff) => {
            filesize += bytecount;
            const lines = buff.toString().split(/\r?\n/).slice(0, -1);
            lines.forEach(line => process(line));
        });
    });

    fs.watch(path.split('/').slice(0, -1).join('/'), (event, filename) => { // watching for if latest.log get rotated olr anything
        if (event === 'rename' && filename === 'latest.log') {
            fs.open(path, 'r', (err, fd) => {
                file = fd;
            });
        }
    });

    const process = async (line) => {
        // console.log(line);
        if(/.*\[CHAT\] (ONLINE:)?(\w| |\(|\/|\)|,|!|\[|\]|\+)+/.test(line)) { // this particular regex will prevent anything said by a player from getting futher
            console.log(`LEGIT LINE: ${  line}`);
            if(line.includes(' ONLINE: ')) { // case for /who
                const players = line.split(' [CHAT] ONLINE: ')[1].split(', ');
                win.webContents.send('showPlayers', players);
                players.forEach( async (player) => {
                    fetchAndUpdatePlayer(player, win, key);
                });
            }
            else if (/has (joined \(\d+\/\d+\)|quit)!/.test(line)) {
                if (line.includes(' has joined ')) { // case for someone joining the lobby
                    if(read('autowho') && (!autowho || line.includes(`${user} has joined`))) {
                        ks.startBatch()
                            .batchTypeKey('control') // We send these keys before because they can often interfere with `/who` if they were already pressed down. Might (try) to make this configurable (somehow) if enough people use different layouts for it to matter.
                            .batchTypeKey('w')
                            .batchTypeKey('a')
                            .batchTypeKey('s')
                            .batchTypeKey('d')
                            .batchTypeKey('space')
                            .batchTypeKey('slash', 50)
                            .batchTypeKeys(['w','h','o','enter'])
                            .sendBatch();
                        autowho = true;
                    }
                    const player = line.split(' [CHAT] ')[1].split(' has joined')[0];
                    win.webContents.send('addPlayer', player);
                    fetchAndUpdatePlayer(player, win, key);
                }
                else if (line.includes(' has quit!')) { // case for someone quiting the lobby
                    const player = line.split(' [CHAT] ')[1].split(' has quit!')[0];
                    win.webContents.send('deletePlayer', player);
                }
            }
            else if (line.includes('FINAL KILL!')) {
                const player = line.split(' [CHAT] ')[1].split(' ')[0];
                win.webContents.send('deletePlayer', player);
            }
            else if (line.includes('disconnected')) {
                const player = line.split(' [CHAT] ')[1].split(' ')[0];
                win.webContents.send('deletePlayer', player);
            }
            else if (line.includes('reconnected.')) {
                const player = line.split(' [CHAT] ')[1].split(' ')[0];
                win.webContents.send('addPlayer', player);
                fetchAndUpdatePlayer(player, win, key);
            }
            else if (line.includes('Sending you to mini')) {
                win.webContents.send('showPlayers', []); // reset the front end when we join a new lobby
                autowho = false;
            }
            else if (line.includes('Your new API key is ')) {
                key = line.split('[CHAT] Your new API key is ')[1];
                write('key', key);
                if(await validKey(key)) win.webContents.send('validKey');
            }
        }
    };
};