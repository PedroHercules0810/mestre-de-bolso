// ============================================================================
// MESTRE DE BOLSO — Utilitários e Gerador de Tabela de Classes Homebrew (5.5e)
// ============================================================================

const FULL_CASTER_SLOTS = [
    [2, 0, 0, 0, 0, 0, 0, 0, 0], // 1
    [3, 0, 0, 0, 0, 0, 0, 0, 0], // 2
    [4, 2, 0, 0, 0, 0, 0, 0, 0], // 3
    [4, 3, 0, 0, 0, 0, 0, 0, 0], // 4
    [4, 3, 2, 0, 0, 0, 0, 0, 0], // 5
    [4, 3, 3, 0, 0, 0, 0, 0, 0], // 6
    [4, 3, 3, 1, 0, 0, 0, 0, 0], // 7
    [4, 3, 3, 2, 0, 0, 0, 0, 0], // 8
    [4, 3, 3, 3, 1, 0, 0, 0, 0], // 9
    [4, 3, 3, 3, 2, 0, 0, 0, 0], // 10
    [4, 3, 3, 3, 2, 1, 0, 0, 0], // 11
    [4, 3, 3, 3, 2, 1, 0, 0, 0], // 12
    [4, 3, 3, 3, 2, 1, 1, 0, 0], // 13
    [4, 3, 3, 3, 2, 1, 1, 0, 0], // 14
    [4, 3, 3, 3, 2, 1, 1, 1, 0], // 15
    [4, 3, 3, 3, 2, 1, 1, 1, 0], // 16
    [4, 3, 3, 3, 2, 1, 1, 1, 1], // 17
    [4, 3, 3, 3, 3, 1, 1, 1, 1], // 18
    [4, 3, 3, 3, 3, 2, 1, 1, 1], // 19
    [4, 3, 3, 3, 3, 2, 2, 1, 1]  // 20
];

const HALF_CASTER_SLOTS = [
    [2, 0, 0, 0, 0], // 1
    [2, 0, 0, 0, 0], // 2
    [3, 0, 0, 0, 0], // 3
    [3, 0, 0, 0, 0], // 4
    [4, 2, 0, 0, 0], // 5
    [4, 2, 0, 0, 0], // 6
    [4, 3, 0, 0, 0], // 7
    [4, 3, 0, 0, 0], // 8
    [4, 3, 2, 0, 0], // 9
    [4, 3, 2, 0, 0], // 10
    [4, 3, 3, 0, 0], // 11
    [4, 3, 3, 0, 0], // 12
    [4, 3, 3, 1, 0], // 13
    [4, 3, 3, 1, 0], // 14
    [4, 3, 3, 2, 0], // 15
    [4, 3, 3, 2, 0], // 16
    [4, 3, 3, 3, 1], // 17
    [4, 3, 3, 3, 1], // 18
    [4, 3, 3, 3, 2], // 19
    [4, 3, 3, 3, 2]  // 20
];

const THIRD_CASTER_SLOTS = [
    [0, 0, 0, 0], // 1
    [0, 0, 0, 0], // 2
    [2, 0, 0, 0], // 3
    [3, 0, 0, 0], // 4
    [3, 0, 0, 0], // 5
    [3, 0, 0, 0], // 6
    [4, 2, 0, 0], // 7
    [4, 2, 0, 0], // 8
    [4, 2, 0, 0], // 9
    [4, 3, 0, 0], // 10
    [4, 3, 0, 0], // 11
    [4, 3, 0, 0], // 12
    [4, 3, 2, 0], // 13
    [4, 3, 2, 0], // 14
    [4, 3, 2, 0], // 15
    [4, 3, 3, 0], // 16
    [4, 3, 3, 0], // 17
    [4, 3, 3, 0], // 18
    [4, 3, 3, 1], // 19
    [4, 3, 3, 1]  // 20
];

const PACT_CASTER_PROGRESSION = [
    '1 (1º)', '2 (1º)', '2 (2º)', '2 (2º)', '2 (3º)',
    '2 (3º)', '2 (4º)', '2 (4º)', '2 (5º)', '2 (5º)',
    '3 (5º)', '3 (5º)', '3 (5º)', '3 (5º)', '3 (5º)',
    '3 (5º)', '4 (5º)', '4 (5º)', '4 (5º)', '4 (5º)'
];

const formatSlotsSummary = (slotsArr) => {
    const active = slotsArr
        .map((count, idx) => (count > 0 ? `${idx + 1}º:${count}` : null))
        .filter(Boolean);
    return active.length > 0 ? active.join(' · ') : '—';
};

export const getProfBonusForLevel = (lvl) => {
    const safeLvl = Math.max(1, Math.min(20, parseInt(lvl, 10) || 1));
    return `+${Math.floor((safeLvl - 1) / 4) + 2}`;
};

export const getHitPointsDescription = (hitDie, className, lang = 'pt') => {
    const dieMap = {
        d6: { max: 6, avg: 4 },
        d8: { max: 8, avg: 5 },
        d10: { max: 10, avg: 6 },
        d12: { max: 12, avg: 7 }
    };
    const info = dieMap[hitDie] || dieMap.d8;
    const cls = className || (lang === 'pt' ? 'sua classe' : 'your class');
    if (lang === 'pt') {
        return `1${hitDie} por nível de ${cls} (${info.max} + Mod. CON no 1º nível; 1${hitDie} [ou ${info.avg}] + Mod. CON por nível seguinte)`;
    }
    return `1${hitDie} per ${cls} level (${info.max} + CON mod at 1st level; 1${hitDie} [or ${info.avg}] + CON mod per level after)`;
};

export const getCasterSlotForLevel = (casterType, level) => {
    const idx = Math.max(0, Math.min(19, (parseInt(level, 10) || 1) - 1));
    if (casterType === 'full') return formatSlotsSummary(FULL_CASTER_SLOTS[idx]);
    if (casterType === 'half') return formatSlotsSummary(HALF_CASTER_SLOTS[idx]);
    if (casterType === 'third') return formatSlotsSummary(THIRD_CASTER_SLOTS[idx]);
    if (casterType === 'pact') return PACT_CASTER_PROGRESSION[idx];
    return null;
};

/**
 * Gera a estrutura inicial dos 20 níveis para o Criador Homebrew de Classes,
 * seguindo o esqueleto padrão do D&D 5.5e (para facilitar a criação do Mestre,
 * mas totalmente editável nível a nível).
 */
export const createDefault20Levels = (lang = 'pt') => {
    const defaultCol1Values = [
        '1d4', '1d4', '1d4', '1d4', '1d6',
        '1d6', '1d6', '1d6', '1d6', '1d6',
        '1d8', '1d8', '1d8', '1d8', '1d8',
        '1d8', '1d10', '1d10', '1d10', '1d10'
    ];
    const defaultCol2Values = [
        '2', '2', '2', '2', '3',
        '3', '3', '3', '4', '4',
        '4', '4', '5', '5', '5',
        '5', '6', '6', '6', 'Ilimitado'
    ];

    const levels = [];
    for (let lvl = 1; lvl <= 20; lvl++) {
        let defaultFeatures = [];
        if (lvl === 1) {
            defaultFeatures = [
                {
                    name: lang === 'pt' ? 'Característica Inicial da Classe' : 'Starting Class Feature',
                    desc: lang === 'pt'
                        ? 'Descreva aqui a habilidade principal que define o estilo de jogo desta classe no 1º nível.'
                        : 'Describe the core feature that defines this class at 1st level.'
                }
            ];
        } else if ([4, 8, 12, 16].includes(lvl)) {
            defaultFeatures = [
                {
                    name: lang === 'pt' ? 'Incremento no Valor de Atributo' : 'Ability Score Improvement',
                    desc: lang === 'pt'
                        ? 'Você recebe o talento Incremento no Valor de Atributo (+2 em um atributo ou +1 em dois atributos, até o máximo de 20) ou outro Talento Geral à sua escolha.'
                        : 'You gain the Ability Score Improvement feat or another General feat of your choice.'
                }
            ];
        } else if ([3, 6, 10, 14].includes(lvl)) {
            defaultFeatures = [
                {
                    name: lang === 'pt'
                        ? (lvl === 3 ? 'Subclasse da Classe' : 'Característica de Subclasse')
                        : (lvl === 3 ? 'Class Subclass' : 'Subclass Feature'),
                    desc: lang === 'pt'
                        ? `Você recebe uma característica concedida pela sua escolha de Subclasse no ${lvl}º nível.`
                        : `You gain a feature from your chosen Subclass at level ${lvl}.`
                }
            ];
        } else if (lvl === 5) {
            defaultFeatures = [
                {
                    name: lang === 'pt' ? 'Ataque Extra / Poder de 5º Nível' : 'Extra Attack / 5th-Level Power',
                    desc: lang === 'pt'
                        ? 'Você pode atacar duas vezes, em vez de uma, sempre que realizar a ação de Ataque no seu turno (ou recebe um aprimoramento equivalente).'
                        : 'You can attack twice instead of once whenever you take the Attack action on your turn.'
                }
            ];
        } else if (lvl === 19) {
            defaultFeatures = [
                {
                    name: lang === 'pt' ? 'Dádiva Épica (Epic Boon)' : 'Epic Boon',
                    desc: lang === 'pt'
                        ? 'Você recebe um talento de Dádiva Épica ou outro talento à sua escolha (+1 em um atributo, até o máximo de 30).'
                        : 'You gain an Epic Boon feat or another feat of your choice (+1 to an ability score, max 30).'
                }
            ];
        } else if (lvl === 20) {
            defaultFeatures = [
                {
                    name: lang === 'pt' ? 'Ápice da Classe (Capstone)' : 'Class Capstone Feature',
                    desc: lang === 'pt'
                        ? 'No 20º nível, você atinge o domínio supremo dos poderes da sua classe.'
                        : 'At 20th level, you reach the ultimate mastery of your class powers.'
                }
            ];
        } else {
            defaultFeatures = [
                {
                    name: lang === 'pt' ? `Habilidade de ${lvl}º Nível` : `Level ${lvl} Feature`,
                    desc: lang === 'pt'
                        ? `Descreva o que a classe entrega ao atingir o ${lvl}º nível.`
                        : `Describe what the class grants upon reaching level ${lvl}.`
                }
            ];
        }

        levels.push({
            level: lvl,
            profBonus: getProfBonusForLevel(lvl),
            colValues: {
                col_1: defaultCol1Values[lvl - 1],
                col_2: defaultCol2Values[lvl - 1]
            },
            features: defaultFeatures
        });
    }
    return levels;
};

/**
 * Converte o formulário do Criador Homebrew de Classes para o formato unificado
 * de `CLASSES_DATA`, gerando automaticamente a Tabela de Progressão completa (1-20),
 * o Core da Classe e as Descrições de cada nível.
 */
export const buildHomebrewClassData = (classForm, existingId = null, slugGenerator = null) => {
    const cleanName = (classForm.name || '').trim() || 'Classe Homebrew';
    const id = existingId || (slugGenerator ? slugGenerator('hb-class', cleanName) : `hb-class-${Date.now()}`);
    const hitDie = ['d6', 'd8', 'd10', 'd12'].includes(classForm.hitDie) ? classForm.hitDie : 'd8';
    const tagline = (classForm.tagline || '').trim() || 'Uma classe personalizada criada pelo Mestre.';
    const subclass = (classForm.subclass || '').trim() || 'Arquétipo Homebrew';
    const primaryAbility = (classForm.primaryAbility || '').trim() || 'Força ou Destreza';
    const savingThrows = Array.isArray(classForm.savingThrows) && classForm.savingThrows.length > 0
        ? classForm.savingThrows.join(' e ')
        : 'Constituição e Sabedoria';
    const skills = (classForm.skills || '').trim() || 'Escolha 2 perícias relacionadas à classe';
    const weapons = (classForm.weapons || '').trim() || 'Armas Simples e Marciais';
    const armor = (classForm.armor || '').trim() || 'Armaduras Leves, Médias e Escudos';
    const tools = (classForm.tools || '').trim() || 'Nenhuma';
    const casterType = classForm.casterType || 'none';

    const customCols = Array.isArray(classForm.customColumns) ? classForm.customColumns : [];
    const extraColumns = customCols
        .filter(c => c && c.key && (c.label || '').trim())
        .map(c => ({
            key: c.key,
            label: { pt: c.label.trim(), en: c.label.trim() }
        }));

    if (casterType !== 'none') {
        const slotHeaderPt = casterType === 'pact'
            ? 'Espaços de Pacto'
            : casterType === 'full'
                ? 'Espaços (1º–9º)'
                : casterType === 'half'
                    ? 'Espaços (1º–5º)'
                    : 'Espaços (1º–4º)';
        const slotHeaderEn = casterType === 'pact' ? 'Pact Slots' : 'Spell Slots';
        extraColumns.push({
            key: '_auto_slots',
            label: { pt: slotHeaderPt, en: slotHeaderEn }
        });
    }

    const rawLevels = Array.isArray(classForm.levels) && classForm.levels.length === 20
        ? classForm.levels
        : createDefault20Levels('pt');

    const levels = rawLevels.map((lvlObj, idx) => {
        const levelNum = idx + 1;
        const profBonus = getProfBonusForLevel(levelNum);
        const extra = {};

        for (const col of customCols) {
            if (col && col.key) {
                extra[col.key] = (lvlObj.colValues && lvlObj.colValues[col.key]) ? String(lvlObj.colValues[col.key]).trim() : '—';
            }
        }
        if (casterType !== 'none') {
            extra._auto_slots = getCasterSlotForLevel(casterType, levelNum) || '—';
        }

        const validFeatures = (Array.isArray(lvlObj.features) ? lvlObj.features : [])
            .filter(f => f && ((f.name || '').trim() || (f.desc || '').trim()))
            .map(f => {
                const fName = (f.name || '').trim() || `Característica de ${levelNum}º Nível`;
                const fDesc = (f.desc || '').trim() || 'Sem descrição adicional.';
                return {
                    name: { pt: fName, en: fName },
                    desc: { pt: fDesc, en: fDesc }
                };
            });

        if (validFeatures.length === 0) {
            validFeatures.push({
                name: { pt: '—', en: '—' },
                desc: { pt: 'Nenhuma característica adicional neste nível.', en: 'No additional feature at this level.' }
            });
        }

        return {
            level: levelNum,
            profBonus,
            extra,
            features: validFeatures
        };
    });

    const hpPt = getHitPointsDescription(hitDie, cleanName, 'pt');
    const hpEn = getHitPointsDescription(hitDie, cleanName, 'en');

    return {
        id,
        slug: id,
        isHomebrew: true,
        name: { pt: cleanName, en: cleanName },
        tagline: { pt: tagline, en: tagline },
        hitDie,
        core: {
            primaryAbility: { pt: primaryAbility, en: primaryAbility },
            hitPoints: { pt: hpPt, en: hpEn },
            savingThrows: { pt: savingThrows, en: savingThrows },
            skills: { pt: skills, en: skills },
            weapons: { pt: weapons, en: weapons },
            armor: { pt: armor, en: armor },
            tools: { pt: tools, en: tools },
            subclass: { pt: `${subclass} (Homebrew)`, en: `${subclass} (Homebrew)` }
        },
        extraColumns,
        levels,
        homebrew_meta: {
            rawForm: {
                ...classForm,
                name: cleanName,
                hitDie
            }
        }
    };
};
