// ============================================================================
// MESTRE DE BOLSO — Motor Híbrido de Tradução D&D 5e / SRD 2024 (PT-BR)
// Camada 1: Glossário Oficial SRD + Parser Estrutural/Gramatical Determinístico
// Camada 2: Integração com Cache Neural Assíncrono (translatorService.js)
// ============================================================================

let dynamicCacheGetter = null;
export const registerDynamicTranslationGetter = (fn) => {
    dynamicCacheGetter = fn;
};

// Normaliza texto removendo acentos para busca bilíngue
export const normalizeForSearch = (str) => {
    if (!str) return '';
    return String(str)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
};

// Verifica se um termo buscado bate com o nome em Inglês OU Português
export const matchesBilingualSearch = (originalName, searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) return true;
    const q = normalizeForSearch(searchTerm);
    const enNorm = normalizeForSearch(originalName);
    if (enNorm.includes(q)) return true;
    const ptNorm = normalizeForSearch(translateName(originalName, 'pt'));
    return ptNorm.includes(q);
};

// --- Glossário Oficial SRD (Monstros, Armas, Armaduras, Itens Mágicos) ---
const EXACT_NAMES_DICT = {
    // Humanoides & NPCs
    "aboleth": "Aboleth",
    "acolyte": "Acólito",
    "archmage": "Arquimago",
    "assassin": "Assassino",
    "bandit": "Bandido",
    "bandit captain": "Capitão Bandido",
    "berserker": "Berserker",
    "commoner": "Plebeu",
    "cultist": "Cultista",
    "cult fanatic": "Fanático do Culto",
    "druid": "Druida",
    "gladiator": "Gladiador",
    "guard": "Guarda",
    "knight": "Cavaleiro",
    "mage": "Mago",
    "noble": "Nobre",
    "priest": "Sacerdote",
    "scout": "Batedor",
    "spy": "Espião",
    "thug": "Capanga",
    "tribal warrior": "Guerreiro Tribal",
    "veteran": "Veterano",

    // Mortos-Vivos
    "banshee": "Banshee",
    "death knight": "Cavaleiro da Morte",
    "demilich": "Demilich",
    "flameskull": "Crânio Flamejante",
    "ghast": "Lívido",
    "ghost": "Fantasma",
    "ghoul": "Carniçal",
    "lich": "Lich",
    "mummy": "Múmia",
    "mummy lord": "Senhor das Múmias",
    "minotaur skeleton": "Esqueleto de Minotauro",
    "ogre zombie": "Zumbi Ogro",
    "poltergeist": "Poltergeist",
    "revenant": "Revenante",
    "shadow": "Sombra",
    "skeleton": "Esqueleto",
    "specter": "Espectro",
    "vampire": "Vampiro",
    "vampire spawn": "Cria Vampírica",
    "warhorse skeleton": "Esqueleto de Cavalo de Guerra",
    "wight": "Inumano",
    "will-o'-wisp": "Fogo-Fátuo",
    "wraith": "Aparição",
    "zombie": "Zumbi",

    // Monstros Clássicos & Humanoides Monstruosos
    "ankheg": "Ankheg",
    "azer": "Azer",
    "basilisk": "Basilisco",
    "behir": "Behir",
    "bugbear": "Bugbear",
    "bugbear chief": "Chefe Bugbear",
    "bulette": "Bulette",
    "centaur": "Centauro",
    "chimera": "Quimera",
    "chuul": "Chuul",
    "cloaker": "Manto Negro",
    "cockatrice": "Cocatriz",
    "couatl": "Couatl",
    "cyclops": "Ciclope",
    "darkmantle": "Manto Escuro",
    "deva": "Deva",
    "doppelganger": "Duplo",
    "drider": "Drider",
    "dryad": "Dríade",
    "duergar": "Duergar",
    "ettercap": "Ettercap",
    "ettin": "Ettin",
    "Flesh Golem": "Golem de Carne",
    "gargoyle": "Gárgula",
    "galeb duhr": "Galeb Duhr",
    "gibbering mouther": "Abocanhador Matraqueante",
    "gnoll": "Gnoll",
    "gnoll pack lord": "Senhor da Matilha Gnoll",
    "gnome, deep (svirfneblin)": "Gnomo das Profundezas (Svirfneblin)",
    "deep gnome (svirfneblin)": "Gnomo das Profundezas (Svirfneblin)",
    "goblin": "Goblin",
    "goblin boss": "Chefe Goblin",
    "gorgon": "Górgona",
    "grick": "Grick",
    "griffon": "Grifo",
    "grimlock": "Grimlock",
    "harpy": "Harpia",
    "hell hound": "Cão Infernal",
    "hippogriff": "Hipogrifo",
    "hobgoblin": "Hobgoblin",
    "hobgoblin captain": "Capitão Hobgoblin",
    "hobgoblin warlord": "Senhor da Guerra Hobgoblin",
    "homunculus": "Homúnculo",
    "hydra": "Hidra",
    "invisible stalker": "Perseguidor Invisível",
    "kobold": "Kobold",
    "kraken": "Kraken",
    "lamia": "Lâmia",
    "lizardfolk": "Povo Lagarto",
    "lycanthrope": "Licantropo",
    "werebear": "Homem-Urso",
    "wereboar": "Homem-Javali",
    "wererat": "Homem-Rato",
    "weretiger": "Homem-Tigre",
    "werewolf": "Lobisomem",
    "manticore": "Mantícora",
    "medusa": "Medusa",
    "merfolk": "Povo do Mar",
    "merrow": "Merrow",
    "mimic": "Mímico",
    "minotaur": "Minotauro",
    "naga": "Naga",
    "guardian naga": "Naga Guardiã",
    "spirit naga": "Naga Espiritual",
    "bone naga": "Naga de Osso",
    "nightmare": "Pesadelo",
    "nymph": "Ninfa",
    "ogre": "Ogro",
    "half-ogre": "Meio-Ogro",
    "oni": "Oni",
    "orc": "Orc",
    "orc war chief": "Chefe de Guerra Orc",
    "otyugh": "Otyugh",
    "owlbear": "Urso-Coruja",
    "pegasus": "Pégaso",
    "phase spider": "Aranha de Fase",
    "planetar": "Planetar",
    "pseudodragon": "Pseudodragão",
    "purple worm": "Verme Púrpura",
    "rakshasa": "Rakshasa",
    "remorhaz": "Remorhaz",
    "roc": "Roca",
    "roper": "Roper",
    "rust monster": "Monstro da Ferrugem",
    "sahuagin": "Sahuagin",
    "salamander": "Salamandra",
    "satyr": "Sátiro",
    "sea hag": "Bruxa do Mar",
    "green hag": "Bruxa Verde",
    "night hag": "Bruxa da Noite",
    "shambling mound": "Monte Trôpego",
    "shield guardian": "Guardião do Escudo",
    "solar": "Solar",
    "sphinx": "Esfinge",
    "androsphinx": "Androesfinge",
    "gynosphinx": "Ginoesfinge",
    "sprite": "Sprite",
    "stirge": "Stirge",
    "succubus": "Súcubo",
    "incubus": "Íncubo",
    "succubus/incubus": "Súcubo/Íncubo",
    "tarrasque": "Tarrasque",
    "treant": "Ente",
    "troll": "Troll",
    "unicorn": "Unicórnio",
    "water weird": "Anomalia da Água",
    "winter wolf": "Lobo Invernal",
    "worg": "Worg",
    "wyvern": "Wyvern",
    "xorn": "Xorn",
    "yeti": "Yeti",

    // Limos (Oozes)
    "black pudding": "Pudim Negro",
    "gelatinous cube": "Cubo Gelatinoso",
    "gray ooze": "Limo Cinzento",
    "ochre jelly": "Geleia Ocre",

    // Corruptores (Demônios e Diabos)
    "balor": "Balor",
    "barbed devil": "Diabo Farpado",
    "bearded devil": "Diabo Barbado",
    "bone devil": "Diabo dos Ossos",
    "chain devil": "Diabo das Correntes",
    "dretch": "Dretch",
    "erinyes": "Erínia",
    "glabrezu": "Glabrezu",
    "hezrou": "Hezrou",
    "horned devil": "Diabo Chifrudo",
    "ice devil": "Diabo do Gelo",
    "imp": "Diabrete",
    "lemure": "Lêmure",
    "marilith": "Marilith",
    "nalfeshnee": "Nalfeshnee",
    "pit fiend": "Senhor das Profundezas",
    "quasit": "Quasit",
    "shadow demon": "Demônio das Sombras",
    "spined devil": "Diabo Espinhoso",
    "vrock": "Vrock",

    // Feras e Animais
    "ape": "Macaco",
    "axe beak": "Bico de Machado",
    "baboon": "Babuíno",
    "badger": "Texugo",
    "bat": "Morcego",
    "black bear": "Urso Negro",
    "blink dog": "Cão Teleportador",
    "blood hawk": "Falcão de Sangue",
    "boar": "Javali",
    "brown bear": "Urso Pardo",
    "camel": "Camelo",
    "cat": "Gato",
    "constrictor snake": "Cobra Constritora",
    "crab": "Caranguejo",
    "crocodile": "Crocodilo",
    "deer": "Cervo",
    "dire wolf": "Lobo Atroz",
    "draft horse": "Cavalo de Tração",
    "eagle": "Águia",
    "elephant": "Elefante",
    "elk": "Alce",
    "flying snake": "Cobra Voadora",
    "frog": "Sapo",
    "goat": "Cabra",
    "hawk": "Falcão",
    "hunter shark": "Tubarão Caçador",
    "hyena": "Hiena",
    "jackal": "Chacal",
    "killer whale": "Baleia Assassina",
    "lion": "Leão",
    "lizard": "Lagarto",
    "mammoth": "Mamute",
    "mastiff": "Mastim",
    "mule": "Mula",
    "octopus": "Polvo",
    "owl": "Coruja",
    "panther": "Pantera",
    "plesiosaurus": "Plessiossauro",
    "poisonous snake": "Cobra Venenosa",
    "polar bear": "Urso Polar",
    "pony": "Pônei",
    "quipper": "Piranha",
    "rat": "Rato",
    "raven": "Corvo",
    "reef shark": "Tubarão de Recife",
    "rhinoceros": "Rinoceronte",
    "riding horse": "Cavalo de Montaria",
    "saber-toothed tiger": "Tigre Dente-de-Sabre",
    "scorpion": "Escorpião",
    "sea horse": "Cavalo-Marinho",
    "spider": "Aranha",
    "swarm of bats": "Enxame de Morcegos",
    "swarm of insects": "Enxame de Insetos",
    "swarm of poisonous snakes": "Enxame de Cobras Venenosas",
    "swarm of quippers": "Enxame de Piranhas",
    "swarm of rats": "Enxame de Ratos",
    "swarm of ravens": "Enxame de Corvos",
    "swarm of spiders": "Enxame de Aranhas",
    "tiger": "Tigre",
    "tricertops": "Tricerátops",
    "triceratops": "Tricerátops",
    "tyrannosaurus rex": "Tiranossauro Rex",
    "vulture": "Abutre",
    "warhorse": "Cavalo de Guerra",
    "weasel": "Doninha",
    "wolf": "Lobo",

    // Armas
    "club": "Clava",
    "dagger": "Adaga",
    "greatclub": "Clava Grande",
    "handaxe": "Machadinha",
    "javelin": "Azagaia",
    "light hammer": "Martelo Leve",
    "mace": "Maça",
    "quarterstaff": "Bordão",
    "sickle": "Foice Curta",
    "spear": "Lança",
    "light crossbow": "Besta Leve",
    "dart": "Dardo",
    "shortbow": "Arco Curto",
    "sling": "Funda",
    "battleaxe": "Machado de Batalha",
    "flail": "Mangual",
    "glaive": "Glaive",
    "greataxe": "Machado Grande",
    "greatsword": "Espada Grande",
    "halberd": "Alabarda",
    "lance": "Lança de Montaria",
    "longsword": "Espada Longa",
    "maul": "Malho",
    "morningstar": "Estrela d'Alva",
    "pike": "Pique",
    "rapier": "Rapieira",
    "scimitar": "Cimitarra",
    "shortsword": "Espada Curta",
    "trident": "Tridente",
    "war pick": "Picareta de Guerra",
    "warhammer": "Martelo de Guerra",
    "whip": "Chicote",
    "blowgun": "Zarabatana",
    "hand crossbow": "Besta de Mão",
    "heavy crossbow": "Besta Pesada",
    "longbow": "Arco Longo",
    "net": "Rede",

    // Armaduras & Escudos
    "padded": "Armadura Acolchoada",
    "padded armor": "Armadura Acolchoada",
    "leather": "Armadura de Couro",
    "leather armor": "Armadura de Couro",
    "studded leather": "Couro Batido",
    "studded leather armor": "Armadura de Couro Batido",
    "hide": "Gibão de Peles",
    "hide armor": "Gibão de Peles",
    "chain shirt": "Camisão de Malha",
    "scale mail": "Brunea",
    "breastplate": "Peitoral de Aço",
    "half plate": "Meia Armadura",
    "half plate armor": "Meia Armadura",
    "ring mail": "Cota de Anéis",
    "chain mail": "Cota de Malha",
    "splint": "Cota de Talas",
    "splint armor": "Cota de Talas",
    "plate": "Armadura de Placas",
    "plate armor": "Armadura de Placas",
    "shield": "Escudo",

    // Itens Mágicos e Equipamentos Comuns
    "alchemist's fire": "Fogo Alquímico",
    "antitoxin": "Antitoxina",
    "bag of beans": "Bolsa de Feijões",
    "bag of devouring": "Bolsa Devoradora",
    "bag of holding": "Mochila de Carga",
    "bag of tricks": "Bolsa de Truques",
    "bead of force": "Conta de Energia",
    "belt of dwarvenkind": "Cinturão da Raça Anã",
    "belt of giant strength": "Cinturão da Força do Gigante",
    "boots of elvenkind": "Botas Élficas",
    "boots of levitation": "Botas de Levitação",
    "boots of speed": "Botas de Velocidade",
    "boots of striding and springing": "Botas de Passos Largos e Saltos",
    "boots of the winterlands": "Botas das Terras Invernais",
    "bowl of commanding water elementals": "Tigela de Comandar Elementais da Água",
    "bracers of archery": "Braçadeiras de Arquearia",
    "bracers of defense": "Braçadeiras de Defesa",
    "brazier of commanding fire elementals": "Braseiro de Comandar Elementais do Fogo",
    "broom of flying": "Vassoura Voadora",
    "candle of invocation": "Vela de Invocação",
    "cape of the mountebank": "Capa do Saltimbanco",
    "carpet of flying": "Tapete Voador",
    "censer of controlling air elementals": "Turíbulo de Controlar Elementais do Ar",
    "chime of opening": "Carrilhão de Abertura",
    "circlet of blasting": "Tiara da Destruição",
    "cloak of arachnida": "Manto de Aracnídeo",
    "cloak of displacement": "Manto de Deslocamento",
    "cloak of elvenkind": "Manto Élfico",
    "cloak of protection": "Manto de Proteção",
    "cloak of the bat": "Manto do Morcego",
    "cloak of the manta ray": "Manto da Arraia-Jamanta",
    "crystal ball": "Bola de Cristal",
    "cube of force": "Cubo de Energia",
    "cubic gate": "Portal Cúbico",
    "dagger of venom": "Adaga de Veneno",
    "dancing sword": "Espada Dançarina",
    "decanter of endless water": "Jarro de Água Infinita",
    "deck of illusions": "Baralho de Ilusões",
    "deck of many things": "Baralho de Muitas Coisas",
    "defender": "Defensora",
    "demon armor": "Armadura Demoníaca",
    "dimensional shackles": "Algemas Dimensionais",
    "dragon scale mail": "Brunea de Escamas de Dragão",
    "dragon slayer": "Matadora de Dragões",
    "dust of disappearance": "Pó do Desaparecimento",
    "dust of dryness": "Pó da Secura",
    "dust of sneezing and choking": "Pó do Espirro e Sufocamento",
    "dwarven plate": "Armadura de Placas Anã",
    "dwarven thrower": "Arremessador Anão",
    "efficient quiver": "Aljava Eficiente",
    "efreeti bottle": "Garrafa do Efreeti",
    "elemental gem": "Gema Elemental",
    "elven chain": "Malha Élfica",
    "everlasting rations": "Rações Eternas",
    " Eversmoking Bottle": "Garrafa de Fumaça Eterna",
    "eversmoking bottle": "Garrafa de Fumaça Eterna",
    "eyes of charming": "Olhos do Encantamento",
    "eyes of minute seeing": "Olhos da Visão Minuciosa",
    "eyes of the eagle": "Olhos da Águia",
    "feather token": "Ficha de Pena",
    "figurine of wondrous power": "Estatueta de Poder Maravilhoso",
    "flame tongue": "Língua Flamejante",
    "folding boat": "Barco Dobrável",
    "frost brand": "Marca Gélida",
    "gauntlets of ogre power": "Manoplas da Força do Ogro",
    "gem of brightness": "Gema da Luminosidade",
    "gem of seeing": "Gema da Visão",
    "giant slayer": "Matadora de Gigantes",
    "glamoured studded leather": "Couro Batido Ilusório",
    "gloves of missile snaring": "Luvas de Apanhar Projéteis",
    "gloves of swimming and climbing": "Luvas de Nadar e Escalar",
    "goggles of night": "Óculos da Noite",
    "hammer of thunderbolts": "Martelo dos Trovões",
    "handy haversack": "Mochila Prática",
    "hat of disguise": "Chapéu de Disfarce",
    "headband of intellect": "Tiara do Intelecto",
    "helm of brilliance": "Elmo do Brilho",
    "helm of comprehending languages": "Elmo de Compreender Idiomas",
    "helm of telepathy": "Elmo da Telepatia",
    "helm of teleportation": "Elmo de Teleporte",
    "holy avenger": "Vingadora Sagrada",
    "horn of blasting": "Trombeta da Destruição",
    "horn of valhalla": "Trombeta de Valhalla",
    "horseshoes of a zephyr": "Ferraduras do Zéfiro",
    "horseshoes of speed": "Ferraduras da Velocidade",
    "immovable rod": "Bastão Imóvel",
    "instant fortress": "Fortaleza Instantânea",
    "ioun stone": "Pedra Ioun",
    "iron bands of binding": "Faixas de Ferro de Contenção",
    "iron flask": "Frasco de Ferro",
    "javelin of lightning": "Azagaia Relâmpago",
    "lantern of revealing": "Lanterna da Revelação",
    "luck blade": "Lâmina da Sorte",
    "mace of disruption": "Maça da Disrupção",
    "mace of smiting": "Maça da Destruição",
    "mace of terror": "Maça do Terror",
    "mantle of spell resistance": "Manto de Resistência à Magia",
    "manual of bodily health": "Manual da Saúde Corporal",
    "manual of gainful exercise": "Manual do Bom Exercício",
    "manual of golems": "Manual dos Golens",
    "manual of quickness of action": "Manual da Rapidez de Ação",
    "marvelous pigments": "Pigmentos Maravilhosos",
    "medallion of thoughts": "Medalhão dos Pensamentos",
    "mirror of life trapping": "Espelho de Aprisionar a Vida",
    "mithral armor": "Armadura de Mithral",
    "necklace of adaptation": "Colar de Adaptação",
    "necklace of fireballs": "Colar de Bolas de Fogo",
    "necklace of prayer beads": "Colar de Contas de Oração",
    "nine lives stealer": "Ladra das Nove Vidas",
    "oathbow": "Arco do Juramento",
    "oil of etherealness": "Óleo da Forma Etérea",
    "oil of sharpness": "Óleo da Afiação",
    "oil of slipperiness": "Óleo do Escorregadio",
    "orb of dragonkind": "Orbe dos Dragões",
    "pearl of power": "Pérola do Poder",
    "periapt of health": "Periapto de Saúde",
    "periapt of proof against poison": "Periapto de Proteção contra Veneno",
    "periapt of wound closure": "Periapto de Fechar Ferimentos",
    "philter of love": "Filtro do Amor",
    "pipes of haunting": "Flauta Assombrada",
    "pipes of the sewers": "Flauta dos Esgotos",
    "plate armor of etherealness": "Armadura de Placas da Forma Etérea",
    "portable hole": "Buraco Portátil",
    "potion of animal friendship": "Poção de Amizade Animal",
    "potion of clairvoyance": "Poção de Clarividência",
    "potion of climbing": "Poção de Escalada",
    "potion of diminution": "Poção de Diminuição",
    "potion of flying": "Poção de Voo",
    "potion of gaseous form": "Poção de Forma Gasosa",
    "potion of giant strength": "Poção da Força do Gigante",
    "potion of growth": "Poção de Crescimento",
    "potion of healing": "Poção de Cura",
    "potion of greater healing": "Poção de Cura Maior",
    "potion of superior healing": "Poção de Cura Superior",
    "potion of supreme healing": "Poção de Cura Suprema",
    "potion of heroism": "Poção de Heroísmo",
    "potion of invisibility": "Poção de Invisibilidade",
    "potion of mind reading": "Poção de Ler Mentes",
    "potion of poison": "Poção de Veneno",
    "potion of resistance": "Poção de Resistência",
    "potion of speed": "Poção de Velocidade",
    "potion of water breathing": "Poção de Respirar na Água",
    "restorative ointment": "Unguento Restaurador",
    "ring of animal influence": "Anel de Influência Animal",
    "ring of djinni summoning": "Anel de Invocar Djinni",
    "ring of elemental command": "Anel de Comando Elemental",
    "ring of evasion": "Anel de Evasão",
    "ring of feather falling": "Anel de Queda Suave",
    "ring of free action": "Anel de Ação Livre",
    "ring of invisibility": "Anel de Invisibilidade",
    "ring of jumping": "Anel de Salto",
    "ring of mind shielding": "Anel de Escudo Mental",
    "ring of protection": "Anel de Proteção",
    "ring of regeneration": "Anel de Regeneração",
    "ring of resistance": "Anel de Resistência",
    "ring of shooting stars": "Anel de Estrelas Cadentes",
    "ring of spell storing": "Anel de Armazenar Magias",
    "ring of spell turning": "Anel de Refletir Magias",
    "ring of swimming": "Anel de Natação",
    "ring of telekinesis": "Anel de Telecinese",
    "ring of the ram": "Anel do Carneiro",
    "ring of three wishes": "Anel dos Três Desejos",
    "ring of warmth": "Anel do Calor",
    "ring of water walking": "Anel de Andar na Água",
    "ring of x-ray vision": "Anel de Visão de Raio-X",
    "robe of eyes": "Robe dos Olhos",
    "robe of scintillating colors": "Robe das Cores Cintilantes",
    "robe of stars": "Robe das Estrelas",
    "robe of the archmagi": "Robe do Arquimago",
    "robe of useful items": "Robe dos Itens Úteis",
    "rod of absorption": "Bastão de Absorção",
    "rod of alertness": "Bastão de Prontidão",
    "rod of lordly might": "Bastão do Poder Senhorial",
    "rod of rulership": "Bastão de Comando",
    "rod of security": "Bastão de Segurança",
    "rope of climbing": "Corda de Escalada",
    "rope of entanglement": "Corda de Enredamento",
    "scarab of protection": "Escaravelho de Proteção",
    "scimitar of speed": "Cimitarra da Velocidade",
    "shield of missile attraction": "Escudo de Atração de Projéteis",
    "slippers of spider climbing": "Pantufas de Patas de Aranha",
    "sovereign glue": "Cola Soberana",
    "spell scroll": "Pergaminho de Magia",
    "spellguard shield": "Escudo de Guarda Mágica",
    "sphere of annihilation": "Esfera da Aniquilação",
    "staff of charming": "Cajado do Encantamento",
    "staff of fire": "Cajado do Fogo",
    "staff of frost": "Cajado do Gelo",
    "staff of healing": "Cajado da Cura",
    "staff of power": "Cajado do Poder",
    "staff of striking": "Cajado do Golpe",
    "staff of swarming insects": "Cajado de Enxame de Insetos",
    "staff of the magi": "Cajado do Mago",
    "staff of the python": "Cajado da Píton",
    "staff of the woodlands": "Cajado das Florestas",
    "staff of thunder and lightning": "Cajado do Trovão e Relâmpago",
    "staff of withering": "Cajado do Definhamento",
    "stone of controlling earth elementals": "Pedra de Controlar Elementais da Terra",
    "stone of good luck": "Pedra da Boa Sorte",
    "sun blade": "Lâmina Solar",
    "sword of life stealing": "Espada Ladra de Vidas",
    "sword of sharpness": "Espada da Afiação",
    "sword of wounding": "Espada de Ferimento",
    "talisman of pure good": "Talismã do Bem Puro",
    "talisman of the sphere": "Talismã da Esfera",
    "talisman of ultimate evil": "Talismã do Mal Supremo",
    "tome of clear thought": "Tomo do Pensamento Claro",
    "tome of leadership and influence": "Tomo de Liderança e Influência",
    "tome of understanding": "Tomo da Compreensão",
    "trident of fish command": "Tridente de Comandar Peixes",
    "universal solvent": "Solvente Universal",
    "vicious weapon": "Arma Cruel",
    "vorpal sword": "Espada Vorpal",
    "wand of binding": "Varinha de Contenção",
    "wand of enemy detection": "Varinha de Detectar Inimigos",
    "wand of fear": "Varinha do Medo",
    "wand of fireballs": "Varinha de Bolas de Fogo",
    "wand of lightning bolts": "Varinha de Relâmpagos",
    "wand of magic detection": "Varinha de Detectar Magia",
    "wand of magic missiles": "Varinha de Mísseis Mágicos",
    "wand of paralysis": "Varinha de Paralisia",
    "wand of polymorph": "Varinha de Polimorfia",
    "wand of secrets": "Varinha de Segredos",
    "wand of the war mage": "Varinha do Mago de Guerra",
    "wand of web": "Varinha de Teia",
    "wand of wonder": "Varinha das Maravilhas",
    "weapon, +1, +2, or +3": "Arma +1, +2 ou +3",
    "armor, +1, +2, or +3": "Armadura +1, +2 ou +3",
    "shield, +1, +2, or +3": "Escudo +1, +2 ou +3",
    "well of many worlds": "Poço de Muitos Mundos",
    "wind fan": "Leque do Vento",
    "winged boots": "Botas Aladas",
    "wings of flying": "Asas Voadoras",
    "amulet of health": "Amuleto de Saúde",
    "amulet of proof against detection and location": "Amuleto contra Detecção e Localização",
    "amulet of the planes": "Amuleto dos Planos",
    "animated shield": "Escudo Animado",
    "apparatus of the crab": "Aparato do Caranguejo",
    "armor of invulnerability": "Armadura da Invulnerabilidade",
    "armor of resistance": "Armadura de Resistência",
    "armor of vulnerability": "Armadura da Vulnerabilidade",
    "arrow-catching shield": "Escudo Apanhador de Flechas",
    "arrow of slaying": "Flecha Assassina",
    "berserker axe": "Machado do Berserker"
};

// --- Glossário Completo das 339 Magias do D&D 5.5e (SRD 2024) em PT-BR ---
export const SPELL_NAMES_DICT = {
    "acid arrow": "Flecha Ácida",
    "acid splash": "Espirro Ácido",
    "aid": "Auxílio",
    "alarm": "Alarme",
    "alter self": "Alterar-se",
    "animal friendship": "Amizade Animal",
    "animal messenger": "Mensageiro Animal",
    "animal shapes": "Formas Animais",
    "animate dead": "Animar Mortos",
    "animate objects": "Animar Objetos",
    "antilife shell": "Concha Antivida",
    "antimagic field": "Campo Antimagia",
    "antipathy/sympathy": "Antipatia/Simpatia",
    "arcane eye": "Olho Arcano",
    "arcane hand": "Mão Arcana",
    "arcane lock": "Tranca Arcana",
    "arcane sword": "Espada Arcana",
    "arcanist's magic aura": "Aura Mágica do Arcanista",
    "astral projection": "Projeção Astral",
    "augury": "Augúrio",
    "aura of life": "Aura de Vida",
    "awaken": "Despertar",
    "bane": "Perdição",
    "banishment": "Banimento",
    "barkskin": "Pele de Árvore",
    "beacon of hope": "Sinal de Esperança",
    "befuddlement": "Entorpecimento Mental",
    "bestow curse": "Rogar Maldição",
    "black tentacles": "Tentáculos Negros",
    "blade barrier": "Barreira de Lâminas",
    "bless": "Bênção",
    "blight": "Malogro",
    "blindness/deafness": "Cegueira/Surdez",
    "blink": "Piscar",
    "blur": "Nublar",
    "burning hands": "Mãos Flamejantes",
    "call lightning": "Convocar Relâmpagos",
    "calm emotions": "Acalmar Emoções",
    "chain lightning": "Corrente de Relâmpagos",
    "charm monster": "Enfeitiçar Monstro",
    "charm person": "Enfeitiçar Pessoa",
    "chill touch": "Toque Arrepiante",
    "chromatic orb": "Orbe Cromático",
    "circle of death": "Círculo da Morte",
    "clairvoyance": "Clarividência",
    "clone": "Clone",
    "cloudkill": "Névoa Mortal",
    "color spray": "Leque Cromático",
    "command": "Comando",
    "commune": "Comunhão",
    "commune with nature": "Comunhão com a Natureza",
    "comprehend languages": "Compreender Idiomas",
    "compulsion": "Compulsão",
    "cone of cold": "Cone de Frio",
    "confusion": "Confusão",
    "conjure animals": "Conjurar Animais",
    "conjure celestial": "Conjurar Celestial",
    "conjure elemental": "Conjurar Elemental",
    "conjure fey": "Conjurar Fada",
    "conjure minor elementals": "Conjurar Elementais Menores",
    "conjure woodland beings": "Conjurar Seres da Floresta",
    "contact other plane": "Contatar Outro Plano",
    "contagion": "Contágio",
    "contingency": "Contingência",
    "continual flame": "Chama Contínua",
    "control water": "Controlar a Água",
    "control weather": "Controlar o Clima",
    "counterspell": "Contra-Mágica",
    "create food and water": "Criar Alimentos",
    "create or destroy water": "Criar ou Destruir Água",
    "create undead": "Criar Mortos-Vivos",
    "creation": "Criação",
    "cure wounds": "Curar Ferimentos",
    "dancing lights": "Luzes Dançantes",
    "darkness": "Escuridão",
    "darkvision": "Visão no Escuro",
    "daylight": "Luz do Dia",
    "death ward": "Proteção contra a Morte",
    "delayed blast fireball": "Bola de Fogo Adiável",
    "demiplane": "Semiplano",
    "detect evil and good": "Detectar o Bem e o Mal",
    "detect magic": "Detectar Magia",
    "detect poison and disease": "Detectar Veneno e Doença",
    "detect thoughts": "Detectar Pensamentos",
    "dimension door": "Porta Dimensional",
    "disguise self": "Disfarçar-se",
    "disintegrate": "Desintegrar",
    "dispel evil and good": "Dissipar o Bem e o Mal",
    "dispel magic": "Dissipar Magia",
    "dissonant whispers": "Sussurros Dissonantes",
    "divination": "Adivinhação",
    "divine favor": "Favor Divino",
    "divine smite": "Destruição Divina",
    "divine word": "Palavra Divina",
    "dominate beast": "Dominar Fera",
    "dominate monster": "Dominar Monstro",
    "dominate person": "Dominar Pessoa",
    "dragon's breath": "Sopro de Dragão",
    "dream": "Sonho",
    "druidcraft": "Druidismo",
    "earthquake": "Terremoto",
    "eldritch blast": "Rajada Mística",
    "elementalism": "Elementalismo",
    "enhance ability": "Aprimorar Habilidade",
    "enlarge/reduce": "Aumentar/Reduzir",
    "ensnaring strike": "Golpe Constritor",
    "entangle": "Emaranhar",
    "enthrall": "Cativar",
    "etherealness": "Forma Etérea",
    "expeditious retreat": "Recuo Acelerado",
    "eyebite": "Mau-Olhado",
    "fabricate": "Fabricar",
    "faerie fire": "Fogo das Fadas",
    "faithful hound": "Cão Fiel",
    "false life": "Vitalidade Falsa",
    "fear": "Medo",
    "feather fall": "Queda Suave",
    "find familiar": "Encontrar Familiar",
    "find steed": "Encontrar Montaria",
    "find the path": "Encontrar o Caminho",
    "find traps": "Encontrar Armadilhas",
    "finger of death": "Dedo da Morte",
    "fire bolt": "Raio de Fogo",
    "fire shield": "Escudo de Fogo",
    "fire storm": "Tempestade de Fogo",
    "fireball": "Bola de Fogo",
    "flame blade": "Lâmina Flamejante",
    "flame strike": "Coluna de Chamas",
    "flaming sphere": "Esfera Flamejante",
    "flesh to stone": "Carne para Pedra",
    "floating disk": "Disco Flutuante",
    "fly": "Voo",
    "fog cloud": "Névoa Obscurecente",
    "forbiddance": "Proibição",
    "forcecage": "Prisão de Energia",
    "foresight": "Sexto Sentido",
    "freedom of movement": "Movimentação Livre",
    "freezing sphere": "Esfera Congelante",
    "gaseous form": "Forma Gasosa",
    "gate": "Portal",
    "geas": "Missão",
    "gentle repose": "Repouso Tranquilo",
    "giant insect": "Inseto Gigante",
    "glibness": "Loquacidade",
    "globe of invulnerability": "Globo de Invulnerabilidade",
    "glyph of warding": "Glifo de Vigilância",
    "goodberry": "Bom Fruto",
    "grease": "Área Escorregadia",
    "greater invisibility": "Invisibilidade Maior",
    "greater restoration": "Restauração Maior",
    "guardian of faith": "Guardião da Fé",
    "guards and wards": "Guardas e Proteções",
    "guidance": "Orientação",
    "guiding bolt": "Raio Guia",
    "gust of wind": "Lufada de Vento",
    "hallow": "Consagrar",
    "hallucinatory terrain": "Terreno Alucinógeno",
    "harm": "Moléstia",
    "haste": "Velocidade",
    "heal": "Cura Completa",
    "healing word": "Palavra Curativa",
    "heat metal": "Esquentar Metal",
    "hellish rebuke": "Repreensão Infernal",
    "heroes' feast": "Banquete dos Heróis",
    "heroism": "Heroísmo",
    "hex": "Bruxaria",
    "hideous laughter": "Riso Histérico",
    "hold monster": "Imobilizar Monstro",
    "hold person": "Imobilizar Pessoa",
    "holy aura": "Aura Sagrada",
    "hunter's mark": "Marca do Caçador",
    "hypnotic pattern": "Padrão Hipnótico",
    "ice knife": "Faca de Gelo",
    "ice storm": "Tempestade de Gelo",
    "identify": "Identificação",
    "illusory script": "Escrita Ilusória",
    "imprisonment": "Aprisionamento",
    "incendiary cloud": "Nuvem Incendiária",
    "inflict wounds": "Infligir Ferimentos",
    "insect plague": "Praga de Insetos",
    "instant summons": "Invocação Instantânea",
    "invisibility": "Invisibilidade",
    "irresistible dance": "Dança Irresistível",
    "jump": "Salto",
    "knock": "Arrombar",
    "legend lore": "Conhecimento Lendário",
    "lesser restoration": "Restauração Menor",
    "levitate": "Levitação",
    "light": "Luz",
    "lightning bolt": "Relâmpago",
    "locate animals or plants": "Localizar Animais ou Plantas",
    "locate creature": "Localizar Criatura",
    "locate object": "Localizar Objeto",
    "longstrider": "Passos Longos",
    "mage armor": "Armadura Arcana",
    "mage hand": "Mãos Mágicas",
    "magic circle": "Círculo Mágico",
    "magic jar": "Recipiente Arcano",
    "magic missile": "Mísseis Mágicos",
    "magic mouth": "Boca Encantada",
    "magic weapon": "Arma Mágica",
    "magnificent mansion": "Mansão Magnífica",
    "major image": "Imagem Maior",
    "mass cure wounds": "Curar Ferimentos em Massa",
    "mass heal": "Cura Completa em Massa",
    "mass healing word": "Palavra Curativa em Massa",
    "mass suggestion": "Sugestão em Massa",
    "maze": "Labirinto",
    "meld into stone": "Mesclar-se às Rochas",
    "mending": "Consertar",
    "message": "Mensagem",
    "meteor swarm": "Chuva de Meteoros",
    "mind blank": "Limpar a Mente",
    "mind spike": "Espinho Mental",
    "minor illusion": "Ilusão Menor",
    "mirage arcane": "Miragem Arcana",
    "mirror image": "Reflexos",
    "mislead": "Despistar",
    "misty step": "Passo Nebuloso",
    "modify memory": "Modificar Memória",
    "moonbeam": "Raio Lunar",
    "move earth": "Mover Terra",
    "nondetection": "Indetectável",
    "pass without trace": "Passos sem Pegadas",
    "passwall": "Criar Passagem",
    "phantasmal force": "Força Fantasmagórica",
    "phantasmal killer": "Assassino Fantasmagórico",
    "phantom steed": "Montaria Fantasmagórica",
    "planar ally": "Aliado Planar",
    "planar binding": "Âncora Planar",
    "plane shift": "Viagem Planar",
    "plant growth": "Ampliar Plantas",
    "poison spray": "Rajada de Veneno",
    "polymorph": "Polimorfia",
    "power word heal": "Palavra de Poder: Curar",
    "power word kill": "Palavra de Poder: Matar",
    "power word stun": "Palavra de Poder: Atordoar",
    "prayer of healing": "Oração de Cura",
    "prestidigitation": "Prestidigitação Arcana",
    "prismatic spray": "Rajada Prismática",
    "prismatic wall": "Muralha Prismática",
    "private sanctum": "Santuário Particular",
    "produce flame": "Criar Chamas",
    "programmed illusion": "Ilusão Programada",
    "project image": "Projetar Imagem",
    "protection from energy": "Proteção contra Energia",
    "protection from evil and good": "Proteção contra o Bem e o Mal",
    "protection from poison": "Proteção contra Veneno",
    "purify food and drink": "Purificar Alimentos",
    "raise dead": "Reviver os Mortos",
    "ray of enfeeblement": "Raio do Enfraquecimento",
    "ray of frost": "Raio de Gelo",
    "ray of sickness": "Raio Adoecente",
    "regenerate": "Regeneração",
    "reincarnate": "Reencarnação",
    "remove curse": "Remover Maldição",
    "resilient sphere": "Esfera Resiliente",
    "resistance": "Resistência",
    "resurrection": "Ressurreição",
    "reverse gravity": "Inverter a Gravidade",
    "revivify": "Revivificar",
    "rope trick": "Truque da Corda",
    "sacred flame": "Chama Sagrada",
    "sanctuary": "Santuário",
    "scorching ray": "Raio Ardente",
    "scrying": "Vidência",
    "searing smite": "Destruição Lancinante",
    "secret chest": "Arca Secreta",
    "see invisibility": "Ver o Invisível",
    "seeming": "Similaridade",
    "sending": "Enviar Mensagem",
    "sequester": "Isolamento",
    "shapechange": " Metamorfose",
    "shatter": "Despedaçar",
    "shield": "Escudo Arcano",
    "shield of faith": "Escudo da Fé",
    "shillelagh": "Bordão Místico",
    "shining smite": "Destruição Reluzente",
    "shocking grasp": "Toque Chocante",
    "silence": "Silêncio",
    "silent image": "Imagem Silenciosa",
    "simulacrum": "Simulacro",
    "sleep": "Sono",
    "sleet storm": "Tempestade de Granizo",
    "slow": "Lentidão",
    "sorcerous burst": "Explosão Feiticeira",
    "spare the dying": "Estabilizar",
    "speak with animals": "Falar com Animais",
    "speak with dead": "Falar com os Mortos",
    "speak with plants": "Falar com Plantas",
    "spider climb": "Patas de Aranha",
    "spike growth": "Crescer Espinhos",
    "spirit guardians": "Guardiões Espirituais",
    "spiritual weapon": "Arma Espiritual",
    "starry wisp": "Fagulha Estelar",
    "stinking cloud": "Névoa Fétida",
    "stone shape": "Moldar Rochas",
    "stoneskin": "Pele de Pedra",
    "storm of vengeance": "Tempestade da Vingança",
    "suggestion": "Sugestão",
    "summon dragon": "Invocar Dragão",
    "sunbeam": "Raio Solar",
    "sunburst": "Explosão Solar",
    "symbol": "Símbolo",
    "telekinesis": "Telecinese",
    "telepathic bond": "Ligação Telepática",
    "teleport": "Teleporte",
    "teleportation circle": "Círculo de Teletransporte",
    "thaumaturgy": "Taumaturgia",
    "thunderwave": "Onda Trovejante",
    "time stop": "Parar o Tempo",
    "tiny hut": "Cabana Pequena",
    "tongues": "Idiomas",
    "transport via plants": "Teletransporte por Árvores",
    "tree stride": "Caminhar em Árvores",
    "true polymorph": "Polimorfia Verdadeira",
    "true resurrection": "Ressurreição Verdadeira",
    "true seeing": "Visão da Verdade",
    "true strike": "Golpe Certeiro",
    "tsunami": "Tsunami",
    "unseen servant": "Servo Invisível",
    "vampiric touch": "Toque Vampírico",
    "vicious mockery": "Zombaria Cruel",
    "vitriolic sphere": "Esfera Vitriólica",
    "wall of fire": "Muralha de Fogo",
    "wall of force": "Muralha de Energia",
    "wall of ice": "Muralha de Gelo",
    "wall of stone": "Muralha de Pedra",
    "wall of thorns": "Muralha de Espinhos",
    "warding bond": "Vínculo Protetor",
    "water breathing": "Respirar na Água",
    "water walk": "Andar na Água",
    "web": "Teia",
    "weird": "Encarnação do Medo",
    "wind walk": "Caminhar no Vento",
    "wind wall": "Muralha de Vento",
    "wish": "Desejo",
    "word of recall": "Palavra de Recordação",
    "zone of truth": "Zona da Verdade"
};

export const translateSpellName = (name, lang) => {
    if (lang !== 'pt' || !name) return name;
    const raw = String(name).trim();
    const lower = raw.toLowerCase();
    if (SPELL_NAMES_DICT[lower]) return SPELL_NAMES_DICT[lower].trim();
    return translateName(raw, 'pt');
};

const DRAGON_COLORS = {
    "red": { m: "Vermelho", f: "Vermelha" },
    "blue": { m: "Azul", f: "Azul" },
    "green": { m: "Verde", f: "Verde" },
    "black": { m: "Negro", f: "Negra" },
    "white": { m: "Branco", f: "Branca" },
    "gold": { m: "de Ouro", f: "de Ouro" },
    "silver": { m: "de Prata", f: "de Prata" },
    "bronze": { m: "de Bronze", f: "de Bronze" },
    "copper": { m: "de Cobre", f: "de Cobre" },
    "brass": { m: "de Latão", f: "de Latão" },
    "shadow": { m: "das Sombras", f: "das Sombras" }
};

// --- Tradutor Inteligente de Nomes (Monstros, Itens, Ações) ---
export const translateName = (name, lang) => {
    if (lang !== 'pt' || !name) return name;

    const raw = String(name).trim();
    const lowerName = raw.toLowerCase();

    // 1. Verifica se já existe tradução no cache dinâmico (IA/Neural)
    if (dynamicCacheGetter) {
        const cached = dynamicCacheGetter(`name:${lowerName}`);
        if (cached) return cached;
    }

    // 2. Match Exato no Dicionário Oficial (Monstros/Itens e Magias)
    if (EXACT_NAMES_DICT[lowerName]) {
        return EXACT_NAMES_DICT[lowerName];
    }
    if (SPELL_NAMES_DICT[lowerName]) {
        return SPELL_NAMES_DICT[lowerName].trim();
    }

    // 3. Regras Estruturais Compostas (Dragões, Gigantes, Golens, Elementais, Animais Gigantes)
    // Dragões: "Ancient Red Dragon", "Adult Gold Dragon", "Young Green Dragon", "White Dragon Wyrmling"
    const dragonMatch = lowerName.match(/^(ancient|adult|young)\s+(red|blue|green|black|white|gold|silver|bronze|copper|brass|shadow)\s+dragon$/i);
    if (dragonMatch) {
        const ageMap = { ancient: "Ancião", adult: "Adulto", young: "Jovem" };
        const color = DRAGON_COLORS[dragonMatch[2].toLowerCase()]?.m || dragonMatch[2];
        return `Dragão ${color} ${ageMap[dragonMatch[1].toLowerCase()]}`;
    }

    const wyrmlingMatch = lowerName.match(/^(red|blue|green|black|white|gold|silver|bronze|copper|brass)\s+dragon\s+wyrmling$/i);
    if (wyrmlingMatch) {
        const color = DRAGON_COLORS[wyrmlingMatch[1].toLowerCase()]?.m || wyrmlingMatch[1];
        return `Filhote de Dragão ${color}`;
    }

    // Half-Dragon
    const halfDragonMatch = lowerName.match(/^half-(red|blue|green|black|white|gold|silver|bronze|copper|brass)\s+dragon\s+veteran$/i);
    if (halfDragonMatch) {
        const color = DRAGON_COLORS[halfDragonMatch[1].toLowerCase()]?.m || halfDragonMatch[1];
        return `Veterano Meio-Dragão ${color}`;
    }

    // Feras/Criaturas "Giant <Beast>" ou "Awakened <Plant/Beast>"
    const giantMatch = lowerName.match(/^giant\s+(.+)$/i);
    if (giantMatch) {
        const inner = giantMatch[1].toLowerCase();
        const innerTranslated = EXACT_NAMES_DICT[inner] || translateName(giantMatch[1], 'pt');
        return `${innerTranslated} Gigante`;
    }

    const awakenedMatch = lowerName.match(/^awakened\s+(shrub|tree|.*)/i);
    if (awakenedMatch) {
        const nounMap = { shrub: "Arbusto Desperto", tree: "Árvore Desperta" };
        const sub = awakenedMatch[1].toLowerCase();
        if (nounMap[sub]) return nounMap[sub];
        return `${translateName(awakenedMatch[1], 'pt')} Desperto(a)`;
    }

    // Golens e Elementais
    const golemMatch = lowerName.match(/^(clay|flesh|iron|stone)\s+golem$/i);
    if (golemMatch) {
        const golemMap = { clay: "Barro", flesh: "Carne", iron: "Ferro", stone: "Pedra" };
        return `Golem de ${golemMap[golemMatch[1].toLowerCase()]}`;
    }

    const elementalMatch = lowerName.match(/^(air|earth|fire|water)\s+elemental$/i);
    if (elementalMatch) {
        const elMap = { air: "do Ar", earth: "da Terra", fire: "do Fogo", water: "da Água" };
        return `Elemental ${elMap[elementalMatch[1].toLowerCase()]}`;
    }

    const mephitMatch = lowerName.match(/^(dust|ice|magma|mud|smoke|steam)\s+mephit$/i);
    if (mephitMatch) {
        const mephMap = { dust: "da Poeira", ice: "do Gelo", magma: "de Magma", mud: "da Lama", smoke: "da Fumaça", steam: "do Vapor" };
        return `Mephit ${mephMap[mephitMatch[1].toLowerCase()]}`;
    }

    // Objetos Animados
    const animatedMatch = lowerName.match(/^animated\s+(armor|sword|table|object|rug of smothering)$/i);
    if (animatedMatch) {
        const animMap = { armor: "Armadura Animada", sword: "Espada Voadora", table: "Mesa Animada", object: "Objeto Animado" };
        if (animMap[animatedMatch[1].toLowerCase()]) return animMap[animatedMatch[1].toLowerCase()];
    }
    if (lowerName === 'flying sword') return 'Espada Voadora';
    if (lowerName === 'rug of smothering') return 'Tapete Sufocador';

    // 4. Padrões seguros com Word Boundaries (\b) para nunca corromper partes de palavras
    let tName = raw;
    const safePatterns = [
        [/\bHill Giant\b/gi, "Gigante da Colina"],
        [/\bStone Giant\b/gi, "Gigante de Pedra"],
        [/\bFrost Giant\b/gi, "Gigante do Gelo"],
        [/\bFire Giant\b/gi, "Gigante do Fogo"],
        [/\bCloud Giant\b/gi, "Gigante das Nuvens"],
        [/\bStorm Giant\b/gi, "Gigante da Tempestade"],
        [/\bSwarm of\b/gi, "Enxame de"],
        [/\bPotion of\b/gi, "Poção de"],
        [/\bRing of\b/gi, "Anel de"],
        [/\bScroll of\b/gi, "Pergaminho de"],
        [/\bSpell Scroll\b/gi, "Pergaminho de Magia"],
        [/\bWand of\b/gi, "Varinha de"],
        [/\bStaff of\b/gi, "Cajado de"],
        [/\bRod of\b/gi, "Bastão de"],
        [/\bAmulet of\b/gi, "Amuleto de"],
        [/\bCloak of\b/gi, "Manto de"],
        [/\bBoots of\b/gi, "Botas de"],
        [/\bGloves of\b/gi, "Luvas de"],
        [/\bGauntlets of\b/gi, "Manoplas de"],
        [/\bBracers of\b/gi, "Braçadeiras de"],
        [/\bBelt of\b/gi, "Cinturão de"],
        [/\bHelm of\b/gi, "Elmo de"],
        [/\bMantle of\b/gi, "Manto de"],
        [/\bRobe of\b/gi, "Robe de"],
        [/\bManual of\b/gi, "Manual de"],
        [/\bTome of\b/gi, "Tomo de"],
        [/\bHorn of\b/gi, "Trombeta de"],
        [/\bOil of\b/gi, "Óleo de"],
        [/\bDust of\b/gi, "Pó de"],
        [/\bStone of\b/gi, "Pedra de"],
        [/\bArmor of\b/gi, "Armadura de"],
        [/\bShield of\b/gi, "Escudo de"],
        [/\bSword of\b/gi, "Espada de"],
        [/\bMace of\b/gi, "Maça de"],
        [/\bDagger of\b/gi, "Adaga de"],
        [/\bGreater Healing\b/gi, "Cura Maior"],
        [/\bSuperior Healing\b/gi, "Cura Superior"],
        [/\bSupreme Healing\b/gi, "Cura Suprema"],
        [/\bHealing\b/gi, "Cura"],
        [/\bInvisibility\b/gi, "Invisibilidade"],
        [/\bProtection\b/gi, "Proteção"],
        [/\bResistance\b/gi, "Resistência"],
        [/\bInvulnerability\b/gi, "Invulnerabilidade"],
        [/\bVulnerability\b/gi, "Vulnerabilidade"],
        [/\bFireballs\b/gi, "Bolas de Fogo"],
        [/\bLightning Bolts\b/gi, "Relâmpagos"],
        [/\bMagic Missiles\b/gi, "Mísseis Mágicos"],
        [/\bSpell Storing\b/gi, "Armazenar Magias"],
        [/\bRegeneration\b/gi, "Regeneração"],
        [/\bTelekinesis\b/gi, "Telecinese"],
        [/\bTeleportation\b/gi, "Teleporte"],
        [/\bWater Breathing\b/gi, "Respirar na Água"],
        [/\bWater Walking\b/gi, "Andar na Água"],
        [/\bFeather Falling\b/gi, "Queda Suave"],
        [/\bFree Action\b/gi, "Ação Livre"],
        [/\bEvasion\b/gi, "Evasão"],
        [/\bSpeed\b/gi, "Velocidade"],
        [/\bFlying\b/gi, "Voo"],
        [/\bClimbing\b/gi, "Escalada"],
        [/\bSwimming\b/gi, "Natação"],
        [/\bHill\b/gi, "da Colina"],
        [/\bFrost\b/gi, "do Gelo"],
        [/\bCloud\b/gi, "das Nuvens"],
        [/\bStorm\b/gi, "da Tempestade"]
    ];

    safePatterns.forEach(([regex, replacement]) => {
        tName = tName.replace(regex, replacement);
    });

    return tName;
};

// --- Dicionário de Termos, Tags, Perícias, Sentidos, Ações e Propriedades ---
const TERM_DICT = {
    // Tamanhos
    "tiny": "Miúdo", "small": "Pequeno", "medium": "Médio", "large": "Grande", "huge": "Enorme", "gargantuan": "Imenso",

    // Ambientes (Environments)
    "arctic": "Ártico", "coastal": "Costeiro", "desert": "Deserto", "forest": "Floresta",
    "grassland": "Planície", "hill": "Colina", "mountain": "Montanha", "swamp": "Pântano",
    "underdark": "Subterrâneo (Underdark)", "underwater": "Subaquático", "urban": "Urbano",

    // Tipos de Criatura
    "aberration": "Aberração", "beast": "Fera", "celestial": "Celestial", "construct": "Construto",
    "dragon": "Dragão", "elemental": "Elemental", "fey": "Fada", "fiend": "Corruptor",
    "giant": "Gigante", "humanoid": "Humanoide", "monstrosity": "Monstruosidade",
    "ooze": "Limo", "plant": "Planta", "undead": "Morto-vivo",
    "swarm of tiny beasts": "Enxame de feras miúdas",
    "swarm of tiny undead": "Enxame de mortos-vivos miúdos",

    // Alinhamentos
    "unaligned": "Imparcial", "any alignment": "Qualquer alinhamento",
    "any non-good alignment": "Qualquer alinhamento não-bom",
    "any non-lawful alignment": "Qualquer alinhamento não-leal",
    "any evil alignment": "Qualquer alinhamento mau",
    "any chaotic alignment": "Qualquer alinhamento caótico",
    "lawful good": "Leal e Bom", "neutral good": "Neutro e Bom", "chaotic good": "Caótico e Bom",
    "lawful neutral": "Leal e Neutro", "neutral": "Neutro", "chaotic neutral": "Caótico e Neutro",
    "lawful evil": "Leal e Mau", "neutral evil": "Neutro e Mau", "chaotic evil": "Caótico e Mau",

    // Raridades
    "common": "Comum", "uncommon": "Incomum", "rare": "Raro", "very rare": "Muito Raro", "legendary": "Lendário", "artifact": "Artefato", "varies": "Varia",

    // Tipos de Dano
    "acid": "Ácido", "bludgeoning": "Concussão", "cold": "Frio", "fire": "Fogo",
    "force": "Energia", "lightning": "Elétrico", "necrotic": "Necrótico", "piercing": "Perfurante",
    "poison": "Venenoso", "psychic": "Psíquico", "radiant": "Radiante", "slashing": "Cortante", "thunder": "Trovejante",

    // Condições
    "blinded": "Cego", "charmed": "Enfeitiçado", "deafened": "Surdo", "exhaustion": "Exaustão",
    "frightened": "Amedrontado", "grappled": "Agarrado", "incapacitated": "Incapacitado",
    "invisible": "Invisível", "paralyzed": "Paralisado", "petrified": "Petrificado",
    "poisoned": "Envenenado", "prone": "Caído", "restrained": "Impedido", "stunned": "Atordoado", "unconscious": "Inconsciente",

    // Propriedades de Armas
    "finesse": "Acuidade", "heavy": "Pesada", "light": "Leve", "loading": "Recarga",
    "reach": "Alcance", "special": "Especial", "thrown": "Arremesso", "two-handed": "Duas Mãos",
    "versatile": "Versátil", "ammunition": "Munição", "silvered": "Prateada",

    // Perícias (Skills)
    "acrobatics": "Acrobacia", "animal handling": "Adestrar Animais", "arcana": "Arcanismo",
    "athletics": "Atletismo", "deception": "Enganação", "history": "História",
    "insight": "Intuição", "intimidation": "Intimidação", "investigation": "Investigação",
    "medicine": "Medicina", "nature": "Natureza", "perception": "Percepção",
    "performance": "Atuação", "persuasion": "Persuasão", "religion": "Religião",
    "sleight of hand": "Prestidigitação", "stealth": "Furtividade", "survival": "Sobrevivência",

    // Nomes de Traços e Ações Comuns nos StatBlocks
    "multiattack": "Ataques Múltiplos",
    "bite": "Mordida", "claw": "Garra", "claws": "Garras", "slam": "Pancada", "tail": "Cauda",
    "tail attack": "Ataque de Cauda", "wing attack": "Ataque de Asa", "wings": "Asas",
    "gore": "Chifrada", "horns": "Chifres", "hooves": "Cascos", "hoof": "Casco",
    "sting": "Ferrão", "stinger": "Ferrão", "tentacle": "Tentáculo", "tentacles": "Tentáculos",
    "constrict": "Constrição", "crush": "Esmagar", "swallow": "Engolir", "stomp": "Pisotear",
    "rock": "Rocha", "fist": "Punho", "touch": "Toque", "corrupting touch": "Toque Corruptor",
    "life drain": "Drenar Vida", "strength drain": "Drenar Força", "withering touch": "Toque Definhante",
    "horrifying visage": "Semblante Horripilante", "possession": "Possessão", "etherealness": "Forma Etérea",
    "frightful presence": "Presença Aterradora", "breath weapon": "Arma de Sopro",
    "fire breath": "Sopro de Fogo", "cold breath": "Sopro de Frio", "acid breath": "Sopro Ácido",
    "lightning breath": "Sopro Relâmpago", "poison breath": "Sopro Venenoso",
    "paralyzing breath": "Sopro Paralisante", "repulsion breath": "Sopro de Repulsão",
    "sleep breath": "Sopro de Sono", "slowing breath": "Sopro de Lentidão", "weakening breath": "Sopro Enfraquecedor",
    "legendary resistance": "Resistência Lendária", "magic resistance": "Resistência à Magia",
    "magic weapons": "Armas Mágicas", "spellcasting": "Conjuração", "innate spellcasting": "Conjuração Inata",
    "pack tactics": "Tática de Matilha", "amphibious": "Anfíbio", "keen senses": "Sentidos Aguçados",
    "keen sight": "Visão Aguçada", "keen smell": "Olfato Aguçado", "keen hearing": "Audição Aguçada",
    "keen hearing and smell": "Audição e Olfato Aguçados", "keen sight and smell": "Visão e Olfato Aguçados",
    "keen hearing and sight": "Audição e Visão Aguçadas", "spider climb": "Patas de Aranha",
    "web": "Teia", "web sense": "Sentido na Teia", "web walker": "Andarilho da Teia",
    "sunlight sensitivity": "Sensibilidade à Luz Solar", "sunlight hypersensitivity": "Hipersensibilidade à Luz Solar",
    "undead fortitude": "Fortitude de Morto-Vivo", "regeneration": "Regeneração",
    "rejuvenation": "Rejuvenescimento", "turn resistance": "Resistência à Expulsão",
    "turn immunity": "Imunidade à Expulsão", "immutable form": "Forma Imutável",
    "false appearance": "Aparência Falsa", "amorphous": "Amorfo", "incorporeal movement": "Movimento Incorpóreo",
    "illumination": "Iluminação", "heated body": "Corpo Aquecido", "heated weapons": "Armas Aquecidas",
    "water form": "Forma de Água", "fire form": "Forma de Fogo", "air form": "Forma de Ar",
    "earth glide": "Deslizar pela Terra", "siege monster": "Monstro de Cerco",
    "flyby": "Rasante", "charge": "Investida", "pounce": "Bote", "rampage": "Fúria",
    "relentless": "Implacável", "nimble escape": "Fuga Ágil", "sneak attack": "Ataque Furtivo",
    "cunning action": "Ação Ardilosa", "assassinate": "Assassinar", "evasion": "Evasão",
    "brave": "Corajoso", "brute": "Bruto", "martial advantage": "Vantagem Marcial",
    "reckless": "Temerário", "aggressive": "Agressivo", "blood frenzy": "Frenesi de Sangue",
    "hold breath": "Prender a Respiração", "echolocation": "Ecolocalização",
    "antimagic susceptibility": "Suscetibilidade Antimagia", "damage transfer": "Transferência de Dano",
    "death burst": "Explosão da Morte", "devil's sight": "Visão Diabólica",
    "hellish weapons": "Armas Infernais", "angelic weapons": "Armas Angelicais",
    "shapechanger": "Metamorfo", "change shape": "Mudar de Forma",
    "teleport": "Teleporte", "parry": "Aparar", "leadership": "Liderança",
    "redirect attack": "Redirecionar Ataque", "shield": "Escudo", "roar": "Rugido",
    "detect": "Detectar", "move": "Mover", "attack": "Ataque",

    // Categorias de Itens
    "weapon": "Arma", "armor": "Armadura", "wondrous item": "Item Maravilhoso",
    "potion": "Poção", "ring": "Anel", "scroll": "Pergaminho", "wand": "Varinha",
    "staff": "Cajado", "rod": "Bastão", "melee weapon": "Arma Corpo-a-Corpo",
    "ranged weapon": "Arma à Distância", "martial weapon": "Arma Marcial",
    "simple weapon": "Arma Simples", "light armor": "Armadura Leve",
    "medium armor": "Armadura Média", "heavy armor": "Armadura Pesada",
    "adventuring gear": "Equipamento de Aventura",
    "tool": "Ferramenta", "mount": "Montaria", "vehicle": "Veículo",

    // Escolas de Magia (Schools of Magic)
    "abjuration": "Abjuração", "conjuration": "Conjuração", "divination": "Adivinhação",
    "enchantment": "Encantamento", "evocation": "Evocação", "illusion": "Ilusão",
    "necromancy": "Necromancia", "transmutation": "Transmutação",

    // Classes de D&D (Spellcasting Classes)
    "bard": "Bardo", "cleric": "Clérigo", "druid": "Druida", "paladin": "Paladino",
    "ranger": "Patrulheiro", "sorcerer": "Feiticeiro", "warlock": "Bruxo",
    "wizard": "Mago", "artificer": "Artífice"
};

export const translateTerm = (text, lang) => {
    if (lang !== 'pt' || !text) return text;
    const raw = String(text).trim();
    const term = raw.toLowerCase();

    if (TERM_DICT[term]) return TERM_DICT[term];
    if (EXACT_NAMES_DICT[term]) return EXACT_NAMES_DICT[term];

    // Trata termos com sufixos entre parênteses, ex: "Legendary Resistance (3/Day)" ou "Humanoid (Any Race)"
    const parenMatch = raw.match(/^([^(]+)\s*\(([^)]+)\)$/);
    if (parenMatch) {
        const base = translateTerm(parenMatch[1].trim(), 'pt');
        let inner = parenMatch[2].trim();
        inner = inner
            .replace(/(\d+)\/Day/gi, '$1/Dia')
            .replace(/Recharge\s*(\d+[–-]\d+|\d+)/gi, 'Recarga $1')
            .replace(/any race/gi, 'qualquer raça')
            .replace(/shapechanger/gi, 'metamorfo')
            .replace(/demon/gi, 'demônio')
            .replace(/devil/gi, 'diabo')
            .replace(/goblinoid/gi, 'goblinoide');
        return `${base} (${inner})`;
    }

    return translateName(raw, 'pt');
};

// --- Tradutor Determinístico de Textos Mecânicos de D&D 5e / SRD 2024 ---
export const translateDescription = (text, lang) => {
    if (lang !== 'pt' || !text) return text;
    let out = String(text);

    // Se houver tradução neural completa no cache, usa ela prioritariamente
    if (dynamicCacheGetter) {
        const cached = dynamicCacheGetter(`desc:${out.trim()}`);
        if (cached) return cached;
    }

    // 1. Cabeçalhos de Ataque (SRD 5.1 & SRD 2024 / 5.2)
    out = out
        .replace(/Melee or Ranged Weapon Attack:/gi, 'Ataque Corpo a Corpo ou à Distância com Arma:')
        .replace(/Melee or Ranged Attack Roll:/gi, 'Jogada de Ataque Corpo a Corpo ou à Distância:')
        .replace(/Melee Weapon Attack:/gi, 'Ataque Corpo a Corpo com Arma:')
        .replace(/Ranged Weapon Attack:/gi, 'Ataque à Distância com Arma:')
        .replace(/Melee Spell Attack:/gi, 'Ataque Corpo a Corpo com Magia:')
        .replace(/Ranged Spell Attack:/gi, 'Ataque à Distância com Magia:')
        .replace(/Melee Attack Roll:/gi, 'Jogada de Ataque Corpo a Corpo:')
        .replace(/Ranged Attack Roll:/gi, 'Jogada de Ataque à Distância:');

    // 2. Parâmetros de Ataque (to hit, reach, range, targets, Hit:)
    out = out
        .replace(/([+-]\d+)\s+to hit/gi, '$1 para acertar')
        .replace(/\breach\s+(\d+)\s*ft\./gi, (_, ft) => `alcance ${ft} ft. (${Math.round((parseInt(ft) / 5) * 1.5)}m)`)
        .replace(/\brange\s+(\d+(?:\/\d+)?)\s*ft\./gi, 'alcance $1 ft.')
        .replace(/\bone target\b/gi, 'um alvo')
        .replace(/\bone creature\b/gi, 'uma criatura')
        .replace(/\btwo targets\b/gi, 'dois alvos')
        .replace(/\bHit:\s*/gi, 'Acerto: ')
        .replace(/\bMiss:\s*/gi, 'Erro: ')
        .replace(/\bHit or Miss:\s*/gi, 'Acerto ou Erro: ');

    // 3. Salvaguardas estilo SRD 2024 & 5e Clássico
    const attrMap = {
        strength: 'Força', dexterity: 'Destreza', constitution: 'Constituição',
        intelligence: 'Inteligência', wisdom: 'Sabedoria', charisma: 'Carisma'
    };
    out = out.replace(/\b(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s+Saving Throw:\s*DC\s*(\d+)/gi,
        (_, attr, dc) => `Salvaguarda de ${attrMap[attr.toLowerCase()] || attr}: CD ${dc}`
    );
    out = out.replace(/must succeed on a DC\s*(\d+)\s+(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s+saving throw/gi,
        (_, dc, attr) => `deve ter sucesso em uma salvaguarda de ${attrMap[attr.toLowerCase()] || attr} CD ${dc}`
    );
    out = out.replace(/must make a DC\s*(\d+)\s+(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s+saving throw/gi,
        (_, dc, attr) => `deve realizar uma salvaguarda de ${attrMap[attr.toLowerCase()] || attr} CD ${dc}`
    );
    out = out
        .replace(/\bFirst Failure:\s*/gi, 'Primeira Falha: ')
        .replace(/\bSecond Failure:\s*/gi, 'Segunda Falha: ')
        .replace(/\bFailure or Success:\s*/gi, 'Falha ou Sucesso: ')
        .replace(/\bFailure:\s*/gi, 'Falha: ')
        .replace(/\bSuccess:\s*/gi, 'Sucesso: ')
        .replace(/\bHalf damage\b/gi, 'Metade do dano')
        .replace(/taking ([^,]+) on a failed save, or half as much damage on a successful one/gi, 'sofrendo $1 em uma falha, ou metade desse dano em um sucesso');

    // 4. Expressões de Dano ("13 (2d6 + 6) Slashing damage plus 7 (2d6) Fire damage")
    const dmgTypeMap = {
        acid: 'Ácido', bludgeoning: 'de Concussão', cold: 'de Frio', fire: 'de Fogo',
        force: 'de Energia', lightning: 'Elétrico', necrotic: 'Necrótico', piercing: 'Perfurante',
        poison: 'Venenoso', psychic: 'Psíquico', radiant: 'Radiante', slashing: 'Cortante', thunder: 'Trovejante'
    };
    out = out.replace(/(\d+(?:\s*\([^)]+\))?)\s+(acid|bludgeoning|cold|fire|force|lightning|necrotic|piercing|poison|psychic|radiant|slashing|thunder)\s+damage/gi,
        (_, amount, dType) => `${amount} de dano ${dmgTypeMap[dType.toLowerCase()] || dType}`
    );
    out = out.replace(/\b(acid|bludgeoning|cold|fire|force|lightning|necrotic|piercing|poison|psychic|radiant|slashing|thunder)\s+damage\b/gi,
        (_, dType) => `dano ${dmgTypeMap[dType.toLowerCase()] || dType}`
    );

    // 5. Frases mecânicas recorrentes em Traços, Conjuração e Ataques Múltiplos
    out = out
        .replace(/\bplus\s+(\d+)/gi, 'mais $1')
        .replace(/\bAt Will:/gi, 'À Vontade:')
        .replace(/(\d+)\/Day Each:/gi, '$1/Dia Cada:')
        .replace(/(\d+)\/Day:/gi, '$1/Dia:')
        .replace(/\bspell save DC\s*(\d+)/gi, 'CD para evitar magia $1')
        .replace(/([+-]\d+)\s+to hit with spell attacks/gi, '$1 para acertar com ataques mágicos')
        .replace(/If the creature fails its saving throw, it can choose to succeed instead\./gi, 'Se a criatura falhar em uma salvaguarda, ela pode escolher ter sucesso no lugar.')
        .replace(/has advantage on saving throws against spells and other magical effects\./gi, 'tem vantagem em salvaguardas contra magias e outros efeitos mágicos.')
        .replace(/has advantage on an attack roll against a creature if at least one of the ([^']+)'s allies is within 5 ft\. of the creature and the ally isn't incapacitated\./gi, 'tem vantagem em uma jogada de ataque contra uma criatura se pelo menos um aliado estiver a até 1,5m da criatura e não estiver incapacitado.')
        .replace(/can breathe air and water\./gi, 'pode respirar ar e água.')
        .replace(/The ([^.]+?) makes (two|three|four|five) ([^.]+?) attacks\./gi, (_, m, num, type) => {
            const numMap = { two: 'dois', three: 'três', four: 'quatro', five: 'cinco' };
            return `A criatura realiza ${numMap[num.toLowerCase()] || num} ataques (${translateTerm(type, 'pt')}).`;
        })
        .replace(/The ([^.]+?) makes (two|three|four|five) attacks:/gi, (_, m, num) => {
            const numMap = { two: 'dois', three: 'três', four: 'quatro', five: 'cinco' };
            return `A criatura realiza ${numMap[num.toLowerCase()] || num} ataques:`;
        });

    // 6. Conversão de medidas em pés (ft.) que restarem no texto para ft. (Xm)
    out = out.replace(/(\d+)\s*-?\s*(?:ft\.|feet)\b(?!\s*\(\d+m\))/gi, (match, ft) => {
        const meters = Math.round((parseInt(ft) / 5) * 1.5 * 10) / 10;
        return `${ft} ft. (${meters}m)`;
    });

    return out;
};

// --- Helpers para linhas do StatBlock (Salvaguardas, Perícias, Resistências, Idiomas) ---
export const translateSavesObject = (savingThrows, lang) => {
    if (!savingThrows || typeof savingThrows !== 'object') return '';
    const saveLabelsPt = {
        strength: 'FOR', dexterity: 'DES', constitution: 'CON',
        intelligence: 'INT', wisdom: 'SAB', charisma: 'CAR',
        str: 'FOR', dex: 'DES', con: 'CON', int: 'INT', wis: 'SAB', cha: 'CAR'
    };
    return Object.entries(savingThrows)
        .filter(([, val]) => val !== null && val !== undefined)
        .map(([k, val]) => {
            const label = lang === 'pt'
                ? (saveLabelsPt[k.toLowerCase()] || k.substring(0, 3).toUpperCase())
                : k.substring(0, 3).toUpperCase();
            return `${label} ${val >= 0 ? `+${val}` : val}`;
        })
        .join(', ');
};

export const translateSkillsObject = (skillBonuses, lang) => {
    if (!skillBonuses || typeof skillBonuses !== 'object') return '';
    return Object.entries(skillBonuses)
        .filter(([, val]) => val !== null && val !== undefined)
        .map(([k, val]) => {
            const cleanKey = k.replace(/_/g, ' ');
            const skillName = lang === 'pt' ? translateTerm(cleanKey, 'pt') : cleanKey;
            return `${skillName} ${val >= 0 ? `+${val}` : val}`;
        })
        .join(', ');
};

export const translateCommaList = (text, lang) => {
    if (lang !== 'pt' || !text) return text;
    return String(text)
        .split(/([,;])/)
        .map(part => {
            if (part === ',' || part === ';') return part + ' ';
            const trimmed = part.trim();
            if (!trimmed) return '';
            const lower = trimmed.toLowerCase();
            if (TERM_DICT[lower]) return TERM_DICT[lower];
            return trimmed
                .replace(/\bnonmagical attacks\b/gi, 'ataques não-mágicos')
                .replace(/\bthat aren't silvered\b/gi, 'que não sejam prateados')
                .replace(/\bthat aren't adamantine\b/gi, 'que não sejam de adamante')
                .replace(/\bbludgeoning, piercing, and slashing\b/gi, 'concussão, perfurante e cortante')
                .replace(/\bfrom nonmagical attacks\b/gi, 'de ataques não-mágicos')
                .replace(/\bdarkvision\b/gi, 'Visão no Escuro')
                .replace(/\bblindsight\b/gi, 'Percepção às Cegas')
                .replace(/\btremorsense\b/gi, 'Sentido Sísmico')
                .replace(/\btruesight\b/gi, 'Visão Verdadeira')
                .replace(/\bpassive perception\b/gi, 'Percepção Passiva')
                .replace(/\bcommon\b/gi, 'Comum')
                .replace(/\bdwarvish\b/gi, 'Anão')
                .replace(/\belvish\b/gi, 'Élfico')
                .replace(/\bgiant\b/gi, 'Gigante')
                .replace(/\bgnomish\b/gi, 'Gnômico')
                .replace(/\bgoblin\b/gi, 'Goblin')
                .replace(/\bhalfling\b/gi, 'Halfling')
                .replace(/\borc\b/gi, 'Orc')
                .replace(/\babyssal\b/gi, 'Abissal')
                .replace(/\bcelestial\b/gi, 'Celestial')
                .replace(/\bdraconic\b/gi, 'Dracônico')
                .replace(/\bdeep speech\b/gi, 'Dialeto Subterrâneo')
                .replace(/\binfernal\b/gi, 'Infernal')
                .replace(/\bprimordial\b/gi, 'Primordial')
                .replace(/\bsylvan\b/gi, 'Silvestre')
                .replace(/\bundercommon\b/gi, 'Subcomum')
                .replace(/\btelepathy\b/gi, 'Telepatia')
                .replace(/\bundersands\b/gi, 'compreende')
                .replace(/\bunderstands\b/gi, 'compreende')
                .replace(/\bbut can't speak\b/gi, 'mas não pode falar')
                .replace(/\bnatural armor\b/gi, 'armadura natural');
        })
        .join('')
        .replace(/\s+/g, ' ')
        .trim();
};
