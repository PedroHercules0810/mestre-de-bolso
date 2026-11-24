// ============================================================================
// MESTRE DE BOLSO — Compêndio Completo de Classes D&D 5.5e (SRD 2024)
// Inclui: Core da Classe, Tabela de Progressão (Níveis 1-20) e Características por Nível
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

const HALF_CASTER_SLOTS_2024 = [
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

const formatSlotsSummary = (slotsArr) => {
    const active = slotsArr
        .map((count, idx) => (count > 0 ? `${idx + 1}º:${count}` : null))
        .filter(Boolean);
    return active.length > 0 ? active.join(' · ') : '—';
};

const getProfBonus = (lvl) => `+${Math.floor((lvl - 1) / 4) + 2}`;

export const CLASSES_DATA = [
    // ========================================================================
    // 1. BÁRBARO (BARBARIAN)
    // ========================================================================
    {
        id: 'barbarian',
        name: { pt: 'Bárbaro', en: 'Barbarian' },
        tagline: {
            pt: 'Um combatente feroz movido pela fúria primal e instinto selvagem.',
            en: 'A fierce warrior of primal rage and untamed instinct.'
        },
        hitDie: 'd12',
        core: {
            primaryAbility: { pt: 'Força', en: 'Strength' },
            hitPoints: {
                pt: '1d12 por nível de Bárbaro (12 + Mod. CON no 1º nível; 1d12 [ou 7] + Mod. CON por nível seguinte)',
                en: '1d12 per Barbarian level (12 + CON mod at 1st level; 1d12 [or 7] + CON mod per level after)'
            },
            savingThrows: { pt: 'Força e Constituição', en: 'Strength and Constitution' },
            skills: {
                pt: 'Escolha 2: Adestrar Animais, Atletismo, Intimidação, Natureza, Percepção ou Sobrevivência',
                en: 'Choose 2: Animal Handling, Athletics, Intimidation, Nature, Perception, or Survival'
            },
            weapons: { pt: 'Armas Simples e Marciais', en: 'Simple and Martial Weapons' },
            armor: { pt: 'Armaduras Leves, Médias e Escudos', en: 'Light and Medium Armor, Shields' },
            tools: { pt: 'Nenhuma', en: 'None' },
            subclass: { pt: 'Caminho do Berserker (SRD 5.5e)', en: 'Path of the Berserker (SRD 5.5e)' }
        },
        extraColumns: [
            { key: 'rages', label: { pt: 'Fúrias', en: 'Rages' } },
            { key: 'rageDmg', label: { pt: 'Dano de Fúria', en: 'Rage Dmg' } },
            { key: 'mastery', label: { pt: 'Maestrias', en: 'Mastery' } }
        ],
        levels: [
            {
                level: 1,
                extra: { rages: '2', rageDmg: '+2', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Fúria (Rage)', en: 'Rage' },
                        desc: {
                            pt: 'Como Ação Bônus, você entra em Fúria por até 10 minutos (desde que não use armadura pesada). Enquanto em Fúria: resistência a dano de Concussão, Cortante e Perfurante; soma o Dano de Fúria em ataques com Força; Vantagem em testes e salvaguardas de Força. Você recupera 1 uso em um Descanso Curto e todos em um Descanso Longo.',
                            en: 'As a Bonus Action, enter a Rage for up to 10 minutes (if not wearing Heavy armor). Gain resistance to Bludgeoning, Piercing, and Slashing damage, bonus Rage Damage on Strength attacks, and Advantage on Strength checks and saves. Regain 1 use on a Short Rest and all on a Long Rest.'
                        }
                    },
                    {
                        name: { pt: 'Defesa sem Armadura', en: 'Unarmored Defense' },
                        desc: {
                            pt: 'Enquanto não estiver usando nenhuma armadura, sua Classe de Armadura base é igual a 10 + seu modificador de Destreza + seu modificador de Constituição. Você pode usar um Escudo e manter esse benefício.',
                            en: 'While not wearing any armor, your base Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a Shield and still gain this benefit.'
                        }
                    },
                    {
                        name: { pt: 'Maestria em Armas', en: 'Weapon Mastery' },
                        desc: {
                            pt: 'Seu treinamento permite usar as propriedades de maestria de 2 tipos de armas Corpo a Corpo Simples ou Marciais à sua escolha (ex: Trespassar, Derrubar, Empurrar). Você pode trocar uma escolha após um Descanso Longo.',
                            en: 'Your training lets you use the mastery properties of 2 kinds of Simple or Martial Melee weapons of your choice. You can change one of your weapon choices whenever you finish a Long Rest.'
                        }
                    }
                ]
            },
            {
                level: 2,
                extra: { rages: '2', rageDmg: '+2', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Sentido de Perigo', en: 'Danger Sense' },
                        desc: {
                            pt: 'Você tem Vantagem em salvaguardas de Destreza contra efeitos que possa ver ou perceber (como armadilhas e magias), desde que não esteja com a condição Incapacitado.',
                            en: 'You have Advantage on Dexterity saving throws unless you have the Incapacitated condition.'
                        }
                    },
                    {
                        name: { pt: 'Ataque Descuidado (Reckless Attack)', en: 'Reckless Attack' },
                        desc: {
                            pt: 'Ao fazer sua primeira jogada de ataque no turno, você pode atacar de forma imprudente. Você recebe Vantagem em jogadas de ataque com Força até o início do seu próximo turno, mas jogadas de ataque contra você também têm Vantagem.',
                            en: 'When you make your first attack roll on your turn, you can decide to attack recklessly. Doing so gives you Advantage on attack rolls using Strength until the start of your next turn, but attack rolls against you have Advantage during that time.'
                        }
                    }
                ]
            },
            {
                level: 3,
                extra: { rages: '3', rageDmg: '+2', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Subclasse de Bárbaro (Caminho do Berserker)', en: 'Barbarian Subclass (Path of the Berserker)' },
                        desc: {
                            pt: 'Frenesi (Frenzy): Se você usar Ataque Descuidado enquanto estiver em Fúria, você causa dano extra ao primeiro alvo que acertar no seu turno com um ataque usando Força. O dano extra é igual a um número de d6s igual ao seu bônus de Dano de Fúria.',
                            en: 'Frenzy: If you use Reckless Attack while your Rage is active, you deal extra damage to the first target you hit on your turn with a Strength-based attack. The extra damage equals a number of d6s equal to your Rage Damage bonus.'
                        }
                    },
                    {
                        name: { pt: 'Conhecimento Primal (Primal Knowledge)', en: 'Primal Knowledge' },
                        desc: {
                            pt: 'Você ganha proficiência em mais uma perícia da lista do Bárbaro. Além disso, enquanto em Fúria, pode canalizar força bruta para realizar testes de Acrobacia, Furtividade, Intimidação, Percepção ou Sobrevivência como testes de Força.',
                            en: 'You gain proficiency in another skill of your choice from the Barbarian list. In addition, while your Rage is active, you can make Acrobatics, Intimidation, Perception, Stealth, or Survival checks as Strength checks.'
                        }
                    }
                ]
            },
            {
                level: 4,
                extra: { rages: '3', rageDmg: '+2', mastery: '3' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo (+2 em um atributo ou +1 em dois atributos, até o máximo de 20) ou outro Talento Geral para o qual cumpra os pré-requisitos.',
                            en: 'You gain the Ability Score Improvement feat (+2 to one ability score or +1 to two, max 20) or another General feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 5,
                extra: { rages: '3', rageDmg: '+2', mastery: '3' },
                features: [
                    {
                        name: { pt: 'Ataque Extra', en: 'Extra Attack' },
                        desc: {
                            pt: 'Você pode atacar duas vezes, em vez de uma, sempre que realizar a ação de Ataque no seu turno.',
                            en: 'You can attack twice instead of once whenever you take the Attack action on your turn.'
                        }
                    },
                    {
                        name: { pt: 'Movimento Rápido', en: 'Fast Movement' },
                        desc: {
                            pt: 'Seu deslocamento aumenta em 3 metros (10 ft.) enquanto você não estiver vestindo armadura pesada.',
                            en: 'Your speed increases by 10 feet while you aren’t wearing Heavy armor.'
                        }
                    }
                ]
            },
            {
                level: 6,
                extra: { rages: '4', rageDmg: '+2', mastery: '3' },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Fúria Inconsciente)', en: 'Subclass Feature (Mindless Rage)' },
                        desc: {
                            pt: 'Você tem Imunidade às condições Amedrontado e Enfeitiçado enquanto sua Fúria estiver ativa. Se estiver sob uma dessas condições ao entrar em Fúria, a condição é encerrada em você.',
                            en: 'You have Immunity to the Charmed and Frightened conditions while your Rage is active. If you’re Charmed or Frightened when you enter your Rage, the condition ends on you.'
                        }
                    }
                ]
            },
            {
                level: 7,
                extra: { rages: '4', rageDmg: '+2', mastery: '3' },
                features: [
                    {
                        name: { pt: 'Instinto Selvagem', en: 'Feral Instinct' },
                        desc: {
                            pt: 'Seus instintos são tão apurados que você tem Vantagem nas rolagens de Iniciativa.',
                            en: 'Your instincts are so honed that you have Advantage on Initiative rolls.'
                        }
                    },
                    {
                        name: { pt: 'Bote Instintivo (Instinctive Pounce)', en: 'Instinctive Pounce' },
                        desc: {
                            pt: 'Como parte da Ação Bônus usada para entrar em Fúria, você pode se mover até metade do seu deslocamento.',
                            en: 'As part of the Bonus Action you take to enter your Rage, you can move up to half your Speed.'
                        }
                    }
                ]
            },
            {
                level: 8,
                extra: { rages: '4', rageDmg: '+2', mastery: '3' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 9,
                extra: { rages: '4', rageDmg: '+3', mastery: '3' },
                features: [
                    {
                        name: { pt: 'Golpe Brutal (Brutal Strike)', en: 'Brutal Strike' },
                        desc: {
                            pt: 'Se você usar Ataque Descuidado, pode abrir mão da Vantagem em uma jogada de ataque com Força no seu turno. Se o ataque acertar, o alvo sofre 1d10 de dano extra e você aplica um efeito Brutal: Golpe Forçado (empurra 4,5m e você avança) ou Golpe Debilitante (reduz o deslocamento do alvo em 4,5m).',
                            en: 'If you use Reckless Attack, you can forgo any Advantage on one Strength-based attack roll on your turn. On a hit, the target takes an extra 1d10 damage and suffers a Brutal Strike effect: Forceful Blow (push 15 ft. and move) or Hamstring Blow (-15 ft. speed).'
                        }
                    }
                ]
            },
            {
                level: 10,
                extra: { rages: '4', rageDmg: '+3', mastery: '4' },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Retaliação)', en: 'Subclass Feature (Retaliation)' },
                        desc: {
                            pt: 'Quando você sofrer dano de uma criatura que esteja a até 1,5 metro (5 ft.) de você, você pode usar sua Reação para realizar um ataque corpo a corpo com uma arma ou Golpe Desarmado contra aquela criatura.',
                            en: 'When you take damage from a creature that is within 5 feet of you, you can take a Reaction to make one melee attack against that creature, using a weapon or an Unarmed Strike.'
                        }
                    }
                ]
            },
            {
                level: 11,
                extra: { rages: '4', rageDmg: '+3', mastery: '4' },
                features: [
                    {
                        name: { pt: 'Fúria Implacável (Relentless Rage)', en: 'Relentless Rage' },
                        desc: {
                            pt: 'Se você cair a 0 PV enquanto estiver em Fúria e não morrer instantaneamente, pode fazer uma salvaguarda de Constituição CD 10. Em um sucesso, seus PV passam para um valor igual ao dobro do seu nível de Bárbaro. A CD aumenta em +5 a cada uso até um Descanso Curto ou Longo.',
                            en: 'If you drop to 0 Hit Points while your Rage is active and don’t die outright, you can make a DC 10 Constitution saving throw. If you succeed, your Hit Points instead change to a number equal to twice your Barbarian level (+5 DC per subsequent use until Short/Long Rest).'
                        }
                    }
                ]
            },
            {
                level: 12,
                extra: { rages: '5', rageDmg: '+3', mastery: '4' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 13,
                extra: { rages: '5', rageDmg: '+3', mastery: '4' },
                features: [
                    {
                        name: { pt: 'Golpe Brutal Aprimorado', en: 'Improved Brutal Strike' },
                        desc: {
                            pt: 'Você aprende dois novos efeitos para o seu Golpe Brutal: Golpe Atordoante (Desvantagem na próxima salvaguarda do alvo e ele não pode fazer Ataques de Oportunidade) e Golpe Demolidor (+5 na próxima jogada de ataque de um aliado contra o alvo).',
                            en: 'You add two new options to Brutal Strike: Staggering Blow (target has Disadvantage on next saving throw and can’t make Opportunity Attacks) and Sundering Blow (+5 bonus to the next attack roll made by another creature against the target).'
                        }
                    }
                ]
            },
            {
                level: 14,
                extra: { rages: '5', rageDmg: '+3', mastery: '4' },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Presença Intimidante)', en: 'Subclass Feature (Intimidating Presence)' },
                        desc: {
                            pt: 'Como Ação Bônus, você emite terror em uma Emanação de 9 metros (30 ft.). Criaturas escolhidas fazem salvaguarda de Sabedoria (CD 8 + Prof + Mod. FOR) ou ficam Amedrontadas por 1 minuto. Uma vez usado, recarrega em Descanso Longo ou gastando 1 uso de Fúria.',
                            en: 'As a Bonus Action, strike terror in a 30-foot Emanation. Chosen creatures must make a Wisdom save (DC 8 + Prof + STR mod) or have the Frightened condition for 1 minute. Recharges on a Long Rest or by expending a Rage use.'
                        }
                    }
                ]
            },
            {
                level: 15,
                extra: { rages: '5', rageDmg: '+3', mastery: '4' },
                features: [
                    {
                        name: { pt: 'Fúria Persistente', en: 'Persistent Rage' },
                        desc: {
                            pt: 'Quando você rola Iniciativa, pode recuperar todos os usos gastos de Fúria (1x por Descanso Longo). Além disso, sua Fúria dura os 10 minutos completos sem precisar atacar ou sofrer dano, encerrando apenas se você ficar Inconsciente ou vestir armadura pesada.',
                            en: 'When you roll Initiative, you can regain all expended uses of Rage (once per Long Rest). In addition, your Rage lasts the full 10 minutes without needing to attack or take damage, ending early only if you have the Unconscious condition or don Heavy armor.'
                        }
                    }
                ]
            },
            {
                level: 16,
                extra: { rages: '5', rageDmg: '+4', mastery: '4' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 17,
                extra: { rages: '6', rageDmg: '+4', mastery: '4' },
                features: [
                    {
                        name: { pt: 'Golpe Brutal Aprimorado (2d10)', en: 'Improved Brutal Strike (2d10)' },
                        desc: {
                            pt: 'O dano extra do seu Golpe Brutal aumenta para 2d10, e você pode aplicar dois efeitos diferentes de Golpe Brutal simultaneamente sempre que usar a característica.',
                            en: 'The extra damage of your Brutal Strike increases to 2d10, and you can use two different Brutal Strike effects whenever you use Brutal Strike.'
                        }
                    }
                ]
            },
            {
                level: 18,
                extra: { rages: '6', rageDmg: '+4', mastery: '4' },
                features: [
                    {
                        name: { pt: 'Força Indomável', en: 'Indomitable Might' },
                        desc: {
                            pt: 'Se o total de um teste ou salvaguarda de Força que você fizer for menor que o seu valor de Força, você pode usar o seu valor de Força no lugar do resultado.',
                            en: 'If your total for a Strength check or Strength saving throw is less than your Strength score, you can use that score in place of the total.'
                        }
                    }
                ]
            },
            {
                level: 19,
                extra: { rages: '6', rageDmg: '+4', mastery: '4' },
                features: [
                    {
                        name: { pt: 'Dádiva Épica (Epic Boon)', en: 'Epic Boon' },
                        desc: {
                            pt: 'Você recebe um talento de Dádiva Épica (como Dádiva do Ataque Irresistível) ou outro talento à sua escolha, aumentando também um atributo em +1 (até o máximo de 30).',
                            en: 'You gain an Epic Boon feat of your choice (such as Boon of Irresistible Offense), which also increases an ability score by 1 (to a maximum of 30).'
                        }
                    }
                ]
            },
            {
                level: 20,
                extra: { rages: '6', rageDmg: '+4', mastery: '4' },
                features: [
                    {
                        name: { pt: 'Campeão Primal', en: 'Primal Champion' },
                        desc: {
                            pt: 'Você encarna o poder supremo da selva. Seus valores de Força e Constituição aumentam em +4, até um novo máximo de 25.',
                            en: 'You embody primal power. Your Strength and Constitution scores increase by 4, to a maximum of 25.'
                        }
                    }
                ]
            }
        ]
    },

    // ========================================================================
    // 2. BARDO (BARD)
    // ========================================================================
    {
        id: 'bard',
        name: { pt: 'Bardo', en: 'Bard' },
        tagline: {
            pt: 'Um artista inspirador que tece magia através de música, palavras e performance.',
            en: 'An inspiring performer who weaves magic through music, words, and art.'
        },
        hitDie: 'd8',
        core: {
            primaryAbility: { pt: 'Carisma', en: 'Charisma' },
            hitPoints: {
                pt: '1d8 por nível de Bardo (8 + Mod. CON no 1º nível; 1d8 [ou 5] + Mod. CON por nível seguinte)',
                en: '1d8 per Bard level (8 + CON mod at 1st level; 1d8 [or 5] + CON mod per level after)'
            },
            savingThrows: { pt: 'Destreza e Carisma', en: 'Dexterity and Charisma' },
            skills: { pt: 'Escolha quaisquer 3 perícias', en: 'Choose any 3 skills' },
            weapons: { pt: 'Armas Simples', en: 'Simple Weapons' },
            armor: { pt: 'Armaduras Leves', en: 'Light Armor' },
            tools: { pt: 'Escolha 3 Instrumentos Musicais', en: 'Choose 3 Musical Instruments' },
            subclass: { pt: 'Colégio do Conhecimento (SRD 5.5e)', en: 'College of Lore (SRD 5.5e)' }
        },
        extraColumns: [
            { key: 'bardicDie', label: { pt: 'Dado Insp.', en: 'Bardic Die' } },
            { key: 'prepared', label: { pt: 'Magias Prep.', en: 'Prepared' } },
            { key: 'slots', label: { pt: 'Espaços (1º–9º)', en: 'Spell Slots' } }
        ],
        levels: [
            {
                level: 1,
                extra: { bardicDie: 'd6', prepared: '4', slots: formatSlotsSummary(FULL_CASTER_SLOTS[0]) },
                features: [
                    {
                        name: { pt: 'Inspiração de Bardo', en: 'Bardic Inspiration' },
                        desc: {
                            pt: 'Como Ação Bônus, inspire uma criatura a até 18m que possa ver ou ouvir você. Ela ganha um dado d6 (válido por 1 hora) que pode somar a um Teste de d20 após rolar o dado. Usos iguais ao seu Mod. de Carisma (mín. 1), recuperados em Descanso Longo.',
                            en: 'As a Bonus Action, inspire a creature within 60 ft. It gains a d6 Bardic Inspiration die (lasts 1 hour) to add to a d20 Test after rolling. Uses equal to CHA modifier (min 1), regained on a Long Rest.'
                        }
                    },
                    {
                        name: { pt: 'Conjuração', en: 'Spellcasting' },
                        desc: {
                            pt: 'Você conhece 2 truques e prepara 4 magias de 1º círculo da lista de Bardo, usando Carisma como atributo de conjuração e instrumentos musicais como foco.',
                            en: 'You know 2 cantrips and prepare 4 1st-level Bard spells, using Charisma as your spellcasting ability and Musical Instruments as a spellcasting focus.'
                        }
                    }
                ]
            },
            {
                level: 2,
                extra: { bardicDie: 'd6', prepared: '5', slots: formatSlotsSummary(FULL_CASTER_SLOTS[1]) },
                features: [
                    {
                        name: { pt: 'Especialização (Expertise)', en: 'Expertise' },
                        desc: {
                            pt: 'Escolha 2 perícias nas quais você tem proficiência. Seu Bônus de Proficiência é dobrado para qualquer teste que use essas perícias.',
                            en: 'Choose 2 of your skill proficiencies. Your Proficiency Bonus is doubled for any ability check you make using either of the chosen skills.'
                        }
                    },
                    {
                        name: { pt: 'Pau para Toda Obra (Jack of All Trades)', en: 'Jack of All Trades' },
                        desc: {
                            pt: 'Você pode somar metade do seu Bônus de Proficiência (arredondado para baixo) a qualquer teste de atributo que utilize uma perícia na qual você não tenha proficiência.',
                            en: 'You can add half your Proficiency Bonus (round down) to any ability check you make that uses a skill proficiency you lack.'
                        }
                    }
                ]
            },
            {
                level: 3,
                extra: { bardicDie: 'd6', prepared: '6', slots: formatSlotsSummary(FULL_CASTER_SLOTS[2]) },
                features: [
                    {
                        name: { pt: 'Subclasse de Bardo (Colégio do Conhecimento)', en: 'Bard Subclass (College of Lore)' },
                        desc: {
                            pt: 'Proficiências Bônus: Ganhe proficiência em 3 perícias à sua escolha. Palavras Cortantes (Cutting Words): Como Reação quando uma criatura a até 18m fizer uma rolagem de dano, teste de atributo ou ataque, gaste 1 Inspiração de Bardo e subtraia o valor rolado do total dela.',
                            en: 'Bonus Proficiencies: Gain proficiency with 3 skills of your choice. Cutting Words: As a Reaction when a creature within 60 ft. makes a damage roll, ability check, or attack roll, expend a Bardic Inspiration die and subtract the number rolled from its total.'
                        }
                    }
                ]
            },
            {
                level: 4,
                extra: { bardicDie: 'd6', prepared: '7', slots: formatSlotsSummary(FULL_CASTER_SLOTS[3]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another General feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 5,
                extra: { bardicDie: 'd8', prepared: '9', slots: formatSlotsSummary(FULL_CASTER_SLOTS[4]) },
                features: [
                    {
                        name: { pt: 'Fonte de Inspiração', en: 'Font of Inspiration' },
                        desc: {
                            pt: 'Seu dado de Inspiração de Bardo torna-se d8. Você recupera todos os usos gastos de Inspiração de Bardo em um Descanso Curto ou Longo, e também pode gastar um espaço de magia (sem ação) para recuperar 1 uso.',
                            en: 'Your Bardic Inspiration die becomes a d8. You now regain all expended uses of Bardic Inspiration on a Short or Long Rest, and you can expend a spell slot (no action required) to regain one expended use.'
                        }
                    }
                ]
            },
            {
                level: 6,
                extra: { bardicDie: 'd8', prepared: '10', slots: formatSlotsSummary(FULL_CASTER_SLOTS[5]) },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Descobertas Mágicas)', en: 'Subclass Feature (Magical Discoveries)' },
                        desc: {
                            pt: 'Você aprende duas magias à sua escolha das listas de Clérigo, Druida ou Mago (de qualquer círculo que você possa conjurar). Elas estão sempre preparadas e contam como magias de Bardo.',
                            en: 'You learn two spells of your choice from the Cleric, Druid, or Wizard spell list (of a level you can cast). They are always prepared and count as Bard spells for you.'
                        }
                    }
                ]
            },
            {
                level: 7,
                extra: { bardicDie: 'd8', prepared: '11', slots: formatSlotsSummary(FULL_CASTER_SLOTS[6]) },
                features: [
                    {
                        name: { pt: 'Contra-Encanto (Countercharm)', en: 'Countercharm' },
                        desc: {
                            pt: 'Quando você ou uma criatura a até 9m falhar em uma salvaguarda contra um efeito que imponha a condição Amedrontado ou Enfeitiçado, você pode usar sua Reação para permitir que a criatura rerrole a salvaguarda com Vantagem.',
                            en: 'If you or a creature within 30 feet fails a saving throw against an effect that applies the Charmed or Frightened condition, you can take a Reaction to cause the save to be rerolled with Advantage.'
                        }
                    }
                ]
            },
            {
                level: 8,
                extra: { bardicDie: 'd8', prepared: '12', slots: formatSlotsSummary(FULL_CASTER_SLOTS[7]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 9,
                extra: { bardicDie: 'd8', prepared: '14', slots: formatSlotsSummary(FULL_CASTER_SLOTS[8]) },
                features: [
                    {
                        name: { pt: 'Especialização (2 Novas Perícias)', en: 'Expertise (2 Additional Skills)' },
                        desc: {
                            pt: 'Escolha mais 2 perícias nas quais você tem proficiência para dobrar o seu Bônus de Proficiência.',
                            en: 'Choose 2 more of your skill proficiencies to gain Expertise.'
                        }
                    }
                ]
            },
            {
                level: 10,
                extra: { bardicDie: 'd10', prepared: '15', slots: formatSlotsSummary(FULL_CASTER_SLOTS[9]) },
                features: [
                    {
                        name: { pt: 'Segredos Mágicos (Magical Secrets)', en: 'Magical Secrets' },
                        desc: {
                            pt: 'Seu dado de Inspiração sobe para d10. Além disso, sempre que você ganhar níveis ou trocar magias preparadas, você pode escolher suas magias de Bardo das listas de Bardo, Clérigo, Druida e Mago!',
                            en: 'Your Bardic Inspiration die becomes a d10. Whenever you prepare new Bard spells, you can choose them from the Bard, Cleric, Druid, and Wizard spell lists!'
                        }
                    }
                ]
            },
            {
                level: 11,
                extra: { bardicDie: 'd10', prepared: '16', slots: formatSlotsSummary(FULL_CASTER_SLOTS[10]) },
                features: [
                    {
                        name: { pt: 'Magias de 6º Círculo', en: '6th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia espaços de magia de 6º círculo e amplia seu repertório arcano.',
                            en: 'You unlock 6th-level spell slots and expand your prepared spells.'
                        }
                    }
                ]
            },
            {
                level: 12,
                extra: { bardicDie: 'd10', prepared: '16', slots: formatSlotsSummary(FULL_CASTER_SLOTS[11]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 13,
                extra: { bardicDie: 'd10', prepared: '17', slots: formatSlotsSummary(FULL_CASTER_SLOTS[12]) },
                features: [
                    {
                        name: { pt: 'Magias de 7º Círculo', en: '7th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia espaços de magia de 7º círculo.',
                            en: 'You unlock 7th-level spell slots.'
                        }
                    }
                ]
            },
            {
                level: 14,
                extra: { bardicDie: 'd10', prepared: '17', slots: formatSlotsSummary(FULL_CASTER_SLOTS[13]) },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Perícia Inigualável)', en: 'Subclass Feature (Peerless Skill)' },
                        desc: {
                            pt: 'Quando você fizer um teste de atributo ou jogada de ataque e falhar, você pode gastar 1 uso de Inspiração de Bardo, rolar o dado e somar ao resultado, potencialmente transformando a falha em sucesso (o dado só é gasto se o teste passar!).',
                            en: 'When you make an ability check or attack roll and fail, you can roll a Bardic Inspiration die and add it to the total. You expend the Bardic Inspiration use only if the roll then succeeds.'
                        }
                    }
                ]
            },
            {
                level: 15,
                extra: { bardicDie: 'd12', prepared: '18', slots: formatSlotsSummary(FULL_CASTER_SLOTS[14]) },
                features: [
                    {
                        name: { pt: 'Dado de Inspiração d12 & 8º Círculo', en: 'd12 Bardic Inspiration & 8th-Level Spells' },
                        desc: {
                            pt: 'Seu dado de Inspiração de Bardo atinge seu máximo (d12) e você desbloqueia magias de 8º círculo.',
                            en: 'Your Bardic Inspiration die becomes a d12 and you unlock 8th-level spell slots.'
                        }
                    }
                ]
            },
            {
                level: 16,
                extra: { bardicDie: 'd12', prepared: '18', slots: formatSlotsSummary(FULL_CASTER_SLOTS[15]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 17,
                extra: { bardicDie: 'd12', prepared: '19', slots: formatSlotsSummary(FULL_CASTER_SLOTS[16]) },
                features: [
                    {
                        name: { pt: 'Magias de 9º Círculo', en: '9th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia o ápice da magia com espaços de 9º círculo.',
                            en: 'You unlock the pinnacle of spellcasting with 9th-level spell slots.'
                        }
                    }
                ]
            },
            {
                level: 18,
                extra: { bardicDie: 'd12', prepared: '20', slots: formatSlotsSummary(FULL_CASTER_SLOTS[17]) },
                features: [
                    {
                        name: { pt: 'Inspiração Superior', en: 'Superior Inspiration' },
                        desc: {
                            pt: 'Quando você rola Iniciativa e tiver menos de 2 usos de Inspiração de Bardo disponíveis, você recupera usos até ficar com 2.',
                            en: 'When you roll Initiative, you regain expended uses of Bardic Inspiration until you have two if you have fewer than that.'
                        }
                    }
                ]
            },
            {
                level: 19,
                extra: { bardicDie: 'd12', prepared: '21', slots: formatSlotsSummary(FULL_CASTER_SLOTS[18]) },
                features: [
                    {
                        name: { pt: 'Dádiva Épica', en: 'Epic Boon' },
                        desc: {
                            pt: 'Você recebe um talento de Dádiva Épica ou outro talento à sua escolha (+1 em um atributo, até 30).',
                            en: 'You gain an Epic Boon feat or another feat of your choice (+1 to an ability score, max 30).'
                        }
                    }
                ]
            },
            {
                level: 20,
                extra: { bardicDie: 'd12', prepared: '22', slots: formatSlotsSummary(FULL_CASTER_SLOTS[19]) },
                features: [
                    {
                        name: { pt: 'Palavras da Criação', en: 'Words of Creation' },
                        desc: {
                            pt: 'Você domina duas das Palavras Primordiais da Criação: as magias Palavra de Poder: Curar e Palavra de Poder: Matar estão sempre preparadas. Quando você conjurar qualquer uma delas, pode escolher uma segunda criatura a até 3m do primeiro alvo para também ser afetada!',
                            en: 'You always have Power Word Heal and Power Word Kill prepared. When you cast either spell, you can target a second creature with it if that creature is within 10 feet of the first target.'
                        }
                    }
                ]
            }
        ]
    },

    // ========================================================================
    // 3. BRUXO (WARLOCK)
    // ========================================================================
    {
        id: 'warlock',
        name: { pt: 'Bruxo', en: 'Warlock' },
        tagline: {
            pt: 'Um ocultista que forja um pacto sobrenatural em troca de segredos e poder arcano.',
            en: 'An occultist empowered by a supernatural pact with an otherworldly patron.'
        },
        hitDie: 'd8',
        core: {
            primaryAbility: { pt: 'Carisma', en: 'Charisma' },
            hitPoints: {
                pt: '1d8 por nível de Bruxo (8 + Mod. CON no 1º nível; 1d8 [ou 5] + Mod. CON por nível seguinte)',
                en: '1d8 per Warlock level (8 + CON mod at 1st level; 1d8 [or 5] + CON mod per level after)'
            },
            savingThrows: { pt: 'Sabedoria e Carisma', en: 'Wisdom and Charisma' },
            skills: {
                pt: 'Escolha 2: Arcanismo, Enganação, História, Intimidação, Investigação, Natureza ou Religião',
                en: 'Choose 2: Arcana, Deception, History, Intimidation, Investigation, Nature, or Religion'
            },
            weapons: { pt: 'Armas Simples', en: 'Simple Weapons' },
            armor: { pt: 'Armaduras Leves', en: 'Light Armor' },
            tools: { pt: 'Nenhuma', en: 'None' },
            subclass: { pt: 'Patrono Corruptor / Fiend (SRD 5.5e)', en: 'Fiend Patron (SRD 5.5e)' }
        },
        extraColumns: [
            { key: 'invocations', label: { pt: 'Invocações', en: 'Invocations' } },
            { key: 'pactSlots', label: { pt: 'Espaços', en: 'Pact Slots' } },
            { key: 'slotLevel', label: { pt: 'Círculo', en: 'Slot Lvl' } }
        ],
        levels: [
            {
                level: 1,
                extra: { invocations: '1', pactSlots: '1', slotLevel: '1º' },
                features: [
                    {
                        name: { pt: 'Invocações Místicas (Eldritch Invocations)', en: 'Eldritch Invocations' },
                        desc: {
                            pt: 'Você desbloqueia fragmentos de conhecimento proibido, começando com 1 Invocação (como Pacto da Lâmina, Pacto da Corrente ou Pacto do Tomo).',
                            en: 'You unearth Eldritch Invocations, gaining 1 invocation of your choice at 1st level (such as Pact of the Blade, Pact of the Chain, or Pact of the Tome).'
                        }
                    },
                    {
                        name: { pt: 'Magia de Pacto (Pact Magic)', en: 'Pact Magic' },
                        desc: {
                            pt: 'Você conhece 2 truques e prepara 2 magias de Bruxo. Todos os seus Espaços de Magia de Pacto são do mesmo círculo e são totalmente recuperados ao terminar um Descanso Curto ou Longo.',
                            en: 'You know 2 cantrips and prepare 2 Warlock spells. All of your Pact Magic spell slots are the same level and recharge completely on a Short or Long Rest.'
                        }
                    }
                ]
            },
            {
                level: 2,
                extra: { invocations: '3', pactSlots: '2', slotLevel: '1º' },
                features: [
                    {
                        name: { pt: 'Astúcia Mágica (Magical Cunning)', en: 'Magical Cunning' },
                        desc: {
                            pt: 'Você pode realizar um rito esotérico de 1 minuto para recuperar espaços gastos de Magia de Pacto até a metade do seu máximo (arredondado para cima). Uma vez por Descanso Longo.',
                            en: 'You can perform an esoteric rite for 1 minute to regain expended Pact Magic spell slots (up to half your maximum, round up). Once per Long Rest.'
                        }
                    }
                ]
            },
            {
                level: 3,
                extra: { invocations: '3', pactSlots: '2', slotLevel: '2º' },
                features: [
                    {
                        name: { pt: 'Subclasse de Bruxo (Patrono Corruptor / Fiend)', en: 'Warlock Subclass (Fiend Patron)' },
                        desc: {
                            pt: 'Bênção do Obscuro (Dark One’s Blessing): Quando você reduzir um inimigo a 0 PV, ou um inimigo a até 3m cair a 0 PV, você ganha Pontos de Vida Temporários iguais ao seu Mod. de Carisma + seu nível de Bruxo (mín. 1). Inclui magias de patrono sempre preparadas (como Mãos Flamejantes e Bola de Fogo no 5º nível).',
                            en: 'Dark One’s Blessing: When you reduce an enemy to 0 HP (or an enemy within 10 ft. drops to 0 HP), gain Temporary HP equal to your CHA modifier + your Warlock level (min 1). Includes always-prepared Fiend spells.'
                        }
                    }
                ]
            },
            {
                level: 4,
                extra: { invocations: '3', pactSlots: '2', slotLevel: '2º' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another General feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 5,
                extra: { invocations: '5', pactSlots: '2', slotLevel: '3º' },
                features: [
                    {
                        name: { pt: '5 Invocações & Espaços de 3º Círculo', en: '5 Invocations & 3rd-Level Pact Slots' },
                        desc: {
                            pt: 'Seus espaços de Pacto sobem para o 3º círculo e você passa a conhecer 5 Invocações Místicas (desbloqueando invocações como Golpe Sedento para Pacto da Lâmina e Rajada Agonizante).',
                            en: 'Your Pact Magic slots become 3rd level and your known Eldritch Invocations increase to 5.'
                        }
                    }
                ]
            },
            {
                level: 6,
                extra: { invocations: '5', pactSlots: '2', slotLevel: '3º' },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Sorte do Próprio Obscuro)', en: 'Subclass Feature (Dark One’s Own Luck)' },
                        desc: {
                            pt: 'Quando você fizer um teste de atributo ou salvaguarda, pode adicionar 1d10 ao resultado após ver o d20. Você pode usar isso um número de vezes igual ao seu Mod. de Carisma por Descanso Longo.',
                            en: 'When you make an ability check or a saving throw, you can add 1d10 to the roll after seeing the d20. Uses equal to your Charisma modifier per Long Rest.'
                        }
                    }
                ]
            },
            {
                level: 7,
                extra: { invocations: '6', pactSlots: '2', slotLevel: '4º' },
                features: [
                    {
                        name: { pt: '6 Invocações & Espaços de 4º Círculo', en: '6 Invocations & 4th-Level Pact Slots' },
                        desc: {
                            pt: 'Seus espaços de Magia de Pacto tornam-se de 4º círculo e suas Invocações sobem para 6.',
                            en: 'Your Pact Magic slots become 4th level and your known Invocations increase to 6.'
                        }
                    }
                ]
            },
            {
                level: 8,
                extra: { invocations: '6', pactSlots: '2', slotLevel: '4º' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 9,
                extra: { invocations: '7', pactSlots: '2', slotLevel: '5º' },
                features: [
                    {
                        name: { pt: 'Contatar Patrono (Contact Patron)', en: 'Contact Patron' },
                        desc: {
                            pt: 'Você tem a magia Contato Extraplanar sempre preparada e pode conjurá-la uma vez por Descanso Longo sem gastar espaço de magia para falar diretamente com seu Patrono (com sucesso automático na salvaguarda!).',
                            en: 'You always have Contact Other Plane prepared and can cast it once per Long Rest without expending a spell slot to contact your Patron (automatically succeeding on the saving throw).'
                        }
                    }
                ]
            },
            {
                level: 10,
                extra: { invocations: '7', pactSlots: '2', slotLevel: '5º' },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Resiliência Diabólica)', en: 'Subclass Feature (Fiendish Resilience)' },
                        desc: {
                            pt: 'Você escolhe um tipo de dano (exceto Energia/Force) sempre que terminar um Descanso Curto ou Longo e ganha Resistência a esse tipo de dano até escolher outro.',
                            en: 'Choose one damage type (other than Force) whenever you finish a Short or Long Rest. You have Resistance to that damage type until you choose a different one.'
                        }
                    }
                ]
            },
            {
                level: 11,
                extra: { invocations: '7', pactSlots: '3', slotLevel: '5º' },
                features: [
                    {
                        name: { pt: 'Arcana Mística (6º Círculo) & 3º Espaço de Pacto', en: 'Mystic Arcanum (6th Level) & 3rd Pact Slot' },
                        desc: {
                            pt: 'Seu patrono concede um segredo mágico chamado Arcana. Escolha uma magia de Bruxo de 6º círculo: você pode conjurá-la uma vez sem gastar espaço de magia por Descanso Longo. Além disso, você ganha seu 3º Espaço de Pacto.',
                            en: 'Choose one 6th-level Warlock spell as your Mystic Arcanum; you can cast it once per Long Rest without a spell slot. You also gain your 3rd Pact Magic slot.'
                        }
                    }
                ]
            },
            {
                level: 12,
                extra: { invocations: '8', pactSlots: '3', slotLevel: '5º' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha (e desbloqueia Golpe Devorador para Pacto da Lâmina).',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 13,
                extra: { invocations: '8', pactSlots: '3', slotLevel: '5º' },
                features: [
                    {
                        name: { pt: 'Arcana Mística (7º Círculo)', en: 'Mystic Arcanum (7th Level)' },
                        desc: {
                            pt: 'Escolha uma magia de Bruxo de 7º círculo como Arcana Mística, podendo conjurá-la 1x por Descanso Longo sem gastar espaço.',
                            en: 'Choose one 7th-level Warlock spell as a Mystic Arcanum (1/Long Rest without a slot).'
                        }
                    }
                ]
            },
            {
                level: 14,
                extra: { invocations: '8', pactSlots: '3', slotLevel: '5º' },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Lançar no Inferno)', en: 'Subclass Feature (Hurl Through Hell)' },
                        desc: {
                            pt: 'Uma vez por turno ao acertar uma criatura com um ataque, você pode forçá-la a uma salvaguarda de Carisma. Em uma falha, ela desaparece pelos planos inferiores até o final do seu próximo turno e sofre 8d10 de dano Psíquico ao retornar (recarrega em Descanso Longo ou gastando 1 espaço de Pacto).',
                            en: 'Once per turn when you hit a creature with an attack roll, force it to make a Charisma save. On a failure, it is banished through the Lower Planes until the end of your next turn and takes 8d10 Psychic damage (1/Long Rest or expend a Pact Magic slot).'
                        }
                    }
                ]
            },
            {
                level: 15,
                extra: { invocations: '9', pactSlots: '3', slotLevel: '5º' },
                features: [
                    {
                        name: { pt: 'Arcana Mística (8º Círculo)', en: 'Mystic Arcanum (8th Level)' },
                        desc: {
                            pt: 'Escolha uma magia de Bruxo de 8º círculo como Arcana Mística, podendo conjurá-la 1x por Descanso Longo sem gastar espaço.',
                            en: 'Choose one 8th-level Warlock spell as a Mystic Arcanum (1/Long Rest without a slot).'
                        }
                    }
                ]
            },
            {
                level: 16,
                extra: { invocations: '9', pactSlots: '3', slotLevel: '5º' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 17,
                extra: { invocations: '9', pactSlots: '4', slotLevel: '5º' },
                features: [
                    {
                        name: { pt: 'Arcana Mística (9º Círculo) & 4º Espaço de Pacto', en: 'Mystic Arcanum (9th Level) & 4th Pact Slot' },
                        desc: {
                            pt: 'Escolha uma magia de Bruxo de 9º círculo como Arcana Mística (1x por Descanso Longo) e receba seu 4º Espaço de Magia de Pacto.',
                            en: 'Choose one 9th-level Warlock spell as a Mystic Arcanum (1/Long Rest) and gain your 4th Pact Magic slot.'
                        }
                    }
                ]
            },
            {
                level: 18,
                extra: { invocations: '10', pactSlots: '4', slotLevel: '5º' },
                features: [
                    {
                        name: { pt: '10ª Invocação Mística', en: '10th Eldritch Invocation' },
                        desc: {
                            pt: 'Seu domínio oculto atinge 10 Invocações Místicas ativas simultaneamente.',
                            en: 'Your mastery of forbidden lore grants your 10th Eldritch Invocation.'
                        }
                    }
                ]
            },
            {
                level: 19,
                extra: { invocations: '10', pactSlots: '4', slotLevel: '5º' },
                features: [
                    {
                        name: { pt: 'Dádiva Épica', en: 'Epic Boon' },
                        desc: {
                            pt: 'Você recebe um talento de Dádiva Épica ou outro talento à sua escolha (+1 em um atributo, até 30).',
                            en: 'You gain an Epic Boon feat or another feat of your choice (+1 to an ability score, max 30).'
                        }
                    }
                ]
            },
            {
                level: 20,
                extra: { invocations: '10', pactSlots: '4', slotLevel: '5º' },
                features: [
                    {
                        name: { pt: 'Mestre Místico (Eldritch Master)', en: 'Eldritch Master' },
                        desc: {
                            pt: 'Quando você usa sua característica Astúcia Mágica, você recupera todos os seus 4 espaços gastos de Magia de Pacto em vez de apenas metade.',
                            en: 'When you use your Magical Cunning feature, you regain all 4 of your expended Pact Magic spell slots.'
                        }
                    }
                ]
            }
        ]
    },

    // ========================================================================
    // 4. CLÉRIGO (CLERIC)
    // ========================================================================
    {
        id: 'cleric',
        name: { pt: 'Clérigo', en: 'Cleric' },
        tagline: {
            pt: 'Um campeão devoto que empunha a magia divina dos planos superiores.',
            en: 'A priestly champion who wields divine magic in service of a higher power.'
        },
        hitDie: 'd8',
        core: {
            primaryAbility: { pt: 'Sabedoria', en: 'Wisdom' },
            hitPoints: {
                pt: '1d8 por nível de Clérigo (8 + Mod. CON no 1º nível; 1d8 [ou 5] + Mod. CON por nível seguinte)',
                en: '1d8 per Cleric level (8 + CON mod at 1st level; 1d8 [or 5] + CON mod per level after)'
            },
            savingThrows: { pt: 'Sabedoria e Carisma', en: 'Wisdom and Charisma' },
            skills: {
                pt: 'Escolha 2: História, Intuição, Medicina, Persuasão ou Religião',
                en: 'Choose 2: History, Insight, Medicine, Persuasion, or Religion'
            },
            weapons: { pt: 'Armas Simples (ou Marciais via Protetor)', en: 'Simple Weapons (or Martial via Protector)' },
            armor: { pt: 'Armaduras Leves, Médias e Escudos (ou Pesadas via Protetor)', en: 'Light and Medium Armor, Shields (or Heavy via Protector)' },
            tools: { pt: 'Nenhuma', en: 'None' },
            subclass: { pt: 'Domínio da Vida (SRD 5.5e)', en: 'Life Domain (SRD 5.5e)' }
        },
        extraColumns: [
            { key: 'channelDiv', label: { pt: 'Canal. Div.', en: 'Channel Div.' } },
            { key: 'prepared', label: { pt: 'Magias Prep.', en: 'Prepared' } },
            { key: 'slots', label: { pt: 'Espaços (1º–9º)', en: 'Spell Slots' } }
        ],
        levels: [
            {
                level: 1,
                extra: { channelDiv: '—', prepared: '4', slots: formatSlotsSummary(FULL_CASTER_SLOTS[0]) },
                features: [
                    {
                        name: { pt: 'Conjuração Divina', en: 'Spellcasting' },
                        desc: {
                            pt: 'Você conhece 3 truques e prepara 4 magias de 1º círculo da lista de Clérigo, usando Sabedoria como atributo de conjuração e um Símbolo Sagrado como foco.',
                            en: 'You know 3 cantrips and prepare 4 1st-level Cleric spells, using Wisdom as your spellcasting ability and a Holy Symbol as a focus.'
                        }
                    },
                    {
                        name: { pt: 'Ordem Divina (Divine Order)', en: 'Divine Order' },
                        desc: {
                            pt: 'Escolha um papel sagrado: Protetor (ganha proficiência com Armas Marciais e treinamento com Armaduras Pesadas) ou Taumaturgo (conhece 1 truque extra de Clérigo e soma seu Mod. de Sabedoria aos testes de Arcanismo e Religião).',
                            en: 'Choose a sacred role: Protector (proficiency with Martial weapons and training with Heavy armor) or Thaumaturge (know 1 extra Cleric cantrip and add your WIS modifier to Arcana and Religion checks).'
                        }
                    }
                ]
            },
            {
                level: 2,
                extra: { channelDiv: '2', prepared: '5', slots: formatSlotsSummary(FULL_CASTER_SLOTS[1]) },
                features: [
                    {
                        name: { pt: 'Canalizar Divindade (Channel Divinity)', en: 'Channel Divinity' },
                        desc: {
                            pt: 'Você canaliza energia divina diretamente dos planos exteriores (2 usos; recupera 1 uso em Descanso Curto e todos em Descanso Longo). Efeitos iniciais: Centelha Divina (cura ou causa 1d8 + Mod. SAB de dano Necrótico/Radiante a até 9m) e Expulsar Mortos-Vivos (mortos-vivos a até 9m ficam Amedrontados e Incapacitados por 1 minuto em falha de SAB).',
                            en: 'Channel divine energy from the Outer Planes (2 uses; regain 1 on a Short Rest, all on a Long Rest). Starting effects: Divine Spark (heal or deal 1d8 + WIS mod Radiant/Necrotic within 30 ft.) and Turn Undead (Undead within 30 ft. are Frightened and Incapacitated for 1 min on a failed WIS save).'
                        }
                    }
                ]
            },
            {
                level: 3,
                extra: { channelDiv: '2', prepared: '6', slots: formatSlotsSummary(FULL_CASTER_SLOTS[2]) },
                features: [
                    {
                        name: { pt: 'Subclasse de Clérigo (Domínio da Vida)', en: 'Cleric Subclass (Life Domain)' },
                        desc: {
                            pt: 'Discípulo da Vida: Quando você conjura uma magia de cura com espaço de magia, o alvo recupera PV adicionais iguais a 2 + o círculo do espaço. Preservar a Vida (Canalizar Divindade): Como ação de Magia, distribua uma reserva de cura igual a 5x seu nível de Clérigo entre criaturas feridas a até 9m (até metade dos PV máximos de cada uma).',
                            en: 'Disciple of Life: When a spell you cast with a spell slot restores HP, the creature regains extra HP equal to 2 + the spell slot level. Preserve Life (Channel Divinity): Distribute healing equal to 5x your Cleric level to Bloodied creatures within 30 ft. (up to half their max HP).'
                        }
                    }
                ]
            },
            {
                level: 4,
                extra: { channelDiv: '2', prepared: '7', slots: formatSlotsSummary(FULL_CASTER_SLOTS[3]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another General feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 5,
                extra: { channelDiv: '2', prepared: '9', slots: formatSlotsSummary(FULL_CASTER_SLOTS[4]) },
                features: [
                    {
                        name: { pt: 'Destruir Mortos-Vivos (Sear Undead)', en: 'Sear Undead' },
                        desc: {
                            pt: 'Sempre que você usar Expulsar Mortos-Vivos, você pode rolar um número de d8s igual ao seu Mod. de Sabedoria (mín. 1d8). Cada morto-vivo que falhar na salvaguarda sofre dano Radiante igual ao total rolado (esse dano não encerra o efeito de Expulsar!).',
                            en: 'Whenever you use Turn Undead, you can roll a number of d8s equal to your Wisdom modifier (min 1d8). Each Undead that fails its saving throw takes Radiant damage equal to the roll’s total (this damage doesn’t end the turn effect).'
                        }
                    }
                ]
            },
            {
                level: 6,
                extra: { channelDiv: '3', prepared: '10', slots: formatSlotsSummary(FULL_CASTER_SLOTS[5]) },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Curandeiro Abençoado)', en: 'Subclass Feature (Blessed Healer)' },
                        desc: {
                            pt: 'Quando você conjura uma magia com espaço de magia que restaura PV de outra criatura, você próprio recupera PV iguais a 2 + o círculo do espaço imediatamente após a magia.',
                            en: 'Immediately after you cast a spell with a spell slot that restores Hit Points to one or more creatures other than yourself, you regain Hit Points equal to 2 + the spell slot’s level.'
                        }
                    }
                ]
            },
            {
                level: 7,
                extra: { channelDiv: '3', prepared: '11', slots: formatSlotsSummary(FULL_CASTER_SLOTS[6]) },
                features: [
                    {
                        name: { pt: 'Golpes Abençoados (Blessed Strikes)', en: 'Blessed Strikes' },
                        desc: {
                            pt: 'Escolha entre Golpe Divino (1x por turno, seus ataques com arma causam +1d8 de dano Necrótico ou Radiante) ou Conjuração Potente (você adiciona seu Mod. de Sabedoria às rolagens de dano dos seus truques de Clérigo).',
                            en: 'Choose Divine Strike (once per turn, weapon hits deal an extra 1d8 Necrotic or Radiant damage) or Potent Spellcasting (add your Wisdom modifier to the damage you deal with any Cleric cantrip).'
                        }
                    }
                ]
            },
            {
                level: 8,
                extra: { channelDiv: '3', prepared: '12', slots: formatSlotsSummary(FULL_CASTER_SLOTS[7]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 9,
                extra: { channelDiv: '3', prepared: '14', slots: formatSlotsSummary(FULL_CASTER_SLOTS[8]) },
                features: [
                    {
                        name: { pt: 'Magias de 5º Círculo', en: '5th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia espaços de magia de 5º círculo (como Reviver os Mortos e Coluna de Chamas).',
                            en: 'You unlock 5th-level spell slots (such as Raise Dead and Flame Strike).'
                        }
                    }
                ]
            },
            {
                level: 10,
                extra: { channelDiv: '3', prepared: '15', slots: formatSlotsSummary(FULL_CASTER_SLOTS[9]) },
                features: [
                    {
                        name: { pt: 'Intervenção Divina (Divine Intervention)', en: 'Divine Intervention' },
                        desc: {
                            pt: 'Como ação de Magia, escolha qualquer magia de Clérigo de 5º círculo ou inferior que não exija Reação para ser conjurada. Você a conjura instantaneamente sem gastar espaço de magia e sem precisar de componentes Materiais (1x por Descanso Longo).',
                            en: 'As a Magic action, choose any Cleric spell of level 5 or lower that doesn’t require a Reaction to cast. You cast that spell without expending a spell slot or needing Material components (1/Long Rest).'
                        }
                    }
                ]
            },
            {
                level: 11,
                extra: { channelDiv: '3', prepared: '16', slots: formatSlotsSummary(FULL_CASTER_SLOTS[10]) },
                features: [
                    {
                        name: { pt: 'Magias de 6º Círculo', en: '6th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia magias de 6º círculo (como Cura Completa e Banquete dos Heróis).',
                            en: 'You unlock 6th-level spell slots (such as Heal and Heroes’ Feast).'
                        }
                    }
                ]
            },
            {
                level: 12,
                extra: { channelDiv: '3', prepared: '16', slots: formatSlotsSummary(FULL_CASTER_SLOTS[11]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 13,
                extra: { channelDiv: '3', prepared: '17', slots: formatSlotsSummary(FULL_CASTER_SLOTS[12]) },
                features: [
                    {
                        name: { pt: 'Magias de 7º Círculo', en: '7th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia magias de 7º círculo (como Ressurreição e Tempestade de Fogo).',
                            en: 'You unlock 7th-level spell slots (such as Resurrection and Fire Storm).'
                        }
                    }
                ]
            },
            {
                level: 14,
                extra: { channelDiv: '3', prepared: '17', slots: formatSlotsSummary(FULL_CASTER_SLOTS[13]) },
                features: [
                    {
                        name: { pt: 'Golpes Abençoados Aprimorados', en: 'Improved Blessed Strikes' },
                        desc: {
                            pt: 'Se você escolheu Golpe Divino, o dano extra sobe para 2d8. Se escolheu Conjuração Potente, ao causar dano com um truque de Clérigo, você concede PV Temporários iguais a 2x seu Mod. de Sabedoria a si mesmo ou a uma criatura a até 18m.',
                            en: 'Divine Strike extra damage increases to 2d8. Potent Spellcasting grants Temporary HP equal to twice your Wisdom modifier to yourself or an ally within 60 ft. whenever you deal damage with a Cleric cantrip.'
                        }
                    }
                ]
            },
            {
                level: 15,
                extra: { channelDiv: '3', prepared: '18', slots: formatSlotsSummary(FULL_CASTER_SLOTS[14]) },
                features: [
                    {
                        name: { pt: 'Magias de 8º Círculo', en: '8th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia magias de 8º círculo (como Aura Sagrada e Terremoto).',
                            en: 'You unlock 8th-level spell slots (such as Holy Aura and Earthquake).'
                        }
                    }
                ]
            },
            {
                level: 16,
                extra: { channelDiv: '3', prepared: '18', slots: formatSlotsSummary(FULL_CASTER_SLOTS[15]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 17,
                extra: { channelDiv: '3', prepared: '19', slots: formatSlotsSummary(FULL_CASTER_SLOTS[16]) },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Cura Suprema)', en: 'Subclass Feature (Supreme Healing)' },
                        desc: {
                            pt: 'Quando você normalmente rolaria um ou mais dados para restaurar Pontos de Vida de uma criatura com uma magia ou Canalizar Divindade, você não rola os dados: use o valor máximo possível para cada dado!',
                            en: 'When you would normally roll one or more dice to restore Hit Points to a creature with a spell or Channel Divinity, don’t roll those dice for the healing; instead use the highest number possible for each die!'
                        }
                    }
                ]
            },
            {
                level: 18,
                extra: { channelDiv: '4', prepared: '20', slots: formatSlotsSummary(FULL_CASTER_SLOTS[17]) },
                features: [
                    {
                        name: { pt: '4º Uso de Canalizar Divindade', en: '4th Channel Divinity Use' },
                        desc: {
                            pt: 'Seu limite de usos de Canalizar Divindade sobe para 4.',
                            en: 'You can now use Channel Divinity 4 times.'
                        }
                    }
                ]
            },
            {
                level: 19,
                extra: { channelDiv: '4', prepared: '21', slots: formatSlotsSummary(FULL_CASTER_SLOTS[18]) },
                features: [
                    {
                        name: { pt: 'Dádiva Épica', en: 'Epic Boon' },
                        desc: {
                            pt: 'Você recebe um talento de Dádiva Épica ou outro talento à sua escolha (+1 em um atributo, até 30).',
                            en: 'You gain an Epic Boon feat or another feat of your choice (+1 to an ability score, max 30).'
                        }
                    }
                ]
            },
            {
                level: 20,
                extra: { channelDiv: '4', prepared: '22', slots: formatSlotsSummary(FULL_CASTER_SLOTS[19]) },
                features: [
                    {
                        name: { pt: 'Intervenção Divina Maior', en: 'Greater Divine Intervention' },
                        desc: {
                            pt: 'Ao usar Intervenção Divina, você pode escolher a magia Desejo (Wish)! Se o fizer, não poderá usar Intervenção Divina novamente até completar 2d4 Descansos Longos.',
                            en: 'When you use Divine Intervention, you can choose Wish when you select a spell! If you do so, you can’t use Divine Intervention again until you finish 2d4 Long Rests.'
                        }
                    }
                ]
            }
        ]
    },

    // ========================================================================
    // 5. DRUIDA (DRUID)
    // ========================================================================
    {
        id: 'druid',
        name: { pt: 'Druida', en: 'Druid' },
        tagline: {
            pt: 'Um sacerdote da natureza que canaliza magia primal e assume formas de feras.',
            en: 'A priest of the Old Faith, wielding elemental forces and adopting animal forms.'
        },
        hitDie: 'd8',
        core: {
            primaryAbility: { pt: 'Sabedoria', en: 'Wisdom' },
            hitPoints: {
                pt: '1d8 por nível de Druida (8 + Mod. CON no 1º nível; 1d8 [ou 5] + Mod. CON por nível seguinte)',
                en: '1d8 per Druid level (8 + CON mod at 1st level; 1d8 [or 5] + CON mod per level after)'
            },
            savingThrows: { pt: 'Inteligência e Sabedoria', en: 'Intelligence and Wisdom' },
            skills: {
                pt: 'Escolha 2: Adestrar Animais, Arcanismo, Intuição, Medicina, Natureza, Percepção, Religião ou Sobrevivência',
                en: 'Choose 2: Animal Handling, Arcana, Insight, Medicine, Nature, Perception, Religion, or Survival'
            },
            weapons: { pt: 'Armas Simples (ou Marciais via Guardião)', en: 'Simple Weapons (or Martial via Warden)' },
            armor: { pt: 'Armaduras Leves e Escudos (ou Médias via Guardião)', en: 'Light Armor and Shields (or Medium via Warden)' },
            tools: { pt: 'Kit de Herbalismo', en: 'Herbalism Kit' },
            subclass: { pt: 'Círculo da Terra (SRD 5.5e)', en: 'Circle of the Land (SRD 5.5e)' }
        },
        extraColumns: [
            { key: 'wildShape', label: { pt: 'Forma Selv.', en: 'Wild Shape' } },
            { key: 'prepared', label: { pt: 'Magias Prep.', en: 'Prepared' } },
            { key: 'slots', label: { pt: 'Espaços (1º–9º)', en: 'Spell Slots' } }
        ],
        levels: [
            {
                level: 1,
                extra: { wildShape: '—', prepared: '4', slots: formatSlotsSummary(FULL_CASTER_SLOTS[0]) },
                features: [
                    {
                        name: { pt: 'Conjuração Primal & Druídico', en: 'Spellcasting & Druidic' },
                        desc: {
                            pt: 'Você conhece o idioma secreto Druídico, tem a magia Falar com Animais sempre preparada, conhece 2 truques e prepara 4 magias de Druida usando Sabedoria.',
                            en: 'You know the secret Druidic language, always have Speak with Animals prepared, know 2 cantrips, and prepare 4 Druid spells using Wisdom.'
                        }
                    },
                    {
                        name: { pt: 'Ordem Primal (Primal Order)', en: 'Primal Order' },
                        desc: {
                            pt: 'Escolha entre Xamã/Magician (1 truque extra de Druida e soma seu Mod. de Sabedoria aos testes de Arcanismo e Natureza) ou Guardião/Warden (proficiência com Armas Marciais e treinamento com Armaduras Médias).',
                            en: 'Choose Magician (know 1 extra Druid cantrip and add WIS mod to Arcana and Nature checks) or Warden (proficiency with Martial weapons and training with Medium armor).'
                        }
                    }
                ]
            },
            {
                level: 2,
                extra: { wildShape: '2', prepared: '5', slots: formatSlotsSummary(FULL_CASTER_SLOTS[1]) },
                features: [
                    {
                        name: { pt: 'Forma Selvagem (Wild Shape)', en: 'Wild Shape' },
                        desc: {
                            pt: 'Como Ação Bônus, você assume a forma de uma Fera conhecida (ND máx. 1/4 sem voo no 2º nível; ND 1/2 no 4º; ND 1 com voo no 8º) e ganha PV Temporários iguais ao seu nível de Druida. Você tem 2 usos (recupera 1 em Descanso Curto, todos em Longo) e pode converter espaços de magia em usos.',
                            en: 'As a Bonus Action, shape-shift into a known Beast form (max CR 1/4 no fly at lvl 2; CR 1/2 at lvl 4; CR 1 with fly at lvl 8) and gain Temp HP equal to your Druid level (2 uses; regain 1 on Short Rest, all on Long Rest).'
                        }
                    },
                    {
                        name: { pt: 'Companheiro Selvagem', en: 'Wild Companion' },
                        desc: {
                            pt: 'Como ação de Magia, você pode gastar um espaço de magia ou 1 uso de Forma Selvagem para conjurar Encontrar Familiar sem componentes materiais (o familiar é uma Fada e permanece até seu próximo Descanso Longo).',
                            en: 'As a Magic action, expend a spell slot or a use of Wild Shape to cast Find Familiar without Material components (the familiar is Fey and disappears when you finish a Long Rest).'
                        }
                    }
                ]
            },
            {
                level: 3,
                extra: { wildShape: '2', prepared: '6', slots: formatSlotsSummary(FULL_CASTER_SLOTS[2]) },
                features: [
                    {
                        name: { pt: 'Subclasse de Druida (Círculo da Terra)', en: 'Druid Subclass (Circle of the Land)' },
                        desc: {
                            pt: 'Auxílio da Terra (Land’s Aid): Como ação de Magia, gaste 1 Forma Selvagem para criar uma esfera de 3m a até 18m: inimigos sofrem 2d6 de dano Necrótico (salvaguarda de CON) e um aliado recupera 2d6 PV. Além disso, após cada Descanso Longo, você escolhe o tipo de terra (Árida, Polar, Temperada ou Tropical) para preparar magias exclusivas.',
                            en: 'Land’s Aid: Expend a Wild Shape use to create a 10-ft.-radius sphere within 60 ft.: enemies take 2d6 Necrotic damage (CON save) and one ally regains 2d6 HP. Choose Arid, Polar, Temperate, or Tropical land each Long Rest for bonus prepared spells.'
                        }
                    }
                ]
            },
            {
                level: 4,
                extra: { wildShape: '2', prepared: '7', slots: formatSlotsSummary(FULL_CASTER_SLOTS[3]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo & Forma Selvagem ND 1/2', en: 'Ability Score Improvement & CR 1/2 Wild Shape' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral, e o ND máximo das suas Formas Selvagens sobe para 1/2.',
                            en: 'You gain the Ability Score Improvement feat or another feat, and your Wild Shape max CR increases to 1/2.'
                        }
                    }
                ]
            },
            {
                level: 5,
                extra: { wildShape: '2', prepared: '9', slots: formatSlotsSummary(FULL_CASTER_SLOTS[4]) },
                features: [
                    {
                        name: { pt: 'Ressurgimento Selvagem (Wild Resurgence)', en: 'Wild Resurgence' },
                        desc: {
                            pt: 'Uma vez no seu turno, se não tiver usos de Forma Selvagem restantes, você pode gastar um espaço de magia (sem ação) para ganhar 1 uso. Além disso, pode gastar 1 uso de Forma Selvagem para recuperar 1 espaço de magia de 1º círculo (1x por Descanso Longo).',
                            en: 'If you have no uses of Wild Shape left, you can give yourself one use by expending a spell slot (no action). You can also expend one use of Wild Shape to give yourself a level 1 spell slot (1/Long Rest).'
                        }
                    }
                ]
            },
            {
                level: 6,
                extra: { wildShape: '3', prepared: '10', slots: formatSlotsSummary(FULL_CASTER_SLOTS[5]) },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Recuperação Natural)', en: 'Subclass Feature (Natural Recovery)' },
                        desc: {
                            pt: 'Você pode conjurar uma das magias do seu Círculo da Terra sem gastar espaço de magia (1x por Descanso Longo). Além disso, durante um Descanso Curto, pode recuperar espaços de magia cujo nível somado seja igual ou menor que metade do seu nível de Druida (arredondado para cima).',
                            en: 'Cast one of your Circle of the Land spells without expending a spell slot (1/Long Rest), and recover expended spell slots during a Short Rest with a combined level up to half your Druid level (round up).'
                        }
                    }
                ]
            },
            {
                level: 7,
                extra: { wildShape: '3', prepared: '11', slots: formatSlotsSummary(FULL_CASTER_SLOTS[6]) },
                features: [
                    {
                        name: { pt: 'Fúria Elemental (Elemental Fury)', en: 'Elemental Fury' },
                        desc: {
                            pt: 'Escolha entre Conjuração Potente (adiciona seu Mod. de Sabedoria ao dano dos seus truques de Druida) ou Golpe Primal (1x por turno, seus ataques com armas ou ataques de Fera em Forma Selvagem causam +1d8 de dano de Frio, Fogo, Elétrico ou Trovejante).',
                            en: 'Choose Potent Spellcasting (add Wisdom modifier to Druid cantrip damage) or Primal Strike (once per turn, weapon or Beast attacks in Wild Shape deal an extra 1d8 Cold, Fire, Lightning, or Thunder damage).'
                        }
                    }
                ]
            },
            {
                level: 8,
                extra: { wildShape: '3', prepared: '12', slots: formatSlotsSummary(FULL_CASTER_SLOTS[7]) },
                features: [
                    {
                        name: { pt: 'Incremento de Atributo & Forma Selvagem ND 1 (com Voo)', en: 'Ability Score Improvement & CR 1 Flying Wild Shape' },
                        desc: {
                            pt: 'Você recebe um Talento/Incremento de Atributo, e o ND máximo das suas Formas Selvagens sobe para 1 (agora permitindo formas com Deslocamento de Voo!).',
                            en: 'You gain an Ability Score Improvement or feat, and your Wild Shape max CR increases to 1 (now allowing forms with a Fly Speed!).'
                        }
                    }
                ]
            },
            {
                level: 9,
                extra: { wildShape: '3', prepared: '14', slots: formatSlotsSummary(FULL_CASTER_SLOTS[8]) },
                features: [
                    {
                        name: { pt: 'Magias de 5º Círculo', en: '5th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia espaços de magia de 5º círculo.',
                            en: 'You unlock 5th-level spell slots.'
                        }
                    }
                ]
            },
            {
                level: 10,
                extra: { wildShape: '3', prepared: '15', slots: formatSlotsSummary(FULL_CASTER_SLOTS[9]) },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Proteção da Natureza)', en: 'Subclass Feature (Nature’s Ward)' },
                        desc: {
                            pt: 'Você é imune à condição Envenenado e você tem Resistência ao tipo de dano associado à sua escolha atual de Terra (Fogo para Árida, Frio para Polar, Elétrico para Temperada ou Venenoso para Tropical).',
                            en: 'You are immune to the Poisoned condition, and you have Resistance to a damage type associated with your current land choice (Fire, Cold, Lightning, or Poison).'
                        }
                    }
                ]
            },
            {
                level: 11,
                extra: { wildShape: '3', prepared: '16', slots: formatSlotsSummary(FULL_CASTER_SLOTS[10]) },
                features: [
                    {
                        name: { pt: 'Magias de 6º Círculo', en: '6th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia espaços de magia de 6º círculo.',
                            en: 'You unlock 6th-level spell slots.'
                        }
                    }
                ]
            },
            {
                level: 12,
                extra: { wildShape: '3', prepared: '16', slots: formatSlotsSummary(FULL_CASTER_SLOTS[11]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 13,
                extra: { wildShape: '3', prepared: '17', slots: formatSlotsSummary(FULL_CASTER_SLOTS[12]) },
                features: [
                    {
                        name: { pt: 'Magias de 7º Círculo', en: '7th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia espaços de magia de 7º círculo.',
                            en: 'You unlock 7th-level spell slots.'
                        }
                    }
                ]
            },
            {
                level: 14,
                extra: { wildShape: '3', prepared: '17', slots: formatSlotsSummary(FULL_CASTER_SLOTS[13]) },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Santuário da Natureza)', en: 'Subclass Feature (Nature’s Sanctuary)' },
                        desc: {
                            pt: 'Como ação de Magia, gaste 1 uso de Forma Selvagem para fazer surgir vinhas e árvores espectrais em um Cubo de 4,5m a até 36m por 1 minuto. Você e seus aliados na área ganham Meia Cobertura (+2 CA e DES) e a Resistência elemental atual da sua Proteção da Natureza.',
                            en: 'Expend a Wild Shape use to cause spectral trees and vines to appear in a 15-foot Cube within 120 feet for 1 minute. You and your allies have Half Cover while in the area and gain the current damage Resistance of your Nature’s Ward.'
                        }
                    }
                ]
            },
            {
                level: 15,
                extra: { wildShape: '3', prepared: '18', slots: formatSlotsSummary(FULL_CASTER_SLOTS[14]) },
                features: [
                    {
                        name: { pt: 'Fúria Elemental Aprimorada', en: 'Improved Elemental Fury' },
                        desc: {
                            pt: 'Se você escolheu Conjuração Potente, o alcance dos seus truques de Druida com alcance de 3m ou mais aumenta em +90 metros (300 ft.). Se escolheu Golpe Primal, o dano extra elemental sobe para 2d8.',
                            en: 'Potent Spellcasting increases the range of Druid cantrips (with 10+ ft. range) by 300 feet. Primal Strike extra elemental damage increases to 2d8.'
                        }
                    }
                ]
            },
            {
                level: 16,
                extra: { wildShape: '3', prepared: '18', slots: formatSlotsSummary(FULL_CASTER_SLOTS[15]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 17,
                extra: { wildShape: '4', prepared: '19', slots: formatSlotsSummary(FULL_CASTER_SLOTS[16]) },
                features: [
                    {
                        name: { pt: '4º Uso de Forma Selvagem & 9º Círculo', en: '4th Wild Shape Use & 9th-Level Spells' },
                        desc: {
                            pt: 'Seus usos de Forma Selvagem sobem para 4 e você desbloqueia magias de 9º círculo.',
                            en: 'Your Wild Shape uses increase to 4 and you unlock 9th-level spell slots.'
                        }
                    }
                ]
            },
            {
                level: 18,
                extra: { wildShape: '4', prepared: '20', slots: formatSlotsSummary(FULL_CASTER_SLOTS[17]) },
                features: [
                    {
                        name: { pt: 'Magias da Fera (Beast Spells)', en: 'Beast Spells' },
                        desc: {
                            pt: 'Enquanto estiver usando Forma Selvagem, você pode conjurar magias em forma de Fera, exceto aquelas que possuem componente Material com custo indicado ou que seja consumido.',
                            en: 'While using Wild Shape, you can cast spells in Beast form, except for any spell that has a Material component with a cost specified or that consumes its Material component.'
                        }
                    }
                ]
            },
            {
                level: 19,
                extra: { wildShape: '4', prepared: '21', slots: formatSlotsSummary(FULL_CASTER_SLOTS[18]) },
                features: [
                    {
                        name: { pt: 'Dádiva Épica', en: 'Epic Boon' },
                        desc: {
                            pt: 'Você recebe um talento de Dádiva Épica ou outro talento à sua escolha (+1 em um atributo, até 30).',
                            en: 'You gain an Epic Boon feat or another feat of your choice (+1 to an ability score, max 30).'
                        }
                    }
                ]
            },
            {
                level: 20,
                extra: { wildShape: '4', prepared: '22', slots: formatSlotsSummary(FULL_CASTER_SLOTS[19]) },
                features: [
                    {
                        name: { pt: 'Arquidruida (Archdruid)', en: 'Archdruid' },
                        desc: {
                            pt: 'Forma Selvagem Perene: Sempre que rolar Iniciativa e não tiver usos de Forma Selvagem, você recupera 1 uso. Mago da Natureza: Você pode converter usos de Forma Selvagem em um único espaço de magia (cada uso vale 2 círculos de magia, 1x por Descanso Longo). Longevidade: Você envelhece 10x mais devagar.',
                            en: 'Evergreen Wild Shape: Regain 1 expended use when rolling Initiative with 0 uses. Nature Magician: Convert Wild Shape uses into a spell slot (each use = 2 spell levels, 1/Long Rest). Longevity: Age 10x slower.'
                        }
                    }
                ]
            }
        ]
    },

    // ========================================================================
    // 6. FEITICEIRO (SORCERER)
    // ========================================================================
    {
        id: 'sorcerer',
        name: { pt: 'Feiticeiro', en: 'Sorcerer' },
        tagline: {
            pt: 'Um conjurador cujo sangue ou alma transborda com poder arcano inato.',
            en: 'A spellcaster who draws on inherent magic from a gift or bloodline.'
        },
        hitDie: 'd6',
        core: {
            primaryAbility: { pt: 'Carisma', en: 'Charisma' },
            hitPoints: {
                pt: '1d6 por nível de Feiticeiro (6 + Mod. CON no 1º nível; 1d6 [ou 4] + Mod. CON por nível seguinte)',
                en: '1d6 per Sorcerer level (6 + CON mod at 1st level; 1d6 [or 4] + CON mod per level after)'
            },
            savingThrows: { pt: 'Constituição e Carisma', en: 'Constitution and Charisma' },
            skills: {
                pt: 'Escolha 2: Arcanismo, Enganação, Intimidação, Intuição, Persuasão ou Religião',
                en: 'Choose 2: Arcana, Deception, Insight, Intimidation, Persuasion, or Religion'
            },
            weapons: { pt: 'Armas Simples', en: 'Simple Weapons' },
            armor: { pt: 'Nenhuma', en: 'None' },
            tools: { pt: 'Nenhuma', en: 'None' },
            subclass: { pt: 'Feitiçaria Dracônica (SRD 5.5e)', en: 'Draconic Sorcery (SRD 5.5e)' }
        },
        extraColumns: [
            { key: 'sorceryPts', label: { pt: 'Pts. Feit.', en: 'Sorcery Pts' } },
            { key: 'prepared', label: { pt: 'Magias Prep.', en: 'Prepared' } },
            { key: 'slots', label: { pt: 'Espaços (1º–9º)', en: 'Spell Slots' } }
        ],
        levels: [
            {
                level: 1,
                extra: { sorceryPts: '—', prepared: '2', slots: formatSlotsSummary(FULL_CASTER_SLOTS[0]) },
                features: [
                    {
                        name: { pt: 'Conjuração', en: 'Spellcasting' },
                        desc: {
                            pt: 'Você conhece 4 truques e prepara 2 magias de 1º círculo da lista de Feiticeiro, usando Carisma como atributo de conjuração.',
                            en: 'You know 4 cantrips and prepare 2 1st-level Sorcerer spells, using Charisma as your spellcasting ability.'
                        }
                    },
                    {
                        name: { pt: 'Feitiçaria Inata (Innate Sorcery)', en: 'Innate Sorcery' },
                        desc: {
                            pt: 'Como Ação Bônus, você libera sua magia interior por 1 minuto: a CD das suas magias de Feiticeiro aumenta em +1 e você tem Vantagem nas jogadas de ataque das magias de Feiticeiro que conjurar (2 usos por Descanso Longo).',
                            en: 'As a Bonus Action, unleash your innate magic for 1 minute: the spell save DC of your Sorcerer spells increases by 1, and you have Advantage on the attack rolls of Sorcerer spells you cast (2 uses per Long Rest).'
                        }
                    }
                ]
            },
            {
                level: 2,
                extra: { sorceryPts: '2', prepared: '4', slots: formatSlotsSummary(FULL_CASTER_SLOTS[1]) },
                features: [
                    {
                        name: { pt: 'Fonte de Magia (Font of Magic)', en: 'Font of Magic' },
                        desc: {
                            pt: 'Você ganha Pontos de Feitiçaria iguais ao seu nível de Feiticeiro. Você pode converter espaços de magia em Pontos de Feitiçaria (sem ação) ou criar espaços de magia de 1º a 5º círculo como Ação Bônus.',
                            en: 'You have Sorcery Points equal to your Sorcerer level. You can convert spell slots into Sorcery Points (no action) or create spell slots of levels 1–5 as a Bonus Action.'
                        }
                    },
                    {
                        name: { pt: 'Metamagia', en: 'Metamagic' },
                        desc: {
                            pt: 'Você escolhe 2 opções de Metamagia para dobrar suas magias aos seus desejos (ex: Magia Acelerada, Magia Cuidadosa, Magia Duplicada, Magia Sutil, Magia Potencializada).',
                            en: 'You gain 2 Metamagic options of your choice to twist your spells to suit your needs (such as Quickened, Careful, Twinned, Subtle, or Empowered Spell).'
                        }
                    }
                ]
            },
            {
                level: 3,
                extra: { sorceryPts: '3', prepared: '6', slots: formatSlotsSummary(FULL_CASTER_SLOTS[2]) },
                features: [
                    {
                        name: { pt: 'Subclasse de Feiticeiro (Feitiçaria Dracônica)', en: 'Sorcerer Subclass (Draconic Sorcery)' },
                        desc: {
                            pt: 'Resiliência Dracônica: Seus PV máximos aumentam em +3 (+1 por nível seguinte), e enquanto não usar armadura, sua CA base é 10 + Mod. DES + Mod. CAR! Inclui magias dracônicas sempre preparadas (como Orbe Cromático e Sopro de Dragão).',
                            en: 'Draconic Resilience: Your HP maximum increases by 3 (+1 per level after), and while not wearing armor, your base AC equals 10 + DEX mod + CHA mod! Includes always-prepared Draconic spells.'
                        }
                    }
                ]
            },
            {
                level: 4,
                extra: { sorceryPts: '4', prepared: '7', slots: formatSlotsSummary(FULL_CASTER_SLOTS[3]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another General feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 5,
                extra: { sorceryPts: '5', prepared: '9', slots: formatSlotsSummary(FULL_CASTER_SLOTS[4]) },
                features: [
                    {
                        name: { pt: 'Restauração Feiticeira (Sorcerous Restoration)', en: 'Sorcerous Restoration' },
                        desc: {
                            pt: 'Ao terminar um Descanso Curto, você pode recuperar Pontos de Feitiçaria gastos até um número igual à metade do seu nível de Feiticeiro (arredondado para baixo). Uma vez por Descanso Longo.',
                            en: 'When you finish a Short Rest, you can regain expended Sorcery Points up to half your Sorcerer level (round down). Once per Long Rest.'
                        }
                    }
                ]
            },
            {
                level: 6,
                extra: { sorceryPts: '6', prepared: '10', slots: formatSlotsSummary(FULL_CASTER_SLOTS[5]) },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Afinidade Elemental)', en: 'Subclass Feature (Elemental Affinity)' },
                        desc: {
                            pt: 'Escolha um tipo de dano dracônico (Ácido, Frio, Fogo, Elétrico ou Venenoso): você tem Resistência a esse tipo de dano, e quando conjurar uma magia que cause esse tipo de dano, pode somar seu Mod. de Carisma a uma rolagem de dano dessa magia.',
                            en: 'Choose Acid, Cold, Fire, Lightning, or Poison: you have Resistance to that damage type, and when you cast a spell that deals damage of that type, you can add your Charisma modifier to one damage roll of that spell.'
                        }
                    }
                ]
            },
            {
                level: 7,
                extra: { sorceryPts: '7', prepared: '11', slots: formatSlotsSummary(FULL_CASTER_SLOTS[6]) },
                features: [
                    {
                        name: { pt: 'Feitiçaria Encarnada (Sorcery Incarnate)', en: 'Sorcery Incarnate' },
                        desc: {
                            pt: 'Se você não tiver usos restantes de Feitiçaria Inata, pode ativá-la gastando 2 Pontos de Feitiçaria. Além disso, enquanto sua Feitiçaria Inata estiver ativa, você pode usar até 2 opções de Metamagia em cada magia que conjurar!',
                            en: 'If you have no uses of Innate Sorcery left, you can use it by spending 2 Sorcery Points. While your Innate Sorcery is active, you can use up to two of your Metamagic options on each spell you cast.'
                        }
                    }
                ]
            },
            {
                level: 8,
                extra: { sorceryPts: '8', prepared: '12', slots: formatSlotsSummary(FULL_CASTER_SLOTS[7]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 9,
                extra: { sorceryPts: '9', prepared: '14', slots: formatSlotsSummary(FULL_CASTER_SLOTS[8]) },
                features: [
                    {
                        name: { pt: 'Magias de 5º Círculo', en: '5th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia espaços de magia de 5º círculo.',
                            en: 'You unlock 5th-level spell slots.'
                        }
                    }
                ]
            },
            {
                level: 10,
                extra: { sorceryPts: '10', prepared: '15', slots: formatSlotsSummary(FULL_CASTER_SLOTS[9]) },
                features: [
                    {
                        name: { pt: '+2 Opções de Metamagia', en: '2 Additional Metamagic Options' },
                        desc: {
                            pt: 'Você aprende mais 2 opções de Metamagia à sua escolha (totalizando 4).',
                            en: 'You learn 2 more Metamagic options of your choice (4 total).'
                        }
                    }
                ]
            },
            {
                level: 11,
                extra: { sorceryPts: '11', prepared: '16', slots: formatSlotsSummary(FULL_CASTER_SLOTS[10]) },
                features: [
                    {
                        name: { pt: 'Magias de 6º Círculo', en: '6th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia espaços de magia de 6º círculo.',
                            en: 'You unlock 6th-level spell slots.'
                        }
                    }
                ]
            },
            {
                level: 12,
                extra: { sorceryPts: '12', prepared: '16', slots: formatSlotsSummary(FULL_CASTER_SLOTS[11]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 13,
                extra: { sorceryPts: '13', prepared: '17', slots: formatSlotsSummary(FULL_CASTER_SLOTS[12]) },
                features: [
                    {
                        name: { pt: 'Magias de 7º Círculo', en: '7th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia espaços de magia de 7º círculo.',
                            en: 'You unlock 7th-level spell slots.'
                        }
                    }
                ]
            },
            {
                level: 14,
                extra: { sorceryPts: '14', prepared: '17', slots: formatSlotsSummary(FULL_CASTER_SLOTS[13]) },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Asas de Dragão)', en: 'Subclass Feature (Dragon Wings)' },
                        desc: {
                            pt: 'Como Ação Bônus, você manifesta asas dracônicas nas costas e ganha Deslocamento de Voo de 18 metros (60 ft.) por 1 hora (1x por Descanso Longo ou gastando 3 Pontos de Feitiçaria).',
                            en: 'As a Bonus Action, cause draconic wings to appear on your back, gaining a Fly Speed of 60 feet for 1 hour (1/Long Rest or spend 3 Sorcery Points).'
                        }
                    }
                ]
            },
            {
                level: 15,
                extra: { sorceryPts: '15', prepared: '18', slots: formatSlotsSummary(FULL_CASTER_SLOTS[14]) },
                features: [
                    {
                        name: { pt: 'Magias de 8º Círculo', en: '8th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia espaços de magia de 8º círculo.',
                            en: 'You unlock 8th-level spell slots.'
                        }
                    }
                ]
            },
            {
                level: 16,
                extra: { sorceryPts: '16', prepared: '18', slots: formatSlotsSummary(FULL_CASTER_SLOTS[15]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 17,
                extra: { sorceryPts: '17', prepared: '19', slots: formatSlotsSummary(FULL_CASTER_SLOTS[16]) },
                features: [
                    {
                        name: { pt: '+2 Opções de Metamagia & 9º Círculo', en: '2 Additional Metamagic Options & 9th-Level Spells' },
                        desc: {
                            pt: 'Você aprende mais 2 opções de Metamagia (totalizando 6) e desbloqueia magias de 9º círculo.',
                            en: 'You learn 2 more Metamagic options (6 total) and unlock 9th-level spell slots.'
                        }
                    }
                ]
            },
            {
                level: 18,
                extra: { sorceryPts: '18', prepared: '20', slots: formatSlotsSummary(FULL_CASTER_SLOTS[17]) },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Companheiro Dracônico)', en: 'Subclass Feature (Dragon Companion)' },
                        desc: {
                            pt: 'Você pode conjurar Invocar Dragão sem componentes materiais, e pode conjurá-la 1x por Descanso Longo sem gastar espaço de magia. Além disso, ao conjurá-la, você pode modificar a magia para não exigir Concentração (durando 1 minuto).',
                            en: 'You can cast Summon Dragon without a Material component (and once per Long Rest without a spell slot). When you cast it, you can modify it so it doesn’t require Concentration (duration becomes 1 minute).'
                        }
                    }
                ]
            },
            {
                level: 19,
                extra: { sorceryPts: '19', prepared: '21', slots: formatSlotsSummary(FULL_CASTER_SLOTS[18]) },
                features: [
                    {
                        name: { pt: 'Dádiva Épica', en: 'Epic Boon' },
                        desc: {
                            pt: 'Você recebe um talento de Dádiva Épica ou outro talento à sua escolha (+1 em um atributo, até 30).',
                            en: 'You gain an Epic Boon feat or another feat of your choice (+1 to an ability score, max 30).'
                        }
                    }
                ]
            },
            {
                level: 20,
                extra: { sorceryPts: '20', prepared: '22', slots: formatSlotsSummary(FULL_CASTER_SLOTS[19]) },
                features: [
                    {
                        name: { pt: 'Apoteose Arcana (Arcane Apotheosis)', en: 'Arcane Apotheosis' },
                        desc: {
                            pt: 'Enquanto sua Feitiçaria Inata estiver ativa, você pode usar uma opção de Metamagia em cada um dos seus turnos sem gastar nenhum Ponto de Feitiçaria nela!',
                            en: 'While your Innate Sorcery feature is active, you can use one Metamagic option on each of your turns without spending Sorcery Points on it!'
                        }
                    }
                ]
            }
        ]
    },

    // ========================================================================
    // 7. GUARDIÃO / PATRULHEIRO (RANGER)
    // ========================================================================
    {
        id: 'ranger',
        name: { pt: 'Guardião (Patrulheiro)', en: 'Ranger' },
        tagline: {
            pt: 'Um caçador incansável que combina precisão marcial e magia primal nas fronteiras.',
            en: 'A wandering warrior who uses martial prowess and primal magic to protect the wilds.'
        },
        hitDie: 'd10',
        core: {
            primaryAbility: { pt: 'Destreza e Sabedoria', en: 'Dexterity and Wisdom' },
            hitPoints: {
                pt: '1d10 por nível de Guardião (10 + Mod. CON no 1º nível; 1d10 [ou 6] + Mod. CON por nível seguinte)',
                en: '1d10 per Ranger level (10 + CON mod at 1st level; 1d10 [or 6] + CON mod per level after)'
            },
            savingThrows: { pt: 'Força e Destreza', en: 'Strength and Dexterity' },
            skills: {
                pt: 'Escolha 3: Adestrar Animais, Atletismo, Furtividade, Intuição, Investigação, Natureza, Percepção ou Sobrevivência',
                en: 'Choose 3: Animal Handling, Athletics, Insight, Investigation, Nature, Perception, Stealth, or Survival'
            },
            weapons: { pt: 'Armas Simples e Marciais', en: 'Simple and Martial Weapons' },
            armor: { pt: 'Armaduras Leves, Médias e Escudos', en: 'Light and Medium Armor, Shields' },
            tools: { pt: 'Nenhuma', en: 'None' },
            subclass: { pt: 'Caçador / Hunter (SRD 5.5e)', en: 'Hunter (SRD 5.5e)' }
        },
        extraColumns: [
            { key: 'favoredEnemy', label: { pt: 'Inim. Fav.', en: 'Fav. Enemy' } },
            { key: 'prepared', label: { pt: 'Magias Prep.', en: 'Prepared' } },
            { key: 'slots', label: { pt: 'Espaços (1º–5º)', en: 'Spell Slots' } }
        ],
        levels: [
            {
                level: 1,
                extra: { favoredEnemy: '2', prepared: '2', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[0]) },
                features: [
                    {
                        name: { pt: 'Conjuração & Maestria em Armas (2)', en: 'Spellcasting & Weapon Mastery (2)' },
                        desc: {
                            pt: 'No D&D 5.5e, o Guardião conjura magias desde o 1º nível (2 magias preparadas usando Sabedoria) e domina as propriedades de Maestria de 2 armas à sua escolha.',
                            en: 'You prepare 2 1st-level Ranger spells using Wisdom right at level 1, and can use the Weapon Mastery properties of 2 weapons of your choice.'
                        }
                    },
                    {
                        name: { pt: 'Inimigo Favorito (Favored Enemy)', en: 'Favored Enemy' },
                        desc: {
                            pt: 'Você sempre tem a magia Marca do Caçador (Hunter’s Mark) preparada e pode conjurá-la 2 vezes (subindo até 6x nos níveis seguintes) sem gastar espaço de magia por Descanso Longo.',
                            en: 'You always have the Hunter’s Mark spell prepared and can cast it without expending a spell slot a number of times shown in theFavored Enemy column per Long Rest.'
                        }
                    }
                ]
            },
            {
                level: 2,
                extra: { favoredEnemy: '2', prepared: '3', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[1]) },
                features: [
                    {
                        name: { pt: 'Explorador Hábil (Deft Explorer)', en: 'Deft Explorer' },
                        desc: {
                            pt: 'Você ganha Especialização (Expertise) em uma das suas perícias nas quais tem proficiência, e aprende 2 idiomas à sua escolha.',
                            en: 'You gain Expertise in one of your skill proficiencies and learn two languages of your choice.'
                        }
                    },
                    {
                        name: { pt: 'Estilo de Luta', en: 'Fighting Style' },
                        desc: {
                            pt: 'Você recebe um talento de Estilo de Luta à sua escolha (ex: Arquearia, Combate com Duas Armas, Defesa) ou o estilo Guerreiro Druídico (2 truques de Druida).',
                            en: 'You gain a Fighting Style feat of your choice (such as Archery, Defense, Two-Weapon Fighting) or Druidic Warrior (2 Druid cantrips).'
                        }
                    }
                ]
            },
            {
                level: 3,
                extra: { favoredEnemy: '2', prepared: '4', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[2]) },
                features: [
                    {
                        name: { pt: 'Subclasse de Guardião (Caçador / Hunter)', en: 'Ranger Subclass (Hunter)' },
                        desc: {
                            pt: 'Conhecimento do Caçador: Quando uma criatura estiver marcada por sua Marca do Caçador, você descobre todas as Imunidades, Resistências e Vulnerabilidades dela. Presa do Caçador: Escolha entre Matador de Colossos (+1d8 de dano 1x/turno contra alvo ferido) ou Quebrador de Hordas (ataque extra gratuito contra outra criatura a 1,5m do alvo). Você pode trocar a opção em um Descanso Curto ou Longo.',
                            en: 'Hunter’s Lore: Know all Immunities, Resistances, and Vulnerabilities of a creature marked by your Hunter’s Mark. Hunter’s Prey: Choose Colossus Slayer (+1d8 damage 1/turn against a target missing HP) or Horde Breaker (free attack against a second creature within 5 ft.).'
                        }
                    }
                ]
            },
            {
                level: 4,
                extra: { favoredEnemy: '2', prepared: '5', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[3]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another General feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 5,
                extra: { favoredEnemy: '3', prepared: '6', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[4]) },
                features: [
                    {
                        name: { pt: 'Ataque Extra', en: 'Extra Attack' },
                        desc: {
                            pt: 'Você pode atacar duas vezes, em vez de uma, sempre que realizar a ação de Ataque no seu turno.',
                            en: 'You can attack twice instead of once whenever you take the Attack action on your turn.'
                        }
                    }
                ]
            },
            {
                level: 6,
                extra: { favoredEnemy: '3', prepared: '6', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[5]) },
                features: [
                    {
                        name: { pt: 'Andarilho (Roving)', en: 'Roving' },
                        desc: {
                            pt: 'Seu deslocamento aumenta em 3 metros (10 ft.) enquanto você não estiver vestindo armadura pesada. Você também ganha Deslocamento de Escalada e Deslocamento de Natação iguais ao seu deslocamento normal.',
                            en: 'Your Speed increases by 10 feet while you aren’t wearing Heavy armor. You also have a Climb Speed and a Swim Speed equal to your Speed.'
                        }
                    }
                ]
            },
            {
                level: 7,
                extra: { favoredEnemy: '3', prepared: '7', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[6]) },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Táticas Defensivas)', en: 'Subclass Feature (Defensive Tactics)' },
                        desc: {
                            pt: 'Escolha entre Escapar da Horda (Ataques de Oportunidade contra você têm Desvantagem) ou Defesa contra Ataques Múltiplos (quando uma criatura acertar você, todos os outros ataques dela contra você nesse turno têm Desvantagem). Pode trocar em Descanso Curto ou Longo.',
                            en: 'Choose Escape the Horde (Opportunity Attacks made against you have Disadvantage) or Multiattack Defense (when a creature hits you, it has Disadvantage on all other attack rolls against you that turn).'
                        }
                    }
                ]
            },
            {
                level: 8,
                extra: { favoredEnemy: '3', prepared: '7', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[7]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 9,
                extra: { favoredEnemy: '4', prepared: '9', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[8]) },
                features: [
                    {
                        name: { pt: 'Especialização (2 Novas Perícias)', en: 'Expertise (2 Additional Skills)' },
                        desc: {
                            pt: 'Escolha mais 2 perícias nas quais você tem proficiência para dobrar o seu Bônus de Proficiência.',
                            en: 'Choose 2 more of your skill proficiencies to gain Expertise.'
                        }
                    }
                ]
            },
            {
                level: 10,
                extra: { favoredEnemy: '4', prepared: '9', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[9]) },
                features: [
                    {
                        name: { pt: 'Incansável (Tireless)', en: 'Tireless' },
                        desc: {
                            pt: 'PV Temporários: Como ação de Magia, ganhe 1d8 + Mod. SAB de PV Temporários (usos iguais ao seu Mod. SAB por Descanso Longo). Reduzir Exaustão: Sempre que terminar um Descanso Curto, seu nível de Exaustão diminui em 1!',
                            en: 'Temporary Hit Points: As a Magic action, give yourself 1d8 + WIS mod Temp HP (WIS mod uses per Long Rest). Decrease Exhaustion: Whenever you finish a Short Rest, your Exhaustion level decreases by 1!'
                        }
                    }
                ]
            },
            {
                level: 11,
                extra: { favoredEnemy: '4', prepared: '10', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[10]) },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Presa Superior do Caçador)', en: 'Subclass Feature (Superior Hunter’s Prey)' },
                        desc: {
                            pt: 'Uma vez por turno, quando você causar dano a uma criatura marcada por sua Marca do Caçador, você também pode causar o dano extra da Marca do Caçador a uma segunda criatura diferente que esteja a até 9 metros (30 ft.) da primeira.',
                            en: 'Once per turn when you deal damage to a creature marked by your Hunter’s Mark, you can also deal that spell’s extra damage to a different creature that you can see within 30 feet of the first creature.'
                        }
                    }
                ]
            },
            {
                level: 12,
                extra: { favoredEnemy: '4', prepared: '10', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[11]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 13,
                extra: { favoredEnemy: '5', prepared: '11', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[12]) },
                features: [
                    {
                        name: { pt: 'Caçador Implacável (Relentless Hunter)', en: 'Relentless Hunter' },
                        desc: {
                            pt: 'Sofrer dano não pode mais quebrar sua Concentração na magia Marca do Caçador!',
                            en: 'Taking damage can’t break your Concentration on Hunter’s Mark!'
                        }
                    }
                ]
            },
            {
                level: 14,
                extra: { favoredEnemy: '5', prepared: '11', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[13]) },
                features: [
                    {
                        name: { pt: 'Véu da Natureza (Nature’s Veil)', en: 'Nature’s Veil' },
                        desc: {
                            pt: 'Como Ação Bônus, você invoca espíritos da natureza para receber a condição Invisível até o final do seu próximo turno (usos iguais ao seu Mod. de Sabedoria por Descanso Longo).',
                            en: 'As a Bonus Action, invoke spirits of nature to give yourself the Invisible condition until the end of your next turn (uses equal to WIS modifier per Long Rest).'
                        }
                    }
                ]
            },
            {
                level: 15,
                extra: { favoredEnemy: '5', prepared: '12', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[14]) },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Defesa Superior do Caçador)', en: 'Subclass Feature (Superior Hunter’s Defense)' },
                        desc: {
                            pt: 'Quando você sofrer dano, pode usar sua Reação para ganhar Resistência àquele dano e a qualquer outro dano do mesmo tipo até o final do turno atual.',
                            en: 'When you take damage, you can take a Reaction to give yourself Resistance to that damage and any other damage of the same type until the end of the current turn.'
                        }
                    }
                ]
            },
            {
                level: 16,
                extra: { favoredEnemy: '5', prepared: '12', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[15]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 17,
                extra: { favoredEnemy: '6', prepared: '14', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[16]) },
                features: [
                    {
                        name: { pt: 'Caçador Preciso (Precise Hunter)', en: 'Precise Hunter' },
                        desc: {
                            pt: 'Você tem Vantagem em todas as suas jogadas de ataque contra a criatura atualmente marcada pela sua Marca do Caçador!',
                            en: 'You have Advantage on attack rolls against the creature currently marked by your Hunter’s Mark!'
                        }
                    }
                ]
            },
            {
                level: 18,
                extra: { favoredEnemy: '6', prepared: '14', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[17]) },
                features: [
                    {
                        name: { pt: 'Sentidos Selvagens (Feral Senses)', en: 'Feral Senses' },
                        desc: {
                            pt: 'Sua conexão com as forças da natureza concede a você Percepção às Cegas (Blindsight) com alcance de 9 metros (30 ft.).',
                            en: 'Your connection to the forces of nature grants you Blindsight with a range of 30 feet.'
                        }
                    }
                ]
            },
            {
                level: 19,
                extra: { favoredEnemy: '6', prepared: '15', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[18]) },
                features: [
                    {
                        name: { pt: 'Dádiva Épica', en: 'Epic Boon' },
                        desc: {
                            pt: 'Você recebe um talento de Dádiva Épica ou outro talento à sua escolha (+1 em um atributo, até 30).',
                            en: 'You gain an Epic Boon feat or another feat of your choice (+1 to an ability score, max 30).'
                        }
                    }
                ]
            },
            {
                level: 20,
                extra: { favoredEnemy: '6', prepared: '15', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[19]) },
                features: [
                    {
                        name: { pt: 'Matador de Inimigos (Foe Slayer)', en: 'Foe Slayer' },
                        desc: {
                            pt: 'O dado de dano extra da sua Marca do Caçador torna-se 1d10 em vez de 1d6.',
                            en: 'The damage die of your Hunter’s Mark is a d10 rather than a d6.'
                        }
                    }
                ]
            }
        ]
    },

    // ========================================================================
    // 8. GUERREIRO (FIGHTER)
    // ========================================================================
    {
        id: 'fighter',
        name: { pt: 'Guerreiro', en: 'Fighter' },
        tagline: {
            pt: 'Um mestre incomparável das armas, táticas de batalha e resistência marcial.',
            en: 'A master of martial combat, skilled with a variety of weapons and armor.'
        },
        hitDie: 'd10',
        core: {
            primaryAbility: { pt: 'Força ou Destreza', en: 'Strength or Dexterity' },
            hitPoints: {
                pt: '1d10 por nível de Guerreiro (10 + Mod. CON no 1º nível; 1d10 [ou 6] + Mod. CON por nível seguinte)',
                en: '1d10 per Fighter level (10 + CON mod at 1st level; 1d10 [or 6] + CON mod per level after)'
            },
            savingThrows: { pt: 'Força e Constituição', en: 'Strength and Constitution' },
            skills: {
                pt: 'Escolha 2: Acrobacia, Adestrar Animais, Atletismo, História, Intimidação, Intuição, Percepção ou Sobrevivência',
                en: 'Choose 2: Acrobatics, Animal Handling, Athletics, History, Insight, Intimidation, Perception, or Survival'
            },
            weapons: { pt: 'Armas Simples e Marciais', en: 'Simple and Martial Weapons' },
            armor: { pt: 'Todas as Armaduras (Leves, Médias, Pesadas) e Escudos', en: 'Light, Medium, and Heavy Armor, Shields' },
            tools: { pt: 'Nenhuma', en: 'None' },
            subclass: { pt: 'Campeão / Champion (SRD 5.5e)', en: 'Champion (SRD 5.5e)' }
        },
        extraColumns: [
            { key: 'secondWind', label: { pt: 'Ret. Fôlego', en: 'Second Wind' } },
            { key: 'mastery', label: { pt: 'Maestrias', en: 'Mastery' } },
            { key: 'attacks', label: { pt: 'Ataques', en: 'Attacks' } }
        ],
        levels: [
            {
                level: 1,
                extra: { secondWind: '2', mastery: '3', attacks: '1' },
                features: [
                    {
                        name: { pt: 'Estilo de Luta', en: 'Fighting Style' },
                        desc: {
                            pt: 'Você recebe um talento de Estilo de Luta à sua escolha (ex: Arquearia, Combate com Armas Grandes, Defesa, Duelismo). Você pode trocar esse estilo sempre que ganhar um nível de Guerreiro.',
                            en: 'You gain a Fighting Style feat of your choice (such as Archery, Defense, Dueling, Great Weapon Fighting).'
                        }
                    },
                    {
                        name: { pt: 'Retomar o Fôlego (Second Wind)', en: 'Second Wind' },
                        desc: {
                            pt: 'Como Ação Bônus, você recupera Pontos de Vida iguais a 1d10 + seu nível de Guerreiro. Você começa com 2 usos (recupera 1 uso em um Descanso Curto e todos em um Descanso Longo).',
                            en: 'As a Bonus Action, regain Hit Points equal to 1d10 + your Fighter level. You have 2 uses (regain 1 use on a Short Rest, all on a Long Rest).'
                        }
                    },
                    {
                        name: { pt: 'Maestria em Armas (3 Armas)', en: 'Weapon Mastery (3 Weapons)' },
                        desc: {
                            pt: 'Você pode usar as propriedades de maestria de 3 tipos de armas Simples ou Marciais à sua escolha.',
                            en: 'You can use the mastery properties of 3 kinds of Simple or Martial weapons of your choice.'
                        }
                    }
                ]
            },
            {
                level: 2,
                extra: { secondWind: '2', mastery: '3', attacks: '1' },
                features: [
                    {
                        name: { pt: 'Surto de Ação (Action Surge)', en: 'Action Surge' },
                        desc: {
                            pt: 'No seu turno, você pode realizar uma ação adicional (exceto a ação de Magia). Uma vez usado, você deve terminar um Descanso Curto ou Longo para usá-lo novamente.',
                            en: 'On your turn, you can take one additional action, except the Magic action. Recharges on a Short or Long Rest.'
                        }
                    },
                    {
                        name: { pt: 'Mente Tática (Tactical Mind)', en: 'Tactical Mind' },
                        desc: {
                            pt: 'Quando você falhar em um teste de atributo, pode gastar 1 uso de Retomar o Fôlego: em vez de curar PV, você rola 1d10 e soma ao teste. Se o teste continuar falhando, o uso de Retomar o Fôlego não é gasto!',
                            en: 'When you fail an ability check, you can expend a use of Second Wind to roll 1d10 and add it to the ability check. If the check still fails, the use of Second Wind isn’t expended!'
                        }
                    }
                ]
            },
            {
                level: 3,
                extra: { secondWind: '2', mastery: '3', attacks: '1' },
                features: [
                    {
                        name: { pt: 'Subclasse de Guerreiro (Campeão / Champion)', en: 'Fighter Subclass (Champion)' },
                        desc: {
                            pt: 'Crítico Aprimorado: Suas jogadas de ataque com armas e Golpes Desarmados atingem um Acerto Crítico com 19 ou 20 no d20. Atleta Notável: Você tem Vantagem em rolagens de Iniciativa e em testes de Força (Atletismo). Além disso, logo após acertar um Crítico, pode se mover até metade do seu deslocamento sem provocar Ataques de Oportunidade.',
                            en: 'Improved Critical: Your attack rolls with weapons and Unarmed Strikes score a Critical Hit on a roll of 19 or 20. Remarkable Athlete: Advantage on Initiative rolls and Strength (Athletics) checks, and after scoring a Critical Hit you can move up to half your Speed without provoking Opportunity Attacks.'
                        }
                    }
                ]
            },
            {
                level: 4,
                extra: { secondWind: '3', mastery: '4', attacks: '1' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another General feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 5,
                extra: { secondWind: '3', mastery: '4', attacks: '2' },
                features: [
                    {
                        name: { pt: 'Ataque Extra (2 Ataques)', en: 'Extra Attack (2 Attacks)' },
                        desc: {
                            pt: 'Você pode atacar duas vezes, em vez de uma, sempre que realizar a ação de Ataque no seu turno.',
                            en: 'You can attack twice instead of once whenever you take the Attack action on your turn.'
                        }
                    },
                    {
                        name: { pt: 'Deslocamento Tático (Tactical Shift)', en: 'Tactical Shift' },
                        desc: {
                            pt: 'Sempre que você ativar seu Retomar o Fôlego com uma Ação Bônus, você pode se mover até metade do seu deslocamento sem provocar Ataques de Oportunidade.',
                            en: 'Whenever you activate your Second Wind with a Bonus Action, you can move up to half your Speed without provoking Opportunity Attacks.'
                        }
                    }
                ]
            },
            {
                level: 6,
                extra: { secondWind: '3', mastery: '4', attacks: '2' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo Extra', en: 'Extra Ability Score Improvement' },
                        desc: {
                            pt: 'O Guerreiro recebe um Incremento no Valor de Atributo ou Talento Geral adicional no 6º nível!',
                            en: 'You gain an additional Ability Score Improvement feat or another General feat of your choice at 6th level!'
                        }
                    }
                ]
            },
            {
                level: 7,
                extra: { secondWind: '3', mastery: '4', attacks: '2' },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Estilo de Luta Adicional)', en: 'Subclass Feature (Additional Fighting Style)' },
                        desc: {
                            pt: 'Você ganha um segundo talento de Estilo de Luta à sua escolha.',
                            en: 'You gain another Fighting Style feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 8,
                extra: { secondWind: '3', mastery: '4', attacks: '2' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 9,
                extra: { secondWind: '3', mastery: '4', attacks: '2' },
                features: [
                    {
                        name: { pt: 'Indomável (Indomitable) & Mestre Tático', en: 'Indomitable & Tactical Master' },
                        desc: {
                            pt: 'Indomável: Se falhar em uma salvaguarda, você pode rerrolá-la com um bônus igual ao seu nível de Guerreiro! (1x por Descanso Longo). Mestre Tático: Ao atacar com uma arma cuja Maestria você domina, pode substituir a propriedade dela por Empurrar (Push), Desacelerar (Sap) ou Lentidão (Slow) naquele ataque.',
                            en: 'Indomitable: Reroll a failed saving throw with a bonus equal to your Fighter level! (1/Long Rest). Tactical Master: When attacking with a mastered weapon, you can replace its mastery property with Push, Sap, or Slow for that attack.'
                        }
                    }
                ]
            },
            {
                level: 10,
                extra: { secondWind: '4', mastery: '5', attacks: '2' },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Guerreiro Heroico)', en: 'Subclass Feature (Heroic Warrior)' },
                        desc: {
                            pt: 'Durante o combate, você pode conceder a si mesmo Inspiração Heroica no início do seu turno caso não a tenha (permitindo rerrolar qualquer dado!).',
                            en: 'During combat, you can give yourself Heroic Inspiration whenever you start your turn without it.'
                        }
                    }
                ]
            },
            {
                level: 11,
                extra: { secondWind: '4', mastery: '5', attacks: '3' },
                features: [
                    {
                        name: { pt: 'Dois Ataques Extras (3 Ataques por Ação)', en: 'Two Extra Attacks (3 Attacks per Action)' },
                        desc: {
                            pt: 'Você pode atacar três vezes, em vez de uma, sempre que realizar a ação de Ataque no seu turno.',
                            en: 'You can attack three times instead of once whenever you take the Attack action on your turn.'
                        }
                    }
                ]
            },
            {
                level: 12,
                extra: { secondWind: '4', mastery: '5', attacks: '3' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 13,
                extra: { secondWind: '4', mastery: '5', attacks: '3' },
                features: [
                    {
                        name: { pt: 'Indomável (2 Usos) & Ataques Estudados', en: 'Indomitable (2 Uses) & Studied Attacks' },
                        desc: {
                            pt: 'Você passa a ter 2 usos de Indomável por Descanso Longo. Além disso, Ataques Estudados: se você errar uma jogada de ataque contra uma criatura, você ganha Vantagem na sua próxima jogada de ataque contra ela até o final do seu próximo turno!',
                            en: 'You can use Indomitable twice per Long Rest. Studied Attacks: If you make an attack roll against a creature and miss, you have Advantage on your next attack roll against that creature before the end of your next turn!'
                        }
                    }
                ]
            },
            {
                level: 14,
                extra: { secondWind: '4', mastery: '5', attacks: '3' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo Extra', en: 'Extra Ability Score Improvement' },
                        desc: {
                            pt: 'O Guerreiro recebe mais um Incremento no Valor de Atributo ou Talento Geral no 14º nível!',
                            en: 'You gain an additional Ability Score Improvement feat or another General feat of your choice at 14th level!'
                        }
                    }
                ]
            },
            {
                level: 15,
                extra: { secondWind: '4', mastery: '5', attacks: '3' },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Crítico Superior)', en: 'Subclass Feature (Superior Critical)' },
                        desc: {
                            pt: 'Suas jogadas de ataque com armas e Golpes Desarmados agora atingem um Acerto Crítico com um resultado de 18, 19 ou 20 no d20!',
                            en: 'Your attack rolls with weapons and Unarmed Strikes can now score a Critical Hit on a roll of 18–20 on the d20!'
                        }
                    }
                ]
            },
            {
                level: 16,
                extra: { secondWind: '4', mastery: '6', attacks: '3' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 17,
                extra: { secondWind: '4', mastery: '6', attacks: '3' },
                features: [
                    {
                        name: { pt: 'Surto de Ação (2 Usos) & Indomável (3 Usos)', en: 'Action Surge (2 Uses) & Indomitable (3 Uses)' },
                        desc: {
                            pt: 'Você pode usar Surto de Ação duas vezes antes de um descanso (máx. 1x por turno) e Indomável três vezes antes de um Descanso Longo.',
                            en: 'You can use Action Surge twice before a rest (only once on a turn) and Indomitable three times before a Long Rest.'
                        }
                    }
                ]
            },
            {
                level: 18,
                extra: { secondWind: '4', mastery: '6', attacks: '3' },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Sobrevivente)', en: 'Subclass Feature (Survivor)' },
                        desc: {
                            pt: 'Desafiar a Morte: Você tem Vantagem em Salvaguardas contra a Morte, e resultados de 18–20 contam como um 20 natural! Regeneração Heroica: No início de cada um dos seus turnos, se você estiver Ferido (Bloodied, com metade ou menos dos PV) e tiver pelo menos 1 PV, você recupera PV iguais a 5 + seu Mod. de Constituição.',
                            en: 'Defy Death: Advantage on Death Saving Throws, and rolls of 18–20 count as a 20! Heroic Rally: At the start of each of your turns, if you are Bloodied and have at least 1 HP, you regain Hit Points equal to 5 + your Constitution modifier.'
                        }
                    }
                ]
            },
            {
                level: 19,
                extra: { secondWind: '4', mastery: '6', attacks: '3' },
                features: [
                    {
                        name: { pt: 'Dádiva Épica', en: 'Epic Boon' },
                        desc: {
                            pt: 'Você recebe um talento de Dádiva Épica ou outro talento à sua escolha (+1 em um atributo, até 30).',
                            en: 'You gain an Epic Boon feat or another feat of your choice (+1 to an ability score, max 30).'
                        }
                    }
                ]
            },
            {
                level: 20,
                extra: { secondWind: '4', mastery: '6', attacks: '4' },
                features: [
                    {
                        name: { pt: 'Três Ataques Extras (4 Ataques por Ação)', en: 'Three Extra Attacks (4 Attacks per Action)' },
                        desc: {
                            pt: 'Você pode atacar quatro vezes, em vez de uma, sempre que realizar a ação de Ataque no seu turno!',
                            en: 'You can attack four times instead of once whenever you take the Attack action on your turn!'
                        }
                    }
                ]
            }
        ]
    },

    // ========================================================================
    // 9. LADINO (ROGUE)
    // ========================================================================
    {
        id: 'rogue',
        name: { pt: 'Ladino', en: 'Rogue' },
        tagline: {
            pt: 'Um especialista furtivo e letal que explora as brechas do inimigo.',
            en: 'A scoundrel who uses stealth, trickery, and precision strikes to overcome obstacles.'
        },
        hitDie: 'd8',
        core: {
            primaryAbility: { pt: 'Destreza', en: 'Dexterity' },
            hitPoints: {
                pt: '1d8 por nível de Ladino (8 + Mod. CON no 1º nível; 1d8 [ou 5] + Mod. CON por nível seguinte)',
                en: '1d8 per Rogue level (8 + CON mod at 1st level; 1d8 [or 5] + CON mod per level after)'
            },
            savingThrows: { pt: 'Destreza e Inteligência', en: 'Dexterity and Intelligence' },
            skills: {
                pt: 'Escolha 4: Acrobacia, Atletismo, Enganação, Furtividade, Intimidação, Intuição, Investigação, Percepção, Persuasão ou Prestidigitação',
                en: 'Choose 4: Acrobatics, Athletics, Deception, Insight, Intimidation, Investigation, Perception, Persuasion, Sleight of Hand, or Stealth'
            },
            weapons: { pt: 'Armas Simples e Armas Marciais com Acuidade ou Leves', en: 'Simple Weapons and Martial Weapons with Finesse or Light' },
            armor: { pt: 'Armaduras Leves', en: 'Light Armor' },
            tools: { pt: 'Ferramentas de Ladrão', en: 'Thieves’ Tools' },
            subclass: { pt: 'Ladrão / Thief (SRD 5.5e)', en: 'Thief (SRD 5.5e)' }
        },
        extraColumns: [
            { key: 'sneakAttack', label: { pt: 'Atq. Furtivo', en: 'Sneak Attack' } },
            { key: 'mastery', label: { pt: 'Maestrias', en: 'Mastery' } }
        ],
        levels: [
            {
                level: 1,
                extra: { sneakAttack: '1d6', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Especialização (2 Perícias) & Gíria de Ladrão', en: 'Expertise (2 Skills) & Thieves’ Cant' },
                        desc: {
                            pt: 'Você dobra seu Bônus de Proficiência em 2 perícias à sua escolha, aprende a Gíria de Ladrão mais 1 idioma adicional e domina 2 Maestrias em Armas.',
                            en: 'Double your Proficiency Bonus in 2 skills of your choice, learn Thieves’ Cant plus 1 language, and gain Weapon Mastery with 2 weapons.'
                        }
                    },
                    {
                        name: { pt: 'Ataque Furtivo (Sneak Attack)', en: 'Sneak Attack' },
                        desc: {
                            pt: 'Uma vez por turno, você causa dano extra (começando em 1d6 e subindo até 10d6) a uma criatura que acertar com uma arma de Acuidade ou à Distância se tiver Vantagem na jogada ou se um aliado não-Incapacitado estiver a até 1,5m do alvo (e você não tiver Desvantagem).',
                            en: 'Once per turn, deal extra damage (1d6 up to 10d6) to one creature you hit with a Finesse or Ranged weapon if you have Advantage on the roll or an ally is within 5 ft. of the target (and you don’t have Disadvantage).'
                        }
                    }
                ]
            },
            {
                level: 2,
                extra: { sneakAttack: '1d6', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Ação Ardilosa (Cunning Action)', en: 'Cunning Action' },
                        desc: {
                            pt: 'Sua agilidade e raciocínio rápido permitem que você realize as ações de Disparada (Dash), Desengajar (Disengage) ou Esconder-se (Hide) como uma Ação Bônus em cada um dos seus turnos.',
                            en: 'On your turn, you can take one of the following actions as a Bonus Action: Dash, Disengage, or Hide.'
                        }
                    }
                ]
            },
            {
                level: 3,
                extra: { sneakAttack: '2d6', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Subclasse de Ladino (Ladrão / Thief) & Mira Firme', en: 'Rogue Subclass (Thief) & Steady Aim' },
                        desc: {
                            pt: 'Mãos Rápidas: Como Ação Bônus, faça um teste de Prestidigitação para desarmar armadilhas, abrir fechaduras ou furtar, ou realize a ação Utilizar (incluindo ativar um Item Mágico!). Andarilho de Segundo Andar: Você ganha Deslocamento de Escalada igual ao seu deslocamento normal e soma Destreza aos saltos. Mira Firme: Como Ação Bônus (se não se mover no turno), ganhe Vantagem na próxima jogada de ataque.',
                            en: 'Fast Hands: As a Bonus Action, make a Sleight of Hand check to pick a lock/disarm a trap/pick a pocket, or take the Utilize action (or take a Magic action to use a magic item!). Second-Story Work: Gain a Climb Speed equal to your Speed. Steady Aim: Bonus Action to gain Advantage on your next attack roll this turn if you don’t move.'
                        }
                    }
                ]
            },
            {
                level: 4,
                extra: { sneakAttack: '2d6', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another General feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 5,
                extra: { sneakAttack: '3d6', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Golpe Ardiloso (Cunning Strike) & Esquiva Sobrenatural', en: 'Cunning Strike & Uncanny Dodge' },
                        desc: {
                            pt: 'Golpe Ardiloso: Ao causar dano de Ataque Furtivo, você pode abrir mão de 1d6 de dano para aplicar um efeito tático: Veneno (Envenenado por 1 min, salv. CON), Rasteira (Caído, salv. DES) ou Recuar (move metade do deslocamento sem provocar Ataques de Oportunidade). Esquiva Sobrenatural: Use sua Reação para reduzir pela metade o dano de um ataque que o acerte.',
                            en: 'Cunning Strike: Forgo 1d6 Sneak Attack dice to apply Poison (CON save or Poisoned), Trip (DEX save or Prone), or Withdraw (move half Speed without Opportunity Attacks). Uncanny Dodge: Reaction to halve the damage of an attack that hits you.'
                        }
                    }
                ]
            },
            {
                level: 6,
                extra: { sneakAttack: '3d6', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Especialização (2 Novas Perícias)', en: 'Expertise (2 Additional Skills)' },
                        desc: {
                            pt: 'Escolha mais 2 perícias nas quais você tem proficiência para dobrar o seu Bônus de Proficiência (totalizando 4 perícias com Especialização).',
                            en: 'Choose 2 more of your skill proficiencies to gain Expertise (4 total).'
                        }
                    }
                ]
            },
            {
                level: 7,
                extra: { sneakAttack: '4d6', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Evasão & Talento Confiável (Reliable Talent)', en: 'Evasão & Reliable Talent' },
                        desc: {
                            pt: 'Evasão: Em salvaguardas de Destreza para sofrer metade do dano, você não sofre nenhum dano em um sucesso e apenas metade em uma falha. Talento Confiável: No D&D 5.5e já no 7º nível, sempre que você fizer um teste de atributo usando uma perícia ou ferramenta na qual tenha proficiência, qualquer resultado de 9 ou menos no d20 é tratado como 10!',
                            en: 'Evasion: On DEX saves for half damage, take no damage on a success and half on a failure. Reliable Talent: Whenever you make an ability check that uses one of your skill or tool proficiencies, you can treat a d20 roll of 9 or lower as a 10!'
                        }
                    }
                ]
            },
            {
                level: 8,
                extra: { sneakAttack: '4d6', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 9,
                extra: { sneakAttack: '5d6', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Furtividade Suprema)', en: 'Subclass Feature (Supreme Sneak)' },
                        desc: {
                            pt: 'Você ganha a opção Ataque Furtivo Invisível (Stealth Attack, custo 1d6) no seu Golpe Ardiloso: se você estiver com a condição Invisível por ter se Escondido, fazer o ataque não encerra a sua condição caso você termine o turno atrás de Três Quartos de Cobertura ou Cobertura Total!',
                            en: 'You gain the Stealth Attack Cunning Strike option (cost 1d6): if you have the Hide action’s Invisible condition, this attack doesn’t end that condition on you if you end the turn behind Three-Quarters Cover or Total Cover!'
                        }
                    }
                ]
            },
            {
                level: 10,
                extra: { sneakAttack: '5d6', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo Extra', en: 'Extra Ability Score Improvement' },
                        desc: {
                            pt: 'O Ladino recebe um Incremento no Valor de Atributo ou Talento Geral adicional no 10º nível!',
                            en: 'You gain an additional Ability Score Improvement feat or another General feat of your choice at 10th level!'
                        }
                    }
                ]
            },
            {
                level: 11,
                extra: { sneakAttack: '6d6', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Golpe Ardiloso Aprimorado', en: 'Improved Cunning Strike' },
                        desc: {
                            pt: 'Você pode usar até dois efeitos de Golpe Ardiloso sempre que causar dano de Ataque Furtivo, pagando o custo em dados de cada efeito.',
                            en: 'You can use up to two Cunning Strike effects when you deal Sneak Attack damage, paying the die cost for each effect.'
                        }
                    }
                ]
            },
            {
                level: 12,
                extra: { sneakAttack: '6d6', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 13,
                extra: { sneakAttack: '7d6', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Usar Dispositivo Mágico)', en: 'Subclass Feature (Use Magic Device)' },
                        desc: {
                            pt: 'Sintonia: Você pode se sintonizar com até 4 itens mágicos ao mesmo tempo! Cargas: Sempre que usar uma propriedade de item mágico que gaste cargas, role 1d6; com um 6, você não gasta nenhuma carga. Pergaminhos: Você pode usar qualquer Pergaminho de Magia usando Inteligência como atributo.',
                            en: 'Attunement: You can attune to up to 4 magic items at once! Charges: Roll 1d6 when expending magic item charges; on a 6, you use it without expending the charges. Scrolls: You can use any Spell Scroll using Intelligence.'
                        }
                    }
                ]
            },
            {
                level: 14,
                extra: { sneakAttack: '7d6', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Golpes Traiçoeiros (Devious Strikes)', en: 'Devious Strikes' },
                        desc: {
                            pt: 'Você adiciona novas opções devastadoras ao seu Golpe Ardiloso: Atordoar/Daze (2d6: alvo só pode mover, agir ou usar ação bônus no próximo turno), Nocautear/Knock Out (6d6: deixa o alvo Inconsciente por 1 minuto em falha de CON) e Obscurecer/Obscure (3d6: Cega o alvo em falha de DES).',
                            en: 'You add new options to Cunning Strike: Daze (2d6:CON save or limited only to move, action, or bonus action), Knock Out (6d6: CON save or Unconscious for 1 minute), and Obscure (3d6: DEX save or Blinded).'
                        }
                    }
                ]
            },
            {
                level: 15,
                extra: { sneakAttack: '8d6', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Mente Escorregadia (Slippery Mind)', en: 'Slippery Mind' },
                        desc: {
                            pt: 'Sua mente astuta concede a você proficiência em salvaguardas de Sabedoria e de Carisma!',
                            en: 'Your cunning mind grants you proficiency in Wisdom and Charisma saving throws!'
                        }
                    }
                ]
            },
            {
                level: 16,
                extra: { sneakAttack: '8d6', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 17,
                extra: { sneakAttack: '9d6', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Reflexos de Ladrão)', en: 'Subclass Feature (Thief’s Reflexes)' },
                        desc: {
                            pt: 'Você é mestre em emboscadas: você pode realizar dois turnos completos durante a primeira rodada de qualquer combate! Seu primeiro turno ocorre na sua Iniciativa normal e o segundo na sua Iniciativa menos 10.',
                            en: 'You can take two turns during the first round of any combat! You take your first turn at your normal Initiative and your second turn at your Initiative minus 10.'
                        }
                    }
                ]
            },
            {
                level: 18,
                extra: { sneakAttack: '9d6', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Elusivo (Elusive)', en: 'Elusive' },
                        desc: {
                            pt: 'Você é tão evasivo que nenhuma jogada de ataque tem Vantagem contra você enquanto você não estiver com a condição Incapacitado.',
                            en: 'No attack roll has Advantage against you unless you have the Incapacitated condition.'
                        }
                    }
                ]
            },
            {
                level: 19,
                extra: { sneakAttack: '10d6', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Dádiva Épica & Ataque Furtivo 10d6', en: 'Epic Boon & 10d6 Sneak Attack' },
                        desc: {
                            pt: 'Você recebe um talento de Dádiva Épica (+1 em um atributo, até 30) e seu Ataque Furtivo alcança 10d6.',
                            en: 'You gain an Epic Boon feat (+1 to an ability score, max 30) and your Sneak Attack reaches 10d6.'
                        }
                    }
                ]
            },
            {
                level: 20,
                extra: { sneakAttack: '10d6', mastery: '2' },
                features: [
                    {
                        name: { pt: 'Golpe de Sorte (Stroke of Luck)', en: 'Stroke of Luck' },
                        desc: {
                            pt: 'Se você falhar em um Teste de d20, você pode transformar o resultado do dado em um 20 natural instantaneamente! Uma vez usado, você o recupera ao terminar um Descanso Curto ou Longo.',
                            en: 'If you fail a d20 Test, you can turn the roll into a 20! Once you use this feature, you can’t use it again until you finish a Short or Long Rest.'
                        }
                    }
                ]
            }
        ]
    },

    // ========================================================================
    // 10. MAGO (WIZARD)
    // ========================================================================
    {
        id: 'wizard',
        name: { pt: 'Mago', en: 'Wizard' },
        tagline: {
            pt: 'Um estudioso supremo das artes arcanas que domina as leis do multiverso.',
            en: 'A scholarly magic-user capable of manipulating the structures of reality.'
        },
        hitDie: 'd6',
        core: {
            primaryAbility: { pt: 'Inteligência', en: 'Intelligence' },
            hitPoints: {
                pt: '1d6 por nível de Mago (6 + Mod. CON no 1º nível; 1d6 [ou 4] + Mod. CON por nível seguinte)',
                en: '1d6 per Wizard level (6 + CON mod at 1st level; 1d6 [or 4] + CON mod per level after)'
            },
            savingThrows: { pt: 'Inteligência e Sabedoria', en: 'Intelligence and Wisdom' },
            skills: {
                pt: 'Escolha 2: Arcanismo, História, Intuição, Investigação, Medicina, Natureza ou Religião',
                en: 'Choose 2: Arcana, History, Insight, Investigation, Medicine, Nature, or Religion'
            },
            weapons: { pt: 'Armas Simples', en: 'Simple Weapons' },
            armor: { pt: 'Nenhuma', en: 'None' },
            tools: { pt: 'Nenhuma', en: 'None' },
            subclass: { pt: 'Evocador / Evoker (SRD 5.5e)', en: 'Evoker (SRD 5.5e)' }
        },
        extraColumns: [
            { key: 'cantrips', label: { pt: 'Truques', en: 'Cantrips' } },
            { key: 'prepared', label: { pt: 'Magias Prep.', en: 'Prepared' } },
            { key: 'slots', label: { pt: 'Espaços (1º–9º)', en: 'Spell Slots' } }
        ],
        levels: [
            {
                level: 1,
                extra: { cantrips: '3', prepared: '4', slots: formatSlotsSummary(FULL_CASTER_SLOTS[0]) },
                features: [
                    {
                        name: { pt: 'Conjuração & Grimório', en: 'Spellcasting & Spellbook' },
                        desc: {
                            pt: 'Você possui um Grimório com 6 magias de 1º círculo (ganhando +2 magias por nível seguinte), conhece 3 truques (podendo trocar 1 truque a cada Descanso Longo!) e prepara 4 magias usando Inteligência. Você também pode conjurar qualquer magia Ritual do seu Grimório mesmo que não esteja preparada.',
                            en: 'Your Spellbook starts with 6 1st-level Wizard spells (+2 per level after). You know 3 cantrips (can replace 1 cantrip each Long Rest) and prepare 4 spells using Intelligence. Ritual Adept lets you cast any Ritual spell in your book without preparing it.'
                        }
                    },
                    {
                        name: { pt: 'Recuperação Arcana (Arcane Recovery)', en: 'Arcane Recovery' },
                        desc: {
                            pt: 'Quando você terminar um Descanso Curto, pode recuperar espaços de magia gastos cujo nível somado seja igual ou menor que metade do seu nível de Mago (arredondado para cima), nenhum deles podendo ser de 6º círculo ou superior (1x por Descanso Longo).',
                            en: 'When you finish a Short Rest, you can recover expended spell slots with a combined level equal to or less than half your Wizard level (round up), none of which can be level 6 or higher (1/Long Rest).'
                        }
                    }
                ]
            },
            {
                level: 2,
                extra: { cantrips: '3', prepared: '5', slots: formatSlotsSummary(FULL_CASTER_SLOTS[1]) },
                features: [
                    {
                        name: { pt: 'Erudito (Scholar)', en: 'Scholar' },
                        desc: {
                            pt: 'Enquanto estuda magia, você também se especializou em um campo acadêmico. Escolha 1 perícia na qual tenha proficiência entre Arcanismo, História, Investigação, Medicina, Natureza ou Religião: você ganha Especialização (dobro de proficiência) nela.',
                            en: 'Choose one of your skill proficiencies from Arcana, History, Investigation, Medicine, Nature, or Religion. You gain Expertise in the chosen skill.'
                        }
                    }
                ]
            },
            {
                level: 3,
                extra: { cantrips: '3', prepared: '6', slots: formatSlotsSummary(FULL_CASTER_SLOTS[2]) },
                features: [
                    {
                        name: { pt: 'Subclasse de Mago (Evocador / Evoker)', en: 'Wizard Subclass (Evoker)' },
                        desc: {
                            pt: 'Sábio da Evocação: O tempo e o ouro gastos para copiar magias de Evocação no seu Grimório caem pela metade, e você adiciona 2 magias de Evocação gratuitas ao Grimório. Truque Potente (Potent Cantrip): No D&D 5.5e já no 3º nível, seus truques causam metade do dano mesmo quando o alvo passa na salvaguarda ou você erra a jogada de ataque!',
                            en: 'Evocation Savant: Gold and time to copy Evocation spells into your spellbook are halved, plus gain 2 free Evocation spells. Potent Cantrip: When you cast a damaging cantrip and miss the attack roll or the target succeeds on its save, the target still takes half the cantrip’s damage!'
                        }
                    }
                ]
            },
            {
                level: 4,
                extra: { cantrips: '4', prepared: '7', slots: formatSlotsSummary(FULL_CASTER_SLOTS[3]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another General feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 5,
                extra: { cantrips: '4', prepared: '9', slots: formatSlotsSummary(FULL_CASTER_SLOTS[4]) },
                features: [
                    {
                        name: { pt: 'Memorizar Magia (Memorize Spell)', en: 'Memorize Spell' },
                        desc: {
                            pt: 'Sempre que você terminar um Descanso Curto, você pode estudar seu Grimório e substituir uma das magias de Mago de 1º círculo ou superior que você tem preparadas por outra magia do seu Grimório!',
                            en: 'Whenever you finish a Short Rest, you can study your spellbook and replace one of the level 1+ Wizard spells you have prepared with another level 1+ spell from the book.'
                        }
                    }
                ]
            },
            {
                level: 6,
                extra: { cantrips: '4', prepared: '10', slots: formatSlotsSummary(FULL_CASTER_SLOTS[5]) },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Esculpir Magias)', en: 'Subclass Feature (Sculpt Spells)' },
                        desc: {
                            pt: 'Ao conjurar uma magia de Evocação que afete outras criaturas que você possa ver, você pode escolher um número delas igual a 1 + o círculo da magia. As criaturas escolhidas passam automaticamente na salvaguarda e não sofrem nenhum dano da magia!',
                            en: 'When you cast an Evocation spell that affects other creatures you can see, choose a number of them equal to 1 + the spell’s level. The chosen creatures automatically succeed on their saving throws against the spell and take no damage from it!'
                        }
                    }
                ]
            },
            {
                level: 7,
                extra: { cantrips: '4', prepared: '11', slots: formatSlotsSummary(FULL_CASTER_SLOTS[6]) },
                features: [
                    {
                        name: { pt: 'Magias de 4º Círculo', en: '4th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia espaços de magia de 4º círculo.',
                            en: 'You unlock 4th-level spell slots.'
                        }
                    }
                ]
            },
            {
                level: 8,
                extra: { cantrips: '4', prepared: '12', slots: formatSlotsSummary(FULL_CASTER_SLOTS[7]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 9,
                extra: { cantrips: '4', prepared: '14', slots: formatSlotsSummary(FULL_CASTER_SLOTS[8]) },
                features: [
                    {
                        name: { pt: 'Magias de 5º Círculo', en: '5th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia espaços de magia de 5º círculo.',
                            en: 'You unlock 5th-level spell slots.'
                        }
                    }
                ]
            },
            {
                level: 10,
                extra: { cantrips: '5', prepared: '15', slots: formatSlotsSummary(FULL_CASTER_SLOTS[9]) },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Evocação Potencializada)', en: 'Subclass Feature (Empowered Evocation)' },
                        desc: {
                            pt: 'Sempre que você conjurar uma magia de Mago da escola de Evocação, você pode adicionar seu modificador de Inteligência a uma rolagem de dano daquela magia.',
                            en: 'Whenever you cast a Wizard spell from the Evocation school, you can add your Intelligence modifier to one damage roll of that spell.'
                        }
                    }
                ]
            },
            {
                level: 11,
                extra: { cantrips: '5', prepared: '16', slots: formatSlotsSummary(FULL_CASTER_SLOTS[10]) },
                features: [
                    {
                        name: { pt: 'Magias de 6º Círculo', en: '6th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia espaços de magia de 6º círculo.',
                            en: 'You unlock 6th-level spell slots.'
                        }
                    }
                ]
            },
            {
                level: 12,
                extra: { cantrips: '5', prepared: '16', slots: formatSlotsSummary(FULL_CASTER_SLOTS[11]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 13,
                extra: { cantrips: '5', prepared: '17', slots: formatSlotsSummary(FULL_CASTER_SLOTS[12]) },
                features: [
                    {
                        name: { pt: 'Magias de 7º Círculo', en: '7th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia espaços de magia de 7º círculo.',
                            en: 'You unlock 7th-level spell slots.'
                        }
                    }
                ]
            },
            {
                level: 14,
                extra: { cantrips: '5', prepared: '18', slots: formatSlotsSummary(FULL_CASTER_SLOTS[13]) },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Sobrecarga / Overchannel)', en: 'Subclass Feature (Overchannel)' },
                        desc: {
                            pt: 'Quando você conjurar uma magia de Mago de 1º a 5º círculo que cause dano, você pode causar o dano máximo possível com essa magia! O primeiro uso por Descanso Longo não tem efeito colateral; usos adicionais antes de descansar causam 2d12 de dano Necrótico por círculo da magia em você.',
                            en: 'When you cast a Wizard spell with a spell slot of levels 1–5 that deals damage, you can deal maximum damage with that spell on the turn you cast it! Free 1/Long Rest; subsequent uses deal 2d12 Necrotic damage per spell level to you.'
                        }
                    }
                ]
            },
            {
                level: 15,
                extra: { cantrips: '5', prepared: '19', slots: formatSlotsSummary(FULL_CASTER_SLOTS[14]) },
                features: [
                    {
                        name: { pt: 'Magias de 8º Círculo', en: '8th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia espaços de magia de 8º círculo.',
                            en: 'You unlock 8th-level spell slots.'
                        }
                    }
                ]
            },
            {
                level: 16,
                extra: { cantrips: '5', prepared: '21', slots: formatSlotsSummary(FULL_CASTER_SLOTS[15]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 17,
                extra: { cantrips: '5', prepared: '22', slots: formatSlotsSummary(FULL_CASTER_SLOTS[16]) },
                features: [
                    {
                        name: { pt: 'Magias de 9º Círculo', en: '9th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia magias de 9º círculo (como Desejo, Chuva de Meteoros e Sexto Sentido).',
                            en: 'You unlock 9th-level spell slots (such as Wish, Meteor Swarm, and Foresight).'
                        }
                    }
                ]
            },
            {
                level: 18,
                extra: { cantrips: '5', prepared: '23', slots: formatSlotsSummary(FULL_CASTER_SLOTS[17]) },
                features: [
                    {
                        name: { pt: 'Maestria em Magia (Spell Mastery)', en: 'Spell Mastery' },
                        desc: {
                            pt: 'Escolha uma magia de 1º círculo e uma de 2º círculo no seu Grimório (com tempo de conjuração de 1 ação). Você as tem sempre preparadas e pode conjurá-las no círculo base à vontade, sem gastar espaços de magia! Você pode trocar uma delas após um Descanso Longo.',
                            en: 'Choose a level 1 and a level 2 spell in your spellbook that have a casting time of an action. You always have them prepared and can cast them at their lowest level without expending a spell slot!'
                        }
                    }
                ]
            },
            {
                level: 19,
                extra: { cantrips: '5', prepared: '24', slots: formatSlotsSummary(FULL_CASTER_SLOTS[18]) },
                features: [
                    {
                        name: { pt: 'Dádiva Épica', en: 'Epic Boon' },
                        desc: {
                            pt: 'Você recebe um talento de Dádiva Épica ou outro talento à sua escolha (+1 em um atributo, até 30).',
                            en: 'You gain an Epic Boon feat or another feat of your choice (+1 to an ability score, max 30).'
                        }
                    }
                ]
            },
            {
                level: 20,
                extra: { cantrips: '5', prepared: '25', slots: formatSlotsSummary(FULL_CASTER_SLOTS[19]) },
                features: [
                    {
                        name: { pt: 'Magias Assinatura (Signature Spells)', en: 'Signature Spells' },
                        desc: {
                            pt: 'Escolha duas magias de Mago de 3º círculo no seu Grimório como suas magias assinatura. Elas estão sempre preparadas e você pode conjurar cada uma delas uma vez no 3º círculo sem gastar espaço de magia (recuperadas em um Descanso Curto ou Longo).',
                            en: 'Choose two level 3 Wizard spells in your spellbook as your signature spells. You always have them prepared and can cast each of them once at level 3 without expending a spell slot (recharging on a Short or Long Rest).'
                        }
                    }
                ]
            }
        ]
    },

    // ========================================================================
    // 11. MONGE (MONK)
    // ========================================================================
    {
        id: 'monk',
        name: { pt: 'Monge', en: 'Monk' },
        tagline: {
            pt: 'Um artista marcial disciplinado que canaliza o foco interior em velocidade e golpes sobre-humanos.',
            en: 'A martial artist who harnesses internal Focus for superhuman speed and strikes.'
        },
        hitDie: 'd8',
        core: {
            primaryAbility: { pt: 'Destreza e Sabedoria', en: 'Dexterity and Wisdom' },
            hitPoints: {
                pt: '1d8 por nível de Monge (8 + Mod. CON no 1º nível; 1d8 [ou 5] + Mod. CON por nível seguinte)',
                en: '1d8 per Monk level (8 + CON mod at 1st level; 1d8 [or 5] + CON mod per level after)'
            },
            savingThrows: { pt: 'Força e Destreza', en: 'Strength and Dexterity' },
            skills: {
                pt: 'Escolha 2: Acrobacia, Atletismo, Furtividade, História, Intuição ou Religião',
                en: 'Choose 2: Acrobatics, Athletics, History, Insight, Religion, or Stealth'
            },
            weapons: { pt: 'Armas Simples e Armas Marciais com a propriedade Leve', en: 'Simple Weapons and Martial Weapons with the Light property' },
            armor: { pt: 'Nenhuma', en: 'None' },
            tools: { pt: 'Escolha 1 tipo de Ferramenta de Artesão ou Instrumento Musical', en: 'Choose 1 type of Artisan’s Tools or Musical Instrument' },
            subclass: { pt: 'Guerreiro da Mão Aberta (SRD 5.5e)', en: 'Warrior of the Open Hand (SRD 5.5e)' }
        },
        extraColumns: [
            { key: 'martialDie', label: { pt: 'Dado Marc.', en: 'Martial Die' } },
            { key: 'focusPts', label: { pt: 'Pts. Foco', en: 'Focus Pts' } },
            { key: 'moveBonus', label: { pt: 'Desloc. Extra', en: 'Unarm. Move' } }
        ],
        levels: [
            {
                level: 1,
                extra: { martialDie: '1d6', focusPts: '—', moveBonus: '—' },
                features: [
                    {
                        name: { pt: 'Artes Marciais (Martial Arts)', en: 'Martial Arts' },
                        desc: {
                            pt: 'Enquanto sem armadura ou escudo: você pode fazer 1 Golpe Desarmado como Ação Bônus no seu turno (independente de ter atacado antes!); pode usar Destreza em vez de Força para ataques, dano e CD de Agarrar/Empurrar; e seu dado de dano de Golpes Desarmados e armas de Monge começa em 1d6.',
                            en: 'While unarmored and not wielding a Shield: you can make an Unarmed Strike as a Bonus Action on your turn; use Dexterity instead of Strength for attack/damage rolls and Grapple/Shove DC; and roll 1d6 in place of normal damage.'
                        }
                    },
                    {
                        name: { pt: 'Defesa sem Armadura', en: 'Unarmored Defense' },
                        desc: {
                            pt: 'Enquanto você não estiver vestindo armadura nem empunhando escudo, sua Classe de Armadura base é igual a 10 + seu modificador de Destreza + seu modificador de Sabedoria.',
                            en: 'While you aren’t wearing armor or wielding a Shield, your base Armor Class equals 10 + your Dexterity modifier + your Wisdom modifier.'
                        }
                    }
                ]
            },
            {
                level: 2,
                extra: { martialDie: '1d6', focusPts: '2', moveBonus: '+3m (10 ft.)' },
                features: [
                    {
                        name: { pt: 'Foco do Monge (Monk’s Focus)', en: 'Monk’s Focus' },
                        desc: {
                            pt: 'Você tem Pontos de Foco iguais ao seu nível de Monge (recuperados em Descanso Curto ou Longo). Rajada de Golpes: 1 Pt para fazer 2 Golpes Desarmados como Ação Bônus. Defesa Paciente: Desengajar como Ação Bônus de graça, ou gaste 1 Pt para Desengajar + Esquivar! Passo do Vento: Disparada como Ação Bônus de graça, ou gaste 1 Pt para Desengajar + Disparada e dobrar a distância de salto!',
                            en: 'You have Focus Points equal to your Monk level (recharge on Short/Long Rest). Flurry of Blows: 1 Pt for 2 Unarmed Strikes as Bonus Action. Patient Defense: Bonus Action Disengage for free, or spend 1 Pt to Disengage and Dodge! Step of the Wind: Bonus Action Dash for free, or spend 1 Pt to Disengage and Dash with doubled jump distance!'
                        }
                    },
                    {
                        name: { pt: 'Movimento sem Armadura & Metabolismo Sobrenatural', en: 'Unarmored Movement & Uncanny Metabolism' },
                        desc: {
                            pt: 'Seu deslocamento aumenta em +3m sem armadura/escudo. Metabolismo Sobrenatural: Quando você rolar Iniciativa, pode recuperar todos os seus Pontos de Foco gastos e se curar em 1 Dado de Artes Marciais + seu nível de Monge (1x por Descanso Longo)!',
                            en: 'Your Speed increases by 10 ft. while unarmored. Uncanny Metabolism: When you roll Initiative, you can regain all expended Focus Points and regain HP equal to 1 Martial Arts die + your Monk level (1/Long Rest)!'
                        }
                    }
                ]
            },
            {
                level: 3,
                extra: { martialDie: '1d6', focusPts: '3', moveBonus: '+3m (10 ft.)' },
                features: [
                    {
                        name: { pt: 'Defletir Ataques (Deflect Attacks)', en: 'Deflect Attacks' },
                        desc: {
                            pt: 'Quando uma jogada de ataque acertar você e seu dano incluir Concussão, Cortante ou Perfurante (corpo a corpo ou à distância!), você pode usar sua Reação para reduzir o dano em 1d10 + seu Mod. de Destreza + seu nível de Monge. Se reduzir a 0, pode gastar 1 Ponto de Foco para redirecionar a força contra um alvo (causando 2 Dados de Artes Marciais + Mod. DES).',
                            en: 'When an attack roll hits you and its damage includes Bludgeoning, Piercing, or Slashing damage, use your Reaction to reduce the damage by 1d10 + DEX mod + Monk level. If reduced to 0, spend 1 Focus Point to redirect the attack!'
                        }
                    },
                    {
                        name: { pt: 'Subclasse de Monge (Guerreiro da Mão Aberta)', en: 'Monk Subclass (Warrior of the Open Hand)' },
                        desc: {
                            pt: 'Técnica da Mão Aberta: Sempre que acertar uma criatura com um ataque da sua Rajada de Golpes, você pode impor um efeito: Derrubar (Caído em falha de DES), Empurrar (afasta até 4,5m em falha de FOR) ou Confundir (o alvo não pode fazer Ataques de Oportunidade até o início do próximo turno dele).',
                            en: 'Open Hand Technique: Whenever you hit a creature with an attack granted by your Flurry of Blows, you can impose one effect: Addle (can’t make Opportunity Attacks), Push (STR save or pushed 15 ft.), or Topple (DEX save or knocked Prone).'
                        }
                    }
                ]
            },
            {
                level: 4,
                extra: { martialDie: '1d6', focusPts: '4', moveBonus: '+3m (10 ft.)' },
                features: [
                    {
                        name: { pt: 'Incremento de Atributo & Queda Lenta', en: 'Ability Score Improvement & Slow Fall' },
                        desc: {
                            pt: 'Você recebe um Incremento de Atributo/Talento Geral e pode usar sua Reação para reduzir qualquer dano de queda que sofrer em um valor igual a 5x seu nível de Monge.',
                            en: 'You gain an Ability Score Improvement or feat, and you can take a Reaction when you fall to reduce any damage you take from the fall by an amount equal to five times your Monk level.'
                        }
                    }
                ]
            },
            {
                level: 5,
                extra: { martialDie: '1d8', focusPts: '5', moveBonus: '+3m (10 ft.)' },
                features: [
                    {
                        name: { pt: 'Ataque Extra & Golpe Atordoante (Stunning Strike)', en: 'Extra Attack & Stunning Strike' },
                        desc: {
                            pt: 'Você ataca duas vezes na ação de Ataque e seu Dado de Artes Marciais sobe para 1d8. Golpe Atordoante: 1x por turno ao acertar com arma de Monge ou Golpe Desarmado, gaste 1 Ponto de Foco para forçar uma salvaguarda de CON. Em falha, o alvo fica Atordoado; mesmo em um sucesso, o deslocamento do alvo cai pela metade e o próximo ataque contra ele tem Vantagem!',
                            en: 'Attack twice when taking the Attack action and Martial Arts die becomes 1d8. Stunning Strike: 1/turn on a hit, spend 1 Focus Point to force a CON save. On a failure, target is Stunned; on a success, target’s Speed is halved and the next attack roll against it has Advantage!'
                        }
                    }
                ]
            },
            {
                level: 6,
                extra: { martialDie: '1d8', focusPts: '6', moveBonus: '+4,5m (15 ft.)' },
                features: [
                    {
                        name: { pt: 'Golpes Potencializados & Integridade Corporal', en: 'Empowered Strikes & Wholeness of Body' },
                        desc: {
                            pt: 'Golpes Potencializados: Seus Golpes Desarmados podem causar dano de Energia (Force) em vez do dano normal. Integridade Corporal (Mão Aberta): Como Ação Bônus, você recupera PV iguais a 1 Dado de Artes Marciais + seu Mod. de Sabedoria (usos iguais ao seu Mod. de Sabedoria por Descanso Longo).',
                            en: 'Empowered Strikes: Your Unarmed Strikes can deal Force damage. Wholeness of Body (Open Hand): As a Bonus Action, roll your Martial Arts die and regain HP equal to the number rolled + your Wisdom modifier (uses equal to WIS mod per Long Rest).'
                        }
                    }
                ]
            },
            {
                level: 7,
                extra: { martialDie: '1d8', focusPts: '7', moveBonus: '+4,5m (15 ft.)' },
                features: [
                    {
                        name: { pt: 'Evasão (Evasion)', en: 'Evasion' },
                        desc: {
                            pt: 'Quando você for submetido a um efeito que permita uma salvaguarda de Destreza para sofrer apenas metade do dano, você não sofre nenhum dano se passar e apenas metade se falhar.',
                            en: 'When you’re subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed and only half damage if you fail.'
                        }
                    }
                ]
            },
            {
                level: 8,
                extra: { martialDie: '1d8', focusPts: '8', moveBonus: '+4,5m (15 ft.)' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 9,
                extra: { martialDie: '1d8', focusPts: '9', moveBonus: '+4,5m (15 ft.)' },
                features: [
                    {
                        name: { pt: 'Movimento Acrobático', en: 'Acrobatic Movement' },
                        desc: {
                            pt: 'Enquanto não estiver usando armadura nem escudo, você ganha a habilidade de se mover ao longo de superfícies verticais e sobre líquidos no seu turno sem cair durante o movimento.',
                            en: 'While you aren’t wearing armor or wielding a Shield, you gain the ability to move along vertical surfaces and across liquids on your turn without falling during the movement.'
                        }
                    }
                ]
            },
            {
                level: 10,
                extra: { martialDie: '1d8', focusPts: '10', moveBonus: '+6m (20 ft.)' },
                features: [
                    {
                        name: { pt: 'Foco Elevado (Heightened Focus) & Auto-Restauração', en: 'Heightened Focus & Self-Restoration' },
                        desc: {
                            pt: 'Foco Elevado: Sua Rajada de Golpes passa a fazer 3 Golpes Desarmados (em vez de 2)! Defesa Paciente concede PV Temporários iguais a 2 Dados de Artes Marciais, e Passo do Vento permite carregar um aliado voluntário com você. Auto-Restauração: No final do seu turno, você pode encerrar em si mesmo a condição Amedrontado, Enfeitiçado ou Envenenado.',
                            en: 'Heightened Focus: Flurry of Blows now makes 3 Unarmed Strikes instead of 2! Patient Defense grants 2 Martial Arts dice of Temp HP, and Step of the Wind lets you carry a willing ally. Self-Restoration: End Charmed, Frightened, or Poisoned on yourself at the end of each of your turns.'
                        }
                    }
                ]
            },
            {
                level: 11,
                extra: { martialDie: '1d10', focusPts: '11', moveBonus: '+6m (20 ft.)' },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Passo Rápido) & Dado 1d10', en: 'Subclass Feature (Fleet Step) & 1d10 Die' },
                        desc: {
                            pt: 'Seu Dado de Artes Marciais sobe para 1d10. Passo Rápido (Mão Aberta): Sempre que você realizar uma Ação Bônus que não seja Passo do Vento, você também pode usar Passo do Vento imediatamente após essa Ação Bônus!',
                            en: 'Your Martial Arts die becomes 1d10. Fleet Step (Open Hand): When you take a Bonus Action other than Step of the Wind, you can also use Step of the Wind immediately after that Bonus Action!'
                        }
                    }
                ]
            },
            {
                level: 12,
                extra: { martialDie: '1d10', focusPts: '12', moveBonus: '+6m (20 ft.)' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 13,
                extra: { martialDie: '1d10', focusPts: '13', moveBonus: '+6m (20 ft.)' },
                features: [
                    {
                        name: { pt: 'Defletir Energia (Deflect Energy)', en: 'Deflect Energy' },
                        desc: {
                            pt: 'Você agora pode usar sua característica Defletir Ataques contra ataques que causem qualquer tipo de dano (incluindo ataques mágicos e elementais)!',
                            en: 'You can now use your Deflect Attacks feature against attacks that deal any damage type, not just Bludgeoning, Piercing, or Slashing!'
                        }
                    }
                ]
            },
            {
                level: 14,
                extra: { martialDie: '1d10', focusPts: '14', moveBonus: '+7,5m (25 ft.)' },
                features: [
                    {
                        name: { pt: 'Sobrevivente Disciplinado (Disciplined Survivor)', en: 'Disciplined Survivor' },
                        desc: {
                            pt: 'Sua disciplina física e mental concede a você proficiência em TODAS as seis salvaguardas (incluindo Salvaguardas contra a Morte)! Além disso, se falhar em uma salvaguarda, pode gastar 1 Ponto de Foco para rerrolá-la.',
                            en: 'Your physical and mental discipline grants you proficiency in all saving throws (including Death Saving Throws)! Whenever you fail a saving throw, you can expend 1 Focus Point to reroll it.'
                        }
                    }
                ]
            },
            {
                level: 15,
                extra: { martialDie: '1d10', focusPts: '15', moveBonus: '+7,5m (25 ft.)' },
                features: [
                    {
                        name: { pt: 'Foco Perfeito (Perfect Focus)', en: 'Perfect Focus' },
                        desc: {
                            pt: 'Quando você rola Iniciativa e não usa Metabolismo Sobrenatural, você recupera Pontos de Foco gastos até ficar com 4 caso tenha3 ou menos.',
                            en: 'When you roll Initiative and don’t use Uncanny Metabolism, you regain expended Focus Points until you have 4 if you have 3 or fewer.'
                        }
                    }
                ]
            },
            {
                level: 16,
                extra: { martialDie: '1d10', focusPts: '16', moveBonus: '+7,5m (25 ft.)' },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 17,
                extra: { martialDie: '1d12', focusPts: '17', moveBonus: '+7,5m (25 ft.)' },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Palma Vibrante) & Dado 1d12', en: 'Subclass Feature (Quivering Palm) & 1d12 Die' },
                        desc: {
                            pt: 'Seu Dado de Artes Marciais atinge 1d12. Palma Vibrante (Mão Aberta): Ao acertar um Golpe Desarmado, você pode criar vibrações letais no alvo (dura até seu nível em dias). Como ação, gaste 4 Pontos de Foco para encerrar as vibrações: o alvo faz salvaguarda de CON, sofrendo 10d12 de dano de Energia em uma falha (ou metade em um sucesso)!',
                            en: 'Your Martial Arts die becomes 1d12. Quivering Palm (Open Hand): Set up lethal vibrations on an Unarmed Strike hit. Expend 4 Focus Points as an action to end them: target makes a CON save, taking 10d12 Force damage on a failed save or half as much on a successful one!'
                        }
                    }
                ]
            },
            {
                level: 18,
                extra: { martialDie: '1d12', focusPts: '18', moveBonus: '+9m (30 ft.)' },
                features: [
                    {
                        name: { pt: 'Defesa Superior (Superior Defense)', en: 'Superior Defense' },
                        desc: {
                            pt: 'No início do seu turno, você pode gastar 3 Pontos de Foco para ganhar Resistência a todos os tipos de dano, exceto Energia (Force), por 1 minuto ou até ficar Incapacitado.',
                            en: 'At the start of your turn, you can expend 3 Focus Points to gain Resistance to all damage except Force damage for 1 minute or until you have the Incapacitated condition.'
                        }
                    }
                ]
            },
            {
                level: 19,
                extra: { martialDie: '1d12', focusPts: '19', moveBonus: '+9m (30 ft.)' },
                features: [
                    {
                        name: { pt: 'Dádiva Épica', en: 'Epic Boon' },
                        desc: {
                            pt: 'Você recebe um talento de Dádiva Épica ou outro talento à sua escolha (+1 em um atributo, até 30).',
                            en: 'You gain an Epic Boon feat or another feat of your choice (+1 to an ability score, max 30).'
                        }
                    }
                ]
            },
            {
                level: 20,
                extra: { martialDie: '1d12', focusPts: '20', moveBonus: '+9m (30 ft.)' },
                features: [
                    {
                        name: { pt: 'Corpo e Mente (Body and Mind)', en: 'Body and Mind' },
                        desc: {
                            pt: 'Você desenvolveu seu corpo e mente a novos patamares. Seus valores de Destreza e Sabedoria aumentam em +4, até um novo máximo de 25!',
                            en: 'You have developed your body and mind to new heights. Your Dexterity and Wisdom scores increase by 4, to a maximum of 25!'
                        }
                    }
                ]
            }
        ]
    },

    // ========================================================================
    // 12. PALADINO (PALADIN)
    // ========================================================================
    {
        id: 'paladin',
        name: { pt: 'Paladino', en: 'Paladin' },
        tagline: {
            pt: 'Um guerreiro sagrado unido a um juramento solene que pune o mal e protege os aliados.',
            en: 'A holy warrior bound to a sacred oath who smites foes and shields allies.'
        },
        hitDie: 'd10',
        core: {
            primaryAbility: { pt: 'Força e Carisma', en: 'Strength and Charisma' },
            hitPoints: {
                pt: '1d10 por nível de Paladino (10 + Mod. CON no 1º nível; 1d10 [ou 6] + Mod. CON por nível seguinte)',
                en: '1d10 per Paladin level (10 + CON mod at 1st level; 1d10 [or 6] + CON mod per level after)'
            },
            savingThrows: { pt: 'Sabedoria e Carisma', en: 'Wisdom and Charisma' },
            skills: {
                pt: 'Escolha 2: Atletismo, Intimidação, Intuição, Medicina, Persuasão ou Religião',
                en: 'Choose 2: Athletics, Insight, Intimidation, Medicine, Persuasion, or Religion'
            },
            weapons: { pt: 'Armas Simples e Marciais', en: 'Simple and Martial Weapons' },
            armor: { pt: 'Todas as Armaduras (Leves, Médias, Pesadas) e Escudos', en: 'Light, Medium, and Heavy Armor, Shields' },
            tools: { pt: 'Nenhuma', en: 'None' },
            subclass: { pt: 'Juramento de Devoção (SRD 5.5e)', en: 'Oath of Devotion (SRD 5.5e)' }
        },
        extraColumns: [
            { key: 'channelDiv', label: { pt: 'Canal. Div.', en: 'Channel Div.' } },
            { key: 'prepared', label: { pt: 'Magias Prep.', en: 'Prepared' } },
            { key: 'slots', label: { pt: 'Espaços (1º–5º)', en: 'Spell Slots' } }
        ],
        levels: [
            {
                level: 1,
                extra: { channelDiv: '—', prepared: '2', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[0]) },
                features: [
                    {
                        name: { pt: 'Imposição das Mãos (Lay on Hands)', en: 'Lay on Hands' },
                        desc: {
                            pt: 'Como Ação Bônus (no D&D 5.5e!), você toca uma criatura e restaura PV a partir de uma reserva igual a 5x seu nível de Paladino (recuperada em Descanso Longo). Você também pode gastar 5 PV da reserva para remover a condição Envenenado.',
                            en: 'As a Bonus Action, touch a creature and draw power from a healing pool equal to 5x your Paladin level to restore HP (or expend 5 HP from the pool to remove the Poisoned condition).'
                        }
                    },
                    {
                        name: { pt: 'Conjuração & Maestria em Armas (2)', en: 'Spellcasting & Weapon Mastery (2)' },
                        desc: {
                            pt: 'Você prepara 2 magias de Paladino já no 1º nível (usando Carisma) e domina as propriedades de Maestria de 2 tipos de armas.',
                            en: 'You prepare 2 1st-level Paladin spells right at level 1 (using Charisma) and can use the Weapon Mastery properties of 2 kinds of weapons.'
                        }
                    }
                ]
            },
            {
                level: 2,
                extra: { channelDiv: '—', prepared: '3', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[1]) },
                features: [
                    {
                        name: { pt: 'Destruição do Paladino (Paladin’s Smite) & Estilo de Luta', en: 'Paladin’s Smite & Fighting Style' },
                        desc: {
                            pt: 'Você sempre tem a magia Destruição Divina (Divine Smite) preparada e pode conjurá-la uma vez por Descanso Longo sem gastar espaço de magia! Além disso, recebe um talento de Estilo de Luta ou Guerreiro Abençoado (2 truques de Clérigo).',
                            en: 'You always have the Divine Smite spell prepared and can cast it once per Long Rest without expending a spell slot! You also gain a Fighting Style feat or Blessed Warrior (2 Cleric cantrips).'
                        }
                    }
                ]
            },
            {
                level: 3,
                extra: { channelDiv: '2', prepared: '4', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[2]) },
                features: [
                    {
                        name: { pt: 'Canalizar Divindade & Juramento de Devoção', en: 'Channel Divinity & Oath of Devotion' },
                        desc: {
                            pt: 'Você ganha 2 usos de Canalizar Divindade (recupera 1 em Descanso Curto, todos em Longo), incluindo Sentido Divino (detecta Celestiais, Corruptores e Mortos-Vivos a 18m por 10 min como Ação Bônus). Arma Sagrada (Devoção): Quando você realiza a ação de Ataque, pode gastar 1 Canalizar Divindade para imbuir uma arma com luz por 10 min, somando seu Mod. de Carisma às jogadas de ataque com ela!',
                            en: 'Gain 2 uses of Channel Divinity (regain 1 on Short Rest), including Divine Sense. Sacred Weapon (Devotion): When you take the Attack action, expend 1 Channel Divinity to imbue one melee weapon for 10 minutes, adding your Charisma modifier to attack rolls made with it!'
                        }
                    }
                ]
            },
            {
                level: 4,
                extra: { channelDiv: '2', prepared: '5', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[3]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another General feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 5,
                extra: { channelDiv: '2', prepared: '6', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[4]) },
                features: [
                    {
                        name: { pt: 'Ataque Extra & Corcel Fiel (Faithful Steed)', en: 'Extra Attack & Faithful Steed' },
                        desc: {
                            pt: 'Você pode atacar duas vezes sempre que realizar a ação de Ataque. Corcel Fiel: Você tem a magia Encontrar Montaria (Find Steed) sempre preparada e pode conjurá-la uma vez por Descanso Longo sem gastar espaço de magia!',
                            en: 'You can attack twice whenever you take the Attack action. Faithful Steed: You always have the Find Steed spell prepared and can cast it once per Long Rest without expending a spell slot!'
                        }
                    }
                ]
            },
            {
                level: 6,
                extra: { channelDiv: '2', prepared: '6', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[5]) },
                features: [
                    {
                        name: { pt: 'Aura de Proteção (Aura of Protection)', en: 'Aura of Protection' },
                        desc: {
                            pt: 'Você irradia uma aura protetora invisível em uma Emanação de 3 metros (10 ft.) enquanto não estiver Incapacitado. Você e seus aliados na aura ganham um bônus em TODAS as salvaguardas igual ao seu modificador de Carisma (mín. +1)!',
                            en: 'You radiate a protective aura in a 10-foot Emanation while not Incapacitated. You and your allies in the aura gain a bonus to all saving throws equal to your Charisma modifier (minimum bonus of +1)!'
                        }
                    }
                ]
            },
            {
                level: 7,
                extra: { channelDiv: '2', prepared: '7', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[6]) },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Aura de Devoção)', en: 'Subclass Feature (Aura of Devotion)' },
                        desc: {
                            pt: 'Você e seus aliados não podem receber a condição Enfeitiçado enquanto estiverem na sua Aura de Proteção.',
                            en: 'You and your allies have Immunity to the Charmed condition while in your Aura of Protection.'
                        }
                    }
                ]
            },
            {
                level: 8,
                extra: { channelDiv: '2', prepared: '7', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[7]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 9,
                extra: { channelDiv: '2', prepared: '9', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[8]) },
                features: [
                    {
                        name: { pt: 'Abjurar Inimigos (Abjure Foes)', en: 'Abjure Foes' },
                        desc: {
                            pt: 'Como ação de Magia, gaste 1 uso de Canalizar Divindade para subjugar inimigos. Escolha um número de criaturas visíveis a até 18m igual ao seu Mod. de Carisma: cada alvo faz salvaguarda de SAB ou fica Amedrontado por 1 minuto (e enquanto Amedrontado, só pode fazer movimento OU ação OU ação bônus no turno dele!).',
                            en: 'As a Magic action, expend 1 use of Channel Divinity to overwhelm foes. Choose creatures within 60 ft. up to your CHA mod: on a failed WIS save, a target is Frightened for 1 minute and can do only one of the following on its turns: move, take an action, or take a Bonus Action.'
                        }
                    }
                ]
            },
            {
                level: 10,
                extra: { channelDiv: '2', prepared: '9', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[9]) },
                features: [
                    {
                        name: { pt: 'Aura de Coragem (Aura of Courage)', en: 'Aura of Courage' },
                        desc: {
                            pt: 'Você e seus aliados têm Imunidade à condição Amedrontado enquanto estiverem na sua Aura de Proteção.',
                            en: 'You and your allies have Immunity to the Frightened condition while in your Aura of Protection.'
                        }
                    }
                ]
            },
            {
                level: 11,
                extra: { channelDiv: '3', prepared: '10', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[10]) },
                features: [
                    {
                        name: { pt: 'Golpes Radiantes (Radiant Strikes) & 3º Canalizar Divindade', en: 'Radiant Strikes & 3rd Channel Divinity' },
                        desc: {
                            pt: 'Seus golpes agora carregam poder sobrenatural permanente: sempre que você acertar um alvo com uma jogada de ataque usando uma arma Corpo a Corpo ou um Golpe Desarmado, o alvo sofre 1d8 de dano Radiante extra!',
                            en: 'When you hit a target with an attack roll using a Melee weapon or an Unarmed Strike, the target takes an extra 1d8 Radiant damage!'
                        }
                    }
                ]
            },
            {
                level: 12,
                extra: { channelDiv: '3', prepared: '10', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[11]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 13,
                extra: { channelDiv: '3', prepared: '11', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[12]) },
                features: [
                    {
                        name: { pt: 'Magias de 4º Círculo', en: '4th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia espaços de magia de 4º círculo (como Aura de Vida e Banimento).',
                            en: 'You unlock 4th-level spell slots (such as Aura of Life and Banishment).'
                        }
                    }
                ]
            },
            {
                level: 14,
                extra: { channelDiv: '3', prepared: '11', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[13]) },
                features: [
                    {
                        name: { pt: 'Toque Restaurador (Restoring Touch)', en: 'Restoring Touch' },
                        desc: {
                            pt: 'Quando você usa Imposição das Mãos em uma criatura, você também pode remover uma ou mais das seguintes condições dela (gastando 5 PV da sua reserva de cura para cada condição removida): Amedrontado, Atordoado, Cego, Enfeitiçado, Paralisado ou Surdo.',
                            en: 'When you use Lay on Hands on a creature, you can also remove one or more of the following conditions from the creature (expending 5 HP from your pool per condition): Blinded, Charmed, Deafened, Frightened, Paralyzed, or Stunned.'
                        }
                    }
                ]
            },
            {
                level: 15,
                extra: { channelDiv: '3', prepared: '12', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[14]) },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Destruição de Proteção)', en: 'Subclass Feature (Smite of Protection)' },
                        desc: {
                            pt: 'Sua destruição mágica agora irradia energia protetora: sempre que você conjurar Destruição Divina (Divine Smite), você e seus aliados ganham Meia Cobertura (+2 na CA e em salvaguardas de Destreza) enquanto estiverem na sua Aura de Proteção até o início do seu próximo turno!',
                            en: 'Whenever you cast Divine Smite, you and your allies have Half Cover (+2 bonus to AC and DEX saves) while in your Aura of Protection until the start of your next turn!'
                        }
                    }
                ]
            },
            {
                level: 16,
                extra: { channelDiv: '3', prepared: '12', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[15]) },
                features: [
                    {
                        name: { pt: 'Incremento no Valor de Atributo', en: 'Ability Score Improvement' },
                        desc: {
                            pt: 'Você recebe o talento Incremento no Valor de Atributo ou outro Talento Geral à sua escolha.',
                            en: 'You gain the Ability Score Improvement feat or another feat of your choice.'
                        }
                    }
                ]
            },
            {
                level: 17,
                extra: { channelDiv: '3', prepared: '14', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[16]) },
                features: [
                    {
                        name: { pt: 'Magias de 5º Círculo', en: '5th-Level Spells' },
                        desc: {
                            pt: 'Você desbloqueia espaços de magia de 5º círculo.',
                            en: 'You unlock 5th-level spell slots.'
                        }
                    }
                ]
            },
            {
                level: 18,
                extra: { channelDiv: '3', prepared: '14', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[17]) },
                features: [
                    {
                        name: { pt: 'Expansão de Aura (9 metros / 30 ft.)', en: 'Aura Expansion (30 feet)' },
                        desc: {
                            pt: 'Sua Aura de Proteção (e todas as suas outras auras de Paladino) cresce para uma Emanação de 9 metros (30 ft.)!',
                            en: 'Your Aura of Protection is now a 30-foot Emanation!'
                        }
                    }
                ]
            },
            {
                level: 19,
                extra: { channelDiv: '3', prepared: '15', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[18]) },
                features: [
                    {
                        name: { pt: 'Dádiva Épica', en: 'Epic Boon' },
                        desc: {
                            pt: 'Você recebe um talento de Dádiva Épica ou outro talento à sua escolha (+1 em um atributo, até 30).',
                            en: 'You gain an Epic Boon feat or another feat of your choice (+1 to an ability score, max 30).'
                        }
                    }
                ]
            },
            {
                level: 20,
                extra: { channelDiv: '3', prepared: '15', slots: formatSlotsSummary(HALF_CASTER_SLOTS_2024[19]) },
                features: [
                    {
                        name: { pt: 'Característica de Subclasse (Halo Sagrado)', en: 'Subclass Feature (Holy Nimbus)' },
                        desc: {
                            pt: 'Como Ação Bônus, você imbuí sua Aura de Proteção com poder sagrado por 10 minutos: emite Luz Plena (Luz Solar) em 9m; você tem Vantagem em todas as salvaguardas contra efeitos de Corruptores ou Mortos-Vivos; e qualquer inimigo que comece o turno na aura sofre dano Radiante igual ao seu Mod. de Carisma + seu Bônus de Proficiência! (1x por Descanso Longo ou gastando espaço de 5º círculo).',
                            en: 'As a Bonus Action, imbue your Aura of Protection with holy power for 10 minutes: emit Bright Sunlight for 30 ft.; gain Advantage on saving throws against Fiends and Undead; and any enemy that starts its turn in the aura takes Radiant damage equal to your CHA modifier + your Proficiency Bonus!'
                        }
                    }
                ]
            }
        ]
    }
].map(cls => ({
    ...cls,
    levels: cls.levels.map(lvlObj => ({
        ...lvlObj,
        profBonus: getProfBonus(lvlObj.level)
    }))
}));
