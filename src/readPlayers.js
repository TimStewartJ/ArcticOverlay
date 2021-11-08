

exports.readFromFile = (path, win, key) => {
    // this is where the latest.log is read
    // currently, we use fs's watchfile to watch with a 20ms interval and grab the last line using read-last-lines
    // this is the fastest method so far, but further experimentation is required
    // the package `tail` does not work on windows as far as i can tell
    // the package `always-tail` works but is not very fast

    const fetchAndUpdatePlayer = async (player) => {
        let playerData = await fetchPlayer(player, key);
        if(!playerData.error) win.webContents.send('updatePlayer', playerData);
        else console.log(playerData);
    }

    const fs = require("fs");

    const rll = require('read-last-lines');

    // const { Tail } = require('tail');

    // let options = {encoding: "ansi" };

    // tail = new Tail(path, options);

    const Tail = require('always-tail');

    const tail = new Tail(path, '\n');

    const ks = require('node-key-sender');
    ks.setOption('startDelayMillisec', 25);

    console.log("reading ready");

    // tail.on("line", (data) => {
    //     if (data.includes(" ONLINE: ")) {
    //         let players = data.split(" [CHAT] ONLINE: ")[1].split(", ")
    //         win.webContents.send('showplayers', players);
    //     }
    // });

    const { fetchPlayer } = require('./fetchPlayers.js');

    let autowho = false;

    let logData = fs.statSync(path);
    let filesize = logData.size;

    let file;

    fs.open(path, 'r', (err, fd) => {
        file = fd;
    })

    // method adopted from statsify, using watch file even though they dont for some reason
    fs.watchFile(path, {interval: 20}, () => {

        fs.read(file, Buffer.alloc(2056), 0, 2056, filesize, (err, bytecount, buff) => {
            filesize += bytecount;
            const lines = buff.toString().split(/\r?\n/).slice(0, -1);
            lines.forEach(line => process(line));
        })

        // rll.read(path, 1).then((line) => {
        //     process(line);
        // });
    });

    const process = (line) => {
        if(line.includes("[CHAT]")) {
            if(line.includes(" ONLINE: ")) {
                let players = line.split(" [CHAT] ONLINE: ")[1].split(", ")
                win.webContents.send('showPlayers', players);
                players.forEach( async (player) => {
                    fetchAndUpdatePlayer(player);
                });
            }
            else if (line.includes(" has joined (")) {
                if(!autowho) {
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
                let player = line.split(" [CHAT] ")[1].split(" has joined")[0]
                win.webContents.send('addPlayer', player);
                fetchAndUpdatePlayer(player);
            }
            else if (line.includes(" has quit!")) {
                let player = line.split(" [CHAT] ")[1].split(" has quit!")[0]
                win.webContents.send('deletePlayer', player);
            }
            else if (line.includes("Sending you to mini")) {
                autowho = false;
            }
        }
    }
}