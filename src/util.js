// util.js: lots of utility data and functions
// some of this is taken from statsify code, big thanks to their team!

// objects and arrays holding data:

const xpperlevel = [500, 1000, 2000, 3500];

const colors = {
    0: { hsl: 'hsl(0, 0%, 0%)' },
    1: { hsl: 'hsl(240, 100%, 33%)' },
    2: { hsl: 'hsl(120, 100%, 33%)' },
    3: { hsl: 'hsl(180, 100%, 33%)' },
    4: { hsl: 'hsl(0, 100%, 33%)' },
    5: { hsl: 'hsl(300, 100%, 33%)' },
    6: { hsl: 'hsl(40, 100%, 50%)' },
    7: { hsl: 'hsl(0, 0%, 67%)' },
    8: { hsl: 'hsl(0, 0%, 33%)' },
    9: { hsl: 'hsl(240, 100%, 67%)' },
    a: { hsl: 'hsl(120, 100%, 67%)' },
    b: { hsl: 'hsl(180, 100%, 67%)' },
    c: { hsl: 'hsl(0, 100%, 67%)' },
    d: { hsl: 'hsl(300, 100%, 67%)' },
    e: { hsl: 'hsl(60, 100%, 67%)' },
    f: { hsl: 'hsl(0, 0%, 100%)' },
    g: { hsl: 'hsl(58, 96%, 44%)' },
    s: { hsl: 'hsl(205, 90%, 56%)' },
};

const prestigeColors = [
    { req: 0, fn: (n) => `§7[${n}✫]` },
    { req: 100, fn: (n) => `§f[${n}✫]` },
    { req: 200, fn: (n) => `§6[${n}✫]` },
    { req: 300, fn: (n) => `§b[${n}✫]` },
    { req: 400, fn: (n) => `§2[${n}✫]` },
    { req: 500, fn: (n) => `§3[${n}✫]` },
    { req: 600, fn: (n) => `§4[${n}✫]` },
    { req: 700, fn: (n) => `§d[${n}✫]` },
    { req: 800, fn: (n) => `§9[${n}✫]` },
    { req: 900, fn: (n) => `§5[${n}✫]` },
    {
        req: 1000,
        fn: (n) => {
            const nums = n.toString().split('');
            return `§c[§6${nums[0]}§e${nums[1]}§a${nums[2]}§b${nums[3]}§d✫§5]`;
        },
    },
    { req: 1100, fn: (n) => `§7[§f${n}§7✪]` },
    { req: 1200, fn: (n) => `§7[§e${n}§6✪§7]` },
    { req: 1300, fn: (n) => `§7[§b${n}§3✪§7]` },
    { req: 1400, fn: (n) => `§7[§a${n}§2✪§7]` },
    { req: 1500, fn: (n) => `§7[§3${n}§9✪§7]` },
    { req: 1600, fn: (n) => `§7[§c${n}§4✪§7]` },
    { req: 1700, fn: (n) => `§7[§d${n}§5✪§7]` },
    { req: 1800, fn: (n) => `§7[§9${n}§1✪§7]` },
    { req: 1900, fn: (n) => `§7[§5${n}§8✪§7]` },
    {
        req: 2000,
        fn: (n) => {
            const nums = n.toString().split('');
            return `§8[§7${nums[0]}§f${nums[1]}${nums[2]}§7${nums[3]}§8✪]`;
        },
    },
    {
        req: 2100,
        fn: (n) => {
            const nums = n.toString().split('');
            return `§f[${nums[0]}§e${nums[1]}${nums[2]}§6${nums[3]}⚝]`;
        },
    },
    {
        req: 2200,
        fn: (n) => {
            const nums = n.toString().split('');
            return `§6[${nums[0]}§f${nums[1]}${nums[2]}§b${nums[3]}§3⚝]`;
        },
    },
    {
        req: 2300,
        fn: (n) => {
            const nums = n.toString().split('');
            return `§5[${nums[0]}§d${nums[1]}${nums[2]}§6${nums[3]}§e⚝]`;
        },
    },
    {
        req: 2400,
        fn: (n) => {
            const nums = n.toString().split('');
            return `§b[${nums[0]}§f${nums[1]}${nums[2]}§7${nums[3]}⚝§8]`;
        },
    },
    {
        req: 2500,
        fn: (n) => {
            const nums = n.toString().split('');
            return `§f[${nums[0]}§a${nums[1]}${nums[2]}§2${nums[3]}⚝]`;
        },
    },
    {
        req: 2600,
        fn: (n) => {
            const nums = n.toString().split('');
            return `§4[${nums[0]}§c${nums[1]}${nums[2]}§d${nums[3]}5]`;
        },
    },
    {
        req: 2700,
        fn: (n) => {
            const nums = n.toString().split('');
            return `§e[${nums[0]}§f${nums[1]}${nums[2]}§8${nums[3]}⚝]`;
        },
    },
    {
        req: 2800,
        fn: (n) => {
            const nums = n.toString().split('');
            return `§a[${nums[0]}§2${nums[1]}${nums[2]}§6${nums[3]}⚝§e]`;
        },
    },
    {
        req: 2900,
        fn: (n) => {
            const nums = n.toString().split('');
            return `§b[${nums[0]}§3${nums[1]}${nums[2]}§9${nums[3]}⚝§1]`;
        },
    },
    {
        req: 3000,
        fn: (n) => {
            const nums = n.toString().split('');
            return `§e[${nums[0]}§6${nums[1]}${nums[2]}§c${nums[3]}⚝§4]`;
        },
    },
];

// general functions

exports.ratio = (top = 0, bottom = 1) => {
    return (top / bottom);
};

const tieredColors = [[170, 170, 170], [255,255,255], [255, 170, 0], [0, 170, 170], [170, 0, 0], [170, 0, 170]];

exports.color = (top, bottom, val) => {
    const norm = 25/top;
    val *= norm;
    return tieredColors[Math.min(tieredColors.length - 1, Math.floor(Math.sqrt(val)))];
};

exports.getBwLevel = (exp = 0) => {
    const prestiges = Math.floor(exp / 487000);
    let level = prestiges * 100;
    let remainingExp = exp - prestiges * 487000;

    for (let i = 0; i < 4; ++i) {
        const expForNextLevel = xpperlevel[i];
        if (remainingExp < expForNextLevel) break;
        level++;
        remainingExp -= expForNextLevel;
    }

    return parseFloat((level + remainingExp / 5000).toFixed(2));
};

// function to convert mc colors into something usable via html
exports.mcColor = (text) => {
    let finalText = '';
    splitText = text.split('§').slice(1);

    splitText.forEach(part => {
        const color = colors[part[0]].hsl || '';

        finalText += `<span style="color: ${color};">${part.substring(1)}</span>`;
    });
    return finalText;
};

// function that gives mc color based on star level.
exports.getBwFormattedLevel = (star) => {
    return prestigeColors[Math.floor(star/100)].fn(star);
};

// RANK STUFF

const ranks = {
    SUPERSTAR: 'MVP++',
    VIP_PLUS: 'VIP+',
    MVP_PLUS: 'MVP+',
    MVP: 'MVP',
    VIP: 'VIP',
    NONE: 'NON',
};

const rankColors = {
    'MVP+': { mc: '§c', hex: '#FF5555' },
    'MVP++': { mc: '§c', hex: '#FFAA00' },
    'VIP+': { mc: '§6', hex: '#FFAA00' },
    'PIG+++': { mc: '§b', hex: '#FF55FF' },
};

const rankColorsPlus = {
    RED: { mc: '§c', hex: '#FF5555' },
    GOLD: { mc: '§6', hex: '#FFAA00' },
    GREEN: { mc: '§a', hex: '#55FF55' },
    YELLOW: { mc: '§e', hex: '#FFFF55' },
    LIGHT_PURPLE: { mc: '§d', hex: '#FF55FF' },
    WHITE: { mc: '§f', hex: '#F2F2F2' },
    BLUE: { mc: '§9', hex: '#5555FF' },
    DARK_GREEN: { mc: '§2', hex: '#00AA00' },
    DARK_RED: { mc: '§4', hex: '#AA0000' },
    DARK_AQUA: { mc: '§3', hex: '#00AAAA' },
    DARK_PURPLE: { mc: '§5', hex: '#AA00AA' },
    DARK_GRAY: { mc: '§8', hex: '#555555' },
    BLACK: { mc: '§0', hex: '#000000' },
    DARK_BLUE: { mc: '§1', hex: '#0000AA' },
};

exports.getFormattedRank = (json) => {
    let rank = json.rank;
    if (!rank || rank == 'NORMAL')
    {
        if(json.monthlyPackageRank == 'NONE') json.monthlyPackageRank = null;
        rank = ranks[json.monthlyPackageRank || json.newPackageRank || json.packageRank || 'NONE'];
    }
    if (json.prefix) rank = json.prefix.replace(/§.|\[|]/g, '');

    const plus = json.rankPlusColor;
    let color;
    if (plus == undefined || rank == 'PIG+++') {
        color = rankColors[rank] || { mc: '§7', hex: '#BAB6B6' };
    } else {
        color = rankColorsPlus[plus] || { mc: '§7', hex: '#BAB6B6' };
    }
    color = color.mc;

    rank = {
        'MVP+': `§b[MVP${color}+§b]`,
        'MVP++': `§6[MVP${color}++§6]`,
        MVP: '§b[MVP]',
        'VIP+': `§a[VIP${color}+§a]`,
        VIP: '§a[VIP]',
        YOUTUBER: '§c[§fYOUTUBE§c]',
        'PIG+++': `§d[PIG${color}+++§d]`,
        HELPER: '§9[HELPER]',
        MODERATOR: '§2[MOD]',
        ADMIN: '§c[ADMIN]',
        OWNER: '§c[OWNER]',
        SLOTH: '§c[SLOTH]',
        ANGUS: '§c[ANGUS]',
        APPLE: '§6[APPLE]',
        MOJANG: '§6[MOJANG]',
        'BUILD TEAM': '§3[BUILD TEAM]',
        EVENTS: '§6[EVENTS]',
    }[rank];

    if (!rank) return '§7';
    return `${rank} `;
};
