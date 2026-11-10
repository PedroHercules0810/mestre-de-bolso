export const REFERENCE_DATA = {
  en: [
    { title: "Actions in Combat", items: [
        { name: "Dodge", desc: "Until the start of your next turn, any attack roll made against you has Disadvantage if you can see the attacker. You also have Advantage on Dex saves." },
        { name: "Dash", desc: "Gain extra movement for the current turn equal to your speed, after applying any modifiers." },
        { name: "Disengage", desc: "Your movement doesn't provoke opportunity attacks for the rest of the turn." },
        { name: "Help", desc: "Grant advantage to an ally's next ability check or attack roll (if the target is within 5 ft of you)." },
        { name: "Hide", desc: "Make a Stealth check to become Hidden. Requires being heavily obscured or behind total cover from the target." },
        { name: "Ready", desc: "Choose a perceivable trigger and an action you will take in response. When the trigger occurs, you can use your Reaction to take the action." }
    ]},
    { title: "Conditions (2024)", items: [
        { name: "Blinded", desc: "Can't see. Fails checks requiring sight. Attack rolls against it have Advantage, its attack rolls have Disadvantage." },
        { name: "Charmed", desc: "Can't attack the charmer. Charmer has Advantage on social ability checks against it." },
        { name: "Deafened", desc: "Can't hear. Fails ability checks requiring hearing." },
        { name: "Frightened", desc: "Disadvantage on ability checks/attack rolls while source of fear is within line of sight. Can't willingly move closer to the source." },
        { name: "Grappled", desc: "Speed is 0. Disadvantage on attacks against targets other than the grappler." },
        { name: "Invisible", desc: "Can't be seen without magic/special sense. Attack rolls against it have Disadvantage, its attack rolls have Advantage." },
        { name: "Paralyzed", desc: "Incapacitated. Can't move/speak. Fails Str/Dex saves. Attacks against it have Advantage. Hits from within 5 ft are Critical Hits." },
        { name: "Poisoned", desc: "Disadvantage on attack rolls and ability checks." },
        { name: "Prone", desc: "Only crawl. Disadvantage on attacks. Attacks against it have Advantage if within 5 ft, otherwise Disadvantage." },
        { name: "Restrained", desc: "Speed is 0. Attacks against it have Advantage, its attacks have Disadvantage. Disadvantage on Dex saves." },
        { name: "Stunned", desc: "Incapacitated. Fails Str/Dex saves. Attacks against it have Advantage." },
        { name: "Unconscious", desc: "Incapacitated, drops what it holds, falls Prone. Fails Str/Dex saves. Attacks against it have Advantage. Hits from within 5 ft are Critical Hits." }
    ]},
    { title: "Spellcasting Components", items: [
        { name: "Verbal (V)", desc: "The chanting of mystic words. You cannot cast the spell if you are gagged or in an area of magical silence." },
        { name: "Somatic (S)", desc: "Forceful gesticulation or an intricate set of gestures. You must have at least one free hand to perform these gestures." },
        { name: "Material (M)", desc: "Specific objects or a spellcasting focus. Requires one free hand (can be the same hand used for Somatic components). Components are only consumed if the spell specifies it." }
    ]},
    { title: "Spellcasting Tags", items: [
        { name: "Concentration (C)", desc: "Requires you to maintain focus. Taking damage requires a CON save (DC 10 or half damage taken, whichever is higher). Casting another concentration spell ends the current one." },
        { name: "Ritual (R)", desc: "Can be cast as a ritual if you have the feature. Takes 10 minutes longer to cast but doesn't expend a spell slot." }
    ]},
    { title: "Schools of Magic", items: [
        { name: "Abjuration", desc: "Protective spells that create magical barriers, negate harmful effects, ward locations against trespassers, or banish creatures to other planes of existence (e.g., Shield, Counterspell, Banishment)." },
        { name: "Conjuration", desc: "Spells that transport objects and creatures from one location to another (teleportation) or summon creatures and matter out of thin air (e.g., Misty Step, Mage Hand, Find Familiar)." },
        { name: "Divination", desc: "Spells that reveal information, whether in the form of secrets long forgotten, glimpses of the future, the locations of hidden things, or supernatural perception (e.g., Detect Magic, Identify, Scrying)." },
        { name: "Enchantment", desc: "Spells that affect the minds of others, influencing or controlling their behavior, inspiring allies, or clouding enemies' thoughts (e.g., Charm Person, Hold Person, Suggestion)." },
        { name: "Evocation", desc: "Spells that manipulate raw magical energy to produce a desired effect—unleashing blasts of fire or lightning, or channeling positive energy to heal wounds (e.g., Fireball, Cure Wounds, Magic Missile)." },
        { name: "Illusion", desc: "Spells that deceive the senses or minds of others, causing creatures to see phantoms, hear imaginary sounds, or fail to notice real things (e.g., Invisibility, Major Image, Mirror Image)." },
        { name: "Necromancy", desc: "Spells that manipulate the energies of life and death, draining vital force, afflicting foes with decay, or restoring life to the fallen (e.g., Inflict Wounds, Animate Dead, Revivify)." },
        { name: "Transmutation", desc: "Spells that change the physical properties of a creature, object, or environment—transforming shapes, enhancing speed, or granting flight (e.g., Polymorph, Haste, Fly)." }
    ]},
    { title: "Movement & Environment", items: [
        { name: "Difficult Terrain", desc: "Moving 1 foot in difficult terrain costs 2 feet of speed." },
        { name: "Crawling, Climbing, Swimming", desc: "Each foot of movement costs 1 extra foot (2 extra feet in difficult terrain), unless you have a specific speed for it." },
        { name: "Long Jump", desc: "Cover a number of feet up to your Strength score if you move at least 10 feet on foot immediately before the jump. When you make a standing long jump, you can leap only half that distance." },
        { name: "High Jump", desc: "Leap into the air a number of feet equal to 3 + your Strength modifier if you move at least 10 feet on foot immediately before the jump. Standing high jump is half that distance." },
        { name: "Falling Damage", desc: "A creature takes 1d6 bludgeoning damage for every 10 feet it falls, to a maximum of 20d6. The creature lands Prone, unless it avoids taking any damage." },
        { name: "Suffocating", desc: "A creature can hold its breath for a number of minutes equal to 1 + its Constitution modifier (minimum of 30 seconds). Once out of breath, it survives for its Con mod in rounds before dropping to 0 HP." }
    ]},
    { title: "Resting", items: [
        { name: "Short Rest", desc: "A period of downtime, at least 1 hour long. Characters can spend one or more Hit Dice to regain hit points." },
        { name: "Long Rest", desc: "A period of extended downtime, at least 8 hours long. Characters regain all lost hit points and up to half of their maximum Hit Dice." }
    ]},
    { title: "Light & Vision", items: [
        { name: "Dim Light", desc: "Also called shadows. Creates a lightly obscured area (disadvantage on Wisdom (Perception) checks that rely on sight)." },
        { name: "Darkness", desc: "Creates a heavily obscured area. Creatures effectively suffer from the Blinded condition when trying to see something in that area." },
        { name: "Darkvision", desc: "A creature can see in dim light as if it were bright light, and in darkness as if it were dim light (can't discern color in darkness, only shades of gray)." }
    ]},
    { title: "Exhaustion (2024)", items: [
        { name: "Levels 1-5", desc: "Subtract your Exhaustion level from all d20 tests (attacks, saves, ability checks) and Spell Save DCs. Speed is reduced by 5 ft per level." },
        { name: "Level 6", desc: "Death." }
    ]},
    { title: "Cover", items: [
        { name: "Half Cover", desc: "+2 bonus to AC and Dexterity saving throws." },
        { name: "Three-Quarters", desc: "+5 bonus to AC and Dexterity saving throws." },
        { name: "Total Cover", desc: "Can't be targeted directly by an attack or spell." }
    ]}
  ],
  pt: [
    { title: "Ações em Combate", items: [
        { name: "Esquivar", desc: "Até o início do seu próximo turno, qualquer jogada de ataque contra você tem Desvantagem (se você puder ver o atacante). Você também tem Vantagem em testes de Des." },
        { name: "Disparada", desc: "Ganha movimento extra no turno atual igual ao seu deslocamento (após aplicar modificadores)." },
        { name: "Desengajar", desc: "Seu movimento não provoca ataques de oportunidade pelo resto do turno." },
        { name: "Ajuda", desc: "Concede vantagem no próximo teste de atributo ou jogada de ataque de um aliado (se o alvo do ataque estiver a 1,5m de você)." },
        { name: "Esconder-se", desc: "Faz um teste de Furtividade para ficar Escondido. Requer estar sob cobertura total ou área totalmente obscurecida em relação ao alvo." },
        { name: "Preparar", desc: "Escolhe um gatilho perceptível e uma ação em resposta. Quando o gatilho ocorrer, você pode usar sua Reação para realizar a ação." }
    ]},
    { title: "Condições (2024)", items: [
        { name: "Cego", desc: "Não enxerga. Falha em testes de visão. Ataques contra têm Vantagem; seus ataques têm Desvantagem." },
        { name: "Enfeitiçado", desc: "Não pode atacar o conjurador. O conjurador tem Vantagem em testes sociais." },
        { name: "Surdo", desc: "Não ouve. Falha em testes de audição." },
        { name: "Amedrontado", desc: "Desvantagem em ataques/testes se a fonte do medo estiver visível. Não pode se aproximar voluntariamente." },
        { name: "Agarrado", desc: "Deslocamento é 0. Desvantagem em ataques contra alvos diferentes do agarrador." },
        { name: "Invisível", desc: "Não pode ser visto sem magia. Ataques contra têm Desvantagem; seus ataques têm Vantagem." },
        { name: "Paralisado", desc: "Incapacitado. Falha em resistências de For/Des. Ataques contra têm Vantagem. Acertos a 1,5m são Críticos." },
        { name: "Envenenado", desc: "Desvantagem em jogadas de ataque e testes de atributo." },
        { name: "Caído", desc: "Pode apenas rastejar. Ataques têm Desvantagem. Ataques contra têm Vantagem se a 1,5m, senão Desvantagem." },
        { name: "Impedido", desc: "Deslocamento 0. Ataques contra têm Vantagem, seus ataques têm Desvantagem. Desvantagem em testes de Des." },
        { name: "Atordoado", desc: "Incapacitado. Falha em resistências de For/Des. Ataques contra têm Vantagem." },
        { name: "Inconsciente", desc: "Incapacitado, cai Caído. Falha For/Des. Ataques contra têm Vantagem. Acertos a 1,5m são Críticos." }
    ]},
    { title: "Componentes de Magia", items: [
        { name: "Verbal (V)", desc: "O cântico de palavras místicas. Não é possível conjurar se estiver amordaçado ou em uma área de silêncio mágico." },
        { name: "Somático (S)", desc: "Gesticulação vigorosa ou conjunto complexo de gestos. Requer pelo menos uma mão livre." },
        { name: "Material (M)", desc: "Objetos específicos ou um foco de conjuração. Requer uma mão livre (pode ser a mesma mão usada para os gestos Somáticos). O material só é consumido se a magia especificar." }
    ]},
    { title: "Tags de Magia", items: [
        { name: "Concentração (C)", desc: "Exige foco constante. Sofrer dano exige um teste de resistência de CON (CD 10 ou metade do dano sofrido, o que for maior). Conjurar outra magia de concentração encerra a atual." },
        { name: "Ritual (R)", desc: "Pode ser conjurada como ritual se você tiver a característica. Demora 10 minutos a mais para conjurar, mas não gasta um espaço de magia." }
    ]},
    { title: "Escolas de Magia", items: [
        { name: "Abjuração", desc: "Magias de proteção que criam barreiras mágicas, anulam efeitos nocivos, protegem locais contra invasores ou banem criaturas para outros planos de existência (ex.: Escudo Arcano, Contramágica, Banimento)." },
        { name: "Conjuração", desc: "Magias que transportam objetos e criaturas de um local para outro (teletransporte) ou invocam criaturas e matéria a partir do nada (ex.: Passo Nebuloso, Mãos Mágicas, Encontrar Familiar)." },
        { name: "Adivinhação", desc: "Magias que revelam informações, seja na forma de segredos há muito esquecidos, vislumbres do futuro, localização de coisas ocultas ou percepção sobrenatural (ex.: Detectar Magia, Identificação, Vidência)." },
        { name: "Encantamento", desc: "Magias que afetam a mente de outros seres, influenciando ou controlando seu comportamento, inspirando aliados ou confundindo inimigos (ex.: Enfeitiçar Pessoa, Imobilizar Pessoa, Sugestão)." },
        { name: "Evocação", desc: "Magias que manipulam energia mágica bruta para produzir um efeito desejado — disparando explosões de fogo ou relâmpago, ou canalizando energia positiva para curar ferimentos (ex.: Bola de Fogo, Curar Ferimentos, Mísseis Mágicos)." },
        { name: "Ilusão", desc: "Magias que enganam os sentidos ou a mente de outros, fazendo criaturas verem miragens, ouvirem sons imaginários ou deixarem de notar coisas reais (ex.: Invisibilidade, Imagem Maior, Reflexos)." },
        { name: "Necromancia", desc: "Magias que manipulam as energias da vida e da morte, drenando força vital, afligindo inimigos com definhamento, erguendo mortos-vivos ou devolvendo a vida aos caídos (ex.: Infligir Ferimentos, Animar Mortos, Revivificar)." },
        { name: "Transmutação", desc: "Magias que alteram as propriedades físicas de uma criatura, objeto ou ambiente — transformando formas, ampliando a velocidade ou concedendo voo (ex.: Polimorfia, Velocidade, Voo)." }
    ]},
    { title: "Movimento & Ambiente", items: [
        { name: "Terreno Difícil", desc: "Mover-se 1,5m em terreno difícil custa 3m de deslocamento (o dobro)." },
        { name: "Rastejar, Escalar, Nadar", desc: "Cada 1,5m de movimento custa 1,5m extra (3m extra em terreno difícil), a menos que você tenha um deslocamento específico para isso." },
        { name: "Salto em Distância", desc: "Cobre uma distância em pés igual ao seu valor de Força (ex: FOR 15 = 15 ft / 4,5m), se mover pelo menos 3m antes de saltar. Salto parado cobre metade." },
        { name: "Salto em Altura", desc: "Alcança uma altura em pés igual a 3 + Mod de FOR, se mover pelo menos 3m antes de saltar. Salto parado alcança metade." },
        { name: "Dano de Queda", desc: "Uma criatura sofre 1d6 de dano de concussão para cada 3 metros (10 ft) de queda, até um máximo de 20d6. A criatura cai Caída a menos que evite todo o dano." },
        { name: "Sufocamento", desc: "Pode prender a respiração por minutos igual a 1 + mod de CON (min. 30 seg). Sem fôlego, sobrevive por rodadas igual ao mod de CON antes de cair a 0 PV." }
    ]},
    { title: "Descanso", items: [
        { name: "Descanso Curto", desc: "Um período de inatividade de pelo menos 1 hora. Personagens podem gastar um ou mais Dados de Vida para recuperar pontos de vida." },
        { name: "Descanso Longo", desc: "Um período de inatividade estendida de pelo menos 8 horas. Personagens recuperam todos os PV perdidos e até metade de seus Dados de Vida máximos." }
    ]},
    { title: "Luz e Visão", items: [
        { name: "Penumbra (Dim Light)", desc: "Também chamada de sombras. Cria uma área levemente obscurecida (desvantagem em testes de Sabedoria (Percepção) que dependem da visão)." },
        { name: "Escuridão (Darkness)", desc: "Cria uma área totalmente obscurecida. Criaturas sofrem efetivamente a condição Cego ao tentar ver algo na área." },
        { name: "Visão no Escuro (Darkvision)", desc: "Pode enxergar na penumbra como se fosse luz plena, e no escuro como se fosse penumbra (não discerne cores no escuro, apenas tons de cinza)." }
    ]},
    { title: "Exaustão (2024)", items: [
        { name: "Níveis 1-5", desc: "Subtraia o nível de Exaustão de testes de d20 (ataques, resistências, atributos) e da CD das suas Magias. Deslocamento reduz 1,5m por nível." },
        { name: "Nível 6", desc: "Morte." }
    ]},
    { title: "Cobertura", items: [
        { name: "Meia Cobertura", desc: "+2 de bônus na CA e em resistências de Destreza." },
        { name: "Três Quartos", desc: "+5 de bônus na CA e em resistências de Destreza." },
        { name: "Cobertura Total", desc: "Não pode ser alvo direto de ataques ou magias." }
    ]}
  ]
};
