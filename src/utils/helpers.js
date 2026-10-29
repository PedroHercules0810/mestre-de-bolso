export const rollDice = (count, sides) => {
    let total = 0;
    for(let i = 0; i < count; i++) total += Math.floor(Math.random() * sides) + 1;
    return total;
};

export const parseCR = (crValue) => {
    if (!crValue) return 0;
    const crStr = String(crValue).trim();
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
    const keys = [statName, statName.substring(0,3), `${statName}_score`];
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
    if (monster.ability_scores) {
        for (const key of keys) {
            if (monster.ability_scores[key] !== undefined && monster.ability_scores[key] !== null) {
                const num = extractFirstNumber(monster.ability_scores[key]);
                if (num !== null) return num;
            }
        }
    }
    return null;
};
