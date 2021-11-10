const fetch = require('node-fetch');
const { color, ratio, getBwFormattedLevel, getBwLevel, mcColor, getRank, getFormattedRank, getPlusColor } = require('./util.js');

const uuidCache = {};
const nickCache = {};

exports.validKey = (key) => {
    return new Promise( resolve => {
        fetch(`https://api.hypixel.net/key?key=${key}`).then(res=> res.json()).catch(err => resolve(false))
            .then(data => resolve(data.success));
    });
};

exports.fetchPlayer = (player, key) => {
    return new Promise( resolve => {
        let lookup = '';
        if(uuidCache[player]) lookup = `uuid=${uuidCache[player]}`;
        else if(nickCache[player]) resolve({nick: true, user: player});
        else lookup = `name=${player}`;
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
                    const bedwars = data.player.stats ? data.player.stats.Bedwars || {} : {};
                    const stars = getBwLevel(bedwars.Experience || 0);
                    const rank = getRank(data.player);
                    const plusColor = getPlusColor(rank, data.player.rankPlusColor);
                    const formattedRank = getFormattedRank(rank, plusColor.mc);
                    resolve({
                        user: player,
                        uuid: data.player.uuid,
                        coloredstar: mcColor(getBwFormattedLevel(Math.trunc(stars))),
                        rank: rank,
                        displayName: `${mcColor(`${formattedRank}${player}`)}`,
                        stats: {
                            bedwars: {
                                overall: {
                                    stars: stars,
                                    ws: bedwars.winstreak || 0,
                                    fkdr: ratio(bedwars.final_kills_bedwars || 0, bedwars.final_deaths_bedwars || 0),
                                    wlr: ratio(bedwars.wins_bedwars || 0, bedwars.losses_bedwars || 0),
                                    color: color(650, 0, stars*Math.pow(ratio(bedwars.final_kills_bedwars || 0, bedwars.final_deaths_bedwars || 0), 2)),
                                }
                            }
                        }
                    });
                }
            });
    });
};