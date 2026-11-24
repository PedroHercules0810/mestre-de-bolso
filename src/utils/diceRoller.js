// ============================================================================
// MESTRE DE BOLSO — Motor de Rolagem de Dados Poliedrais (D&D 5.5e)
// Suporta múltiplos tipos de dados simultâneos, modificadores e Vantagem/Desvantagem
// ============================================================================

export const DICE_TYPES = [
    { sides: 4, label: 'd4', color: 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300' },
    { sides: 6, label: 'd6', color: 'border-sky-500/50 bg-sky-500/15 text-sky-300' },
    { sides: 8, label: 'd8', color: 'border-purple-500/50 bg-purple-500/15 text-purple-300' },
    { sides: 10, label: 'd10', color: 'border-amber-500/50 bg-amber-500/15 text-amber-300' },
    { sides: 12, label: 'd12', color: 'border-rose-500/50 bg-rose-500/15 text-rose-300' },
    { sides: 20, label: 'd20', color: 'border-[#FF1457] bg-[#FF1457]/20 text-[#FF1457]' },
    { sides: 100, label: 'd100', color: 'border-indigo-500/50 bg-indigo-500/15 text-indigo-300' }
];

export const rollSingleDie = (sides, rng = Math.random) => {
    const s = Math.max(2, Math.min(100000, parseInt(sides, 10) || 6));
    return Math.floor(rng() * s) + 1;
};

/**
 * Formata a string da fórmula da parada de dados (ex: "1d20 + 2d6 + 1d8 + 4")
 */
export const formatPoolFormula = (pool = {}, modifier = 0, rollMode = 'normal', lang = 'pt') => {
    const parts = [];
    const sortedSides = Object.keys(pool)
        .map(k => parseInt(k, 10))
        .filter(s => !Number.isNaN(s) && (pool[s] || 0) > 0)
        .sort((a, b) => b - a); // d20 primeiro, depois d12, d10, d8, d6, d4

    for (const sides of sortedSides) {
        const count = Math.max(0, Math.min(500, parseInt(pool[sides], 10) || 0));
        if (count > 0) {
            parts.push(`${count}d${sides}`);
        }
    }

    const mod = parseInt(modifier, 10) || 0;
    let formula = parts.join(' + ') || '0';
    if (mod > 0) {
        formula += ` + ${mod}`;
    } else if (mod < 0) {
        formula += ` - ${Math.abs(mod)}`;
    }

    if (rollMode === 'advantage') {
        formula += lang === 'pt' ? ' (Vantagem)' : ' (Advantage)';
    } else if (rollMode === 'disadvantage') {
        formula += lang === 'pt' ? ' (Desvantagem)' : ' (Disadvantage)';
    }

    return formula;
};

/**
 * Executa a rolagem completa de uma parada de dados mista (pool: { 20: 1, 6: 2, ... }),
 * aplicando Vantagem ou Desvantagem e retornando o detalhamento completo de cada dado.
 */
export const executeDicePoolRoll = ({
    pool = {},
    modifier = 0,
    rollMode = 'normal', // 'normal' | 'advantage' | 'disadvantage'
    rng = Math.random
}) => {
    const mod = Math.max(-100000, Math.min(100000, parseInt(modifier, 10) || 0));
    const mode = ['normal', 'advantage', 'disadvantage'].includes(rollMode) ? rollMode : 'normal';

    const activeSides = Object.keys(pool)
        .map(k => parseInt(k, 10))
        .filter(s => !Number.isNaN(s) && s >= 2 && (parseInt(pool[s], 10) || 0) > 0)
        .sort((a, b) => b - a);

    if (activeSides.length === 0) {
        return {
            total: mod,
            diceSubtotal: 0,
            modifier: mod,
            rollMode: mode,
            groups: [],
            allKeptRolls: [],
            isCritSuccess: false,
            isCritFail: false,
            timestamp: new Date().toISOString()
        };
    }

    const hasD20 = activeSides.includes(20);
    const groups = [];
    const allKeptRolls = [];
    let diceSubtotal = 0;
    let isCritSuccess = false;
    let isCritFail = false;

    for (const sides of activeSides) {
        const count = Math.max(1, Math.min(200, parseInt(pool[sides], 10) || 0));
        const applyAdvOnThisGroup = mode !== 'normal' && (sides === 20 || !hasD20);

        const rolls = [];
        let groupSubtotal = 0;

        for (let i = 0; i < count; i++) {
            if (applyAdvOnThisGroup) {
                const r1 = rollSingleDie(sides, rng);
                const r2 = rollSingleDie(sides, rng);
                const keepFirst = mode === 'advantage' ? r1 >= r2 : r1 <= r2;
                const kept = keepFirst ? r1 : r2;
                const dropped = keepFirst ? r2 : r1;

                rolls.push({
                    sides,
                    value: kept,
                    droppedValue: dropped,
                    pair: [r1, r2],
                    isMax: kept === sides,
                    isMin: kept === 1,
                    hasAdvPair: true
                });
                groupSubtotal += kept;
                allKeptRolls.push({ sides, value: kept, droppedValue: dropped });
            } else {
                const r = rollSingleDie(sides, rng);
                rolls.push({
                    sides,
                    value: r,
                    droppedValue: null,
                    pair: [r],
                    isMax: r === sides,
                    isMin: r === 1,
                    hasAdvPair: false
                });
                groupSubtotal += r;
                allKeptRolls.push({ sides, value: r, droppedValue: null });
            }
        }

        if (sides === 20) {
            if (rolls.some(r => r.value === 20)) isCritSuccess = true;
            if (rolls.some(r => r.value === 1)) isCritFail = true;
        }

        diceSubtotal += groupSubtotal;
        groups.push({
            sides,
            label: `d${sides}`,
            count,
            subtotal: groupSubtotal,
            rolls
        });
    }

    return {
        total: diceSubtotal + mod,
        diceSubtotal,
        modifier: mod,
        rollMode: mode,
        groups,
        allKeptRolls,
        isCritSuccess,
        isCritFail,
        timestamp: new Date().toISOString()
    };
};
