exports.readFromFile = (path, win, key) => {
    // this is where the latest.log is read
    // currently, we use fs's watchfile to watch with a 20ms interval and grab the last line using read-last-lines
    // this is the fastest method so far, but further experimentation is required
    // the package `tail` does not work on windows as far as i can tell
    // the package `always-tail` works but is not very fast

    const fs = require("fs");

    const rll = require('read-last-lines');

    // const { Tail } = require('tail');

    // let options = {encoding: "ansi" };

    // tail = new Tail(path, options);

    const Tail = require('always-tail');

    const tail = new Tail(path, '\n');

    console.log("reading ready");

    // tail.on("line", (data) => {
    //     if (data.includes(" ONLINE: ")) {
    //         let players = data.split(" [CHAT] ONLINE: ")[1].split(", ")
    //         win.webContents.send('showplayers', players);
    //     }
    // });

    const { fetchPlayer } = require('./fetchPlayers.js');

    fs.watchFile(path, {interval: 20}, () => {
        rll.read(path, 1).then((line) => {
            if (line.includes(" ONLINE: ")) {
                let players = line.split(" [CHAT] ONLINE: ")[1].split(", ")
                win.webContents.send('showPlayers', players);
                players.forEach( async (player) => {
                    let playerData = await fetchPlayer(player, key);
                    if(!playerData.error) win.webContents.send('updatePlayer', playerData);
                    else console.log(playerData);
                })
            }
        });
    });
}