import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Swords, Shield, Settings, Book, Plus, Trash2, Heart, RotateCcw, 
  AlertTriangle, Play, Check, Lock, Unlock, Package,
  Dices, Skull, X, Download, UserPlus, Info, ArrowRight, ArrowLeft,
  Search, Minus, Menu as MenuIcon, Coins, Gem, Sparkles, BookOpen,
  ScrollText, FileText, Edit3
} from 'lucide-react';

// --- Smart Name Translator ---
const translateName = (name, lang) => {
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
const translateTerm = (text, lang) => {
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

const rollDice = (count, sides) => {
    let total = 0;
    for(let i = 0; i < count; i++) total += Math.floor(Math.random() * sides) + 1;
    return total;
};

const parseCR = (crValue) => {
    if (!crValue) return 0;
    const crStr = String(crValue).trim();
    if (crStr.includes('/')) {
        const [num, den] = crStr.split('/');
        return (parseFloat(num) || 0) / (parseFloat(den) || 1);
    }
    return parseFloat(crStr) || 0;
};

const XP_BUDGET_5E = {
  1: { low: 50, moderate: 75, high: 100 },
  2: { low: 100, moderate: 150, high: 200 },
  3: { low: 150, moderate: 225, high: 400 },
  4: { low: 250, moderate: 375, high: 500 },
  5: { low: 500, moderate: 750, high: 1100 },
  6: { low: 600, moderate: 900, high: 1400 },
  7: { low: 750, moderate: 1100, high: 1700 },
  8: { low: 900, moderate: 1400, high: 2100 },
  9: { low: 1100, moderate: 1600, high: 2400 },
  10: { low: 1200, moderate: 1900, high: 2800 },
  11: { low: 1600, moderate: 2400, high: 3600 },
  12: { low: 2000, moderate: 3000, high: 4500 },
  13: { low: 2200, moderate: 3400, high: 5100 },
  14: { low: 2500, moderate: 3800, high: 5700 },
  15: { low: 2800, moderate: 4300, high: 6400 },
  16: { low: 3200, moderate: 4800, high: 7200 },
  17: { low: 3900, moderate: 5900, high: 8800 },
  18: { low: 4200, moderate: 6300, high: 9500 },
  19: { low: 4900, moderate: 7300, high: 10900 },
  20: { low: 5700, moderate: 8500, high: 12700 }
};

const CR_TO_XP = {
    "0": 10, "1/8": 25, "1/4": 50, "1/2": 100, "1": 200, "2": 450, "3": 700, "4": 1100,
    "5": 1800, "6": 2300, "7": 2900, "8": 3900, "9": 5000, "10": 5900, "11": 7200, 
    "12": 8400, "13": 10000, "14": 11500, "15": 13000, "16": 15000, "17": 18000, 
    "18": 20000, "19": 22000, "20": 25000, "21": 33000, "22": 41000, "23": 50000, 
    "24": 62000, "25": 75000, "30": 155000
};

const CONDITIONS = [
    { id: 'blinded', label: 'Blinded/Cego', color: 'bg-slate-700' },
    { id: 'charmed', label: 'Charmed/Enfeitiçado', color: 'bg-pink-600' },
    { id: 'deafened', label: 'Deafened/Surdo', color: 'bg-stone-500' },
    { id: 'exhaustion', label: 'Exhaustion/Exaustão', color: 'bg-zinc-600' },
    { id: 'frightened', label: 'Frightened/Amedrontado', color: 'bg-purple-600' },
    { id: 'grappled', label: 'Grappled/Agarrado', color: 'bg-orange-500' },
    { id: 'invisible', label: 'Invisible/Invisível', color: 'bg-cyan-600' },
    { id: 'paralyzed', label: 'Paralyzed/Paralisado', color: 'bg-teal-600' },
    { id: 'poisoned', label: 'Poisoned/Envenenado', color: 'bg-green-600' },
    { id: 'prone', label: 'Prone/Caído', color: 'bg-amber-700' },
    { id: 'restrained', label: 'Restrained/Impedido', color: 'bg-orange-600' },
    { id: 'stunned', label: 'Stunned/Atordoado', color: 'bg-yellow-500' },
    { id: 'unconscious', label: 'Unconscious/Inconsciente', color: 'bg-gray-800' }
];

const DICTIONARY = {
  en: {
    generator: "Generator", encounter: "Encounter", tracker: "Combat", settings: "Sync & Settings", library: "DM Screen",
    bestiary: "Bestiary", menu: "Menu", customEncounter: "Custom Encounter", items: "Compendium",
    partySize: "Party Size", avgLevel: "Avg Level", difficulty: "Difficulty",
    low: "Low", moderate: "Moderate", high: "High",
    filters: "Filters (Optional)", type: "Type", environment: "Environment", any: "Any",
    generateBtn: "Auto Generate", searchMonsters: "Search monsters...", searchItems: "Search items...", searchRules: "Search rules...",
    totalBudget: "Total Budget", xp: "XP",
    rerollAll: "Reroll All", lock: "Lock", swap: "Swap", addToTracker: "Send all to Combat",
    addToEncounter: "+ Encounter", addDirectTracker: "+ Combat",
    emptyEncounter: "Your encounter is empty. Generate one or add monsters from the Bestiary.",
    clearEncounter: "Clear Encounter",
    syncBestiary: "Update Bestiary", syncDesc: "Downloads SRD 5.2 monsters for offline use.",
    syncItems: "Update Items",
    syncing: "Syncing... Please wait.", syncDone: "Up-to-Date!",
    language: "Language", theme: "Theme", credits: "Credits & Licenses",
    creditsText: "Content based on D&D 5.5E SRD 5.2 (CC-BY 4.0) by Wizards of the Coast. Powered by Open5e API.",
    addPlayer: "Add Player / NPC", name: "Name", init: "Initiative", maxHp: "Max HP", add: "Add",
    nextTurn: "Next Turn", round: "Round", turn: "Turn", clearTracker: "Clear Combat",
    loot: "Suggested Loot", style: "Encounter Style", balanced: "Balanced", boss: "Boss & Minions", horde: "Horde",
    budgetAdj: "Budget Adjustment", recommended: "Recommended",
    speed: "Speed", str: "STR", dex: "DEX", con: "CON", int: "INT", wis: "WIS", cha: "CHA",
    partyTooWeak: "Party is too weak for any monsters with these filters! (Slider is at max)",
    budgetTooLow: "Budget is too low to spawn monsters. Increase the budget adjustment.",
    noMonsters: "No monsters match the selected filters.", noItems: "No items match.",
    forceGenerate: "Generate Anyway (Possible TPK 💀)", cancel: "Cancel", error: "Generation Failed",
    creator: "Criado por: Pedro Hércues", aiDisclaimer: "Este aplicativo foi gerado com IA e pode apresentar problemas. Caso encontre erros, entre em contato:", email: "pedrosouzagrangeiro@gmail.com",
    addedToEncounter: "added to Encounter!", addedToTracker: "sent to Combat!",
    lootGenTitle: "Loot Generator", compendiumTitle: "Compendium",
    lootTier: "Challenge Tier", lootType: "Treasure Type",
    individualLoot: "Individual", hoardLoot: "Hoard / Boss",
    generateLootBtn: "Generate Loot", magicItems: "Magic Items",
    gemsAndArt: "Gems & Art", coins: "Coins",
    tier1: "Tier 1 (CR 0-4)", tier2: "Tier 2 (CR 5-10)", tier3: "Tier 3 (CR 11-16)", tier4: "Tier 4 (CR 17+)",
    noItemsCache: "⚠️ Sync items in Settings to generate Magic Items!",
    campaigns: "Campaigns", newCampaign: "New Campaign", campaignName: "Campaign Name",
    campaignDesc: "Description / Synopsis (Optional)", noCampaigns: "No campaigns yet. Create your first campaign to start taking notes!",
    notes: "Notes", newNote: "New Note", editNote: "Edit Note", noteTitle: "Note Title", noteContent: "Write your campaign notes, NPCs, locations or session logs here...",
    noNotes: "No notes in this campaign yet.", save: "Save", backToCampaigns: "Back to Campaigns",
    deleteCampaignConfirm: "Delete this campaign and all its notes?", deleteNoteConfirm: "Delete this note?",
    campaignCreated: "Campaign created!", noteSaved: "Note saved!", searchNotes: "Search notes..."
  },
  pt: {
    generator: "Gerador", encounter: "Encontro", tracker: "Combate", settings: "Sincronização", library: "Escudo do Mestre",
    bestiary: "Bestiário", menu: "Menu", customEncounter: "Encontro Personalizado", items: "Compêndio de Itens",
    partySize: "Jogadores", avgLevel: "Nível Médio", difficulty: "Dificuldade",
    low: "Baixa", moderate: "Média", high: "Alta",
    filters: "Filtros (Opcional)", type: "Tipo", environment: "Ambiente", any: "Qualquer",
    generateBtn: "Gerar Automático", searchMonsters: "Buscar monstros...", searchItems: "Buscar itens...", searchRules: "Buscar regras...",
    totalBudget: "Orçamento Total", xp: "XP",
    rerollAll: "Rolar Tudo", lock: "Travar", swap: "Trocar", addToTracker: "Enviar p/ Combate",
    addToEncounter: "+ Encontro", addDirectTracker: "+ Combate",
    emptyEncounter: "O encontro está vazio. Gere um aleatório ou adicione monstros pelo Bestiário.",
    clearEncounter: "Limpar Encontro",
    syncBestiary: "Atualizar Bestiário", syncDesc: "Baixa monstros do SRD 5.2 para uso offline.",
    syncItems: "Atualizar Itens",
    syncing: "Sincronizando... Aguarde.", syncDone: "Atualizado!",
    language: "Idioma", theme: "Tema", credits: "Créditos e Licenças",
    creditsText: "Conteúdo baseado no D&D 5.5E SRD 5.2 (CC-BY 4.0) da Wizards of the Coast. Fornecido por Open5e API.",
    addPlayer: "Add Jogador / NPC", name: "Nome", init: "Iniciativa", maxHp: "PV Máx", add: "Adicionar",
    nextTurn: "Próximo Turno", round: "Rodada", turn: "Turno", clearTracker: "Limpar Combate",
    loot: "Saque Sugerido", style: "Estilo do Encontro", balanced: "Equilibrado", boss: "Chefe e Lacaios", horde: "Horda",
    budgetAdj: "Ajuste de Orçamento", recommended: "Recomendado",
    speed: "Deslocamento", str: "FOR", dex: "DES", con: "CON", int: "INT", wis: "SAB", cha: "CAR",
    partyTooWeak: "O grupo é muito fraco para enfrentar monstros com esses filtros! (Ajuste no máximo)",
    budgetTooLow: "O orçamento é muito baixo para gerar monstros. Tente aumentar o Ajuste de Orçamento.",
    noMonsters: "Nenhum monstro corresponde aos filtros selecionados.", noItems: "Nenhum item encontrado.",
    forceGenerate: "Gerar Mesmo Assim (Risco de TPK 💀)", cancel: "Cancelar", error: "Falha na Geração",
    creator: "Criado por: Pedro Hércues", aiDisclaimer: "Este aplicativo foi gerado com IA e pode apresentar problemas. Caso encontre erros, entre em contato:", email: "pedrosouzagrangeiro@gmail.com",
    addedToEncounter: "adicionado ao Encontro!", addedToTracker: "enviado para o Combate!",
    lootGenTitle: "Gerador de Loot", compendiumTitle: "Compêndio",
    lootTier: "Nível (Tier)", lootType: "Tipo de Tesouro",
    individualLoot: "Individual", hoardLoot: "Tesouro (Covil/Chefe)",
    generateLootBtn: "Gerar Tesouro", magicItems: "Itens Mágicos",
    gemsAndArt: "Gemas & Artes", coins: "Moedas",
    tier1: "Tier 1 (ND 0-4)", tier2: "Tier 2 (ND 5-10)", tier3: "Tier 3 (ND 11-16)", tier4: "Tier 4 (ND 17+)",
    noItemsCache: "⚠️ Sincronize os itens na aba Sistema para sortear Itens Mágicos!",
    campaigns: "Campanhas", newCampaign: "Nova Campanha", campaignName: "Nome da Campanha",
    campaignDesc: "Descrição / Sinopse (Opcional)", noCampaigns: "Nenhuma campanha criada. Crie sua primeira campanha para começar a fazer anotações!",
    notes: "Anotações", newNote: "Nova Nota", editNote: "Editar Nota", noteTitle: "Título da Nota", noteContent: "Escreva anotações da sessão, NPCs, locais ou segredos da campanha...",
    noNotes: "Nenhuma anotação nesta campanha ainda.", save: "Salvar", backToCampaigns: "Voltar para Campanhas",
    deleteCampaignConfirm: "Excluir esta campanha e todas as suas notas?", deleteNoteConfirm: "Excluir esta nota?",
    campaignCreated: "Campanha criada!", noteSaved: "Nota salva!", searchNotes: "Buscar notas..."
  }
};

const generateAdvancedLoot = (tier, type, allItems, lang = 'pt') => {
    let coins = {};
    let gems = "";
    let items = [];

    const getItems = (rarities, count) => {
        if (!allItems || allItems.length === 0) return [];
        const pool = allItems.filter(i => {
            const r = (safeText(i.rarity) || "").toLowerCase();
            return rarities.some(target => r.includes(target));
        });
        if(pool.length === 0) return [];
        let selected = [];
        for(let i=0; i<count; i++) {
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

const generateEncounterLoot = (monsters, allItems, lang) => {
    if(!monsters || monsters.length === 0) return null;
    let maxCR = 0;
    let isBoss = false;
    
    monsters.forEach(m => {
        const cr = parseCR(m.challenge_rating);
        if(cr > maxCR) maxCR = cr;
        if(m.isBoss) isBoss = true;
    });
    
    let tier = 1;
    if(maxCR >= 17) tier = 4;
    else if(maxCR >= 11) tier = 3;
    else if(maxCR >= 5) tier = 2;

    const totalCount = monsters.reduce((sum, m) => sum + m.count, 0);
    const type = (isBoss || totalCount > 3 || maxCR >= 11) ? 'hoard' : 'individual';
    
    return generateAdvancedLoot(tier, type, allItems, lang);
};

const DB_NAME = 'QuickEncounterDB';
const STORE_MONSTERS = 'monsters';
const STORE_ITEMS = 'items';

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 3);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_MONSTERS)) {
        db.createObjectStore(STORE_MONSTERS, { keyPath: 'slug' });
      }
      if (!db.objectStoreNames.contains(STORE_ITEMS)) {
        db.createObjectStore(STORE_ITEMS, { keyPath: 'slug' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveDataToDB = async (storeName, dataList) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    let count = 0;
    dataList.forEach(item => {
        let uniqueSlug = item.slug;
        if (!uniqueSlug) {
            uniqueSlug = String(item.name || "unknown").toLowerCase().replace(/[^a-z0-9]+/g, '-');
            item.slug = uniqueSlug;
        }
        
        if (storeName === STORE_MONSTERS) {
            if (item.xp !== undefined && item.xp !== null) {
                const rawXp = typeof item.xp === 'string' ? item.xp.replace(/\D/g, '') : item.xp;
                item.xp = parseInt(rawXp) || 0;
            } 
            else if (item.challenge_rating !== undefined && item.challenge_rating !== null) {
                const cleanCR = String(item.challenge_rating).split(' ')[0];
                item.xp = CR_TO_XP[cleanCR] !== undefined ? CR_TO_XP[cleanCR] : 0;
            }
            else {
                item.xp = 0;
            }
        }

        store.put(item);
        count++;
    });

    transaction.oncomplete = () => resolve(count);
    transaction.onerror = (e) => reject(e.target.error);
  });
};

const getAllDataFromDB = async (storeName) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState('pt');
  const [monsters, setMonsters] = useState([]);
  const [items, setItems] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [itemsTab, setItemsTab] = useState('compendium'); 
  
  const [encounter, setEncounter] = useState(null);
  const [tracker, setTracker] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(-1);
  const [round, setRound] = useState(1);
  const [encounterError, setEncounterError] = useState(null);
  const [campaigns, setCampaigns] = useState(() => {
    try {
      const saved = localStorage.getItem('mestre_campaigns');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load campaigns", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mestre_campaigns', JSON.stringify(campaigns));
    } catch (e) {
      console.error("Failed to save campaigns", e);
    }
  }, [campaigns]);
  
  const [debugLogs, setDebugLogs] = useState(["[SISTEMA] Aguardando ações..."]);
  const t = DICTIONARY[lang];

  const addLog = (msg) => {
    setDebugLogs(prev => {
        const time = new Date().toLocaleTimeString('pt-BR', {hour12: false});
        return [`[${time}] ${msg}`, ...prev].slice(0, 40);
    });
  };

  const showToast = (msg) => {
    setToastMsg(msg);
  };

  const loadCache = async () => {
    try {
      const monsterData = await getAllDataFromDB(STORE_MONSTERS);
      const sortedMonsters = monsterData.sort((a, b) => (safeText(a.name) > safeText(b.name)) ? 1 : -1);
      setMonsters(sortedMonsters);
      
      const itemData = await getAllDataFromDB(STORE_ITEMS);
      const sortedItems = itemData.sort((a, b) => (safeText(a.name) > safeText(b.name)) ? 1 : -1);
      setItems(sortedItems);

      addLog(`Cache carregado: ${sortedMonsters.length} monstros, ${sortedItems.length} itens.`);
    } catch (e) {
      console.error("Cache Error:", e);
      addLog("Erro crítico ao carregar cache local.");
    }
  };

  useEffect(() => { loadCache(); }, []);

  const syncData = async (type) => {
    setIsSyncing(true);
    let totalSaved = 0;
    
    const fetchPageAndSave = async (fetchUrl, storeName) => {
        try {
            addLog(`Baixando...`);
            const response = await fetch(fetchUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                let itemsToSave = data.results;
                if(storeName === STORE_ITEMS) {
                     itemsToSave = itemsToSave.map(i => ({...i, open5e_category: type}));
                }
                const savedCount = await saveDataToDB(storeName, itemsToSave);
                totalSaved += savedCount;
                addLog(`Sucesso: ${totalSaved} registros salvos.`);
            }
            return data.next;
        } catch (error) {
            throw error;
        }
    };

    try {
        if (type === 'monsters') {
            addLog("Iniciando sync de Monstros (SRD 2024)...");
            let url = 'https://api.open5e.com/v2/creatures/?document__key__in=srd-2024&limit=100';
            while (url) { url = await fetchPageAndSave(url, STORE_MONSTERS); }
        } else if (type === 'items') {
             addLog("Iniciando sync de Itens...");
             const endpoints = ['magicitems', 'weapons', 'armor'];
             for (const ep of endpoints) {
                 addLog(`Baixando categoria: ${ep}...`);
                 let url = `https://api.open5e.com/v1/${ep}/?limit=100`;
                 while (url) { url = await fetchPageAndSave(url, STORE_ITEMS); }
             }
        }
        addLog(`Sincronização concluída!`);
        await loadCache();
    } catch (error) {
        console.error(error);
        addLog(`Falha na Sincronização: ${error.message}`);
    } finally {
        setIsSyncing(false);
    }
  };

  const generateEncounter = (partySize, level, difficulty, filters, budgetMultiplier = 1, style = 'balanced', force = false) => {
    setEncounterError(null);
    if (monsters.length === 0) {
        addLog("ERRO: O Cache de monstros está vazio.");
        return false;
    }

    const perCharBudget = XP_BUDGET_5E[level]?.[difficulty] || XP_BUDGET_5E[1][difficulty];
    const baseTotalBudget = perCharBudget * partySize;
    let totalBudget = Math.floor(baseTotalBudget * budgetMultiplier);
    
    let availableMonsters = monsters.filter(m => {
      let typeMatch = true;
      let envMatch = true;
      
      if (filters.type && filters.type !== 'Any') {
          const typeString = typeof m.type === 'object' ? String(m.type.name || m.type.desc || m.type) : String(m.type || '');
          typeMatch = typeString.toLowerCase().includes(filters.type.toLowerCase());
      }
      if (filters.environment && filters.environment !== 'Any') {
          const envString = Array.isArray(m.environments) ? m.environments.join(', ') : (m.environments || m.environment || '');
          envMatch = envString.toLowerCase().includes(filters.environment.toLowerCase());
      }
      return typeMatch && envMatch && m.xp && m.xp > 0;
    });

    if (style === 'horde') {
        availableMonsters = availableMonsters.filter(m => m.xp <= (totalBudget / 4));
    }

    if (availableMonsters.length === 0) {
        addLog(`Falha Crítica: Orçamento de ${totalBudget} XP. Monstros compatíveis = 0.`);
        setEncounterError("noMonsters");
        return false;
    }

    const selected = {};
    let currentTotalXP = 0;
    let availableBudget = totalBudget;
    
    if (style === 'boss' && !force) {
        const bossBudget = totalBudget * 0.7;
        const potentialBosses = availableMonsters.filter(m => m.xp <= bossBudget * 1.1 && m.xp >= bossBudget * 0.5);
        if (potentialBosses.length > 0) {
            const boss = potentialBosses[Math.floor(Math.random() * potentialBosses.length)];
            selected[boss.slug] = { ...boss, count: 1, isBoss: true };
            currentTotalXP += boss.xp;
            availableBudget -= boss.xp;
            addLog(`BOSS Selecionado: ${safeText(boss.name)} (${boss.xp} XP)`);
        }
    }

    let attempts = 0;
    let addedSomething = true;

    while (availableBudget > 0 && addedSomething && attempts < 200) {
      addedSomething = false;
      const affordable = availableMonsters.filter(m => m.xp <= availableBudget * 1.1); 
      
      if (affordable.length > 0) {
        const choice = affordable[Math.floor(Math.random() * affordable.length)];
        if (selected[choice.slug]) {
          selected[choice.slug].count += 1;
        } else {
          selected[choice.slug] = { ...choice, count: 1 };
        }
        addedSomething = true;
        availableBudget -= choice.xp;
        currentTotalXP += choice.xp;
      }
      attempts++;
    }

    if (Object.keys(selected).length === 0) {
        if (force && availableMonsters.length > 0) {
            const weakest = availableMonsters.reduce((prev, curr) => (prev.xp < curr.xp) ? prev : curr);
            selected[weakest.slug] = { ...weakest, count: 1, isBoss: style === 'boss' };
            currentTotalXP += weakest.xp;
            addLog(`GERAÇÃO FORÇADA: Risco de TPK. Puxado: ${safeText(weakest.name)}.`);
        } else {
            if (budgetMultiplier >= 3) {
                addLog(`FALHA: Grupo fraco demais para os filtros escolhidos.`);
                setEncounterError("partyTooWeak");
            } else {
                addLog(`FALHA: Orçamento (${totalBudget} XP) baixo demais.`);
                setEncounterError("budgetTooLow");
            }
            return false;
        }
    }
    
    const finalMonsters = Object.values(selected);
    setEncounter({
      budget: totalBudget,
      totalXP: currentTotalXP,
      monsters: finalMonsters,
      loot: generateEncounterLoot(finalMonsters, items, lang)
    });
    return true;
  };

  const addMonsterToEncounter = (monster) => {
    setEncounter(prev => {
        const current = prev || { budget: 0, totalXP: 0, monsters: [], loot: null };
        const existingIdx = current.monsters.findIndex(m => m.slug === monster.slug);
        let newMonsters = [...current.monsters];
        
        if(existingIdx >= 0) {
            newMonsters[existingIdx].count += 1;
        } else {
            newMonsters.push({...monster, count: 1, isBoss: false});
        }
        
        const newTotalXP = current.totalXP + monster.xp;
        showToast(`${translateName(safeText(monster.name), lang)} ${t.addedToEncounter}`);
        
        return { 
            ...current, 
            totalXP: newTotalXP, 
            monsters: newMonsters,
            loot: generateEncounterLoot(newMonsters, items, lang)
        };
    });
  };

  const updateMonsterCount = (slug, delta) => {
    if (!encounter) return;
    let newMonsters = [...encounter.monsters];
    const idx = newMonsters.findIndex(m => m.slug === slug);
    if (idx === -1) return;

    const monsterXP = newMonsters[idx].xp;
    newMonsters[idx].count += delta;
    
    let newTotalXP = encounter.totalXP + (delta * monsterXP);

    if (newMonsters[idx].count <= 0) {
        newMonsters.splice(idx, 1);
    }

    setEncounter({ 
        ...encounter, 
        totalXP: newTotalXP, 
        monsters: newMonsters,
        loot: newMonsters.length === 0 ? null : generateEncounterLoot(newMonsters, items, lang)
    });
  };

  const parseEntityStats = (m, existingTrackerCount) => {
      let hp = 10, ac = 10;
      try {
           if (m.hit_points != null) {
               if (typeof m.hit_points === 'object') hp = m.hit_points.value || parseInt(m.hit_points.desc) || 10;
               else hp = parseInt(m.hit_points) || 10;
           }
           if (m.armor_class != null) {
               if (Array.isArray(m.armor_class)) ac = m.armor_class[0]?.value || parseInt(m.armor_class[0]?.desc) || 10;
               else if (typeof m.armor_class === 'object') ac = m.armor_class.value || parseInt(m.armor_class.desc) || 10;
               else ac = parseInt(m.armor_class) || 10;
           }
      } catch(e) { console.error("Error parsing stats", e) }

      const dexMod = Math.floor(((getDeepStat(m, 'dexterity') || 10) - 10) / 2);
      const initRoll = Math.floor(Math.random() * 20) + 1 + dexMod;

      const baseOriginalName = safeText(m.name);
      let finalName = translateName(baseOriginalName, lang);
      if (existingTrackerCount > 0) {
          finalName = `${finalName} #${existingTrackerCount + 1}`;
      }

      return {
          id: `${m.slug}-${crypto.randomUUID()}`,
          originalName: baseOriginalName,
          name: finalName,
          initiative: initRoll,
          hp: hp,
          maxHp: hp,
          ac: ac,
          isPlayer: false,
          conditions: []
      };
  };

  const countExistingInTracker = (baseOriginalName, currentTracker) => {
      return currentTracker.filter(e => e.originalName === baseOriginalName).length;
  };

  const addToTracker = () => {
    if (!encounter) return;
    let newTracker = [...tracker];
    
    encounter.monsters.forEach(m => {
      const baseOriginalName = safeText(m.name);
      for (let i = 0; i < m.count; i++) {
        const existingCount = countExistingInTracker(baseOriginalName, newTracker);
        newTracker.push(parseEntityStats(m, existingCount));
      }
    });
    newTracker.sort((a, b) => b.initiative - a.initiative);
    setTracker(newTracker);
    showToast(t.addToTracker);
    if(currentTurn === -1) setCurrentTurn(0);
  };

  const addDirectlyToTracker = (monster) => {
      const baseOriginalName = safeText(monster.name);
      const existingCount = countExistingInTracker(baseOriginalName, tracker);

      const newEntity = parseEntityStats(monster, existingCount);
      const newTracker = [...tracker, newEntity].sort((a, b) => b.initiative - a.initiative);
      setTracker(newTracker);
      showToast(`${newEntity.name} ${t.addedToTracker}`);
      if(currentTurn === -1) setCurrentTurn(0);
  };

  return (
    <AppContext.Provider value={{
      lang, setLang, t, monsters, items, syncData, isSyncing, debugLogs, addLog,
      generateEncounter, encounter, setEncounter, encounterError, setEncounterError,
      addMonsterToEncounter, updateMonsterCount, addDirectlyToTracker,
      tracker, setTracker, addToTracker, currentTurn, setCurrentTurn, round, setRound,
      toastMsg, setToastMsg, itemsTab, setItemsTab,
      campaigns, setCampaigns, showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

const safeText = (val) => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'string' || typeof val === 'number') return String(val);
    if (Array.isArray(val)) {
        return val.map(v => {
            if (v === null || v === undefined) return '';
            return typeof v === 'object' ? (v.name || v.desc || v.value || JSON.stringify(v)) : String(v);
        }).join(', ');
    }
    if (typeof val === 'object') {
        return String(val.name || val.desc || val.value || JSON.stringify(val));
    }
    return String(val);
};

const getDeepStat = (monster, statName) => {
    const keys = [statName, statName.substring(0,3), `${statName}_score`];
    const extractFirstNumber = (val) => {
        if (val === null || val === undefined) return null;
        const textVal = String(safeText(val));
        const match = textVal.match(/-?\d+/);
        return match ? parseInt(match[0], 10) : null;
    };
    for (const key of keys) {
        if (monster[key] !== undefined && monster[key] !== null) {
            const num = extractFirstNumber(monster[key]);
            if (num !== null) return num;
        }
    }
    if (monster.ability_scores) {
        for (const key of keys) {
            if (monster.ability_scores[key] !== undefined && monster.ability_scores[key] !== null) {
                const num = extractFirstNumber(monster.ability_scores[key]);
                if (num !== null) return num;
            }
        }
    }
    return null;
};

const ToastMessage = () => {
    const { toastMsg, setToastMsg } = useContext(AppContext);
    
    useEffect(() => {
        if (!toastMsg) return;
        const timer = setTimeout(() => {
            setToastMsg(null);
        }, 3000);
        return () => clearTimeout(timer);
    }, [toastMsg, setToastMsg]);

    if (!toastMsg) return null;

    return (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-2 fade-in zoom-in duration-300 pointer-events-none w-[90%] max-w-sm flex justify-center">
            <div className="bg-[#FF1457]/95 backdrop-blur-sm text-white text-xs font-bold py-3 px-6 rounded-full shadow-[0_10px_25px_rgba(255,20,87,0.5)] border border-[#FF1457]/50 text-center flex items-center gap-2">
                <Check size={16} className="text-white" /> {toastMsg}
            </div>
        </div>
    );
};

const StatBlock = ({ monster, lang }) => {
  const getMod = (score) => {
      if (score === null || isNaN(score)) return "N/A";
      const mod = Math.floor((score - 10) / 2);
      return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const getStat = (name) => getDeepStat(monster, name);

  let speedText = '';
  if (monster.speed) {
      if (typeof monster.speed === 'string') {
          speedText = monster.speed;
      } else if (typeof monster.speed === 'object') {
          const speedDict = { 'walk': 'Terrestre', 'fly': 'Voo', 'swim': 'Natação', 'climb': 'Escalada', 'burrow': 'Escavação' };
          speedText = Object.entries(monster.speed)
              .map(([key, val]) => `${lang === 'pt' ? (speedDict[key] || key) : key} ${safeText(val)} ft.`)
              .join(' • ');
      }
  }
  speedText = speedText.replace(/(\d+)\s*(ft\.?|feet)/gi, (match, p1) => {
      const meters = Math.round((parseInt(p1) / 5) * 1.5);
      return `${p1} ft. (${meters}m)`;
  });

  const renderSection = (title, data) => {
      if (!data || !Array.isArray(data) || data.length === 0) return null;
      const validItems = data.filter(item => item && (item.name || item.desc));
      if (validItems.length === 0) return null;

      return (
          <div className="mb-2">
            <h5 className="font-bold text-[#FF1457] border-b border-[#453745] mb-1">{title}</h5>
            {validItems.map((item, idx) => (
              <p key={idx} className="mb-1 text-gray-300">
                  <span className="font-bold italic text-white">{translateTerm(safeText(item.name), lang)}.</span> {safeText(item.desc)}
              </p>
            ))}
          </div>
      );
  };

  return (
    <div className="bg-[#2B2C30] border border-[#453745] text-gray-200 p-4 rounded-xl mt-2 shadow-inner text-sm font-sans">
      <div className="border-b-2 border-[#453745] pb-2 mb-2">
          <h4 className="font-bold text-lg text-[#FF1457] capitalize tracking-wide">{translateName(safeText(monster.name), lang)}</h4>
          <p className="italic text-xs text-gray-400 capitalize">
              {translateTerm(safeText(monster.size), lang)} {translateTerm(safeText(monster.type), lang)}, {translateTerm(safeText(monster.alignment), lang) || 'Any alignment'}
          </p>
      </div>

      <div className="border-b-2 border-[#453745] pb-2 mb-2 text-xs space-y-1">
          <p><span className="font-bold text-[#FF1457]">Armor Class</span> {safeText(monster.armor_class) || '10'}</p>
          <p><span className="font-bold text-[#FF1457]">Hit Points</span> {safeText(monster.hit_points) || '10'}</p>
          <p><span className="font-bold text-[#FF1457]">Speed</span> {speedText || '30 ft. (9m)'}</p>
      </div>

      <div className="border-b-2 border-[#453745] pb-2 mb-2 flex justify-between text-center bg-[#35313B] p-2 rounded-lg">
          {[
              {l: 'STR', k: 'strength'}, {l: 'DEX', k: 'dexterity'}, {l: 'CON', k: 'constitution'},
              {l: 'INT', k: 'intelligence'}, {l: 'WIS', k: 'wisdom'}, {l: 'CHA', k: 'charisma'}
          ].map(stat => {
              const val = getStat(stat.k);
              return (
                <div key={stat.k}>
                    <div className="font-bold text-[#FF1457]">{stat.l}</div>
                    <div className="text-white font-bold">{val !== null ? val : '-'}</div>
                    <div className="text-[10px] text-gray-400">({getMod(val)})</div>
                </div>
              );
          })}
      </div>

      {monster.special_abilities && Array.isArray(monster.special_abilities) && (
          <div className="mb-2">
            {monster.special_abilities.filter(item => item && (item.name || item.desc)).map((ability, idx) => (
                <p key={idx} className="mb-1 text-gray-300">
                    <span className="font-bold italic text-white">{translateTerm(safeText(ability.name), lang)}.</span> {safeText(ability.desc)}
                </p>
            ))}
          </div>
      )}
      
      {monster.traits && Array.isArray(monster.traits) && (
          <div className="mb-2">
            {monster.traits.filter(item => item && (item.name || item.desc)).map((trait, idx) => (
                <p key={idx} className="mb-1 text-gray-300">
                    <span className="font-bold italic text-white">{translateTerm(safeText(trait.name), lang)}.</span> {safeText(trait.desc)}
                </p>
            ))}
          </div>
      )}

      {renderSection('Actions', monster.actions)}
      {renderSection('Bonus Actions', monster.bonus_actions)}
      {renderSection('Reactions', monster.reactions)}
      {renderSection('Legendary Actions', monster.legendary_actions)}
      {renderSection('Mythic Actions', monster.mythic_actions)}
    </div>
  );
};

const HomeScreen = ({ onNavigate }) => {
  const { t, generateEncounter, monsters, encounterError, setEncounterError, lang } = useContext(AppContext);
  const [partySize, setPartySize] = useState(4);
  const [avgLevel, setAvgLevel] = useState(1);
  const [difficulty, setDifficulty] = useState('moderate');
  const [typeFilter, setTypeFilter] = useState('Any');
  const [envFilter, setEnvFilter] = useState('Any');
  const [styleFilter, setStyleFilter] = useState('balanced');
  const [budgetMult, setBudgetMult] = useState(100);
  const [showFilters, setShowFilters] = useState(false);

  const handleGenerate = (force = false) => {
    const success = generateEncounter(partySize, avgLevel, difficulty, { type: typeFilter, environment: envFilter }, budgetMult / 100, styleFilter, force);
    if (success) onNavigate('encounter');
  };

  const baseBudget = (XP_BUDGET_5E[avgLevel]?.[difficulty] || XP_BUDGET_5E[1][difficulty]) * partySize;
  const currentBudget = Math.floor(baseBudget * (budgetMult / 100));

  return (
    <div className="p-4 space-y-4 pb-8 max-w-lg mx-auto">
      <div className="bg-[#35313B] p-5 rounded-3xl shadow-xl border border-[#453745]">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="text-xs text-gray-400 font-semibold mb-1 block uppercase tracking-wider">{t.partySize}</label>
            <div className="flex items-center bg-[#2B2C30] rounded-xl p-1 border border-[#453745]">
              <button onClick={() => setPartySize(Math.max(1, partySize - 1))} className="p-2 text-gray-400 hover:text-white transition-colors">-</button>
              <span className="flex-1 text-center font-bold text-lg text-white">{partySize}</span>
              <button onClick={() => setPartySize(partySize + 1)} className="p-2 text-gray-400 hover:text-white transition-colors">+</button>
            </div>
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-400 font-semibold mb-1 block uppercase tracking-wider">{t.avgLevel}</label>
            <div className="flex items-center bg-[#2B2C30] rounded-xl p-1 border border-[#453745]">
              <button onClick={() => setAvgLevel(Math.max(1, avgLevel - 1))} className="p-2 text-gray-400 hover:text-white transition-colors">-</button>
              <span className="flex-1 text-center font-bold text-lg text-white">{avgLevel}</span>
              <button onClick={() => setAvgLevel(Math.min(20, avgLevel + 1))} className="p-2 text-gray-400 hover:text-white transition-colors">+</button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs text-gray-400 font-semibold mb-2 block uppercase tracking-wider">{t.difficulty}</label>
          <div className="flex gap-2 bg-[#2B2C30] p-1 rounded-xl border border-[#453745]">
            {['low', 'moderate', 'high'].map(d => (
              <button key={d} onClick={() => setDifficulty(d)} 
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${difficulty === d ? 'bg-[#FF1457] text-white shadow-md' : 'text-gray-400 hover:text-gray-200 hover:bg-[#35313B]'}`}>
                {t[d]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{t.budgetAdj}</label>
                <span className="text-[#FF1457] font-bold">{budgetMult}%</span>
            </div>
            <input type="range" min="50" max="300" step="10" value={budgetMult} onChange={(e) => setBudgetMult(e.target.value)}
                className="w-full h-2 bg-[#453745] rounded-lg appearance-none cursor-pointer accent-[#FF1457]" />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>{currentBudget} XP</span>
                {budgetMult !== 100 && <span>({t.recommended}: {baseBudget} XP)</span>}
            </div>
        </div>

        <button onClick={() => setShowFilters(!showFilters)} className="w-full text-left flex items-center justify-between py-2 text-gray-400 hover:text-[#FF1457] border-b border-[#453745] mb-4 transition-colors">
          <span className="font-semibold">{t.filters}</span>
          {showFilters ? <Lock size={16}/> : <Unlock size={16}/>}
        </button>

        {showFilters && (
          <div className="space-y-4 mb-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">{t.style}</label>
              <select value={styleFilter} onChange={(e) => setStyleFilter(e.target.value)} className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-lg p-3 outline-none focus:border-[#FF1457] transition-colors">
                <option value="balanced">{t.balanced}</option>
                <option value="boss">{t.boss}</option>
                <option value="horde">{t.horde}</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">{t.type}</label>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-lg p-3 outline-none focus:border-[#FF1457] transition-colors">
                {['Any', 'Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon', 'Elemental', 'Fey', 'Fiend', 'Giant', 'Humanoid', 'Monstrosity', 'Ooze', 'Plant', 'Undead'].map(tOption => 
                    <option key={tOption} value={tOption}>{tOption === 'Any' ? t.any : translateTerm(tOption, lang)}</option>
                )}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">{t.environment}</label>
              <select value={envFilter} onChange={(e) => setEnvFilter(e.target.value)} className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-lg p-3 outline-none focus:border-[#FF1457] transition-colors">
                {['Any', 'Arctic', 'Coastal', 'Desert', 'Forest', 'Grassland', 'Hill', 'Mountain', 'Swamp', 'Underdark', 'Underwater', 'Urban'].map(env => <option key={env} value={env}>{env === 'Any' ? t.any : env}</option>)}
              </select>
            </div>
          </div>
        )}

        <button onClick={() => handleGenerate(false)} className="w-full bg-gradient-to-r from-[#FF1457] to-[#613C4C] hover:opacity-90 text-white font-black py-4 rounded-2xl shadow-lg shadow-[#FF1457]/30 flex items-center justify-center gap-2 transform active:scale-95 transition-all">
          <Dices size={24} /> {t.generateBtn}
        </button>
      </div>
      
      {encounterError && (
        <div className="fixed inset-0 bg-[#2B2C30]/90 flex items-center justify-center p-4 z-50">
          <div className="bg-[#35313B] p-6 rounded-2xl border border-[#FF1457]/50 shadow-2xl max-w-sm w-full text-center">
            <Skull size={48} className="mx-auto text-[#FF1457] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t.error}</h3>
            <p className="text-gray-300 mb-6">{t[encounterError] || encounterError}</p>
            <div className="flex flex-col gap-3">
              {(encounterError === 'partyTooWeak' || encounterError === 'budgetTooLow') && (
                <button onClick={() => { setEncounterError(null); handleGenerate(true); }} className="w-full bg-[#FF1457] hover:bg-[#d10e46] text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2">
                  <Skull size={18} /> {t.forceGenerate}
                </button>
              )}
              <button onClick={() => setEncounterError(null)} className="w-full bg-[#453745] hover:bg-[#613C4C] text-white font-bold py-3 rounded-xl transition-colors">
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const renderItemDetails = (item, lang) => {
    return (
        <div className="bg-[#2B2C30] border border-[#453745] text-gray-200 p-4 rounded-xl shadow-inner text-sm font-sans space-y-3">
            <div className="border-b-2 border-[#453745] pb-2">
                <h4 className="font-bold text-lg text-[#FF1457]">{translateName(safeText(item.name), lang)}</h4>
                <p className="italic text-xs text-gray-400 capitalize">
                    {translateTerm(safeText(item.type) || safeText(item.equipment_category), lang)} 
                    {item.rarity && ` • ${translateTerm(safeText(item.rarity), lang)}`}
                    {item.requires_attunement && ` (Requires Attunement)`}
                </p>
            </div>
            
            {(item.cost || item.damage_dice || item.ac_string) && (
                <div className="text-xs space-y-1 font-bold bg-[#35313B] p-3 rounded-lg border border-[#453745]">
                    {item.cost && <p><span className="text-[#FF1457]">Cost:</span> {safeText(item.cost)}</p>}
                    {item.damage_dice && <p><span className="text-[#FF1457]">Damage:</span> {safeText(item.damage_dice)} {translateTerm(safeText(item.damage_type), lang)}</p>}
                    {item.weight && <p><span className="text-[#FF1457]">Weight:</span> {safeText(item.weight)}</p>}
                    {item.ac_string && <p><span className="text-[#FF1457]">Armor Class:</span> {safeText(item.ac_string)}</p>}
                    {item.properties && Array.isArray(item.properties) && <p><span className="text-[#FF1457]">Properties:</span> {item.properties.map(p => translateTerm(p, lang)).join(', ')}</p>}
                </div>
            )}
            
            <div className="whitespace-pre-wrap leading-relaxed text-gray-300">
                {safeText(item.desc)}
            </div>
        </div>
    );
};

const EncounterScreen = ({ onNavigate }) => {
  const { t, encounter, setEncounter, addToTracker, updateMonsterCount, lang } = useContext(AppContext);
  const [expanded, setExpanded] = useState({});

  if (!encounter || !encounter.monsters || encounter.monsters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center pt-24 animate-in fade-in">
        <Swords size={48} className="mb-4 opacity-50 text-[#FF1457]" />
        <p className="mb-6">{t.emptyEncounter}</p>
        <div className="flex gap-4 flex-col sm:flex-row">
            <button onClick={() => onNavigate('home')} className="bg-[#FF1457] hover:opacity-90 text-white px-6 py-3 rounded-full font-bold transition-colors">{t.generator}</button>
            <button onClick={() => onNavigate('bestiary')} className="bg-[#453745] hover:bg-[#613C4C] text-white px-6 py-3 rounded-full font-bold transition-colors">{t.bestiary}</button>
        </div>
      </div>
    );
  }

  const renderEncounterLoot = (loot) => {
      if (!loot) return <p className="text-white text-xs">-</p>;
      const coinsStr = Object.entries(loot.coins).map(([k,v]) => `${v} ${k}`).join(', ');
      const itemsCount = loot.items ? loot.items.length : 0;
      return (
          <div className="text-right flex flex-col items-end">
              <h2 className="text-[#FF1457] font-bold text-sm uppercase flex items-center gap-1"><Gem size={14}/> {t.loot}</h2>
              <p className="text-white text-xs font-bold mt-1 bg-[#2B2C30] px-2 py-1 rounded-md border border-[#453745]">{coinsStr || "0"}</p>
              {loot.gems && <p className="text-gray-400 text-[10px] mt-1 max-w-[150px] truncate">{loot.gems}</p>}
              {itemsCount > 0 && <p className="text-[#FF1457] text-[10px] font-bold bg-[#FF1457]/10 px-2 py-0.5 rounded-full mt-1 border border-[#FF1457]/30">+{itemsCount} {t.magicItems}</p>}
          </div>
      );
  };

  return (
    <div className="p-4 pb-8 max-w-lg mx-auto animate-in fade-in">
      <div className="bg-[#35313B] rounded-2xl p-4 mb-4 shadow-lg border border-[#453745] flex justify-between items-start">
        <div>
          <h2 className="text-white font-bold text-lg">{t.totalBudget}</h2>
          <p className="text-gray-400 text-sm">{encounter.totalXP} {t.xp}</p>
        </div>
        {renderEncounterLoot(encounter.loot)}
      </div>

      <div className="space-y-3 mb-6">
        {encounter.monsters.map((m, idx) => (
          <div key={idx} className="bg-[#35313B] rounded-xl overflow-hidden border border-[#453745] shadow-md transition-all">
            <div className={`p-4 flex flex-col gap-3 ${m.isBoss ? 'border-l-4 border-[#FF1457]' : ''}`}>
                <div className="flex items-center justify-between">
                    <div className="flex-1 cursor-pointer flex items-center gap-2" onClick={() => setExpanded({ ...expanded, [idx]: !expanded[idx] })}>
                        <h3 className="font-bold text-white leading-tight flex items-center gap-2">
                            {translateName(safeText(m.name), lang)} {m.isBoss && <Skull size={14} className="text-[#FF1457]"/>}
                        </h3>
                        {expanded[idx] ? <X size={16} className="text-gray-500"/> : <ArrowRight size={16} className="rotate-90 text-gray-500" />}
                    </div>
                    
                    <div className="flex items-center bg-[#2B2C30] rounded-lg p-1 border border-[#453745] ml-2">
                        <button onClick={(e) => { e.stopPropagation(); updateMonsterCount(m.slug, -1); }} className="p-2 text-gray-400 hover:text-[#FF1457] transition-colors"><Minus size={14}/></button>
                        <span className="w-6 text-center font-bold text-sm text-white">{m.count}</span>
                        <button onClick={(e) => { e.stopPropagation(); updateMonsterCount(m.slug, 1); }} className="p-2 text-gray-400 hover:text-[#FF1457] transition-colors"><Plus size={14}/></button>
                    </div>
                </div>
                <div className="text-xs text-gray-400">CR {safeText(m.challenge_rating)} • {m.xp} XP / un</div>
            </div>
            
            {expanded[idx] && (
              <div className="p-4 bg-[#2B2C30] border-t border-[#453745]">
                <StatBlock monster={m} lang={lang} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
          <button onClick={() => setEncounter(null)} className="bg-[#453745] hover:bg-[#613C4C] border border-[#613C4C] text-[#FF1457] font-bold p-4 rounded-xl shadow-lg transition-colors flex items-center justify-center">
            <Trash2 size={20} />
          </button>
          <button onClick={() => { addToTracker(); onNavigate('tracker'); }} className="flex-1 bg-[#FF1457] hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors">
            <Shield size={20} /> {t.addToTracker}
          </button>
      </div>
    </div>
  );
};

const TrackerScreen = () => {
    const { t, tracker, setTracker, currentTurn, setCurrentTurn, round, setRound, lang } = useContext(AppContext);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newName, setNewName] = useState("");
    const [newInit, setNewInit] = useState("");
    const [newHp, setNewHp] = useState("");
    const [showConditionMenu, setShowConditionMenu] = useState(null);
    const [hpInput, setHpInput] = useState({});

    const nextTurn = () => {
        if (tracker.length === 0) return;
        if (currentTurn >= tracker.length - 1) {
            setCurrentTurn(0);
            setRound(r => r + 1);
        } else {
            setCurrentTurn(c => c + 1);
        }
    };

    const updateHp = (idx, delta) => {
        const newTracker = [...tracker];
        newTracker[idx].hp = Math.max(0, newTracker[idx].hp + delta);
        setTracker(newTracker);
    };

    const updateInitiative = (id, newInit) => {
        const newTracker = tracker.map(e => e.id === id ? { ...e, initiative: newInit } : e);
        setTracker(newTracker);
    };

    const sortTracker = () => {
        const newTracker = [...tracker].map(e => ({...e, initiative: parseInt(e.initiative) || 0})).sort((a, b) => b.initiative - a.initiative);
        setTracker(newTracker);
        setCurrentTurn(0);
    };

    const toggleCondition = (entityId, conditionId) => {
        const newTracker = tracker.map(entity => {
            if (entity.id === entityId) {
                const has = entity.conditions?.includes(conditionId);
                const conds = entity.conditions || [];
                return { ...entity, conditions: has ? conds.filter(c => c !== conditionId) : [...conds, conditionId] };
            }
            return entity;
        });
        setTracker(newTracker);
        setShowConditionMenu(null);
    };

    const addPlayer = (e) => {
        e.preventDefault();
        const newEntity = {
            id: `custom-${Date.now()}`,
            name: newName || "Player",
            originalName: newName || "Player",
            initiative: parseInt(newInit) || 0,
            hp: parseInt(newHp) || 10,
            maxHp: parseInt(newHp) || 10,
            ac: 10,
            isPlayer: true,
            conditions: []
        };
        const newTracker = [...tracker, newEntity].sort((a, b) => b.initiative - a.initiative);
        setTracker(newTracker);
        setShowAddForm(false);
        setNewName(""); setNewInit(""); setNewHp("");
        if (currentTurn === -1) setCurrentTurn(0);
    };

    const removeEntity = (id) => {
        const newTracker = tracker.filter(e => e.id !== id);
        setTracker(newTracker);
        if (currentTurn >= newTracker.length) setCurrentTurn(0);
    };

    const handleHpChange = (id, value) => {
        setHpInput({ ...hpInput, [id]: value });
    };

    const applyHpChange = (idx, id) => {
        const delta = parseInt(hpInput[id]);
        if (!isNaN(delta)) {
            updateHp(idx, delta);
        }
        setHpInput({ ...hpInput, [id]: '' });
    };

    return (
        <div className="p-4 pb-8 max-w-lg mx-auto animate-in fade-in">
            <div className="flex gap-2 mb-4">
                <button onClick={nextTurn} className="flex-1 bg-[#FF1457] hover:opacity-90 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors active:scale-95">
                    <Play size={18} fill="currentColor" /> {t.nextTurn}
                </button>
                <div className="bg-[#35313B] px-4 rounded-xl flex items-center justify-center font-bold text-gray-300 border border-[#453745] shadow-inner gap-2 text-sm">
                    <span>{t.round} {round}</span>
                    <span className="text-gray-500">|</span>
                    <span>{t.turn} {currentTurn >= 0 ? currentTurn + 1 : 0}</span>
                </div>
            </div>

            <div className="space-y-2 mb-6">
                {tracker.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 italic">Nenhum combatente na iniciativa.</div>
                ) : (
                    tracker.map((entity, idx) => {
                        const isTurn = currentTurn === idx;
                        const isDead = entity.hp === 0;
                        const isMenuOpen = showConditionMenu === entity.id;
                        return (
                            <div key={entity.id} className={`relative p-3 rounded-xl border transition-all duration-300 ${isMenuOpen ? 'z-50' : 'z-10'} ${isTurn ? 'bg-[#453745] border-[#FF1457] scale-[1.02] shadow-lg shadow-[#FF1457]/20' : 'bg-[#35313B] border-[#453745]'} ${isDead ? 'opacity-50 grayscale' : ''}`}>
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex items-start gap-3 flex-1">
                                        <input
                                            type="number"
                                            value={entity.initiative}
                                            onChange={(e) => updateInitiative(entity.id, e.target.value === '' ? '' : parseInt(e.target.value))}
                                            onBlur={sortTracker}
                                            className={`w-12 h-12 flex-shrink-0 text-center rounded-lg flex items-center justify-center font-black text-lg outline-none focus:ring-2 focus:ring-[#FF1457] transition-colors shadow-inner ${entity.isPlayer ? 'bg-blue-600/80 text-white' : 'bg-[#613C4C] text-white border border-[#FF1457]/30'}`}
                                        />
                                        <div className="flex-1 mt-0.5">
                                            <h4 className={`font-bold text-lg leading-tight ${entity.isPlayer ? 'text-blue-400' : 'text-white'} ${isDead ? 'line-through' : ''}`}>{safeText(entity.name)}</h4>
                                            
                                            <div className="flex flex-wrap gap-1.5 mt-2 relative">
                                                {entity.conditions && entity.conditions.length > 0 && entity.conditions.map(cId => {
                                                    const conf = CONDITIONS.find(c => c.id === cId);
                                                    return conf ? (
                                                        <button key={cId} onClick={() => toggleCondition(entity.id, cId)} className={`text-[10px] font-semibold px-2.5 py-1.5 rounded flex items-center gap-1 text-white shadow-sm transition-transform active:scale-95 ${conf.color}`}>
                                                            {conf.label.split('/')[lang === 'pt' ? 1 : 0] || conf.label.split('/')[0]} <X size={12} />
                                                        </button>
                                                    ) : null;
                                                })}
                                                <button onClick={() => setShowConditionMenu(showConditionMenu === entity.id ? null : entity.id)} className="text-[10px] font-bold px-3 py-1.5 rounded bg-[#453745] hover:bg-[#613C4C] text-gray-300 flex items-center gap-1 transition-colors border border-[#613C4C] shadow-sm">
                                                    <Plus size={12}/> Status
                                                </button>
                                                
                                                {showConditionMenu === entity.id && (
                                                    <div className="absolute top-full left-0 mt-2 w-48 bg-[#2B2C30] border border-[#453745] rounded-lg shadow-2xl z-[100] p-2 grid grid-cols-1 gap-1 max-h-60 overflow-y-auto">
                                                        {CONDITIONS.map(c => {
                                                            const has = entity.conditions?.includes(c.id);
                                                            return (
                                                                <button key={c.id} onClick={() => toggleCondition(entity.id, c.id)} className={`text-left text-xs p-2 rounded transition-colors font-semibold ${has ? 'bg-[#FF1457]/20 text-[#FF1457]' : 'hover:bg-[#453745] text-gray-300'}`}>
                                                                    {has ? '✓ ' : ''}{c.label.split('/')[lang === 'pt' ? 1 : 0] || c.label.split('/')[0]}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => removeEntity(entity.id)} className="text-gray-500 hover:text-[#FF1457] p-2 transition-colors bg-[#2B2C30] rounded-lg border border-[#453745]"><X size={16}/></button>
                                </div>
                                <div className="mt-3 flex items-center justify-between border-t border-[#453745] pt-3">
                                    <div className="text-sm font-bold text-gray-300 bg-[#2B2C30] px-3 py-1.5 rounded-lg border border-[#453745] flex items-center gap-2">
                                        <Heart size={14} className="text-[#FF1457]" fill="currentColor" /> {entity.hp} <span className="text-gray-500">/ {entity.maxHp}</span>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <input 
                                            type="number"
                                            placeholder="-10 ou 5"
                                            value={hpInput[entity.id] || ''}
                                            onChange={(e) => handleHpChange(entity.id, e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') applyHpChange(idx, entity.id) }}
                                            className="w-24 bg-[#2B2C30] border border-[#453745] rounded-lg p-2 text-sm text-center text-white outline-none focus:border-[#FF1457] transition-colors placeholder-gray-600 shadow-inner"
                                        />
                                        <button onClick={() => applyHpChange(idx, entity.id)} className="w-10 h-10 bg-[#FF1457] hover:opacity-90 text-white rounded-lg flex items-center justify-center font-bold shadow transition-colors active:scale-95">
                                            <Check size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {!showAddForm ? (
                <button onClick={() => setShowAddForm(true)} className="w-full bg-[#35313B] hover:bg-[#453745] border border-[#453745] text-gray-300 font-bold py-3 rounded-xl flex items-center justify-center gap-2 mb-4 transition-colors">
                    <UserPlus size={18} /> {t.addPlayer}
                </button>
            ) : (
                <form onSubmit={addPlayer} className="bg-[#35313B] p-4 rounded-xl border border-[#FF1457]/50 mb-4 shadow-lg animate-in fade-in zoom-in-95">
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2"><UserPlus size={16} className="text-[#FF1457]"/> {t.addPlayer}</h4>
                    <div className="flex gap-2 mb-3">
                        <input type="text" placeholder={t.name} value={newName} onChange={e => setNewName(e.target.value)} required className="flex-1 bg-[#2B2C30] border border-[#453745] text-white rounded-lg p-2 outline-none focus:border-[#FF1457] text-sm" />
                        <input type="number" placeholder="Init" value={newInit} onChange={e => setNewInit(e.target.value)} required className="w-16 bg-[#2B2C30] border border-[#453745] text-white rounded-lg p-2 outline-none focus:border-[#FF1457] text-sm text-center" />
                        <input type="number" placeholder="HP" value={newHp} onChange={e => setNewHp(e.target.value)} required className="w-20 bg-[#2B2C30] border border-[#453745] text-white rounded-lg p-2 outline-none focus:border-[#FF1457] text-sm text-center" />
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-white py-2 rounded-lg font-bold text-sm">{t.cancel}</button>
                        <button type="submit" className="flex-1 bg-[#FF1457] hover:opacity-90 text-white py-2 rounded-lg font-bold text-sm">{t.add}</button>
                    </div>
                </form>
            )}

            <button onClick={() => { setTracker([]); setCurrentTurn(-1); setRound(1); }} className="w-full text-[#FF1457] hover:text-white font-semibold py-3 text-sm flex items-center justify-center gap-2 mt-4 transition-colors">
                <Trash2 size={16} /> {t.clearTracker}
            </button>
        </div>
    );
};

const BestiaryScreen = () => {
    const { t, monsters, lang, addMonsterToEncounter, addDirectlyToTracker } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("Any");
    const [expanded, setExpanded] = useState({});

    const types = ['Any', 'Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon', 'Elemental', 'Fey', 'Fiend', 'Giant', 'Humanoid', 'Monstrosity', 'Ooze', 'Plant', 'Undead'];

    const filteredMonsters = monsters.filter(m => {
        const matchesSearch = safeText(m.name).toLowerCase().includes(searchTerm.toLowerCase());
        let matchesType = true;
        if (typeFilter !== 'Any') {
            const mType = typeof m.type === 'object' ? String(m.type.name || m.type.desc || m.type) : String(m.type || '');
            matchesType = mType.toLowerCase().includes(typeFilter.toLowerCase());
        }
        return matchesSearch && matchesType;
    });

    return (
        <div className="p-4 pb-8 max-w-lg mx-auto animate-in fade-in">
            <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder={t.searchMonsters}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-[#35313B] text-white p-3 pl-10 rounded-xl border border-[#453745] outline-none focus:border-[#FF1457] transition-colors shadow-inner"
                    />
                </div>
                <select 
                    value={typeFilter} 
                    onChange={e => setTypeFilter(e.target.value)}
                    className="bg-[#35313B] border border-[#453745] text-gray-300 rounded-xl px-3 outline-none focus:border-[#FF1457] font-bold text-xs"
                >
                    {types.map(tOption => <option key={tOption} value={tOption}>{tOption === 'Any' ? t.any : translateTerm(tOption, lang)}</option>)}
                </select>
            </div>
            
            <p className="text-xs text-gray-500 mb-4 text-right font-semibold uppercase">{filteredMonsters.length} {t.bestiary} Results</p>

            <div className="space-y-3">
                {filteredMonsters.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 italic bg-[#35313B] rounded-xl border border-[#453745] border-dashed">
                        {t.noMonsters}
                    </div>
                ) : (
                    filteredMonsters.map((m) => (
                        <div key={m.slug} className="bg-[#35313B] rounded-xl overflow-hidden border border-[#453745] shadow-md">
                            <div 
                                className="p-4 flex justify-between items-center cursor-pointer hover:bg-[#453745] transition-colors"
                                onClick={() => setExpanded({ ...expanded, [m.slug]: !expanded[m.slug] })}
                            >
                                <div>
                                    <h4 className="font-bold text-white leading-tight">{translateName(safeText(m.name), lang)}</h4>
                                    <p className="text-xs text-gray-400 capitalize">CR {safeText(m.challenge_rating)} • {translateTerm(safeText(m.type), lang)}</p>
                                </div>
                                <span className="text-gray-500">
                                    {expanded[m.slug] ? <X size={20} /> : <ArrowRight size={20} className="rotate-90" />}
                                </span>
                            </div>
                            
                            {expanded[m.slug] && (
                                <div className="p-4 bg-[#2B2C30] border-t border-[#453745] animate-in fade-in slide-in-from-top-2">
                                    <div className="flex gap-2 mb-4">
                                        <button 
                                            onClick={() => { addMonsterToEncounter(m); }}
                                            className="flex-1 bg-[#FF1457] hover:opacity-90 text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-colors shadow-md active:scale-95"
                                        >
                                            <Swords size={14}/> {t.addToEncounter}
                                        </button>
                                        <button 
                                            onClick={() => { addDirectlyToTracker(m); }}
                                            className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-colors shadow-md active:scale-95 border border-[#613C4C]"
                                        >
                                            <Shield size={14}/> {t.addDirectTracker}
                                        </button>
                                    </div>
                                    <StatBlock monster={m} lang={lang} />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const ItemsScreen = () => {
    const { t, items, lang, itemsTab, setItemsTab } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("Any");
    const [expanded, setExpanded] = useState({});

    const [lootTier, setLootTier] = useState(1);
    const [lootType, setLootType] = useState('hoard');
    const [generatedLoot, setGeneratedLoot] = useState(null);

    const itemCategories = [
        { id: 'Any', label: t.any },
        { id: 'Weapon', label: lang === 'pt' ? 'Armas' : 'Weapons' },
        { id: 'Armor', label: lang === 'pt' ? 'Armaduras' : 'Armor' },
        { id: 'Potion', label: lang === 'pt' ? 'Poções' : 'Potions' },
        { id: 'Ring', label: lang === 'pt' ? 'Anéis' : 'Rings' },
        { id: 'Scroll', label: lang === 'pt' ? 'Pergaminhos' : 'Scrolls' },
        { id: 'WandStaffRod', label: lang === 'pt' ? 'Varinhas/Cajados' : 'Wands & Staffs' },
        { id: 'Wondrous', label: lang === 'pt' ? 'Itens Maravilhosos' : 'Wondrous Items' },
    ];

    const filteredItems = items.filter(i => {
        const matchesSearch = safeText(i.name).toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesType = true;
        if (typeFilter !== 'Any') {
            const typeStr = (safeText(i.type) || safeText(i.equipment_category) || safeText(i.open5e_category) || '').toLowerCase();
            switch(typeFilter) {
                case 'Weapon': matchesType = typeStr.includes('weapon') || typeStr.includes('arma'); break;
                case 'Armor': matchesType = typeStr.includes('armor') || typeStr.includes('armadura'); break;
                case 'Potion': matchesType = typeStr.includes('potion') || typeStr.includes('poção'); break;
                case 'Ring': matchesType = typeStr.includes('ring') || typeStr.includes('anel'); break;
                case 'Scroll': matchesType = typeStr.includes('scroll') || typeStr.includes('pergaminho'); break;
                case 'WandStaffRod': matchesType = typeStr.includes('wand') || typeStr.includes('staff') || typeStr.includes('rod') || typeStr.includes('cajado'); break;
                case 'Wondrous': matchesType = typeStr.includes('wondrous') || typeStr.includes('maravilhoso'); break;
                default: matchesType = true;
            }
        }
        return matchesSearch && matchesType;
    });

    const handleGenerateLoot = () => {
        setGeneratedLoot(generateAdvancedLoot(lootTier, lootType, items, lang));
    };

    return (
        <div className="p-4 pb-8 max-w-lg mx-auto animate-in fade-in">
            <div className="flex bg-[#35313B] p-1 rounded-xl mb-4 border border-[#453745] shadow-inner">
                <button onClick={() => setItemsTab('compendium')} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1 ${itemsTab === 'compendium' ? 'bg-[#FF1457] text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                    <Book size={14}/> {t.compendiumTitle}
                </button>
                <button onClick={() => setItemsTab('loot')} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1 ${itemsTab === 'loot' ? 'bg-[#FF1457] text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                    <Gem size={14}/> {t.lootGenTitle}
                </button>
            </div>

            {itemsTab === 'compendium' && (
                <div className="animate-in fade-in slide-in-from-left-4">
                    <div className="flex gap-2 mb-4">
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input 
                                type="text" 
                                placeholder={t.searchItems}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-[#35313B] text-white p-3 pl-10 rounded-xl border border-[#453745] outline-none focus:border-[#FF1457] transition-colors shadow-inner"
                            />
                        </div>
                        <select 
                            value={typeFilter} 
                            onChange={e => setTypeFilter(e.target.value)}
                            className="bg-[#35313B] border border-[#453745] text-gray-300 rounded-xl px-2 outline-none focus:border-[#FF1457] font-bold text-[10px]"
                        >
                            {itemCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                        </select>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-4 text-right font-semibold uppercase">{filteredItems.length} {t.items} Results</p>

                    <div className="space-y-3">
                        {filteredItems.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 italic bg-[#35313B] rounded-xl border border-[#453745] border-dashed">
                                {t.noItems}
                            </div>
                        ) : (
                            filteredItems.map((item) => (
                                <div key={item.slug} className="bg-[#35313B] rounded-xl overflow-hidden border border-[#453745] shadow-md">
                                    <div 
                                        className="p-4 flex justify-between items-center cursor-pointer hover:bg-[#453745] transition-colors"
                                        onClick={() => setExpanded({ ...expanded, [item.slug]: !expanded[item.slug] })}
                                    >
                                        <div>
                                            <h4 className="font-bold text-white leading-tight">{translateName(safeText(item.name), lang)}</h4>
                                            <p className="text-xs text-gray-400 capitalize">
                                                {translateTerm(safeText(item.rarity) || safeText(item.equipment_category) || safeText(item.type), lang)}
                                            </p>
                                        </div>
                                        <span className="text-gray-500">
                                            {expanded[item.slug] ? <X size={20} /> : <ArrowRight size={20} className="rotate-90" />}
                                        </span>
                                    </div>
                                    
                                    {expanded[item.slug] && (
                                        <div className="p-4 bg-[#2B2C30] border-t border-[#453745] animate-in fade-in slide-in-from-top-2">
                                            {renderItemDetails(item, lang)}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {itemsTab === 'loot' && (
                <div className="animate-in fade-in slide-in-from-right-4 space-y-4">
                    <div className="bg-[#35313B] p-5 rounded-2xl shadow-xl border border-[#453745]">
                        <div className="mb-4">
                            <label className="text-xs text-gray-400 font-semibold mb-2 block uppercase tracking-wider">{t.lootTier}</label>
                            <select value={lootTier} onChange={(e) => setLootTier(parseInt(e.target.value))} className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-lg p-3 outline-none focus:border-[#FF1457] transition-colors font-bold text-sm">
                                <option value={1}>{t.tier1}</option>
                                <option value={2}>{t.tier2}</option>
                                <option value={3}>{t.tier3}</option>
                                <option value={4}>{t.tier4}</option>
                            </select>
                        </div>
                        
                        <div className="mb-6">
                            <label className="text-xs text-gray-400 font-semibold mb-2 block uppercase tracking-wider">{t.lootType}</label>
                            <div className="flex gap-2 bg-[#2B2C30] p-1 rounded-xl border border-[#453745]">
                                <button onClick={() => setLootType('individual')} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${lootType === 'individual' ? 'bg-[#FF1457] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-[#35313B]'}`}>
                                    {t.individualLoot}
                                </button>
                                <button onClick={() => setLootType('hoard')} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${lootType === 'hoard' ? 'bg-[#FF1457] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-[#35313B]'}`}>
                                    {t.hoardLoot}
                                </button>
                            </div>
                        </div>

                        {items.length === 0 && (
                            <p className="text-[#FF1457] text-xs font-bold mb-4 bg-[#FF1457]/10 p-2 rounded-lg border border-[#FF1457]/30">
                                {t.noItemsCache}
                            </p>
                        )}

                        <button onClick={handleGenerateLoot} className="w-full bg-gradient-to-r from-[#FF1457] to-[#613C4C] hover:opacity-90 text-white font-black py-4 rounded-2xl shadow-lg shadow-[#FF1457]/30 flex items-center justify-center gap-2 transform active:scale-95 transition-all">
                            <Gem size={20} /> {t.generateLootBtn}
                        </button>
                    </div>

                    {generatedLoot && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 mt-6">
                            <h3 className="font-bold text-gray-400 uppercase text-xs tracking-wider flex items-center gap-2 border-b border-[#453745] pb-2">
                                <Sparkles size={14} className="text-[#FF1457]"/> Recompensa Gerada
                            </h3>

                            {Object.keys(generatedLoot.coins).length > 0 && (
                                <div className="bg-[#35313B] p-4 rounded-xl border border-[#453745] shadow-md flex items-center gap-4">
                                    <div className="bg-[#453745] p-3 rounded-full text-[#FF1457] border border-[#613C4C]"><Coins size={24}/></div>
                                    <div>
                                        <h4 className="text-xs text-gray-400 font-bold uppercase">{t.coins}</h4>
                                        <p className="text-white font-bold">
                                            {Object.entries(generatedLoot.coins).map(([k,v]) => `${v} ${k}`).join(' • ')}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {generatedLoot.gems && (
                                <div className="bg-[#35313B] p-4 rounded-xl border border-[#453745] shadow-md flex items-center gap-4">
                                    <div className="bg-[#453745] p-3 rounded-full text-[#FF1457] border border-[#613C4C]"><Gem size={24}/></div>
                                    <div>
                                        <h4 className="text-xs text-gray-400 font-bold uppercase">{t.gemsAndArt}</h4>
                                        <p className="text-white font-bold">{generatedLoot.gems}</p>
                                    </div>
                                </div>
                            )}

                            {generatedLoot.items && generatedLoot.items.length > 0 && (
                                <div>
                                    <h4 className="text-xs text-[#FF1457] font-bold uppercase mb-2 ml-1 flex items-center gap-1"><Package size={14}/> {t.magicItems}</h4>
                                    <div className="space-y-3">
                                        {generatedLoot.items.map((item, idx) => (
                                            <div key={`${item.slug}-${idx}`}>
                                                {renderItemDetails(item, lang)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const REFERENCE_DATA = {
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

const DMScreenTab = () => {
    const { lang, t } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState("");

    const data = REFERENCE_DATA[lang] || REFERENCE_DATA['en'];
    const filteredRules = data.map(category => {
        const filteredItems = category.items.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.desc.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return { ...category, items: filteredItems };
    }).filter(category => category.items.length > 0);

    return (
        <div className="p-4 pb-8 max-w-lg mx-auto animate-in fade-in">
            <div className="relative mb-6">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input 
                    type="text" 
                    placeholder={t.searchRules}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-[#35313B] text-white p-4 pl-10 rounded-2xl border border-[#453745] outline-none focus:border-[#FF1457] transition-colors shadow-inner"
                />
            </div>

            <div className="space-y-4">
                {filteredRules.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 italic bg-[#35313B] rounded-xl border border-[#453745] border-dashed">
                        Nenhuma regra encontrada.
                    </div>
                ) : (
                    filteredRules.map((category, idx) => (
                        <div key={idx} className="bg-[#35313B] rounded-2xl p-5 border border-[#453745] shadow-sm">
                            <h3 className="font-bold text-[#FF1457] border-b border-[#453745] pb-2 mb-3 uppercase text-xs tracking-widest flex items-center gap-2">
                                <BookOpen size={14}/> {category.title}
                            </h3>
                            <div className="space-y-3">
                                {category.items.map((item, i) => (
                                    <div key={i} className="bg-[#2B2C30] p-3 rounded-xl border border-[#453745]">
                                        <h4 className="font-bold text-white text-sm mb-1">{item.name}</h4>
                                        <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};


const CampaignsScreen = () => {
    const { t, lang, campaigns, setCampaigns, showToast } = useContext(AppContext);
    const [selectedCampaignId, setSelectedCampaignId] = useState(null);
    const [showNewCampaignForm, setShowNewCampaignForm] = useState(false);
    const [campaignName, setCampaignName] = useState("");
    const [campaignDesc, setCampaignDesc] = useState("");

    const [showNoteForm, setShowNoteForm] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const [searchNoteTerm, setSearchNoteTerm] = useState("");
    const [expandedNote, setExpandedNote] = useState({});
    const [confirmDelete, setConfirmDelete] = useState(null);

    const activeCampaign = campaigns.find(c => c.id === selectedCampaignId);

    const handleCreateCampaign = (e) => {
        e.preventDefault();
        if (!campaignName.trim()) return;
        const newCamp = {
            id: `camp-${Date.now()}`,
            name: campaignName.trim(),
            description: campaignDesc.trim(),
            createdAt: new Date().toISOString(),
            notes: []
        };
        setCampaigns(prev => [newCamp, ...prev]);
        setCampaignName("");
        setCampaignDesc("");
        setShowNewCampaignForm(false);
        showToast(t.campaignCreated);
    };

    const handleDeleteCampaign = (id) => {
        setCampaigns(prev => prev.filter(c => c.id !== id));
        if (selectedCampaignId === id) setSelectedCampaignId(null);
        setConfirmDelete(null);
    };

    const handleSaveNote = (e) => {
        e.preventDefault();
        if (!noteTitle.trim() && !noteContent.trim()) return;
        const finalTitle = noteTitle.trim() || (lang === 'pt' ? 'Nota sem título' : 'Untitled Note');

        setCampaigns(prev => prev.map(c => {
            if (c.id !== selectedCampaignId) return c;
            let updatedNotes = [...(c.notes || [])];
            if (editingNoteId) {
                updatedNotes = updatedNotes.map(n => n.id === editingNoteId ? {
                    ...n,
                    title: finalTitle,
                    content: noteContent,
                    updatedAt: new Date().toISOString()
                } : n);
            } else {
                const newNote = {
                    id: `note-${Date.now()}`,
                    title: finalTitle,
                    content: noteContent,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                updatedNotes = [newNote, ...updatedNotes];
            }
            return { ...c, notes: updatedNotes };
        }));

        setNoteTitle("");
        setNoteContent("");
        setEditingNoteId(null);
        setShowNoteForm(false);
        showToast(t.noteSaved);
    };

    const openEditNote = (note) => {
        setEditingNoteId(note.id);
        setNoteTitle(note.title);
        setNoteContent(note.content);
        setShowNoteForm(true);
    };

    const handleDeleteNote = (noteId) => {
        setCampaigns(prev => prev.map(c => {
            if (c.id !== selectedCampaignId) return c;
            return { ...c, notes: (c.notes || []).filter(n => n.id !== noteId) };
        }));
        setConfirmDelete(null);
    };

    const formatDate = (isoStr) => {
        if (!isoStr) return "";
        try {
            return new Date(isoStr).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', {
                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
            });
        } catch {
            return "";
        }
    };

    if (activeCampaign) {
        const notesList = (activeCampaign.notes || []).filter(n =>
            n.title.toLowerCase().includes(searchNoteTerm.toLowerCase()) ||
            n.content.toLowerCase().includes(searchNoteTerm.toLowerCase())
        );

        return (
            <div className="p-4 pb-8 max-w-lg mx-auto animate-in fade-in">
                <button
                    onClick={() => { setSelectedCampaignId(null); setShowNoteForm(false); setEditingNoteId(null); setSearchNoteTerm(""); }}
                    className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#FF1457] mb-4 transition-colors uppercase tracking-wider"
                >
                    <ArrowLeft size={16} /> {t.backToCampaigns}
                </button>

                <div className="bg-[#35313B] rounded-2xl p-5 mb-4 shadow-lg border border-[#453745]">
                    <div className="flex justify-between items-start gap-2">
                        <div>
                            <h2 className="text-xl font-black text-white flex items-center gap-2">
                                <ScrollText size={20} className="text-[#FF1457] flex-shrink-0" />
                                {activeCampaign.name}
                            </h2>
                            {activeCampaign.description && (
                                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{activeCampaign.description}</p>
                            )}
                        </div>
                        <span className="text-[10px] font-bold bg-[#2B2C30] text-[#FF1457] px-2.5 py-1 rounded-full border border-[#453745] whitespace-nowrap">
                            {(activeCampaign.notes || []).length} {t.notes}
                        </span>
                    </div>
                </div>

                {!showNoteForm ? (
                    <button
                        onClick={() => { setEditingNoteId(null); setNoteTitle(""); setNoteContent(""); setShowNoteForm(true); }}
                        className="w-full bg-gradient-to-r from-[#FF1457] to-[#613C4C] hover:opacity-90 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-[#FF1457]/30 flex items-center justify-center gap-2 mb-4 transform active:scale-95 transition-all text-sm"
                    >
                        <Plus size={18} /> {t.newNote}
                    </button>
                ) : (
                    <form onSubmit={handleSaveNote} className="bg-[#35313B] p-4 rounded-2xl border border-[#FF1457]/50 mb-4 shadow-xl animate-in fade-in zoom-in-95 space-y-3">
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <FileText size={16} className="text-[#FF1457]" /> {editingNoteId ? t.editNote : t.newNote}
                        </h4>
                        <input
                            type="text"
                            placeholder={t.noteTitle}
                            value={noteTitle}
                            onChange={e => setNoteTitle(e.target.value)}
                            required
                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-3 outline-none focus:border-[#FF1457] text-sm font-bold"
                        />
                        <textarea
                            rows={6}
                            placeholder={t.noteContent}
                            value={noteContent}
                            onChange={e => setNoteContent(e.target.value)}
                            className="w-full bg-[#2B2C30] border border-[#453745] text-gray-200 rounded-xl p-3 outline-none focus:border-[#FF1457] text-sm leading-relaxed resize-y"
                        />
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => { setShowNoteForm(false); setEditingNoteId(null); }}
                                className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-white py-2.5 rounded-xl font-bold text-sm transition-colors"
                            >
                                {t.cancel}
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-[#FF1457] hover:opacity-90 text-white py-2.5 rounded-xl font-bold text-sm transition-colors shadow-md"
                            >
                                {t.save}
                            </button>
                        </div>
                    </form>
                )}

                {(activeCampaign.notes || []).length > 0 && (
                    <div className="relative mb-4">
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder={t.searchNotes}
                            value={searchNoteTerm}
                            onChange={e => setSearchNoteTerm(e.target.value)}
                            className="w-full bg-[#35313B] text-white p-3 pl-10 rounded-xl border border-[#453745] outline-none focus:border-[#FF1457] transition-colors shadow-inner text-sm"
                        />
                    </div>
                )}

                <div className="space-y-3">
                    {notesList.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 italic bg-[#35313B] rounded-2xl border border-[#453745] border-dashed p-6">
                            <FileText size={36} className="mx-auto mb-2 opacity-40 text-[#FF1457]" />
                            {t.noNotes}
                        </div>
                    ) : (
                        notesList.map(note => {
                            const isExp = expandedNote[note.id] !== undefined ? expandedNote[note.id] : true;
                            return (
                                <div key={note.id} className="bg-[#35313B] rounded-2xl border border-[#453745] overflow-hidden shadow-md">
                                    <div
                                        onClick={() => setExpandedNote(prev => ({ ...prev, [note.id]: !isExp }))}
                                        className="p-4 flex justify-between items-start gap-2 cursor-pointer hover:bg-[#453745]/50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white text-base leading-snug">{note.title}</h4>
                                            <p className="text-[10px] text-gray-500 mt-0.5">{formatDate(note.updatedAt)}</p>
                                        </div>
                                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                            <button
                                                onClick={() => openEditNote(note)}
                                                className="p-2 text-gray-400 hover:text-white bg-[#2B2C30] rounded-lg border border-[#453745] transition-colors"
                                            >
                                                <Edit3 size={14} />
                                            </button>
                                            <button
                                                onClick={() => setConfirmDelete({ type: 'note', id: note.id })}
                                                className="p-2 text-gray-400 hover:text-[#FF1457] bg-[#2B2C30] rounded-lg border border-[#453745] transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    {isExp && note.content && (
                                        <div className="px-4 pb-4 pt-2 border-t border-[#453745]/60 bg-[#2B2C30]/60 text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                                            {note.content}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {confirmDelete && (
                    <div className="fixed inset-0 bg-[#2B2C30]/90 flex items-center justify-center p-4 z-50">
                        <div className="bg-[#35313B] p-6 rounded-2xl border border-[#FF1457]/50 shadow-2xl max-w-sm w-full text-center">
                            <Trash2 size={40} className="mx-auto text-[#FF1457] mb-3" />
                            <p className="text-white font-bold mb-6">{t.deleteNoteConfirm}</p>
                            <div className="flex gap-3">
                                <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-white font-bold py-2.5 rounded-xl">
                                    {t.cancel}
                                </button>
                                <button onClick={() => handleDeleteNote(confirmDelete.id)} className="flex-1 bg-[#FF1457] hover:bg-[#d10e46] text-white font-bold py-2.5 rounded-xl">
                                    <Trash2 size={16} className="inline mr-1" /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="p-4 pb-8 max-w-lg mx-auto animate-in fade-in">
            {!showNewCampaignForm ? (
                <button
                    onClick={() => setShowNewCampaignForm(true)}
                    className="w-full bg-gradient-to-r from-[#FF1457] to-[#613C4C] hover:opacity-90 text-white font-black py-4 rounded-2xl shadow-lg shadow-[#FF1457]/30 flex items-center justify-center gap-2 mb-6 transform active:scale-95 transition-all"
                >
                    <Plus size={22} /> {t.newCampaign}
                </button>
            ) : (
                <form onSubmit={handleCreateCampaign} className="bg-[#35313B] p-5 rounded-2xl border border-[#FF1457]/50 mb-6 shadow-xl animate-in fade-in zoom-in-95 space-y-3">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <ScrollText size={18} className="text-[#FF1457]" /> {t.newCampaign}
                    </h3>
                    <input
                        type="text"
                        placeholder={t.campaignName}
                        value={campaignName}
                        onChange={e => setCampaignName(e.target.value)}
                        required
                        className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-3 outline-none focus:border-[#FF1457] text-sm font-bold"
                    />
                    <textarea
                        rows={3}
                        placeholder={t.campaignDesc}
                        value={campaignDesc}
                        onChange={e => setCampaignDesc(e.target.value)}
                        className="w-full bg-[#2B2C30] border border-[#453745] text-gray-200 rounded-xl p-3 outline-none focus:border-[#FF1457] text-sm resize-none"
                    />
                    <div className="flex gap-2 pt-1">
                        <button
                            type="button"
                            onClick={() => setShowNewCampaignForm(false)}
                            className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-white py-2.5 rounded-xl font-bold text-sm transition-colors"
                        >
                            {t.cancel}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-[#FF1457] hover:opacity-90 text-white py-2.5 rounded-xl font-bold text-sm transition-colors shadow-md"
                        >
                            {t.save}
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-3">
                {campaigns.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 italic bg-[#35313B] rounded-2xl border border-[#453745] border-dashed p-6">
                        <ScrollText size={48} className="mx-auto mb-3 opacity-40 text-[#FF1457]" />
                        <p>{t.noCampaigns}</p>
                    </div>
                ) : (
                    campaigns.map(camp => (
                        <div
                            key={camp.id}
                            onClick={() => setSelectedCampaignId(camp.id)}
                            className="bg-[#35313B] hover:bg-[#453745]/60 rounded-2xl p-4 border border-[#453745] shadow-md transition-all cursor-pointer flex justify-between items-center gap-3"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <ScrollText size={18} className="text-[#FF1457] flex-shrink-0" />
                                    <h3 className="font-bold text-white text-base truncate">{camp.name}</h3>
                                </div>
                                {camp.description && (
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{camp.description}</p>
                                )}
                                <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500 font-semibold">
                                    <span className="text-[#FF1457] bg-[#2B2C30] px-2 py-0.5 rounded-md border border-[#453745]">
                                        {(camp.notes || []).length} {t.notes}
                                    </span>
                                    <span>{formatDate(camp.createdAt)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                <button
                                    onClick={() => setConfirmDelete({ type: 'campaign', id: camp.id })}
                                    className="p-2.5 text-gray-400 hover:text-[#FF1457] bg-[#2B2C30] rounded-xl border border-[#453745] transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <ArrowRight size={18} className="text-gray-500" onClick={() => setSelectedCampaignId(camp.id)} />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {confirmDelete && confirmDelete.type === 'campaign' && (
                <div className="fixed inset-0 bg-[#2B2C30]/90 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#35313B] p-6 rounded-2xl border border-[#FF1457]/50 shadow-2xl max-w-sm w-full text-center">
                        <Trash2 size={40} className="mx-auto text-[#FF1457] mb-3" />
                        <p className="text-white font-bold mb-6">{t.deleteCampaignConfirm}</p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-white font-bold py-2.5 rounded-xl">
                                {t.cancel}
                            </button>
                            <button onClick={() => handleDeleteCampaign(confirmDelete.id)} className="flex-1 bg-[#FF1457] hover:bg-[#d10e46] text-white font-bold py-2.5 rounded-xl">
                                <Trash2 size={16} className="inline mr-1" /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const MenuScreen = () => {
    const { lang, setLang, t, monsters, items, isSyncing, syncData, debugLogs } = useContext(AppContext);
    
    return (
      <div className="p-4 pb-8 max-w-lg mx-auto space-y-4 animate-in fade-in">
        
        <div className="text-center mb-6">
            <h2 className="text-white font-bold text-lg mb-1">Bem-vindo(a) ao seu Bolso!</h2>
            <p className="text-gray-400 text-xs">Abra o menu lateral (≡) no canto superior esquerdo para navegar.</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
            <div className="bg-gradient-to-br from-[#613C4C] to-[#453745] p-4 rounded-2xl border border-[#FF1457]/30 shadow-lg flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-white">{monsters.length}</h3>
                    <p className="text-[10px] text-gray-300 font-semibold uppercase">{lang === 'pt' ? 'Monstros' : 'Monsters'}</p>
                </div>
                <Skull size={24} className="text-[#FF1457]/50" />
            </div>
            <div className="bg-gradient-to-br from-[#613C4C] to-[#453745] p-4 rounded-2xl border border-[#FF1457]/30 shadow-lg flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-white">{items.length}</h3>
                    <p className="text-[10px] text-gray-300 font-semibold uppercase">{lang === 'pt' ? 'Itens' : 'Items'}</p>
                </div>
                <Package size={24} className="text-[#FF1457]/50" />
            </div>
        </div>

        <div className="bg-[#35313B] rounded-2xl border border-[#453745] overflow-hidden shadow-sm">
            <div className="p-4 bg-[#2B2C30] border-b border-[#453745]">
                <h4 className="font-bold text-white flex items-center gap-2 uppercase tracking-wider text-xs"><Settings size={16} className="text-[#FF1457]" /> {t.settings}</h4>
            </div>
            
            <div className="p-4 space-y-4">
                <div>
                    <label className="text-xs text-gray-400 font-semibold mb-2 block uppercase">{t.language}</label>
                    <div className="flex gap-2">
                        <button onClick={() => setLang('en')} className={`flex-1 py-2 rounded-lg font-bold border transition-colors ${lang === 'en' ? 'bg-[#FF1457] border-[#FF1457] text-white shadow-inner' : 'bg-[#2B2C30] border-[#453745] text-gray-400 hover:text-white'}`}>English</button>
                        <button onClick={() => setLang('pt')} className={`flex-1 py-2 rounded-lg font-bold border transition-colors ${lang === 'pt' ? 'bg-[#FF1457] border-[#FF1457] text-white shadow-inner' : 'bg-[#2B2C30] border-[#453745] text-gray-400 hover:text-white'}`}>Português</button>
                    </div>
                </div>
                <div>
                    <label className="text-xs text-gray-400 font-semibold mb-2 block uppercase">Databases (Offline Cache)</label>
                    <div className="flex gap-2 mb-2">
                        <button onClick={() => syncData('monsters')} disabled={isSyncing} className={`flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-xs ${isSyncing ? 'bg-[#453745] text-gray-500 cursor-not-allowed' : 'bg-[#2B2C30] border border-[#FF1457]/50 hover:bg-[#453745] text-white'}`}>
                            {isSyncing ? <RotateCcw size={16} className="animate-spin" /> : <Download size={16} />} {isSyncing ? t.syncing : t.syncBestiary}
                        </button>
                        <button onClick={() => syncData('items')} disabled={isSyncing} className={`flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-xs ${isSyncing ? 'bg-[#453745] text-gray-500 cursor-not-allowed' : 'bg-[#2B2C30] border border-[#FF1457]/50 hover:bg-[#453745] text-white'}`}>
                            {isSyncing ? <RotateCcw size={16} className="animate-spin" /> : <Download size={16} />} {isSyncing ? t.syncing : t.syncItems}
                        </button>
                    </div>
                    
                    <div className="mt-4 bg-[#2B2C30] p-3 rounded-xl border border-[#453745] shadow-inner h-40 overflow-y-auto font-mono text-[10px] text-[#FF1457] flex flex-col-reverse">
                        {debugLogs.map((log, i) => (
                            <div key={i} className="opacity-80 hover:opacity-100 py-0.5 border-b border-[#FF1457]/20">{log}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-[#35313B] rounded-2xl p-5 border border-[#453745] shadow-sm text-center">
            <Info size={24} className="mx-auto text-[#FF1457] mb-2" />
            <h3 className="text-white font-bold mb-2 uppercase text-xs tracking-wider">{t.credits}</h3>
            <p className="text-[10px] text-gray-400 mb-4">{t.creditsText}</p>
            <div className="border-t border-[#453745] pt-4 mt-2">
                <p className="text-sm font-bold text-[#FF1457] mb-2">{t.creator}</p>
                <p className="text-[10px] text-gray-500 leading-relaxed mb-1">{t.aiDisclaimer}</p>
                <a href={`mailto:${t.email}`} className="text-xs font-bold text-[#FF1457] hover:text-white transition-colors inline-flex items-center gap-1">{t.email}</a>
            </div>
        </div>
      </div>
    );
};

const Sidebar = ({ isOpen, onClose, onNavigate, currentRoute, t, lang }) => {
    const { setItemsTab } = useContext(AppContext);
    const [expanded, setExpanded] = useState({ monsters: true, items: true, dm: true, system: true });

    const toggleCategory = (cat) => setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));

    const handleNavigate = (route, tab) => {
        if (tab) setItemsTab(tab);
        onNavigate(route);
        onClose();
    };

    const menuData = [
        {
            id: 'monsters', label: lang === 'pt' ? 'Monstros' : 'Monsters', icon: Skull,
            sub: [
                { id: 'bestiary', label: t.bestiary, icon: Book },
                { id: 'home', label: t.generator, icon: Dices },
                { id: 'encounter', label: t.encounter, icon: Swords }
            ]
        },
        {
            id: 'items', label: lang === 'pt' ? 'Itens' : 'Items', icon: Package,
            sub: [
                { id: 'items', tab: 'compendium', label: t.compendiumTitle, icon: Search },
                { id: 'items', tab: 'loot', label: t.lootGenTitle, icon: Gem }
            ]
        },
        {
            id: 'dm', label: lang === 'pt' ? 'Mestre (DM)' : 'Dungeon Master', icon: Shield,
            sub: [
                { id: 'campaigns', label: t.campaigns, icon: ScrollText },
                { id: 'tracker', label: t.tracker, icon: Shield },
                { id: 'library', label: t.library, icon: BookOpen }
            ]
        },
        {
            id: 'system', label: lang === 'pt' ? 'Sistema' : 'System', icon: Settings,
            sub: [
                { id: 'menu', label: t.settings, icon: RotateCcw }
            ]
        }
    ];

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/70 z-40 transition-opacity" onClick={onClose} />}
            
            <div className={`fixed inset-y-0 left-0 w-3/4 max-w-[300px] bg-[#35313B] border-r border-[#453745] z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 border-b border-[#453745] flex justify-between items-center bg-[#2B2C30] sticky top-0 z-10">
                    <h2 className="font-black text-[#FF1457]">MESTRE DE BOLSO</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-[#FF1457] p-2 bg-[#453745] rounded-lg transition-colors"><X size={20}/></button>
                </div>
                
                <div className="p-3 space-y-2 pb-10">
                    {menuData.map(cat => (
                        <div key={cat.id} className="mb-2">
                            <button onClick={() => toggleCategory(cat.id)} className="w-full flex items-center justify-between p-3 rounded-xl text-gray-300 hover:bg-[#453745] hover:text-white transition-colors bg-[#2B2C30] border border-[#453745]">
                                <div className="flex items-center gap-3 font-bold text-sm uppercase tracking-wider">
                                    <cat.icon size={16} className="text-[#FF1457]" />
                                    {cat.label}
                                </div>
                                <ArrowRight size={16} className={`text-gray-500 transition-transform duration-200 ${expanded[cat.id] ? 'rotate-90' : 'rotate-0'}`} />
                            </button>
                            
                            {expanded[cat.id] && (
                                <div className="ml-4 pl-4 border-l-2 border-[#453745] mt-2 space-y-1">
                                    {cat.sub.map(subItem => {
                                        const isActive = currentRoute === subItem.id && (!subItem.tab || useContext(AppContext).itemsTab === subItem.tab);
                                        return (
                                            <button 
                                                key={`${subItem.id}-${subItem.tab || ''}`} 
                                                onClick={() => handleNavigate(subItem.id, subItem.tab)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'bg-[#FF1457]/20 text-[#FF1457] border border-[#FF1457]/30' : 'text-gray-400 hover:bg-[#453745] hover:text-white border border-transparent'}`}
                                            >
                                                <subItem.icon size={16} />
                                                {subItem.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

const AppContent = () => {
  const [currentRoute, setCurrentRoute] = useState('menu');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t, lang } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-[#2B2C30] text-gray-200 font-sans selection:bg-[#FF1457]/30">
      
      <header className="bg-[#35313B] border-b border-[#453745] py-4 px-4 sticky top-0 z-30 shadow-md flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="text-gray-300 hover:text-[#FF1457] p-2 -ml-2 rounded-lg hover:bg-[#453745] transition-colors">
            <MenuIcon size={24} />
        </button>
        <h1 className="text-xl font-black text-[#FF1457] tracking-tight leading-none text-center flex-1">
            MESTRE DE BOLSO
        </h1>
        <div className="w-10"></div>
      </header>
      
      <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          onNavigate={setCurrentRoute}
          currentRoute={currentRoute}
          t={t}
          lang={lang}
      />
      
      <main className="w-full relative">
        {currentRoute === 'home' && <HomeScreen onNavigate={setCurrentRoute} />}
        {currentRoute === 'encounter' && <EncounterScreen onNavigate={setCurrentRoute} />}
        {currentRoute === 'tracker' && <TrackerScreen />}
        {currentRoute === 'campaigns' && <CampaignsScreen />}
        {currentRoute === 'bestiary' && <BestiaryScreen />}
        {currentRoute === 'items' && <ItemsScreen />}
        {currentRoute === 'library' && <DMScreenTab />}
        {currentRoute === 'menu' && <MenuScreen />}
      </main>

      <ToastMessage />
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-[#2B2C30] text-[#FF1457]">
          <AlertTriangle size={64} className="mb-4 text-[#FF1457]" />
          <h2 className="text-2xl font-bold mb-2">Erro Crítico / Critical Error</h2>
          <p className="text-sm text-gray-400 mb-6">{this.state.error?.message || "Algo deu errado durante a renderização da interface."}</p>
          <button onClick={() => window.location.reload()} className="bg-[#FF1457] hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-colors">
            Reiniciar App / Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}