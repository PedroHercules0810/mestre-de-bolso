import { rollDice, parseCR, safeText } from './helpers.js';

export const generateAdvancedLoot = (tier, type, allItems, lang = 'pt') => {
    let coins = {};
    let gems = "";
    let items = [];

    const getItems = (rarities, count) => {
        if (!allItems || !Array.isArray(allItems) || allItems.length === 0) return [];
        const normalizedTargets = rarities.map(t => String(t).toLowerCase().trim());
        const pool = allItems.filter(i => {
            if (!i) return false;
            const r = (safeText(i.rarity) || "").toLowerCase().trim();
            return normalizedTargets.includes(r);
        });
        if (pool.length === 0) return [];
        const selected = [];
        for (let i = 0; i < count; i++) {
            selected.push(pool[Math.floor(Math.random() * pool.length)]);
        }
        return selected;
    };

    if (type === 'individual') {
        if (tier === 1) coins = { CP: rollDice(5,6)*10, SP: rollDice(4,6)*10, GP: rollDice(1,6) };
        else if (tier === 2) coins = { CP: rollDice(4,6)*100, EP: rollDice(1,6)*10, GP: rollDice(4,6)*10, PP: rollDice(1,6) };
        else if (tier === 3) coins = { SP: rollDice(4,6)*100, EP: rollDice(1,6)*100, GP: rollDice(4,6)*100, PP: rollDice(1,6)*10 };
        else coins = { EP: rollDice(2,6)*1000, GP: rollDice(8,6)*100, PP: rollDice(1,6)*100 };
    } else {
        if (tier === 1) {
            coins = { CP: rollDice(6,6)*100, SP: rollDice(3,6)*100, GP: rollDice(2,6)*10 };
            gems = lang === 'pt' ? `${rollDice(2,6)}x Gemas de 10gp (ex: Ágata, Quartzo)` : `${rollDice(2,6)}x 10gp Gems`;
            if(Math.random() > 0.6) items = getItems(['common', 'uncommon'], rollDice(1,4));
        } else if (tier === 2) {
            coins = { CP: rollDice(2,6)*100, SP: rollDice(2,6)*1000, GP: rollDice(6,6)*100, PP: rollDice(3,6)*10 };
            gems = lang === 'pt' ? `${rollDice(2,4)}x Objetos de Arte de 25gp` : `${rollDice(2,4)}x 25gp Art Objects`;
            if(Math.random() > 0.4) items = getItems(['uncommon', 'rare'], rollDice(1,4));
        } else if (tier === 3) {
            coins = { GP: rollDice(4,6)*1000, PP: rollDice(5,6)*100 };
            gems = lang === 'pt' ? `${rollDice(3,6)}x Gemas de 500gp (ex: Pérola, Topázio)` : `${rollDice(3,6)}x 500gp Gems`;
            items = getItems(['rare', 'very rare'], rollDice(1,4));
        } else {
            coins = { GP: rollDice(12,6)*1000, PP: rollDice(8,6)*1000 };
            gems = lang === 'pt' ? `${rollDice(1,8)}x Gemas de 5000gp (ex: Diamante, Rubi)` : `${rollDice(1,8)}x 5000gp Gems`;
            items = getItems(['very rare', 'legendary'], rollDice(1,4));
        }
    }

    Object.keys(coins).forEach(k => { if(coins[k] === 0) delete coins[k] });
    return { coins, gems, items };
};

export const generateEncounterLoot = (monsters, allItems, lang) => {
    if(!monsters || !Array.isArray(monsters) || monsters.length === 0) return null;
    let maxCR = 0;
    let isBoss = false;
    
    monsters.forEach(m => {
        if (!m) return;
        const cr = parseCR(m.challenge_rating);
        if(cr > maxCR) maxCR = cr;
        if(m.isBoss) isBoss = true;
    });
    
    let tier = 1;
    if(maxCR >= 17) tier = 4;
    else if(maxCR >= 11) tier = 3;
    else if(maxCR >= 5) tier = 2;

    const totalCount = monsters.reduce((sum, m) => sum + (Number(m?.count) || 1), 0);
    const type = (isBoss || totalCount > 3 || maxCR >= 11) ? 'hoard' : 'individual';
    
    return generateAdvancedLoot(tier, type, allItems, lang);
};
