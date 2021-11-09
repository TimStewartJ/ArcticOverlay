const fetch = require('node-fetch');

let uuidCache = {};
let nickCache = {};

ratio = (top, bottom) => {
    return (top/bottom).toFixed(2);
}

const xpperlevel = [500, 1000, 2000, 3500];

// the following function is shamelessly stolen from statsify
const getBwLevel = (exp = 0) => {
    var prestiges = Math.floor(exp / 487000);
    var level = prestiges * 100;
    var remainingExp = exp - (prestiges * 487000);

    for (let i = 0; i < 4; ++i) {
        var expForNextLevel = xpperlevel[i]
        if (remainingExp < expForNextLevel) break;
        level++
        remainingExp -= expForNextLevel
    }

    return parseFloat((level + (remainingExp / 5000)).toFixed(2))
}

exports.fetchPlayer = (player, key) => {
    return new Promise( resolve => {
        let lookup = ""
        if(uuidCache[player]) lookup = `uuid=${uuidCache[player]}`
        else if(nickCache[player]) resolve({nick: true, user: player});
        else lookup = `name=${player}`
        fetch(`https://api.hypixel.net/player?key=${key}&${lookup}`)
        .then(res => res.json()).catch(err => resolve({error: true, reason: err, user: player}))
        .then(data => {
            if(data.throttle) resolve({error: true, reason: 'throttle', user: player});
            else if(data.success == false) resolve({error: true, reason: data.cause, user: player});
            else if(!data.player) {
                nickCache[player] = true;
                resolve({nick: true, user: player});
            }
            else {
                uuidCache[player] = data.player.uuid;
                let bedwars = data.player.stats ? data.player.stats.Bedwars || {} : {}
                resolve({
                    user: player,
                    uuid: data.player.uuid,
                    stats: {
                        bedwars: {
                            overall: {
                                stars: getBwLevel(bedwars.Experience || 0),
                                ws: bedwars.winstreak || 0,
                                fkdr: ratio(bedwars.final_kills_bedwars || 0, bedwars.final_deaths_bedwars || 0),
                                wlr: ratio(bedwars.wins_bedwars || 0, bedwars.losses_bedwars || 0),
                            }
                        }
                    }
                });
            }
        });
    });
}