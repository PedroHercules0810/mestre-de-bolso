// ============================================================================
// MESTRE DE BOLSO — Calculadora de Nível e Balanceamento de Magias (DMG 5e/5.5e)
// Baseado na tabela oficial "Creating a Spell / Spell Damage" (DMG p. 283-284)
// ============================================================================

export const SPELL_LEVEL_TABLE = [
    {
        level: 0,
        minCasterLevel: 1,
        singleTargetDice: '1d10',
        singleTargetAvg: 5.5,
        multiTargetDice: '1d6',
        multiTargetAvg: 3.5,
        scrollRarity: 'Common',
        color: 'text-gray-300 border-gray-500/40 bg-gray-500/10'
    },
    {
        level: 1,
        minCasterLevel: 1,
        singleTargetDice: '2d10',
        singleTargetAvg: 11,
        multiTargetDice: '2d6',
        multiTargetAvg: 7,
        scrollRarity: 'Common',
        color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
    },
    {
        level: 2,
        minCasterLevel: 3,
        singleTargetDice: '3d10',
        singleTargetAvg: 16.5,
        multiTargetDice: '4d6',
        multiTargetAvg: 14,
        scrollRarity: 'Uncommon',
        color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
    },
    {
        level: 3,
        minCasterLevel: 5,
        singleTargetDice: '5d10',
        singleTargetAvg: 27.5,
        multiTargetDice: '6d6 (ou 8d6)',
        multiTargetAvg: 24,
        scrollRarity: 'Uncommon',
        color: 'text-sky-400 border-sky-500/40 bg-sky-500/10'
    },
    {
        level: 4,
        minCasterLevel: 7,
        singleTargetDice: '6d10',
        singleTargetAvg: 33,
        multiTargetDice: '7d6',
        multiTargetAvg: 24.5,
        scrollRarity: 'Rare',
        color: 'text-sky-400 border-sky-500/40 bg-sky-500/10'
    },
    {
        level: 5,
        minCasterLevel: 9,
        singleTargetDice: '8d10',
        singleTargetAvg: 44,
        multiTargetDice: '8d6',
        multiTargetAvg: 28,
        scrollRarity: 'Rare',
        color: 'text-purple-400 border-purple-500/40 bg-purple-500/10'
    },
    {
        level: 6,
        minCasterLevel: 11,
        singleTargetDice: '10d10',
        singleTargetAvg: 55,
        multiTargetDice: '11d6',
        multiTargetAvg: 38.5,
        scrollRarity: 'Very Rare',
        color: 'text-purple-400 border-purple-500/40 bg-purple-500/10'
    },
    {
        level: 7,
        minCasterLevel: 13,
        singleTargetDice: '11d10',
        singleTargetAvg: 60.5,
        multiTargetDice: '12d6',
        multiTargetAvg: 42,
        scrollRarity: 'Very Rare',
        color: 'text-amber-400 border-amber-500/40 bg-amber-500/10'
    },
    {
        level: 8,
        minCasterLevel: 15,
        singleTargetDice: '12d10',
        singleTargetAvg: 66,
        multiTargetDice: '13d6',
        multiTargetAvg: 45.5,
        scrollRarity: 'Very Rare',
        color: 'text-amber-400 border-amber-500/40 bg-amber-500/10'
    },
    {
        level: 9,
        minCasterLevel: 17,
        singleTargetDice: '15d10',
        singleTargetAvg: 82.5,
        multiTargetDice: '14d6 (ou 40d6)',
        multiTargetAvg: 49,
        scrollRarity: 'Legendary',
        color: 'text-[#FF1457] border-[#FF1457]/50 bg-[#FF1457]/15'
    }
];

/**
 * Calcula a média matemática de uma expressão de dados (ex: "8d6 + 4" -> 32)
 */
export const parseDiceAverage = (diceStr) => {
    if (diceStr === null || diceStr === undefined) return 0;
    if (typeof diceStr === 'number') {
        return Number.isFinite(diceStr) ? Math.max(0, Math.min(10000, diceStr)) : 0;
    }
    if (typeof diceStr !== 'string') return 0;
    const clean = diceStr.trim().toLowerCase();
    if (!clean) return 0;

    const regex = /([+-]?\s*\d+)\s*d\s*(\d+)/g;
    let totalAvg = 0;
    let matched = false;
    let match;
    while ((match = regex.exec(clean)) !== null) {
        matched = true;
        const rawCount = parseInt(match[1].replace(/\s+/g, ''), 10) || 0;
        const count = Math.max(-10000, Math.min(10000, rawCount));
        const faces = Math.max(0, Math.min(1000000, parseInt(match[2], 10) || 0));
        if (faces > 0 && count !== 0) {
            totalAvg += count * ((faces + 1) / 2);
        }
    }

    const remainder = clean.replace(regex, '');
    const flatRegex = /([+-]?\s*\d+(?:\.\d+)?)/g;
    let flatMatch;
    while ((flatMatch = flatRegex.exec(remainder)) !== null) {
        const val = parseFloat(flatMatch[1].replace(/\s+/g, ''));
        if (Number.isFinite(val)) {
            totalAvg += val;
            matched = true;
        }
    }

    if (!matched || !Number.isFinite(totalAvg)) return 0;
    return Math.max(0, Math.min(100000, Math.round(totalAvg * 10) / 10));
};

/**
 * Calcula o Nível de Magia (0 a 9), Dano de Referência (DMG p. 284),
 * Nível Mínimo de Conjurador e Raridade de Pergaminho.
 */
export const calculateSpellPower = ({
    autoLevel = true,
    manualLevel = 1,
    damageDice = '2d10',
    targetScope = 'single', // 'single' | 'aoe'
    effectTier = 0,         // 0: Nenhum/Dano Puro, 1: Controle Leve (1º-2º), 2: Controle Forte/Voo (3º-4º), 3: Controle em Massa/Teleporte (5º-6º), 4: Alterar Realidade (7º-9º)
    halfOnSave = true       // DMG p. 283: Magias que não causam efeito em sucesso permitem ~25% mais dano no mesmo círculo
}) => {
    const avgDamage = parseDiceAverage(damageDice);

    if (!autoLevel) {
        const parsedLvl = Math.max(0, Math.min(9, parseInt(manualLevel, 10) || 0));
        const entry = SPELL_LEVEL_TABLE[parsedLvl];
        return {
            level: entry.level,
            minCasterLevel: entry.minCasterLevel,
            benchmarkSingleDice: entry.singleTargetDice,
            benchmarkMultiDice: entry.multiTargetDice,
            benchmarkAvg: targetScope === 'aoe' ? entry.multiTargetAvg : entry.singleTargetAvg,
            avgDamage,
            scrollRarity: entry.scrollRarity,
            color: entry.color
        };
    }

    // DMG p. 283: Se a magia não causa dano em caso de salvaguarda bem-sucedida (ou erro de ataque),
    // o dano efetivo para cálculo de nível é reduzido em ~20% (equivale a permitir 25% mais dano no mesmo nível).
    const effectiveAvg = halfOnSave ? avgDamage : avgDamage * 0.8;

    // 1. Nível estimado pelo dano (Alvo Único vs Área de Efeito)
    let damageLevel = 0;
    if (effectiveAvg > 0) {
        let bestLvl = 0;
        let minDiff = Infinity;
        for (const row of SPELL_LEVEL_TABLE) {
            const refAvg = targetScope === 'aoe' ? row.multiTargetAvg : row.singleTargetAvg;
            const diff = Math.abs(effectiveAvg - refAvg);
            if (diff < minDiff) {
                minDiff = diff;
                bestLvl = row.level;
            }
        }
        damageLevel = bestLvl;
    }

    // 2. Nível estimado pelo efeito de controle / utilidade
    // 0 -> 0, 1 -> 1, 2 -> 3, 3 -> 5, 4 -> 8
    const effectLevelMap = [0, 1, 3, 5, 8];
    const parsedEffect = Math.max(0, Math.min(4, parseInt(effectTier, 10) || 0));
    const controlLevel = effectLevelMap[parsedEffect];

    // 3. Combinação de Dano + Efeito secundário
    let finalLevel = Math.max(damageLevel, controlLevel);
    if (damageLevel >= 1 && controlLevel >= 1) {
        // Magia que causa dano considerável E aplica condição/controle forte sobe +1 círculo
        finalLevel = Math.min(9, finalLevel + 1);
    }

    const entry = SPELL_LEVEL_TABLE[Math.max(0, Math.min(9, finalLevel))];

    return {
        level: entry.level,
        minCasterLevel: entry.minCasterLevel,
        benchmarkSingleDice: entry.singleTargetDice,
        benchmarkMultiDice: entry.multiTargetDice,
        benchmarkAvg: targetScope === 'aoe' ? entry.multiTargetAvg : entry.singleTargetAvg,
        avgDamage,
        scrollRarity: entry.scrollRarity,
        color: entry.color
    };
};
