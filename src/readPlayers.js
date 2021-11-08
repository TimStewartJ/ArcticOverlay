exports.readFromFile = (path, win) => {
    // const { Tail } = require('tail');

    // let options = {encoding: "ansi" };

    // tail = new Tail(path, options);

    const Tail = require('always-tail');

    const tail = new Tail(path, '\n');

    console.log("reading ready");

    tail.on("line", (data) => {
        console.log(data);
        if (data.includes(" ONLINE: ")) {
            let players = data.split(" [CHAT] ONLINE: ")[1].split(", ")
            players.forEach((player) => console.log(player));
            win.webContents.send('showplayers', players);
        }
    });
}