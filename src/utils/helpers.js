export const rollDice = (count, sides) => {
    const c = Math.min(10000, Math.max(0, parseInt(count, 10) || 0));
    const s = Math.min(1000000, Math.max(0, parseInt(sides, 10) || 0));
    if (c === 0 || s === 0) return 0;
    let total = 0;
    for (let i = 0; i < c; i++) {
        total += Math.floor(Math.random() * s) + 1;
    }
    return total;
};

export const parseCR = (crValue) => {
    if (crValue === null || crValue === undefined || crValue === '') return 0;
    if (typeof crValue === 'number') {
        return Number.isFinite(crValue) ? Math.max(0, crValue) : 0;
    }
    const crStr = String(crValue).trim().split(' ')[0];
    if (crStr.includes('/')) {
        const [num, den] = crStr.split('/');
        const n = parseFloat(num) || 0;
        const d = parseFloat(den);
        if (!d || !Number.isFinite(d) || d <= 0) return 0;
        const res = n / d;
        return Number.isFinite(res) ? Math.max(0, res) : 0;
    }
    const parsed = parseFloat(crStr);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

const safeStringify = (obj) => {
    try {
        return JSON.stringify(obj) || '';
    } catch {
        return '';
    }
};

export const safeText = (val) => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'number') return Number.isFinite(val) ? String(val) : '';
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) {
        return val.map(v => {
            if (v === null || v === undefined) return '';
            if (typeof v === 'number') return Number.isFinite(v) ? String(v) : '';
            return typeof v === 'object' ? String(v.name || v.desc || v.value || safeStringify(v)) : String(v);
        }).filter(Boolean).join(', ');
    }
    if (typeof val === 'object') {
        return String(val.name || vValueOrDesc(val) || safeStringify(val));
    }
    return String(val);
};

const vValueOrDesc = (obj) => obj.desc || obj.value || '';

export const generateHomebrewSlug = (prefix, cleanName) => {
    const safePrefix = String(prefix || 'hb').toLowerCase().replace(/[^a-z0-9-]+/g, '');
    const safeSlug = String(cleanName || 'custom').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'custom';
    return `${safePrefix}-${safeSlug}-${Date.now()}`;
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
