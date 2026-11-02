// ============================================================================
// MESTRE DE BOLSO — Calculadora de Raridade e Valor de Itens Mágicos (DMG 5e)
// Baseado nas tabelas de Poder de Itens Mágicos (DMG p. 135 & p. 284-285)
// ============================================================================

export const RARITY_TABLE = [
    {
        id: 'Common',
        minLevel: 1,
        valueRangePt: '50 – 100 PO',
        valueRangeEn: '50 – 100 GP',
        defaultCostPt: '75 PO',
        defaultCostEn: '75 GP',
        color: 'text-gray-300 border-gray-500/40 bg-gray-500/10'
    },
    {
        id: 'Uncommon',
        minLevel: 1,
        valueRangePt: '101 – 500 PO',
        valueRangeEn: '101 – 500 GP',
        defaultCostPt: '300 PO',
        defaultCostEn: '300 GP',
        color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
    },
    {
        id: 'Rare',
        minLevel: 5,
        valueRangePt: '501 – 5.000 PO',
        valueRangeEn: '501 – 5,000 GP',
        defaultCostPt: '2.500 PO',
        defaultCostEn: '2,500 GP',
        color: 'text-sky-400 border-sky-500/40 bg-sky-500/10'
    },
    {
        id: 'Very Rare',
        minLevel: 11,
        valueRangePt: '5.001 – 50.000 PO',
        valueRangeEn: '5,001 – 50,000 GP',
        defaultCostPt: '25.000 PO',
        defaultCostEn: '25,000 GP',
        color: 'text-purple-400 border-purple-500/40 bg-purple-500/10'
    },
    {
        id: 'Legendary',
        minLevel: 17,
        valueRangePt: '50.001+ PO',
        valueRangeEn: '50,001+ GP',
        defaultCostPt: '100.000 PO',
        defaultCostEn: '100,000 GP',
        color: 'text-amber-400 border-amber-500/40 bg-amber-500/10'
    },
    {
        id: 'Artifact',
        minLevel: 17,
        valueRangePt: 'Inestimável',
        valueRangeEn: 'Priceless',
        defaultCostPt: 'Inestimável',
        defaultCostEn: 'Priceless',
        color: 'text-[#FF1457] border-[#FF1457]/50 bg-[#FF1457]/15'
    }
];

/**
 * Calcula a Raridade, Preço Sugerido e Nível Recomendado de um Item Homebrew
 * seguindo as diretrizes do Guia do Mestre (DMG p. 135 e p. 284-285).
 */
export const calculateItemPower = ({
    autoRarity = true,
    manualRarity = 'Uncommon',
    magicBonus = 0,          // 0, 1, 2, 3, 4
    extraDamageTier = 0,     // 0 (Nenhum), 1 (+1d4/+1d6), 2 (+2d6), 3 (+3d6+), 4 (Vorpal/Massivo)
    spellEffectTier = 0,     // 0 (Cosmético/Truque), 1 (1º-2º círculo), 2 (3º-4º), 3 (5º-6º), 4 (7º-8º), 5 (9º círculo)
    category = 'Weapon',
    requiresAttunement = false
}) => {
    if (!autoRarity) {
        const entry = RARITY_TABLE.find(r => r.id.toLowerCase() === String(manualRarity).toLowerCase()) || RARITY_TABLE[1];
        return {
            rarity: entry.id,
            minLevel: entry.minLevel,
            valueRangePt: entry.valueRangePt,
            valueRangeEn: entry.valueRangeEn,
            defaultCostPt: entry.defaultCostPt,
            defaultCostEn: entry.defaultCostEn,
            color: entry.color,
            powerIndex: RARITY_TABLE.indexOf(entry)
        };
    }

    const bonus = parseInt(magicBonus) || 0;
    const dmgTier = parseInt(extraDamageTier) || 0;
    const spellTier = parseInt(spellEffectTier) || 0;

    // 1. Índice base pelo Bônus Mágico (+1 = Uncommon [1], +2 = Rare [2], +3 = Very Rare [3], +4 = Legendary [4])
    // Nota DMG: Armaduras +1 começam em Rare (2), +2 em Very Rare (3), +3 em Legendary (4)
    let bonusIndex = 0;
    if (bonus > 0) {
        const isArmor = category === 'Armor';
        bonusIndex = isArmor ? Math.min(5, bonus + 1) : Math.min(5, bonus);
    }

    // 2. Índice pelo Dano Extra por Ataque (ex: Flame Tongue = +2d6 Rare [2])
    const dmgIndex = Math.min(5, dmgTier);

    // 3. Índice pelo Nível de Magia / Efeito (DMG p. 285: Max Spell Level por Raridade)
    // 0 -> Common(0), 1 -> Uncommon(1), 2 -> Rare(2), 3 -> Very Rare(3), 4 -> Legendary(4), 5 -> Artifact(5)
    const spellIndex = Math.min(5, spellTier);

    // Combinação: o maior pilar define o patamar base; múltiplos pilares fortes elevam a raridade em +1
    const indices = [bonusIndex, dmgIndex, spellIndex].sort((a, b) => b - a);
    let finalIndex = indices[0];

    // Se houver dois pilares significativos (>= 1) juntos (ex: Arma +2 que também dá +2d6 de dano ou magia de 3º nível), sobe 1 grau de raridade
    if (indices[0] >= 1 && indices[1] >= 2) {
        finalIndex = Math.min(5, finalIndex + 1);
    } else if (indices[0] >= 1 && indices[1] >= 1 && indices[2] >= 1) {
        finalIndex = Math.min(5, finalIndex + 1);
    }

    // Consumíveis (Poções e Pergaminhos) sem bônus fixo costumam ser 1 grau mais acessíveis se não forem de nível épico
    const isConsumable = category === 'Potion' || category === 'Scroll';
    if (isConsumable && finalIndex > 0 && bonus === 0 && dmgTier === 0 && !requiresAttunement) {
        finalIndex = Math.max(0, finalIndex - 1);
    }

    const entry = RARITY_TABLE[Math.max(0, Math.min(RARITY_TABLE.length - 1, finalIndex))];

    return {
        rarity: entry.id,
        minLevel: entry.minLevel,
        valueRangePt: entry.valueRangePt,
        valueRangeEn: entry.valueRangeEn,
        defaultCostPt: entry.defaultCostPt,
        defaultCostEn: entry.defaultCostEn,
        color: entry.color,
        powerIndex: finalIndex
    };
};
