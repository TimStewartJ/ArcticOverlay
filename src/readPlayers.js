const { read, write } = require('./settings');

exports.readFromFile = async (path, win) => {
    // this is where the latest.log is read
    // we used to use fs's watchfile to watch with a 20ms interval and grab the last line using read-last-lines
    // because multiple lines could be written in the same moment, we now manually read off the newest bytes with fs
    // this is the fastest method so far, but further experimentation is required
    // the package `always-tail` works but is not very fast

    // this will call upon the api to get the player data and then update it on the front end
    const fetchAndUpdatePlayer = async (player) => {
        if(key) {
            let playerData = await fetchPlayer(player, key);
            if(!playerData.error) win.webContents.send('updatePlayer', playerData);
            else console.log(player + " " + playerData);
        }
    };

    const buffSize = 2056;

    const fs = require("fs");

    // const rll = require('read-last-lines');

    // const Tail = require('always-tail');

    // const tail = new Tail(path, '\n');

    const ks = require('node-key-sender');
    ks.setOption('startDelayMillisec', 25);

    const { fetchPlayer, validKey } = require('./fetchPlayers.js');

    let key = read("key");

    // let test = await validKey(key);
        
    // console.log(test);
    
    if(!key || !await validKey(key)) {
        win.webContents.send('invalidKey');
        
    }

    let autowho = false;

    let logData = fs.statSync(path);
    let filesize = logData.size;

    
    let file;
    fs.open(path, 'r', (err, fd) => {
        file = fd;
    });

    // method adopted from statsify, using watch file even though they dont for some reason
    fs.watchFile(path, {interval: 20}, () => {
        fs.read(file, Buffer.alloc(buffSize), 0, buffSize, filesize, (err, bytecount, buff) => {
            filesize += bytecount;
            const lines = buff.toString().split(/\r?\n/).slice(0, -1);
            lines.forEach(line => process(line));
        });

        // rll.read(path, 1).then((line) => {
        //     process(line);
        // });
    });

    const process = async (line) => {
        // console.log(line);
        if(/.*\[CHAT\] (ONLINE:)?(\w| |\(|\/|\)|,|!|\[|\]|\+)+/.test(line)) { // this particular regex will prevent anything said by a player from getting futher
            // console.log("LEGIT LINE: " + line);
            if(line.includes(" ONLINE: ")) { // case for /who
                let players = line.split(" [CHAT] ONLINE: ")[1].split(", ");
                win.webContents.send('showPlayers', players);
                players.forEach( async (player) => {
                    fetchAndUpdatePlayer(player);
                });
            }
            else if (/has (joined \(\d+\/\d+\)|quit)!/.test(line)) {
                if (line.includes(" has joined ")) { // case for someone joining the lobby
                    if(read("autowho") && !autowho) {
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
                    let player = line.split(" [CHAT] ")[1].split(" has joined")[0];
                    win.webContents.send('addPlayer', player);
                    fetchAndUpdatePlayer(player);
                }
                else if (line.includes(" has quit!")) { // case for someone quiting the lobby
                    let player = line.split(" [CHAT] ")[1].split(" has quit!")[0];
                    win.webContents.send('deletePlayer', player);
                }
            }
            else if (line.includes("Sending you to mini")) {
                win.webContents.send('showPlayers', []); // reset the front end when we join a new lobby
                autowho = false;
            }
            else if (line.includes("Your new API key is ")) {
                key = line.split("[CHAT] Your new API key is ")[1];
                write("key", key);
                if(await validKey(key)) win.webContents.send("validKey");
            }
        }
    };
};