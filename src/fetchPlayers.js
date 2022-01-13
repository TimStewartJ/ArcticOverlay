const fetch = require('node-fetch');
const { color, ratio, getBwFormattedLevel, getBwLevel, mcColor, getFormattedRank } = require('./util.js');

const uuidCache = {};
const nickCache = {};

const gameModes = {
    overall: '',
    solo: 'eight_one',
    doubles: 'eight_two',
    threes: 'four_three',
    fours: 'four_four',
    fourvfours: 'two_four',
};

exports.validKey = (key) => {
    return new Promise( resolve => {
        fetch(`https://api.hypixel.net/key?key=${key}`).then(res=> res.json()).catch(err => resolve(false))
            .then(data => resolve(data));
    });
};

exports.getDisplayName = (key, uuid) => {
    return new Promise( resolve => {
        fetch(`https://api.hypixel.net/player?key=${key}&uuid=${uuid}`).then(res => res.json()).then(data => resolve(data.player.displayname));
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
                    const formattedRank = getFormattedRank(data.player);

                    data = {
                        user: data.player.displayname,
                        uuid: data.player.uuid,
                        coloredstar: mcColor(getBwFormattedLevel(Math.trunc(stars))),
                        // rank: rank,
                        displayName: `${mcColor(`${formattedRank}${data.player.displayname}`)}`,
                        stats: {
                            bedwars: {
                                stars: stars,
                            }
                        }
                    };

                    for(const key in gameModes) {
                        let val = gameModes[key];
                        if (key !== 'overall') val+='_'; 
                        data.stats.bedwars[key] = {
                            stars: stars,
                            ws: bedwars[`${val}winstreak`] || 0,
                            fkdr: ratio(bedwars[`${val}final_kills_bedwars`], bedwars[`${val}final_deaths_bedwars`]),
                            final: bedwars[`${val}final_kills_bedwars`] || 0,
                            wlr: ratio(bedwars[`${val}wins_bedwars`], bedwars[`${val}losses_bedwars`]),
                            bblr: ratio(bedwars[`${val}beds_broken_bedwars`], bedwars[`${val}beds_lost_bedwars`]),
                            color: color(650, 0, (stars*Math.pow(ratio(bedwars[`${val}final_kills_bedwars`], bedwars[`${val}final_deaths_bedwars`]), 2)/10)),
                        };
                    }
                    resolve(data);
                }
            });
    });
};

exports.fetchSniperStatus = (player, key) => {
    return new Promise( resolve => {
        const lookup = `name=${player}`;
        fetch(`https://statsify.net/api/overlay/sniper?key=${key}&${lookup}`)
            .then(res => res.json()).catch(err => resolve({error: true, reason: err, user: player}))
            .then(data => {
                if(data && data.success) resolve({error: false, sniper: data.sniper, sniperData: true, user: player});
                else {
                    resolve({error: true, user: player});
                }
            });
    });
};