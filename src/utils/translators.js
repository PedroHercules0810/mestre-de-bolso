// --- Smart Name Translator ---
export const translateName = (name, lang) => {
    if (lang !== 'pt' || !name) return name;
    const exactMatches = {
        "skeleton": "Esqueleto", "zombie": "Zumbi", "goblin": "Goblin", "orc": "Orc", 
        "bandit": "Bandido", "guard": "Guarda", "commoner": "Plebeu", "acolyte": "Acólito", 
        "cultist": "Cultista", "knight": "Cavaleiro", "mage": "Mago", "priest": "Sacerdote",
        "spy": "Espião", "thug": "Capanga", "veteran": "Veterano", "assassin": "Assassino",
        "vampire": "Vampiro", "ghoul": "Carniçal", "ghast": "Lívido", "wight": "Inumano",
        "wraith": "Aparição", "specter": "Espectro", "ghost": "Fantasma", "mummy": "Múmia",
        "lich": "Lich", "troll": "Troll", "ogre": "Ogro",
        "wolf": "Lobo", "dire wolf": "Lobo Atroz", "bear": "Urso", "giant spider": "Aranha Gigante",
        "bat": "Morcego", "giant bat": "Morcego Gigante", "rat": "Rato", "giant rat": "Rato Gigante",
        "owl": "Coruja", "giant owl": "Coruja Gigante", "eagle": "Águia", "giant eagle": "Águia Gigante",
        "longsword": "Espada Longa", "shortsword": "Espada Curta", "dagger": "Adaga",
        "rapier": "Rapieira", "scimitar": "Cimitarra", "greatsword": "Espada Grande",
        "handaxe": "Machadinha", "battleaxe": "Machado de Batalha", "greataxe": "Machado Grande",
        "warhammer": "Martelo de Guerra", "mace": "Maça", "morningstar": "Estrela d'Alva",
        "halberd": "Alabarda", "glaive": "Glaive", "pike": "Pique", "spear": "Lança",
        "javelin": "Azagaia", "shortbow": "Arco Curto", "longbow": "Arco Longo",
        "light crossbow": "Besta Leve", "heavy crossbow": "Besta Pesada", "hand crossbow": "Besta de Mão",
        "sling": "Funda", "dart": "Dardo", "club": "Clava", "quarterstaff": "Bordão",
        "leather armor": "Armadura de Couro", "studded leather armor": "Couro Batido",
        "hide armor": "Gibão de Peles", "chain shirt": "Camisão de Malha", "scale mail": "Brunea",
        "breastplate": "Peitoral", "half plate armor": "Meia Armadura", "ring mail": "Cota de Anéis",
        "chain mail": "Cota de Malha", "splint armor": "Cota de Talas", "plate armor": "Armadura de Placas",
        "shield": "Escudo", "bag of holding": "Mochila de Carga", "bag of tricks": "Bolsa de Truques",
        "boots of elvenkind": "Botas Élficas", "cloak of elvenkind": "Manto Élfico",
        "potion of healing": "Poção de Cura", "potion of greater healing": "Poção de Cura Maior",
        "potion of superior healing": "Poção de Cura Superior", "potion of supreme healing": "Poção de Cura Suprema"
    };
    
    const lowerName = String(name).trim().toLowerCase();
    if (exactMatches[lowerName]) return exactMatches[lowerName];

    let tName = String(name);
    const patterns = [
        [/Potion of/gi, "Poção de"], [/Ring of/gi, "Anel de"], [/Scroll of/gi, "Pergaminho de"],
        [/Wand of/gi, "Varinha de"], [/Staff of/gi, "Cajado de"], [/Rod of/gi, "Bastão de"],
        [/Amulet of/gi, "Amuleto de"], [/Cloak of/gi, "Manto de"], [/Boots of/gi, "Botas de"],
        [/Gloves of/gi, "Luvas de"], [/Adult (.*) Dragon/gi, "Dragão $1 Adulto"], 
        [/Ancient (.*) Dragon/gi, "Dragão $1 Ancião"], [/Young (.*) Dragon/gi, "Dragão $1 Jovem"],
        [/(.*) Dragon Wyrmling/gi, "Filhote de Dragão $1"], [/Red/gi, "Vermelho"], [/Blue/gi, "Azul"],
        [/Green/gi, "Verde"], [/Black/gi, "Negro"], [/White/gi, "Branco"], [/Gold/gi, "de Ouro"],
        [/Silver/gi, "de Prata"], [/Bronze/gi, "de Bronze"], [/Copper/gi, "de Cobre"], 
        [/Brass/gi, "de Latão"], [/Hill Giant/gi, "Gigante da Colina"], [/Stone Giant/gi, "Gigante de Pedra"],
        [/Frost Giant/gi, "Gigante do Gelo"], [/Fire Giant/gi, "Gigante do Fogo"], 
        [/Cloud Giant/gi, "Gigante das Nuvens"], [/Storm Giant/gi, "Gigante da Tempestade"],
        [/Swarm of/gi, "Enxame de"], [/Bats/gi, "Morcegos"], [/Rats/gi, "Ratos"], 
        [/Insects/gi, "Insetos"], [/Spiders/gi, "Aranhas"], [/Giant/gi, "Gigante"],
        [/Healing/gi, "Cura"], [/Greater/gi, "Maior"], [/Superior/gi, "Superior"], 
        [/Supreme/gi, "Suprema"], [/Invisibility/gi, "Invisibilidade"], [/Protection/gi, "Proteção"],
        [/Resistance/gi, "Resistência"], [/Fire/gi, "Fogo"], [/Water/gi, "Água"], 
        [/Flying/gi, "Voador"], [/Speed/gi, "Velocidade"], [/Strength/gi, "Força"]
    ];

    patterns.forEach(([regex, replacement]) => { tName = tName.replace(regex, replacement); });
    return tName;
};

// --- Smart Translation Dictionary (Tags & Mechanics) ---
export const translateTerm = (text, lang) => {
    if (lang !== 'pt' || !text) return text;
    const term = String(text).toLowerCase().trim();
    
    const dict = {
        "tiny": "Miúdo", "small": "Pequeno", "medium": "Médio", "large": "Grande", "huge": "Enorme", "gargantuan": "Imenso",
        "aberration": "Aberração", "beast": "Fera", "celestial": "Celestial", "construct": "Construto", "dragon": "Dragão", "elemental": "Elemental", "fey": "Fada", "fiend": "Corruptor", "giant": "Gigante", "humanoid": "Humanoide", "monstrosity": "Monstruosidade", "ooze": "Limo", "plant": "Planta", "undead": "Morto-vivo", "swarm of tiny beasts": "Enxame de feras miúdas",
        "unaligned": "Imparcial", "any alignment": "Qualquer alinhamento", 
        "lawful good": "Leal e Bom", "neutral good": "Neutro e Bom", "chaotic good": "Caótico e Bom",
        "lawful neutral": "Leal e Neutro", "neutral": "Neutro", "chaotic neutral": "Caótico e Neutro",
        "lawful evil": "Leal e Mau", "neutral evil": "Neutro e Mau", "chaotic evil": "Caótico e Mau",
        "common": "Comum", "uncommon": "Incomum", "rare": "Raro", "very rare": "Muito Raro", "legendary": "Lendário", "artifact": "Artefato",
        "acid": "Ácido", "bludgeoning": "Concussão", "cold": "Frio", "fire": "Fogo", "force": "Energia", "lightning": "Elétrico", "necrotic": "Necrótico", "piercing": "Perfurante", "poison": "Venenoso", "psychic": "Psíquico", "radiant": "Radiante", "slashing": "Cortante", "thunder": "Trovejante",
        "finesse": "Acuidade", "heavy": "Pesado", "light": "Leve", "loading": "Recarga", "reach": "Alcance", "special": "Especial", "thrown": "Arremesso", "two-handed": "Duas Mãos", "versatile": "Versátil", "ammunition": "Munição",
        "multiattack": "Ataques Múltiplos", "bite": "Mordida", "claw": "Garra", "longsword": "Espada Longa", "shortsword": "Espada Curta", "shortbow": "Arco Curto", "longbow": "Arco Longo", "dagger": "Adaga", "mace": "Maça", "tail": "Cauda", "breath weapon": "Arma de Sopro",
        "weapon": "Arma", "armor": "Armadura", "wondrous item": "Item Maravilhoso", "potion": "Poção", "ring": "Anel", "scroll": "Pergaminho", "wand": "Varinha", "staff": "Cajado", "rod": "Bastão",
        "melee weapon": "Arma Corpo-a-Corpo", "ranged weapon": "Arma à Distância", "martial weapon": "Arma Marcial", "simple weapon": "Arma Simples", "shield": "Escudo", "light armor": "Armadura Leve", "medium armor": "Armadura Média", "heavy armor": "Armadura Pesada", "adventuring gear": "Equipamento de Aventura"
    };

    return dict[term] || text; 
};
