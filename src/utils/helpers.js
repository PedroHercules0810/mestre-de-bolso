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

export const feetToMetersStr = (ftVal) => {
    const ft = parseFloat(ftVal);
    if (!Number.isFinite(ft)) return String(ftVal);
    const meters = Math.round((ft / 5) * 1.5 * 10) / 10;
    return `${String(meters).replace('.', ',')}m`;
};

export const formatDistanceUnits = (text, unitSystem = 'm') => {
    if (!text || typeof text !== 'string') return text || '';
    let out = text;

    if (unitSystem === 'm') {
        // 1. Converte formatos combinados "30 ft. (9m)" ou "15 ft. (4.5m)" -> "9m" / "4,5m"
        out = out.replace(/(\d+)\s*(?:ft\.?|feet)\s*\((\d+(?:[.,]\d+)?)\s*m\)/gi, (_, _ft, m) => `${m.replace('.', ',')}m`);
        // 2. Converte formatos combinados invertidos "9 metros (30 ft.)" ou "+4,5m (15 ft.)" -> "9m" / "+4,5m"
        out = out.replace(/([+-]?\d+(?:[.,]\d+)?)\s*(?:metros?|m)\s*\(\d+\s*(?:ft\.?|feet)\)/gi, (_, m) => `${m.replace('.', ',')}m`);
        // 3. Converte alcances duplos "80/320 ft." -> "24/96m"
        out = out.replace(/\b(\d+)\/(\d+)\s*(?:feet\b|ft\.|ft\b)/gi, (_, n1, n2) => {
            const m1 = Math.round((parseInt(n1, 10) / 5) * 1.5 * 10) / 10;
            const m2 = Math.round((parseInt(n2, 10) / 5) * 1.5 * 10) / 10;
            return `${String(m1).replace('.', ',')}/${String(m2).replace('.', ',')}m`;
        });
        // 4. Converte medidas simples em pés "30 ft.", "60 feet", "15-foot" -> "9m", "18m", "4,5m"
        out = out.replace(/\b(\d+)\s*(?:-\s*foot|feet|ft\.)/gi, (_, ft) => feetToMetersStr(ft));
        out = out.replace(/\b(\d+)\s*ft\b/gi, (_, ft) => feetToMetersStr(ft));
        return out;
    }

    // Caso unitSystem === 'ft' (Pés):
    // 1. Converte formatos combinados "30 ft. (9m)" -> "30 ft."
    out = out.replace(/(\d+)\s*(?:ft\.?|feet)\s*\(\d+(?:[.,]\d+)?\s*m\)/gi, '$1 ft.');
    // 2. Converte formatos combinados invertidos "+4,5m (15 ft.)" ou "9 metros (30 ft.)" -> "+15 ft." / "30 ft."
    out = out.replace(/([+-])?\d+(?:[.,]\d+)?\s*(?:metros?|m)\s*\((\d+)\s*(?:ft\.?|feet)\)/gi, (_, sign, ft) => `${sign || ''}${ft} ft.`);
    // 3. Converte alcances duplos em metros "24/96m" -> "80/320 ft."
    out = out.replace(/\b(\d+(?:[.,]\d+)?)\/(\d+(?:[.,]\d+)?)\s*m\b/gi, (_, m1, m2) => {
        const f1 = Math.round((parseFloat(m1.replace(',', '.')) / 1.5) * 5);
        const f2 = Math.round((parseFloat(m2.replace(',', '.')) / 1.5) * 5);
        return `${f1}/${f2} ft.`;
    });
    // 4. Converte medidas em metros "1,5m", "4,5m", "9m", "18m", "9 metros" -> "5 ft.", "15 ft.", "30 ft.", "60 ft."
    out = out.replace(/([+-]?\d+(?:[.,]\d+)?)\s*(?:metros?|m)\b/gi, (match, mStr) => {
        const sign = mStr.startsWith('+') ? '+' : mStr.startsWith('-') ? '-' : '';
        const val = Math.abs(parseFloat(mStr.replace(',', '.')));
        if (!Number.isFinite(val) || val === 0) return match;
        const ft = Math.round((val / 1.5) * 5);
        return `${sign}${ft} ft.`;
    });
    return out;
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
