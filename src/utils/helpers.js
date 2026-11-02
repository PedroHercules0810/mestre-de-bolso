export const rollDice = (count, sides) => {
    const c = Math.max(0, parseInt(count, 10) || 0);
    const s = Math.max(0, parseInt(sides, 10) || 0);
    if (c === 0 || s === 0) return 0;
    let total = 0;
    for (let i = 0; i < c; i++) {
        total += Math.floor(Math.random() * s) + 1;
    }
    return total;
};

export const parseCR = (crValue) => {
    if (crValue === null || crValue === undefined || crValue === '') return 0;
    const crStr = String(crValue).trim().split(' ')[0];
    if (crStr.includes('/')) {
        const [num, den] = crStr.split('/');
        return (parseFloat(num) || 0) / (parseFloat(den) || 1);
    }
    return parseFloat(crStr) || 0;
};

export const safeText = (val) => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'string' || typeof val === 'number') return String(val);
    if (Array.isArray(val)) {
        return val.map(v => {
            if (v === null || v === undefined) return '';
            return typeof v === 'object' ? (v.name || v.desc || v.value || JSON.stringify(v)) : String(v);
        }).join(', ');
    }
    if (typeof val === 'object') {
        return String(val.name || val.desc || val.value || JSON.stringify(val));
    }
    return String(val);
};

export const getDeepStat = (monster, statName) => {
    if (!monster || typeof monster !== 'object' || !statName) return null;
    const cleanStat = String(statName);
    const shortStat = cleanStat.substring(0, 3);
    const keys = [cleanStat, shortStat, `${cleanStat}_score`, `${shortStat}_score`];
    const extractFirstNumber = (val) => {
        if (val === null || val === undefined) return null;
        const textVal = String(safeText(val));
        const match = textVal.match(/-?\d+/);
        return match ? parseInt(match[0], 10) : null;
    };
    for (const key of keys) {
        if (monster[key] !== undefined && monster[key] !== null) {
            const num = extractFirstNumber(monster[key]);
            if (num !== null) return num;
        }
    }
    if (monster.ability_scores && typeof monster.ability_scores === 'object') {
        for (const key of keys) {
            if (monster.ability_scores[key] !== undefined && monster.ability_scores[key] !== null) {
                const num = extractFirstNumber(monster.ability_scores[key]);
                if (num !== null) return num;
            }
        }
    }
    return null;
};
