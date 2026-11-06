import { safeText } from './helpers.js';

export const ENVIRONMENTS_LIST = [
    'Arctic',
    'Coastal',
    'Desert',
    'Forest',
    'Grassland',
    'Hill',
    'Mountain',
    'Swamp',
    'Underdark',
    'Underwater',
    'Urban'
];

// Tabela Oficial do Guia do Mestre (DMG p. 302–305: Monsters by Environment)
const DMG_ENVIRONMENT_BY_NAME = {
    // Dragões Cromáticos e Metálicos (Filhotes, Jovens, Adultos, Anciões)
    "white dragon": ["Arctic"],
    "silver dragon": ["Mountain", "Urban", "Arctic"],
    "blue dragon": ["Desert", "Coastal"],
    "brass dragon": ["Desert"],
    "bronze dragon": ["Coastal", "Underwater"],
    "black dragon": ["Swamp"],
    "green dragon": ["Forest"],
    "gold dragon": ["Grassland", "Forest", "Coastal"],
    "red dragon": ["Mountain", "Hill"],
    "copper dragon": ["Hill", "Desert"],

    // Gigantes
    "frost giant": ["Arctic", "Mountain"],
    "hill giant": ["Hill"],
    "stone giant": ["Mountain", "Underdark", "Hill"],
    "fire giant": ["Mountain", "Underdark"],
    "cloud giant": ["Mountain", "Coastal"],
    "storm giant": ["Coastal", "Underwater", "Mountain"],
    "ettin": ["Hill", "Mountain", "Underdark"],
    "cyclops": ["Coastal", "Desert", "Grassland", "Hill", "Mountain", "Underdark"],
    "ogre": ["Forest", "Grassland", "Hill", "Mountain", "Swamp", "Underdark"],
    "half-ogre": ["Hill", "Mountain", "Urban", "Underdark"],
    "oni": ["Forest", "Urban", "Hill"],
    "troll": ["Arctic", "Forest", "Hill", "Mountain", "Swamp", "Underdark"],

    // Humanoides e NPCs (Comuns em múltiplos ambientes + Urbano)
    "bandit": ["Arctic", "Coastal", "Desert", "Forest", "Grassland", "Hill", "Mountain", "Swamp", "Urban"],
    "bandit captain": ["Arctic", "Coastal", "Desert", "Forest", "Grassland", "Hill", "Mountain", "Swamp", "Urban"],
    "berserker": ["Arctic", "Coastal", "Forest", "Hill", "Mountain"],
    "commoner": ["Arctic", "Coastal", "Desert", "Forest", "Grassland", "Hill", "Urban"],
    "cultist": ["Underdark", "Urban", "Swamp", "Desert", "Forest"],
    "cult fanatic": ["Underdark", "Urban", "Swamp", "Desert", "Forest"],
    "druid": ["Arctic", "Coastal", "Desert", "Forest", "Grassland", "Hill", "Mountain", "Swamp"],
    "gladiator": ["Urban", "Desert"],
    "guard": ["Coastal", "Desert", "Forest", "Grassland", "Hill", "Mountain", "Urban"],
    "knight": ["Grassland", "Hill", "Urban"],
    "mage": ["Urban", "Underdark", "Mountain", "Forest"],
    "archmage": ["Urban", "Underdark", "Mountain"],
    "noble": ["Urban"],
    "priest": ["Urban", "Desert", "Forest", "Hill"],
    "acolyte": ["Urban", "Desert", "Forest", "Hill"],
    "scout": ["Arctic", "Coastal", "Desert", "Forest", "Grassland", "Hill", "Mountain", "Swamp", "Underdark"],
    "spy": ["Urban", "Coastal"],
    "thug": ["Urban", "Coastal"],
    "tribal warrior": ["Arctic", "Coastal", "Desert", "Forest", "Grassland", "Hill", "Mountain", "Swamp", "Underdark"],
    "veteran": ["Arctic", "Coastal", "Desert", "Forest", "Grassland", "Hill", "Mountain", "Underdark", "Urban"],
    "assassin": ["Urban", "Underdark"],

    // Goblinoides, Orcs, Kobolds, Gnolls, Povo Lagarto
    "goblin": ["Forest", "Grassland", "Hill", "Underdark"],
    "goblin boss": ["Forest", "Grassland", "Hill", "Underdark"],
    "hobgoblin": ["Desert", "Forest", "Grassland", "Hill", "Underdark"],
    "bugbear": ["Forest", "Grassland", "Hill", "Underdark"],
    "orc": ["Arctic", "Forest", "Grassland", "Hill", "Mountain", "Swamp", "Underdark"],
    "kobold": ["Arctic", "Coastal", "Desert", "Forest", "Hill", "Mountain", "Swamp", "Underdark", "Urban"],
    "gnoll": ["Desert", "Forest", "Grassland", "Hill"],
    "lizardfolk": ["Coastal", "Forest", "Swamp"],
    "sahuagin": ["Coastal", "Underwater"],
    "merfolk": ["Coastal", "Underwater"],
    "merrow": ["Coastal", "Underwater"],
    "grimlock": ["Underdark", "Mountain"],
    "duergar": ["Underdark", "Mountain"],
    "deep gnome": ["Underdark"],
    "svirfneblin": ["Underdark"],
    "drider": ["Underdark", "Forest"],
    "drow": ["Underdark"],

    // Mortos-Vivos
    "skeleton": ["Desert", "Forest", "Grassland", "Hill", "Swamp", "Underdark", "Urban"],
    "zombie": ["Desert", "Forest", "Grassland", "Swamp", "Underdark", "Urban"],
    "ghoul": ["Desert", "Swamp", "Underdark", "Urban"],
    "ghast": ["Swamp", "Underdark", "Urban"],
    "shadow": ["Swamp", "Underdark", "Urban"],
    "specter": ["Swamp", "Underdark", "Urban"],
    "wight": ["Arctic", "Desert", "Swamp", "Underdark", "Urban"],
    "wraith": ["Swamp", "Underdark", "Urban"],
    "ghost": ["Swamp", "Underdark", "Urban", "Coastal"],
    "banshee": ["Coastal", "Forest", "Swamp"],
    "mummy": ["Desert", "Swamp", "Underdark"],
    "mummy lord": ["Desert", "Swamp", "Underdark"],
    "vampire": ["Urban", "Underdark", "Forest"],
    "vampire spawn": ["Urban", "Underdark", "Forest"],
    "lich": ["Desert", "Swamp", "Underdark", "Urban", "Mountain"],
    "demilich": ["Desert", "Underdark"],
    "will-o'-wisp": ["Forest", "Swamp", "Underdark"],
    "revenant": ["Arctic", "Desert", "Forest", "Hill", "Swamp", "Urban"],

    // Monstruosidades, Aberrações, Fadas e Construtos
    "aboleth": ["Underdark", "Underwater", "Coastal"],
    "ankheg": ["Forest", "Grassland"],
    "basilisk": ["Desert", "Mountain", "Underdark"],
    "behir": ["Mountain", "Underdark"],
    "bulette": ["Grassland", "Hill", "Mountain"],
    "centaur": ["Forest", "Grassland"],
    "chimera": ["Grassland", "Hill", "Mountain"],
    "chuul": ["Coastal", "Swamp", "Underdark", "Underwater"],
    "cloaker": ["Underdark"],
    "cockatrice": ["Grassland"],
    "couatl": ["Desert", "Forest", "Grassland", "Urban"],
    "darkmantle": ["Underdark"],
    "doppelganger": ["Underdark", "Urban"],
    "dryad": ["Forest"],
    "ettercap": ["Forest", "Underdark"],
    "gargoyle": ["Underdark", "Urban", "Mountain"],
    "gelatinous cube": ["Underdark"],
    "gibbering mouther": ["Underdark"],
    "gray ooze": ["Underdark", "Swamp"],
    "ochre jelly": ["Underdark", "Swamp"],
    "black pudding": ["Underdark"],
    "gorgon": ["Forest", "Grassland", "Hill"],
    "grick": ["Forest", "Underdark"],
    "griffon": ["Arctic", "Coastal", "Grassland", "Hill", "Mountain"],
    "harpy": ["Coastal", "Forest", "Hill", "Mountain"],
    "hell hound": ["Mountain", "Underdark", "Urban"],
    "hippogriff": ["Grassland", "Hill", "Mountain"],
    "hydra": ["Coastal", "Swamp", "Underdark", "Underwater"],
    "kraken": ["Coastal", "Underwater"],
    "lamia": ["Desert"],
    "manticore": ["Arctic", "Coastal", "Grassland", "Hill", "Mountain"],
    "medusa": ["Desert", "Underdark", "Urban"],
    "mimic": ["Underdark", "Urban"],
    "minotaur": ["Underdark", "Mountain"],
    "naga": ["Desert", "Forest", "Swamp", "Underdark"],
    "otyugh": ["Underdark", "Swamp", "Urban"],
    "owlbear": ["Forest", "Hill"],
    "pegasus": ["Forest", "Grassland", "Hill", "Mountain"],
    "phase spider": ["Desert", "Forest", "Grassland", "Hill", "Underdark", "Urban"],
    "pseudodragon": ["Coastal", "Desert", "Forest", "Hill", "Mountain", "Urban"],
    "purple worm": ["Desert", "Mountain", "Underdark"],
    "rakshasa": ["Urban"],
    "remorhaz": ["Arctic"],
    "roc": ["Arctic", "Coastal", "Desert", "Hill", "Mountain"],
    "roper": ["Underdark", "Mountain"],
    "rust monster": ["Underdark"],
    "salamander": ["Underdark", "Mountain"],
    "satyr": ["Forest"],
    "sea hag": ["Coastal", "Underwater"],
    "green hag": ["Forest", "Hill", "Swamp"],
    "night hag": ["Swamp", "Underdark"],
    "shambling mound": ["Forest", "Swamp"],
    "shield guardian": ["Urban", "Underdark"],
    "sphinx": ["Desert"],
    "androsphinx": ["Desert"],
    "gynosphinx": ["Desert"],
    "sprite": ["Forest"],
    "stirge": ["Coastal", "Desert", "Forest", "Grassland", "Hill", "Mountain", "Swamp", "Underdark", "Urban"],
    "tarrasque": ["Desert", "Grassland", "Hill", "Mountain", "Urban"],
    "treant": ["Forest"],
    "unicorn": ["Forest"],
    "water weird": ["Swamp", "Underdark", "Underwater", "Urban"],
    "winter wolf": ["Arctic"],
    "worg": ["Forest", "Grassland", "Hill"],
    "wyvern": ["Hill", "Mountain", "Coastal"],
    "xorn": ["Underdark"],
    "yeti": ["Arctic", "Mountain"],

    // Licantropos
    "werebear": ["Arctic", "Forest", "Hill"],
    "wereboar": ["Forest", "Grassland", "Hill"],
    "wererat": ["Forest", "Underdark", "Urban"],
    "weretiger": ["Desert", "Forest", "Grassland", "Urban"],
    "werewolf": ["Forest", "Hill", "Urban"]
};

// Normaliza nomes de ambientes vindos de APIs externas (Open5e v1/v2)
const normalizeSingleEnv = (raw) => {
    const s = String(raw || '').toLowerCase().trim();
    if (!s) return null;
    if (s.includes('arctic') || s.includes('ice') || s.includes('tundra') || s.includes('glacier') || s.includes('artico') || s.includes('ártico')) return 'Arctic';
    if (s.includes('coast') || s.includes('beach') || s.includes('island') || s.includes('costeiro')) return 'Coastal';
    if (s.includes('desert') || s.includes('deserto')) return 'Desert';
    if (s.includes('forest') || s.includes('jungle') || s.includes('wood') || s.includes('floresta')) return 'Forest';
    if (s.includes('grass') || s.includes('plain') || s.includes('savanna') || s.includes('steppe') || s.includes('planicie') || s.includes('planície')) return 'Grassland';
    if (s.includes('hill') || s.includes('colina')) return 'Hill';
    if (s.includes('mountain') || s.includes('peak') || s.includes('volcano') || s.includes('montanha')) return 'Mountain';
    if (s.includes('swamp') || s.includes('marsh') || s.includes('bog') || s.includes('pantano') || s.includes('pântano')) return 'Swamp';
    if (s.includes('underdark') || s.includes('cavern') || s.includes('cave') || s.includes('subterranean') || s.includes('dungeon') || s.includes('subterraneo') || s.includes('subterrâneo')) return 'Underdark';
    if (s.includes('underwater') || s.includes('water') || s.includes('aquatic') || s.includes('ocean') || s.includes('sea') || s.includes('subaquatico') || s.includes('subaquático')) return 'Underwater';
    if (s.includes('urban') || s.includes('city') || s.includes('town') || s.includes('settlement') || s.includes('sewer') || s.includes('temple') || s.includes('ruin') || s.includes('urbano')) return 'Urban';
    return null;
};

/**
 * Retorna a lista de ambientes oficiais D&D 5e (DMG) para um monstro,
 * combinando dados explícitos do objeto + tabela oficial DMG + heurísticas inteligentes.
 */
export const getMonsterEnvironments = (monster) => {
    if (!monster || typeof monster !== 'object') return [];

    const envSet = new Set();

    // 1. Verifica campos explícitos no monstro (environments array ou environment string)
    const rawEnvs = Array.isArray(monster.environments)
        ? monster.environments
        : monster.environment
            ? String(monster.environment).split(',')
            : [];

    rawEnvs.forEach(e => {
        const val = typeof e === 'object' ? (e.name || e.key || '') : String(e || '');
        const norm = normalizeSingleEnv(val);
        if (norm) envSet.add(norm);
    });

    if (envSet.size > 0) {
        return Array.from(envSet);
    }

    const name = safeText(monster.name).toLowerCase().trim();
    const type = (typeof monster.type === 'object' ? safeText(monster.type.name || monster.type.key) : safeText(monster.type)).toLowerCase();

    // 2. Verifica na tabela oficial do DMG (match exato ou parcial por família)
    if (DMG_ENVIRONMENT_BY_NAME[name]) {
        DMG_ENVIRONMENT_BY_NAME[name].forEach(e => envSet.add(e));
        return Array.from(envSet);
    }

    for (const [key, envs] of Object.entries(DMG_ENVIRONMENT_BY_NAME)) {
        if (name.includes(key)) {
            envs.forEach(e => envSet.add(e));
        }
    }

    if (envSet.size > 0) {
        return Array.from(envSet);
    }

    // 3. Heurísticas Inteligentes baseadas em Nome, Deslocamento, Traços e Tipo de Criatura
    const speedObj = typeof monster.speed === 'object' && monster.speed !== null ? monster.speed : {};
    const speedStr = typeof monster.speed === 'string' ? monster.speed.toLowerCase() : '';
    const hasSwim = Boolean(speedObj.swim || speedStr.includes('swim') || speedStr.includes('natação'));
    const hasFly = Boolean(speedObj.fly || speedStr.includes('fly') || speedStr.includes('voo'));
    const hasBurrow = Boolean(speedObj.burrow || speedStr.includes('burrow') || speedStr.includes('escavação'));
    const hasClimb = Boolean(speedObj.climb || speedStr.includes('climb') || speedStr.includes('escalada'));

    // Palavras-chave no nome (Feras, Elementais, Mephits, Enxames, Dinossauros)
    if (/\b(polar|winter|ice|frost|snow|mammoth|walrus|penguin)\b/.test(name)) {
        envSet.add('Arctic');
    }
    if (/\b(shark|whale|octopus|quipper|squid|crab|sea|reef|plesiosaurus|water|dolphin|fish|frog|toad|crocodile)\b/.test(name)) {
        envSet.add('Underwater');
        envSet.add('Coastal');
    }
    if (/\b(crocodile|frog|toad|constrictor|insect|mosquito|leech)\b/.test(name)) {
        envSet.add('Swamp');
    }
    if (/\b(camel|scorpion|vulture|jackal|hyena|cobra|mummy|dust|sand|fire|magma|efreeti)\b/.test(name)) {
        envSet.add('Desert');
    }
    if (/\b(spider|ape|baboon|badger|bear|boar|deer|elk|owl|panther|tiger|wolf|weasel|bat|snake|treant|shrub|tree|awakened)\b/.test(name)) {
        envSet.add('Forest');
    }
    if (/\b(lion|elephant|rhinoceros|triceratops|tyrannosaurus|allosaurus|ankylosaurus|pteranodon|horse|pony|mule|elk|hyena|jackal|boar|vulture|eagle|hawk|axe beak|blood hawk)\b/.test(name)) {
        envSet.add('Grassland');
    }
    if (/\b(goat|eagle|hawk|griffon|hippogriff|pegasus|peryton|roc|gargoyle|air|smoke|steam|cloud|storm|stone|earth)\b/.test(name)) {
        envSet.add('Mountain');
        envSet.add('Hill');
    }
    if (/\b(wolf|bear|boar|lion|goat|badger|hyena|eagle|owl|bat|rat|spider)\b/.test(name)) {
        envSet.add('Hill');
    }
    if (/\b(rat|cat|dog|mastiff|raven|bat|spider|horse|mule|pony|animated|rug|broom|sword|armor|golem|homunculus|invisible stalker|gargoyle)\b/.test(name)) {
        envSet.add('Urban');
    }
    if (/\b(bat|rat|spider|snake|lizard|beetle|centipede|fungus|shrieker|violet|ooze|cube|jelly|pudding|earth|magma|mud|xorn|dretch|quasit|imp|demon|devil)\b/.test(name)) {
        envSet.add('Underdark');
    }

    if (envSet.size > 0) {
        return Array.from(envSet);
    }

    // 4. Fallback por Deslocamento e Tipo de Criatura (garante que nenhum monstro fique órfão)
    if (hasSwim) {
        envSet.add('Underwater');
        envSet.add('Coastal');
        envSet.add('Swamp');
    }
    if (hasBurrow) {
        envSet.add('Underdark');
        envSet.add('Desert');
        envSet.add('Hill');
    }
    if (hasClimb) {
        envSet.add('Forest');
        envSet.add('Mountain');
        envSet.add('Underdark');
    }
    if (hasFly) {
        envSet.add('Mountain');
        envSet.add('Forest');
        envSet.add('Coastal');
        envSet.add('Grassland');
    }

    if (type.includes('aberration') || type.includes('ooze')) {
        envSet.add('Underdark');
        envSet.add('Swamp');
    } else if (type.includes('beast')) {
        envSet.add('Forest');
        envSet.add('Grassland');
        envSet.add('Hill');
    } else if (type.includes('celestial')) {
        envSet.add('Mountain');
        envSet.add('Urban');
        envSet.add('Desert');
    } else if (type.includes('construct')) {
        envSet.add('Urban');
        envSet.add('Underdark');
        envSet.add('Desert');
    } else if (type.includes('dragon')) {
        envSet.add('Mountain');
        envSet.add('Hill');
        envSet.add('Forest');
        envSet.add('Coastal');
    } else if (type.includes('elemental')) {
        envSet.add('Desert');
        envSet.add('Mountain');
        envSet.add('Underdark');
        envSet.add('Coastal');
    } else if (type.includes('fey')) {
        envSet.add('Forest');
        envSet.add('Swamp');
        envSet.add('Hill');
    } else if (type.includes('fiend')) {
        envSet.add('Underdark');
        envSet.add('Urban');
        envSet.add('Desert');
        envSet.add('Swamp');
    } else if (type.includes('giant')) {
        envSet.add('Hill');
        envSet.add('Mountain');
        envSet.add('Arctic');
    } else if (type.includes('humanoid')) {
        envSet.add('Urban');
        envSet.add('Forest');
        envSet.add('Grassland');
        envSet.add('Hill');
        envSet.add('Coastal');
    } else if (type.includes('monstrosity')) {
        envSet.add('Underdark');
        envSet.add('Mountain');
        envSet.add('Forest');
        envSet.add('Desert');
    } else if (type.includes('plant')) {
        envSet.add('Forest');
        envSet.add('Swamp');
    } else if (type.includes('undead')) {
        envSet.add('Underdark');
        envSet.add('Swamp');
        envSet.add('Urban');
        envSet.add('Desert');
    } else {
        ENVIRONMENTS_LIST.forEach(e => envSet.add(e));
    }

    return Array.from(envSet);
};
