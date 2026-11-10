import React, { useState } from 'react';
import { 
  Trash2, Book, Swords, Shield, Sparkles, X, ArrowRight, Check, Edit3, Skull, Gem, Package, Wand2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { calculateMonsterCR } from '../utils/crCalculator';
import { calculateItemPower, RARITY_TABLE } from '../utils/itemCalculator';
import { calculateSpellPower, SPELL_LEVEL_TABLE } from '../utils/spellCalculator';
import { translateTerm } from '../utils/translators';
import { StatBlock } from '../components/StatBlock';
import { renderItemDetails } from '../components/ItemDetails';
import { SpellDetailsCard } from '../components/SpellDetails';

const SIZES = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
const TYPES = ['Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon', 'Elemental', 'Fey', 'Fiend', 'Giant', 'Humanoid', 'Monstrosity', 'Ooze', 'Plant', 'Undead'];
const ALIGNMENTS = [
    'Unaligned', 'Lawful Good', 'Neutral Good', 'Chaotic Good',
    'Lawful Neutral', 'Neutral', 'Chaotic Neutral',
    'Lawful Evil', 'Neutral Evil', 'Chaotic Evil', 'Any alignment'
];
const ACTION_TYPES = [
    { id: 'ACTION', pt: 'Ação Padrão', en: 'Action' },
    { id: 'BONUS_ACTION', pt: 'Ação Bônus', en: 'Bonus Action' },
    { id: 'REACTION', pt: 'Reação', en: 'Reaction' },
    { id: 'LEGENDARY_ACTION', pt: 'Ação Lendária', en: 'Legendary Action' },
    { id: 'MYTHIC_ACTION', pt: 'Ação Mítica', en: 'Mythic Action' }
];

const ITEM_CATEGORIES = [
    { id: 'Weapon', pt: 'Arma', en: 'Weapon' },
    { id: 'Armor', pt: 'Armadura', en: 'Armor' },
    { id: 'Shield', pt: 'Escudo', en: 'Shield' },
    { id: 'Wondrous Item', pt: 'Item Maravilhoso', en: 'Wondrous Item' },
    { id: 'Potion', pt: 'Poção', en: 'Potion' },
    { id: 'Ring', pt: 'Anel', en: 'Ring' },
    { id: 'Scroll', pt: 'Pergaminho', en: 'Scroll' },
    { id: 'Wand', pt: 'Varinha', en: 'Wand' },
    { id: 'Staff', pt: 'Cajado', en: 'Staff' },
    { id: 'Rod', pt: 'Bastão', en: 'Rod' },
    { id: 'Adventuring Gear', pt: 'Equipamento de Aventura', en: 'Adventuring Gear' }
];

const DAMAGE_TYPES = [
    'Slashing', 'Piercing', 'Bludgeoning', 'Fire', 'Cold', 'Lightning',
    'Acid', 'Poison', 'Necrotic', 'Radiant', 'Psychic', 'Force', 'Thunder'
];

const WEAPON_PROPERTIES = [
    'Finesse', 'Light', 'Heavy', 'Two-Handed', 'Versatile', 'Reach', 'Thrown', 'Ammunition', 'Loading'
];

const EXTRA_DAMAGE_OPTIONS = [
    { val: 0, pt: 'Nenhum dano extra', en: 'No extra damage' },
    { val: 1, pt: '+1d4 ou +1d6 elemental/extra', en: '+1d4 or +1d6 extra damage' },
    { val: 2, pt: '+2d6 extra (ex: Língua Flamejante)', en: '+2d6 extra (e.g. Flame Tongue)' },
    { val: 3, pt: '+3d6 ou efeito severo em acerto', en: '+3d6 or severe hit effect' },
    { val: 4, pt: 'Dano massivo / Vorpal / Épico', en: 'Massive / Vorpal / Epic damage' }
];

const SPELL_TIER_OPTIONS = [
    { val: 0, pt: 'Nenhum / Efeito menor ou Truque', en: 'None / Minor or Cantrip' },
    { val: 1, pt: 'Magia de 1º a 2º Círculo / Utilitário', en: '1st–2nd Level Spell / Utility' },
    { val: 2, pt: 'Magia de 3º a 4º Círculo (ex: Bola de Fogo)', en: '3rd–4th Level Spell (e.g. Fireball)' },
    { val: 3, pt: 'Magia de 5º a 6º Círculo / Teleporte', en: '5th–6th Level Spell / Teleport' },
    { val: 4, pt: 'Magia de 7º a 8º Círculo / Poder Alto', en: '7th–8th Level Spell / High Power' },
    { val: 5, pt: 'Magia de 9º Círculo / Desejo / Divino', en: '9th Level Spell / Wish / Divine' }
];

const SPELL_SCHOOLS = [
    'Abjuration', 'Conjuration', 'Divination', 'Enchantment',
    'Evocation', 'Illusion', 'Necromancy', 'Transmutation'
];

const SPELL_CLASSES = [
    'Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard'
];

const SPELL_CONTROL_OPTIONS = [
    { val: 0, pt: 'Nenhum / Dano ou Utilitário Simples', en: 'None / Pure Damage or Simple Utility' },
    { val: 1, pt: 'Controle Leve / Debuff 1 Alvo (1º-2º Círculo)', en: 'Minor Control / Single Debuff (1st–2nd Level)' },
    { val: 2, pt: 'Controle Forte / Paralisia / Voo (3º-4º Círculo)', en: 'Hard Control / Hold / Flight (3rd–4th Level)' },
    { val: 3, pt: 'Controle em Massa / Muralha / Teleporte (5º-6º Círculo)', en: 'Mass Control / Wall / Teleport (5th–6th Level)' },
    { val: 4, pt: 'Poder Supremo / Alterar Realidade (7º-9º Círculo)', en: 'Supreme Power / Reality Warping (7th–9th Level)' }
];

const CASTING_TIME_PRESETS = [
    { id: '1 action', pt: '1 Ação', en: '1 Action' },
    { id: '1 bonus action', pt: '1 Ação Bônus', en: '1 Bonus Action' },
    { id: '1 reaction', pt: '1 Reação', en: '1 Reaction' },
    { id: '1 minute', pt: '1 Minuto', en: '1 Minute' },
    { id: '10 minutes', pt: '10 Minutos', en: '10 Minutes' },
    { id: '1 hour', pt: '1 Hora', en: '1 Hour' }
];

const RANGE_PRESETS = [
    { id: 'Self', pt: 'Pessoal (Self)', en: 'Self' },
    { id: 'Touch', pt: 'Toque (Touch)', en: 'Touch' },
    { id: '30 feet', pt: '9 metros (30 ft.)', en: '30 feet' },
    { id: '60 feet', pt: '18 metros (60 ft.)', en: '60 feet' },
    { id: '90 feet', pt: '27 metros (90 ft.)', en: '90 feet' },
    { id: '120 feet', pt: '36 metros (120 ft.)', en: '120 feet' },
    { id: '150 feet', pt: '45 metros (150 ft.)', en: '150 feet' },
    { id: 'Sight', pt: 'Linha de Visão (Sight)', en: 'Sight' }
];

const DURATION_PRESETS = [
    { id: 'Instantaneous', pt: 'Instantânea', en: 'Instantaneous' },
    { id: '1 round', pt: '1 Rodada', en: '1 Round' },
    { id: '1 minute', pt: '1 Minuto', en: '1 Minute' },
    { id: '10 minutes', pt: '10 Minutos', en: '10 Minutes' },
    { id: '1 hour', pt: '1 Hora', en: '1 Hour' },
    { id: '8 hours', pt: '8 Horas', en: '8 Hours' },
    { id: '24 hours', pt: '24 Horas', en: '24 Hours' },
    { id: 'Until dispelled', pt: 'Até ser dissipada', en: 'Until dispelled' }
];

const initialMonsterFormState = {
    name: '',
    size: 'Medium',
    type: 'Humanoid',
    alignment: 'Unaligned',
    ac: 13,
    armorDetail: '',
    hp: 45,
    hitDice: '',
    speed: '30 ft.',
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
    dpr: 12,
    attackBonus: 4,
    saveDC: 13,
    useSaveDC: false,
    resistances: '',
    immunities: '',
    languages: 'Common',
    darkvision: '',
    traits: [],
    actions: [
        { name: 'Strike', desc: 'Melee Attack Roll: +4, reach 5 ft. Hit: 12 (2d8 + 3) Slashing damage.', action_type: 'ACTION' }
    ]
};

const initialItemFormState = {
    name: '',
    category: 'Weapon',
    autoRarity: true,
    manualRarity: 'Uncommon',
    magicBonus: 1,
    extraDamageTier: 0,
    spellEffectTier: 0,
    requiresAttunement: false,
    attunementDetail: '',
    damageDice: '1d8',
    damageType: 'Slashing',
    properties: ['Versatile'],
    acString: '14 + DES (máx 2)',
    weight: '',
    cost: '',
    desc: ''
};

const initialSpellFormState = {
    name: '',
    school: 'Evocation',
    autoLevel: true,
    manualLevel: 1,
    damageDice: '2d10',
    damageType: 'Fire',
    targetScope: 'single',
    effectTier: 0,
    halfOnSave: true,
    castingTime: '1 action',
    range: '60 feet',
    duration: 'Instantaneous',
    concentration: false,
    ritual: false,
    verbal: true,
    somatic: true,
    material: false,
    materialDesc: '',
    classes: ['Wizard', 'Sorcerer'],
    desc: '',
    higherLevel: ''
};

export const HomebrewScreen = ({ onNavigate }) => {
    const {
        t, lang, monsters, items, spells,
        homebrewMonsters, setHomebrewMonsters, sendHomebrewToBestiary, removeMonsterFromBestiary,
        homebrewItems, setHomebrewItems, sendHomebrewToItems, removeItemFromCompendium,
        homebrewSpells, setHomebrewSpells, sendHomebrewToGrimoire, removeSpellFromGrimoire,
        addMonsterToEncounter, addDirectlyToTracker, showToast
    } = useAppContext();

    // Seletor principal: 'monsters', 'items' ou 'spells'
    const [homebrewCategory, setHomebrewCategory] = useState('monsters');

    // Estado de Monstros
    const [activeTab, setActiveTab] = useState('create');
    const [editingSlug, setEditingSlug] = useState(null);
    const [form, setForm] = useState(initialMonsterFormState);
    const [expanded, setExpanded] = useState({});
    const [confirmDeleteSlug, setConfirmDeleteSlug] = useState(null);

    // Estado de Itens
    const [itemActiveTab, setItemActiveTab] = useState('create');
    const [editingItemSlug, setEditingItemSlug] = useState(null);
    const [itemForm, setItemForm] = useState(initialItemFormState);
    const [expandedItems, setExpandedItems] = useState({});
    const [confirmDeleteItemSlug, setConfirmDeleteItemSlug] = useState(null);

    // Estado de Magias
    const [spellActiveTab, setSpellActiveTab] = useState('create');
    const [editingSpellSlug, setEditingSpellSlug] = useState(null);
    const [spellForm, setSpellForm] = useState(initialSpellFormState);
    const [expandedSpells, setExpandedSpells] = useState({});
    const [confirmDeleteSpellSlug, setConfirmDeleteSpellSlug] = useState(null);

    // Cálculo de ND (CR) do Monstro ao vivo
    const crResult = calculateMonsterCR({
        hp: form.hp,
        ac: form.ac,
        dpr: form.dpr,
        attackBonus: form.attackBonus,
        saveDC: form.saveDC,
        useSaveDC: form.useSaveDC
    });

    // Cálculo de Raridade e Valor do Item ao vivo
    const itemPowerResult = calculateItemPower({
        autoRarity: itemForm.autoRarity,
        manualRarity: itemForm.manualRarity,
        magicBonus: itemForm.magicBonus,
        extraDamageTier: itemForm.extraDamageTier,
        spellEffectTier: itemForm.spellEffectTier,
        category: itemForm.category,
        requiresAttunement: itemForm.requiresAttunement
    });

    // Cálculo de Círculo e Balanceamento de Magia ao vivo (DMG p. 283-284)
    const spellPowerResult = calculateSpellPower({
        autoLevel: spellForm.autoLevel,
        manualLevel: spellForm.manualLevel,
        damageDice: spellForm.damageDice,
        targetScope: spellForm.targetScope,
        effectTier: spellForm.effectTier,
        halfOnSave: spellForm.halfOnSave
    });

    // --- Handlers de Monstro ---
    const updateField = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleAddTrait = () => {
        setForm(prev => ({
            ...prev,
            traits: [...prev.traits, { name: '', desc: '' }]
        }));
    };

    const handleUpdateTrait = (idx, field, val) => {
        setForm(prev => ({
            ...prev,
            traits: prev.traits.map((tr, i) => i === idx ? { ...tr, [field]: val } : tr)
        }));
    };

    const handleRemoveTrait = (idx) => {
        setForm(prev => ({
            ...prev,
            traits: prev.traits.filter((_, i) => i !== idx)
        }));
    };

    const handleAddAction = () => {
        setForm(prev => ({
            ...prev,
            actions: [...prev.actions, { name: '', desc: '', action_type: 'ACTION' }]
        }));
    };

    const handleUpdateAction = (idx, field, val) => {
        setForm(prev => ({
            ...prev,
            actions: prev.actions.map((ac, i) => i === idx ? { ...ac, [field]: val } : ac)
        }));
    };

    const handleRemoveAction = (idx) => {
        setForm(prev => ({
            ...prev,
            actions: prev.actions.filter((_, i) => i !== idx)
        }));
    };

    const buildMonsterObject = () => {
        const cleanName = form.name.trim() || (lang === 'pt' ? 'Monstro Homebrew' : 'Homebrew Monster');
        const slug = editingSlug || `hb-${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
        const wisMod = Math.floor(((parseInt(form.wis) || 10) - 10) / 2);

        return {
            slug,
            name: cleanName,
            isHomebrew: true,
            size: form.size,
            type: form.type,
            alignment: form.alignment,
            armor_class: parseInt(form.ac) || 10,
            armor_detail: form.armorDetail.trim() || undefined,
            hit_points: parseInt(form.hp) || 10,
            hit_dice: form.hitDice.trim() || undefined,
            speed: form.speed.trim() || '30 ft.',
            challenge_rating: crResult.cr,
            xp: crResult.xp,
            proficiency_bonus: crResult.proficiencyBonus,
            ability_scores: {
                strength: parseInt(form.str) || 10,
                dexterity: parseInt(form.dex) || 10,
                constitution: parseInt(form.con) || 10,
                intelligence: parseInt(form.int) || 10,
                wisdom: parseInt(form.wis) || 10,
                charisma: parseInt(form.cha) || 10
            },
            passive_perception: 10 + wisMod,
            darkvision_range: parseInt(form.darkvision) || null,
            damage_resistances: form.resistances.trim() || '',
            damage_immunities: form.immunities.trim() || '',
            languages: form.languages.trim() || '',
            traits: form.traits.filter(tr => tr.name.trim() || tr.desc.trim()),
            actions: form.actions
                .filter(ac => ac.name.trim() || ac.desc.trim())
                .map((ac, index) => ({
                    name: ac.name.trim() || 'Action',
                    desc: ac.desc.trim(),
                    action_type: ac.action_type || 'ACTION',
                    order_in_statblock: index
                })),
            homebrew_meta: {
                dpr: parseInt(form.dpr) || 0,
                attackBonus: parseInt(form.attackBonus) || 0,
                saveDC: parseInt(form.saveDC) || 10,
                useSaveDC: !!form.useSaveDC,
                defensiveCR: crResult.defensiveCR,
                offensiveCR: crResult.offensiveCR
            }
        };
    };

    const saveMonsterLocal = (monsterObj) => {
        setHomebrewMonsters(prev => {
            const exists = prev.some(m => m.slug === monsterObj.slug);
            if (exists) {
                return prev.map(m => m.slug === monsterObj.slug ? monsterObj : m);
            }
            return [monsterObj, ...prev];
        });
    };

    const handleSaveHomebrew = (e, alsoSendToBestiary = false) => {
        if (e) e.preventDefault();
        if (!form.name.trim()) return;

        const monsterObj = buildMonsterObject();
        saveMonsterLocal(monsterObj);

        if (alsoSendToBestiary) {
            sendHomebrewToBestiary(monsterObj);
        } else {
            showToast(t.homebrewSaved);
        }

        setEditingSlug(null);
        setForm(initialMonsterFormState);
        setActiveTab('list');
    };

    const handleEditHomebrew = (m) => {
        setEditingSlug(m.slug);
        setForm({
            name: m.name || '',
            size: m.size || 'Medium',
            type: typeof m.type === 'object' ? (m.type.name || 'Humanoid') : (m.type || 'Humanoid'),
            alignment: m.alignment || 'Unaligned',
            ac: m.armor_class || 10,
            armorDetail: m.armor_detail || '',
            hp: m.hit_points || 10,
            hitDice: m.hit_dice || '',
            speed: typeof m.speed === 'string' ? m.speed : '30 ft.',
            str: m.ability_scores?.strength ?? 10,
            dex: m.ability_scores?.dexterity ?? 10,
            con: m.ability_scores?.constitution ?? 10,
            int: m.ability_scores?.intelligence ?? 10,
            wis: m.ability_scores?.wisdom ?? 10,
            cha: m.ability_scores?.charisma ?? 10,
            dpr: m.homebrew_meta?.dpr ?? 10,
            attackBonus: m.homebrew_meta?.attackBonus ?? 4,
            saveDC: m.homebrew_meta?.saveDC ?? 13,
            useSaveDC: m.homebrew_meta?.useSaveDC ?? false,
            resistances: m.damage_resistances || '',
            immunities: m.damage_immunities || '',
            languages: typeof m.languages === 'string' ? m.languages : '',
            darkvision: m.darkvision_range || '',
            traits: Array.isArray(m.traits) ? m.traits.map(tr => ({ ...tr })) : [],
            actions: Array.isArray(m.actions) ? m.actions.map(ac => ({ ...ac })) : []
        });
        setActiveTab('create');
    };

    const handleDeleteHomebrew = async (slug) => {
        const target = homebrewMonsters.find(m => m.slug === slug);
        setHomebrewMonsters(prev => prev.filter(m => m.slug !== slug));
        await removeMonsterFromBestiary(slug, target?.name);
        setConfirmDeleteSlug(null);
    };

    const isInBestiary = (slug) => monsters.some(m => m.slug === slug);

    // --- Handlers de Item Homebrew ---
    const updateItemField = (key, value) => {
        setItemForm(prev => ({ ...prev, [key]: value }));
    };

    const toggleWeaponProperty = (prop) => {
        setItemForm(prev => {
            const exists = prev.properties.includes(prop);
            return {
                ...prev,
                properties: exists
                    ? prev.properties.filter(p => p !== prop)
                    : [...prev.properties, prop]
            };
        });
    };

    const buildItemObject = () => {
        const cleanName = itemForm.name.trim() || (lang === 'pt' ? 'Item Homebrew' : 'Homebrew Item');
        const slug = editingItemSlug || `hb-item-${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
        const isWeapon = itemForm.category === 'Weapon';
        const isArmorOrShield = itemForm.category === 'Armor' || itemForm.category === 'Shield';

        const finalCost = itemForm.cost.trim() || (lang === 'pt' ? itemPowerResult.defaultCostPt : itemPowerResult.defaultCostEn);
        const attunementVal = itemForm.requiresAttunement
            ? (itemForm.attunementDetail.trim() ? `requires attunement ${itemForm.attunementDetail.trim()}` : 'requires attunement')
            : '';

        const bonusNum = parseInt(itemForm.magicBonus) || 0;
        let autoDescPrefix = '';
        if (bonusNum > 0 && !itemForm.desc.includes(`+${bonusNum}`)) {
            autoDescPrefix = lang === 'pt'
                ? `Bônus Mágico: +${bonusNum}.\n`
                : `Magic Bonus: +${bonusNum}.\n`;
        }

        return {
            slug,
            name: cleanName,
            isHomebrew: true,
            type: itemForm.category,
            equipment_category: itemForm.category,
            rarity: itemPowerResult.rarity,
            requires_attunement: attunementVal,
            cost: finalCost,
            weight: itemForm.weight.trim() || undefined,
            damage_dice: isWeapon && itemForm.damageDice.trim() ? itemForm.damageDice.trim() : undefined,
            damage_type: isWeapon ? itemForm.damageType : undefined,
            properties: isWeapon && itemForm.properties.length > 0 ? itemForm.properties : undefined,
            ac_string: isArmorOrShield && itemForm.acString.trim() ? itemForm.acString.trim() : undefined,
            desc: `${autoDescPrefix}${itemForm.desc.trim()}`.trim() || (lang === 'pt' ? 'Item personalizado criado pelo Mestre.' : 'Custom item created by the DM.'),
            homebrew_meta: {
                autoRarity: !!itemForm.autoRarity,
                manualRarity: itemForm.manualRarity,
                magicBonus: bonusNum,
                extraDamageTier: parseInt(itemForm.extraDamageTier) || 0,
                spellEffectTier: parseInt(itemForm.spellEffectTier) || 0,
                attunementDetail: itemForm.attunementDetail.trim(),
                minLevel: itemPowerResult.minLevel,
                valueRangePt: itemPowerResult.valueRangePt,
                valueRangeEn: itemPowerResult.valueRangeEn
            }
        };
    };

    const saveItemLocal = (itemObj) => {
        setHomebrewItems(prev => {
            const exists = prev.some(i => i.slug === itemObj.slug);
            if (exists) {
                return prev.map(i => i.slug === itemObj.slug ? itemObj : i);
            }
            return [itemObj, ...prev];
        });
    };

    const handleSaveHomebrewItem = (e, alsoSendToCompendium = false) => {
        if (e) e.preventDefault();
        if (!itemForm.name.trim()) return;

        const itemObj = buildItemObject();
        saveItemLocal(itemObj);

        if (alsoSendToCompendium) {
            sendHomebrewToItems(itemObj);
        } else {
            showToast(t.homebrewItemSaved);
        }

        setEditingItemSlug(null);
        setItemForm(initialItemFormState);
        setItemActiveTab('list');
    };

    const handleEditHomebrewItem = (item) => {
        setEditingItemSlug(item.slug);
        setItemForm({
            name: item.name || '',
            category: item.type || item.equipment_category || 'Weapon',
            autoRarity: item.homebrew_meta?.autoRarity ?? false,
            manualRarity: item.rarity || 'Uncommon',
            magicBonus: item.homebrew_meta?.magicBonus ?? 0,
            extraDamageTier: item.homebrew_meta?.extraDamageTier ?? 0,
            spellEffectTier: item.homebrew_meta?.spellEffectTier ?? 0,
            requiresAttunement: !!item.requires_attunement,
            attunementDetail: item.homebrew_meta?.attunementDetail || '',
            damageDice: item.damage_dice || '1d8',
            damageType: item.damage_type || 'Slashing',
            properties: Array.isArray(item.properties) ? [...item.properties] : [],
            acString: item.ac_string || '',
            weight: item.weight || '',
            cost: item.cost || '',
            desc: item.desc || ''
        });
        setItemActiveTab('create');
    };

    const handleDeleteHomebrewItem = async (slug) => {
        const target = homebrewItems.find(i => i.slug === slug);
        setHomebrewItems(prev => prev.filter(i => i.slug !== slug));
        await removeItemFromCompendium(slug, target?.name);
        setConfirmDeleteItemSlug(null);
    };

    const isInCompendium = (slug) => items.some(i => i.slug === slug);

    // --- Handlers de Magia Homebrew ---
    const updateSpellField = (key, value) => {
        setSpellForm(prev => ({ ...prev, [key]: value }));
    };

    const toggleSpellClass = (cls) => {
        setSpellForm(prev => {
            const exists = prev.classes.includes(cls);
            return {
                ...prev,
                classes: exists
                    ? prev.classes.filter(c => c !== cls)
                    : [...prev.classes, cls]
            };
        });
    };

    const saveSpellLocal = (spellObj) => {
        setHomebrewSpells(prev => {
            const exists = prev.some(s => s.slug === spellObj.slug);
            if (exists) {
                return prev.map(s => s.slug === spellObj.slug ? spellObj : s);
            }
            return [spellObj, ...prev];
        });
    };

    const handleSaveHomebrewSpell = (e, alsoSendToGrimoire = false) => {
        if (e) e.preventDefault();
        if (!spellForm.name.trim()) return;

        const cleanName = spellForm.name.trim();
        const slug = editingSpellSlug || `hb-spell-${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
        const finalLevel = spellPowerResult.level;

        let autoDamageHeader = '';
        if (spellForm.damageDice.trim() && spellForm.damageDice.trim() !== '0' && !spellForm.desc.includes(spellForm.damageDice.trim())) {
            const translatedDmg = translateTerm(spellForm.damageType, lang);
            autoDamageHeader = lang === 'pt'
                ? `Dano Base: ${spellForm.damageDice.trim()} (${translatedDmg}).\n`
                : `Base Damage: ${spellForm.damageDice.trim()} ${spellForm.damageType} damage.\n`;
        }

        const spellObj = {
            slug,
            key: slug,
            name: cleanName,
            isHomebrew: true,
            level: finalLevel,
            school: { name: spellForm.school, key: spellForm.school.toLowerCase() },
            casting_time: spellForm.castingTime,
            range_text: spellForm.range,
            duration: spellForm.duration,
            concentration: !!spellForm.concentration,
            ritual: !!spellForm.ritual,
            verbal: !!spellForm.verbal,
            somatic: !!spellForm.somatic,
            material: !!spellForm.material,
            material_specified: spellForm.material && spellForm.materialDesc.trim() ? spellForm.materialDesc.trim() : '',
            classes: spellForm.classes.map(c => ({ name: c, key: c.toLowerCase() })),
            desc: `${autoDamageHeader}${spellForm.desc.trim()}`.trim() || (lang === 'pt' ? 'Magia personalizada criada pelo Mestre.' : 'Custom spell created by the DM.'),
            higher_level: spellForm.higherLevel.trim() || '',
            homebrew_meta: {
                autoLevel: !!spellForm.autoLevel,
                manualLevel: finalLevel,
                damageDice: spellForm.damageDice.trim(),
                damageType: spellForm.damageType,
                targetScope: spellForm.targetScope,
                effectTier: parseInt(spellForm.effectTier, 10) || 0,
                halfOnSave: !!spellForm.halfOnSave
            }
        };

        saveSpellLocal(spellObj);

        if (alsoSendToGrimoire) {
            sendHomebrewToGrimoire(spellObj);
        } else {
            showToast(t.homebrewSpellSaved);
        }

        setEditingSpellSlug(null);
        setSpellForm(initialSpellFormState);
        setSpellActiveTab('list');
    };

    const handleEditHomebrewSpell = (spell) => {
        setEditingSpellSlug(spell.slug);
        const schoolName = typeof spell.school === 'object' ? (spell.school?.name || 'Evocation') : (spell.school || 'Evocation');
        const classList = Array.isArray(spell.classes)
            ? spell.classes.map(c => typeof c === 'object' ? c.name : String(c))
            : ['Wizard'];
        setSpellForm({
            name: spell.name || '',
            school: schoolName,
            autoLevel: spell.homebrew_meta?.autoLevel ?? false,
            manualLevel: spell.level ?? 1,
            damageDice: spell.homebrew_meta?.damageDice ?? '2d10',
            damageType: spell.homebrew_meta?.damageType ?? 'Fire',
            targetScope: spell.homebrew_meta?.targetScope ?? 'single',
            effectTier: spell.homebrew_meta?.effectTier ?? 0,
            halfOnSave: spell.homebrew_meta?.halfOnSave ?? true,
            castingTime: spell.casting_time || '1 action',
            range: spell.range_text || '60 feet',
            duration: spell.duration || 'Instantaneous',
            concentration: !!spell.concentration,
            ritual: !!spell.ritual,
            verbal: spell.verbal ?? true,
            somatic: spell.somatic ?? true,
            material: !!spell.material,
            materialDesc: spell.material_specified || '',
            classes: classList,
            desc: spell.desc || '',
            higherLevel: spell.higher_level || ''
        });
        setSpellActiveTab('create');
    };

    const handleDeleteHomebrewSpell = async (slug) => {
        const target = homebrewSpells.find(s => s.slug === slug);
        setHomebrewSpells(prev => prev.filter(s => s.slug !== slug));
        await removeSpellFromGrimoire(slug, target?.name);
        setConfirmDeleteSpellSlug(null);
    };

    const isInGrimoire = (slug) => spells.some(s => s.slug === slug);

    return (
        <div className="p-4 pb-8 max-w-lg mx-auto animate-in fade-in">
            {/* Seletor Superior de Modo Homebrew: Monstros vs Itens vs Magias */}
            <div className="grid grid-cols-3 gap-1.5 mb-4 bg-[#2B2C30] p-1.5 rounded-2xl border border-[#453745] shadow-md">
                <button
                    type="button"
                    onClick={() => setHomebrewCategory('monsters')}
                    className={`py-3 px-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        homebrewCategory === 'monsters'
                            ? 'bg-gradient-to-r from-[#FF1457] to-[#613C4C] text-white shadow-lg shadow-[#FF1457]/25'
                            : 'bg-[#35313B] text-gray-400 hover:text-white'
                    }`}
                >
                    <Skull size={15} /> {t.homebrewMonstersTab}
                </button>
                <button
                    type="button"
                    onClick={() => setHomebrewCategory('items')}
                    className={`py-3 px-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        homebrewCategory === 'items'
                            ? 'bg-gradient-to-r from-[#FF1457] to-[#613C4C] text-white shadow-lg shadow-[#FF1457]/25'
                            : 'bg-[#35313B] text-gray-400 hover:text-white'
                    }`}
                >
                    <Gem size={15} /> {t.homebrewItemsTab}
                </button>
                <button
                    type="button"
                    onClick={() => setHomebrewCategory('spells')}
                    className={`py-3 px-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        homebrewCategory === 'spells'
                            ? 'bg-gradient-to-r from-[#FF1457] to-[#613C4C] text-white shadow-lg shadow-[#FF1457]/25'
                            : 'bg-[#35313B] text-gray-400 hover:text-white'
                    }`}
                >
                    <Wand2 size={15} /> {t.homebrewSpellsTab}
                </button>
            </div>

            {/* ============================================================== */}
            {/* ABA 1: CRIADOR DE MONSTROS HOMEBREW                            */}
            {/* ============================================================== */}
            {homebrewCategory === 'monsters' && (
                <div className="animate-in fade-in">
                    <div className="flex bg-[#35313B] p-1 rounded-xl mb-4 border border-[#453745] shadow-inner">
                        <button
                            onClick={() => setActiveTab('create')}
                            className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'create' ? 'bg-[#FF1457] text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Sparkles size={14} /> {t.createHomebrew}
                        </button>
                        <button
                            onClick={() => setActiveTab('list')}
                            className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'list' ? 'bg-[#FF1457] text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Skull size={14} /> {t.myHomebrew} ({homebrewMonsters.length})
                        </button>
                    </div>

                    {activeTab === 'create' && (
                        <form onSubmit={(e) => handleSaveHomebrew(e, false)} className="space-y-4 animate-in fade-in">
                            {/* Live CR Banner */}
                            <div className="bg-gradient-to-br from-[#613C4C] to-[#35313B] p-4 rounded-2xl border border-[#FF1457]/50 shadow-xl sticky top-[68px] z-20 backdrop-blur-md">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 block">
                                            {t.calculatedCR}
                                        </span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-white">CR {crResult.cr}</span>
                                            <span className="text-xs font-bold text-[#FF1457] bg-[#2B2C30] px-2.5 py-0.5 rounded-full border border-[#FF1457]/40">
                                                {crResult.xp} XP
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right text-xs space-y-1">
                                        <div className="text-gray-300">
                                            <span className="text-gray-400">{t.defensiveCR}:</span> <strong className="text-white">{crResult.defensiveCR}</strong>
                                        </div>
                                        <div className="text-gray-300">
                                            <span className="text-gray-400">{t.offensiveCR}:</span> <strong className="text-white">{crResult.offensiveCR}</strong>
                                        </div>
                                        <div className="text-[10px] text-[#FF1457] font-bold">
                                            {t.profBonus}: +{crResult.proficiencyBonus}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Identity Section */}
                            <div className="bg-[#35313B] p-4 rounded-2xl border border-[#453745] space-y-3 shadow-md">
                                <div>
                                    <label className="text-xs text-gray-400 font-semibold mb-1 block uppercase">{t.monsterName} *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder={lang === 'pt' ? 'Ex: Dragão de Obsidiana' : 'Ex: Obsidian Dragon'}
                                        value={form.name}
                                        onChange={e => updateField('name', e.target.value)}
                                        className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-3 outline-none focus:border-[#FF1457] font-bold text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-gray-400 font-semibold mb-1 block uppercase">{t.size}</label>
                                        <select
                                            value={form.size}
                                            onChange={e => updateField('size', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 outline-none focus:border-[#FF1457] text-xs font-bold"
                                        >
                                            {SIZES.map(s => <option key={s} value={s}>{translateTerm(s, lang)}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 font-semibold mb-1 block uppercase">{t.type}</label>
                                        <select
                                            value={form.type}
                                            onChange={e => updateField('type', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 outline-none focus:border-[#FF1457] text-xs font-bold"
                                        >
                                            {TYPES.map(tp => <option key={tp} value={tp}>{translateTerm(tp, lang)}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-gray-400 font-semibold mb-1 block uppercase">{t.alignment}</label>
                                        <select
                                            value={form.alignment}
                                            onChange={e => updateField('alignment', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 outline-none focus:border-[#FF1457] text-xs font-bold"
                                        >
                                            {ALIGNMENTS.map(a => <option key={a} value={a}>{translateTerm(a, lang)}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 font-semibold mb-1 block uppercase">{t.speed}</label>
                                        <input
                                            type="text"
                                            placeholder="30 ft., fly 60 ft."
                                            value={form.speed}
                                            onChange={e => updateField('speed', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 outline-none focus:border-[#FF1457] text-xs"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Combat & CR Parameters */}
                            <div className="bg-[#35313B] p-4 rounded-2xl border border-[#453745] space-y-3 shadow-md">
                                <h4 className="font-bold text-[#FF1457] text-xs uppercase tracking-wider border-b border-[#453745] pb-1.5">
                                    {lang === 'pt' ? 'Parâmetros de Combate & Cálculo de ND' : 'Combat & CR Parameters'}
                                </h4>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-gray-400 font-semibold mb-1 block">{t.armorClass}</label>
                                        <input
                                            type="number"
                                            value={form.ac}
                                            onChange={e => updateField('ac', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 outline-none focus:border-[#FF1457] font-bold text-sm text-center"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 font-semibold mb-1 block">{t.hitPoints}</label>
                                        <input
                                            type="number"
                                            value={form.hp}
                                            onChange={e => updateField('hp', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 outline-none focus:border-[#FF1457] font-bold text-sm text-center"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-gray-400 font-semibold mb-1 block">{t.dpr}</label>
                                        <input
                                            type="number"
                                            value={form.dpr}
                                            onChange={e => updateField('dpr', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 outline-none focus:border-[#FF1457] font-bold text-sm text-center"
                                        />
                                    </div>
                                    {!form.useSaveDC ? (
                                        <div>
                                            <label className="text-xs text-gray-400 font-semibold mb-1 block">{t.attackBonus}</label>
                                            <input
                                                type="number"
                                                value={form.attackBonus}
                                                onChange={e => updateField('attackBonus', e.target.value)}
                                                className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 outline-none focus:border-[#FF1457] font-bold text-sm text-center"
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="text-xs text-gray-400 font-semibold mb-1 block">{t.saveDC}</label>
                                            <input
                                                type="number"
                                                value={form.saveDC}
                                                onChange={e => updateField('saveDC', e.target.value)}
                                                className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 outline-none focus:border-[#FF1457] font-bold text-sm text-center"
                                            />
                                        </div>
                                    )}
                                </div>

                                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer pt-1">
                                    <input
                                        type="checkbox"
                                        checked={form.useSaveDC}
                                        onChange={e => updateField('useSaveDC', e.target.checked)}
                                        className="accent-[#FF1457] w-4 h-4 rounded"
                                    />
                                    {t.useSaveDC}
                                </label>
                            </div>

                            {/* Ability Scores */}
                            <div className="bg-[#35313B] p-4 rounded-2xl border border-[#453745] space-y-3 shadow-md">
                                <h4 className="font-bold text-[#FF1457] text-xs uppercase tracking-wider border-b border-[#453745] pb-1.5">
                                    {lang === 'pt' ? 'Atributos' : 'Ability Scores'}
                                </h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { k: 'str', l: t.str }, { k: 'dex', l: t.dex }, { k: 'con', l: t.con },
                                        { k: 'int', l: t.int }, { k: 'wis', l: t.wis }, { k: 'cha', l: t.cha }
                                    ].map(st => {
                                        const val = parseInt(form[st.k]) || 10;
                                        const mod = Math.floor((val - 10) / 2);
                                        return (
                                            <div key={st.k} className="bg-[#2B2C30] p-2 rounded-xl border border-[#453745] text-center">
                                                <label className="text-[10px] font-bold text-[#FF1457] block">{st.l}</label>
                                                <input
                                                    type="number"
                                                    value={form[st.k]}
                                                    onChange={e => updateField(st.k, e.target.value)}
                                                    className="w-full bg-transparent text-white font-bold text-center text-sm outline-none my-0.5"
                                                />
                                                <span className="text-[10px] text-gray-400">({mod >= 0 ? `+${mod}` : mod})</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    <div>
                                        <label className="text-[10px] text-gray-400 font-semibold uppercase block mb-1">
                                            {lang === 'pt' ? 'Resistências' : 'Resistances'}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Fire, Cold"
                                            value={form.resistances}
                                            onChange={e => updateField('resistances', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-lg p-2 text-xs outline-none focus:border-[#FF1457]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400 font-semibold uppercase block mb-1">
                                            {lang === 'pt' ? 'Imunidades' : 'Immunities'}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Poison, Psychic"
                                            value={form.immunities}
                                            onChange={e => updateField('immunities', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-lg p-2 text-xs outline-none focus:border-[#FF1457]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] text-gray-400 font-semibold uppercase block mb-1">
                                            {lang === 'pt' ? 'Visão no Escuro (ft)' : 'Darkvision (ft)'}
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="60"
                                            value={form.darkvision}
                                            onChange={e => updateField('darkvision', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-lg p-2 text-xs outline-none focus:border-[#FF1457]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400 font-semibold uppercase block mb-1">
                                            {lang === 'pt' ? 'Idiomas' : 'Languages'}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Common, Draconic"
                                            value={form.languages}
                                            onChange={e => updateField('languages', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-lg p-2 text-xs outline-none focus:border-[#FF1457]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Traits */}
                            <div className="bg-[#35313B] p-4 rounded-2xl border border-[#453745] space-y-3 shadow-md">
                                <div className="flex justify-between items-center border-b border-[#453745] pb-1.5">
                                    <h4 className="font-bold text-[#FF1457] text-xs uppercase tracking-wider">
                                        {lang === 'pt' ? 'Traços & Características' : 'Traits'}
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={handleAddTrait}
                                        className="text-xs font-bold text-white bg-[#FF1457] px-2.5 py-1 rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        {t.addTrait}
                                    </button>
                                </div>
                                {form.traits.map((tr, idx) => (
                                    <div key={idx} className="bg-[#2B2C30] p-3 rounded-xl border border-[#453745] space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder={t.traitName}
                                                value={tr.name}
                                                onChange={e => handleUpdateTrait(idx, 'name', e.target.value)}
                                                className="flex-1 bg-[#35313B] border border-[#453745] text-white rounded-lg p-2 text-xs font-bold outline-none focus:border-[#FF1457]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTrait(idx)}
                                                className="p-2 text-gray-400 hover:text-[#FF1457]"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <textarea
                                            rows={2}
                                            placeholder={t.traitDesc}
                                            value={tr.desc}
                                            onChange={e => handleUpdateTrait(idx, 'desc', e.target.value)}
                                            className="w-full bg-[#35313B] border border-[#453745] text-gray-200 rounded-lg p-2 text-xs outline-none focus:border-[#FF1457]"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="bg-[#35313B] p-4 rounded-2xl border border-[#453745] space-y-3 shadow-md">
                                <div className="flex justify-between items-center border-b border-[#453745] pb-1.5">
                                    <h4 className="font-bold text-[#FF1457] text-xs uppercase tracking-wider">
                                        {lang === 'pt' ? 'Ações (Padrão, Bônus, Reações, Lendárias)' : 'Actions'}
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={handleAddAction}
                                        className="text-xs font-bold text-white bg-[#FF1457] px-2.5 py-1 rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        {t.addAction}
                                    </button>
                                </div>
                                {form.actions.map((ac, idx) => (
                                    <div key={idx} className="bg-[#2B2C30] p-3 rounded-xl border border-[#453745] space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder={t.actionName}
                                                value={ac.name}
                                                onChange={e => handleUpdateAction(idx, 'name', e.target.value)}
                                                className="flex-1 bg-[#35313B] border border-[#453745] text-white rounded-lg p-2 text-xs font-bold outline-none focus:border-[#FF1457]"
                                            />
                                            <select
                                                value={ac.action_type || 'ACTION'}
                                                onChange={e => handleUpdateAction(idx, 'action_type', e.target.value)}
                                                className="bg-[#35313B] border border-[#453745] text-[#FF1457] rounded-lg px-2 text-[10px] font-bold outline-none"
                                            >
                                                {ACTION_TYPES.map(at => (
                                                    <option key={at.id} value={at.id}>{lang === 'pt' ? at.pt : at.en}</option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveAction(idx)}
                                                className="p-2 text-gray-400 hover:text-[#FF1457]"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <textarea
                                            rows={2}
                                            placeholder={t.actionDesc}
                                            value={ac.desc}
                                            onChange={e => handleUpdateAction(idx, 'desc', e.target.value)}
                                            className="w-full bg-[#35313B] border border-[#453745] text-gray-200 rounded-lg p-2 text-xs outline-none focus:border-[#FF1457]"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Submit Buttons */}
                            <div className="space-y-2 pt-2">
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-[#453745] hover:bg-[#613C4C] border border-[#613C4C] text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs transition-colors"
                                    >
                                        <Check size={16} /> {t.saveHomebrew}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => handleSaveHomebrew(e, true)}
                                        className="flex-1 bg-gradient-to-r from-[#FF1457] to-[#613C4C] hover:opacity-90 text-white font-black py-3.5 rounded-xl shadow-lg shadow-[#FF1457]/30 flex items-center justify-center gap-2 text-xs transition-all"
                                    >
                                        <Book size={16} /> {t.save} & {t.sendToBestiary}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {activeTab === 'list' && (
                        <div className="space-y-3 animate-in fade-in">
                            {homebrewMonsters.length === 0 ? (
                                <div className="text-center py-12 text-gray-500 italic bg-[#35313B] rounded-2xl border border-[#453745] border-dashed p-6">
                                    <Sparkles size={40} className="mx-auto mb-2 opacity-40 text-[#FF1457]" />
                                    <p>{t.noHomebrewMonsters}</p>
                                </div>
                            ) : (
                                homebrewMonsters.map(m => {
                                    const isExp = !!expanded[m.slug];
                                    const inBestiary = isInBestiary(m.slug);
                                    return (
                                        <div key={m.slug} className="bg-[#35313B] rounded-2xl overflow-hidden border border-[#453745] shadow-md">
                                            <div
                                                onClick={() => setExpanded(prev => ({ ...prev, [m.slug]: !isExp }))}
                                                className="p-4 flex justify-between items-center cursor-pointer hover:bg-[#453745]/50 transition-colors"
                                            >
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-white leading-tight">{m.name}</h4>
                                                        {inBestiary && (
                                                            <span className="text-[10px] font-bold bg-[#FF1457]/20 text-[#FF1457] px-2 py-0.5 rounded-full border border-[#FF1457]/40">
                                                                {t.inBestiary}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        CR {m.challenge_rating} ({m.xp} XP) • {translateTerm(m.type, lang)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => handleEditHomebrew(m)}
                                                        className="p-2 text-gray-400 hover:text-white bg-[#2B2C30] rounded-lg border border-[#453745]"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDeleteSlug(m.slug)}
                                                        className="p-2 text-gray-400 hover:text-[#FF1457] bg-[#2B2C30] rounded-lg border border-[#453745]"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <span className="text-gray-500 pl-1">
                                                        {isExp ? <X size={18} /> : <ArrowRight size={18} className="rotate-90" />}
                                                    </span>
                                                </div>
                                            </div>

                                            {isExp && (
                                                <div className="p-4 bg-[#2B2C30] border-t border-[#453745] space-y-3">
                                                    <div className="flex flex-wrap gap-2">
                                                        {!inBestiary ? (
                                                            <button
                                                                onClick={() => sendHomebrewToBestiary(m)}
                                                                className="flex-1 bg-[#FF1457] hover:opacity-90 text-white py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                                                            >
                                                                <Book size={14} /> {t.sendToBestiary}
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => removeMonsterFromBestiary(m.slug, m.name)}
                                                                className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-gray-200 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 border border-[#613C4C]"
                                                            >
                                                                <X size={14} /> {t.removeFromBestiary}
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => addMonsterToEncounter(m)}
                                                            className="bg-[#35313B] hover:bg-[#453745] text-white py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1 border border-[#453745]"
                                                        >
                                                            <Swords size={14} className="text-[#FF1457]" /> {t.addToEncounter}
                                                        </button>
                                                        <button
                                                            onClick={() => { addDirectlyToTracker(m); if (onNavigate) onNavigate('tracker'); }}
                                                            className="bg-[#35313B] hover:bg-[#453745] text-white py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1 border border-[#453745]"
                                                        >
                                                            <Shield size={14} className="text-[#FF1457]" /> {t.addDirectTracker}
                                                        </button>
                                                    </div>
                                                    <StatBlock monster={m} lang={lang} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ============================================================== */}
            {/* ABA 2: CRIADOR DE ITENS HOMEBREW                               */}
            {/* ============================================================== */}
            {homebrewCategory === 'items' && (
                <div className="animate-in fade-in">
                    <div className="flex bg-[#35313B] p-1 rounded-xl mb-4 border border-[#453745] shadow-inner">
                        <button
                            onClick={() => setItemActiveTab('create')}
                            className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${itemActiveTab === 'create' ? 'bg-[#FF1457] text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Sparkles size={14} /> {t.createHomebrewItem}
                        </button>
                        <button
                            onClick={() => setItemActiveTab('list')}
                            className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${itemActiveTab === 'list' ? 'bg-[#FF1457] text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Package size={14} /> {t.myHomebrewItems} ({homebrewItems.length})
                        </button>
                    </div>

                    {itemActiveTab === 'create' && (
                        <form onSubmit={(e) => handleSaveHomebrewItem(e, false)} className="space-y-4 animate-in fade-in">
                            {/* Live Item Power & Rarity Banner */}
                            <div className="bg-gradient-to-br from-[#613C4C] to-[#35313B] p-4 rounded-2xl border border-[#FF1457]/50 shadow-xl sticky top-[68px] z-20 backdrop-blur-md">
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 block">
                                            {t.calculatedRarity}
                                        </span>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-2xl font-black text-white">
                                                {translateTerm(itemPowerResult.rarity, lang)}
                                            </span>
                                            {itemForm.magicBonus > 0 && (
                                                <span className="text-xs font-bold text-[#FF1457] bg-[#2B2C30] px-2.5 py-0.5 rounded-full border border-[#FF1457]/40">
                                                    +{itemForm.magicBonus}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right text-xs space-y-1">
                                        <div className="text-gray-300">
                                            <span className="text-gray-400">{t.suggestedValue}:</span>{' '}
                                            <strong className="text-white">
                                                {lang === 'pt' ? itemPowerResult.valueRangePt : itemPowerResult.valueRangeEn}
                                            </strong>
                                        </div>
                                        <div className="text-[11px] text-[#FF1457] font-bold">
                                            {t.minLevel}: {itemPowerResult.minLevel}+
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Identidade do Item */}
                            <div className="bg-[#35313B] p-4 rounded-2xl border border-[#453745] space-y-3 shadow-md">
                                <div>
                                    <label className="text-xs text-gray-400 font-semibold mb-1 block uppercase">{t.itemName} *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder={lang === 'pt' ? 'Ex: Lâmina do Eclipse Carmesim' : 'Ex: Crimson Eclipse Blade'}
                                        value={itemForm.name}
                                        onChange={e => updateItemField('name', e.target.value)}
                                        className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-3 outline-none focus:border-[#FF1457] font-bold text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-gray-400 font-semibold mb-1 block uppercase">{t.itemCategory}</label>
                                        <select
                                            value={itemForm.category}
                                            onChange={e => updateItemField('category', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 outline-none focus:border-[#FF1457] text-xs font-bold"
                                        >
                                            {ITEM_CATEGORIES.map(c => (
                                                <option key={c.id} value={c.id}>{lang === 'pt' ? c.pt : c.en}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 font-semibold mb-1 block uppercase">{t.magicBonus}</label>
                                        <select
                                            value={itemForm.magicBonus}
                                            onChange={e => updateItemField('magicBonus', parseInt(e.target.value))}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 outline-none focus:border-[#FF1457] text-xs font-bold"
                                        >
                                            <option value={0}>+0 ({lang === 'pt' ? 'Sem Bônus' : 'No Bonus'})</option>
                                            <option value={1}>+1</option>
                                            <option value={2}>+2</option>
                                            <option value={3}>+3</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Parâmetros de Poder & Raridade (DMG) */}
                            <div className="bg-[#35313B] p-4 rounded-2xl border border-[#453745] space-y-3 shadow-md">
                                <h4 className="font-bold text-[#FF1457] text-xs uppercase tracking-wider border-b border-[#453745] pb-1.5">
                                    {lang === 'pt' ? 'Poder Mágico & Cálculo de Raridade (DMG)' : 'Magical Power & Rarity Calculation'}
                                </h4>

                                <label className="flex items-center gap-2 text-xs text-gray-200 font-semibold cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={itemForm.autoRarity}
                                        onChange={e => updateItemField('autoRarity', e.target.checked)}
                                        className="accent-[#FF1457] w-4 h-4 rounded"
                                    />
                                    {t.autoRarity}
                                </label>

                                {itemForm.autoRarity ? (
                                    <div className="space-y-3 pt-1">
                                        <div>
                                            <label className="text-xs text-gray-400 font-semibold mb-1 block">{t.extraDamageTier}</label>
                                            <select
                                                value={itemForm.extraDamageTier}
                                                onChange={e => updateItemField('extraDamageTier', parseInt(e.target.value))}
                                                className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 outline-none focus:border-[#FF1457] text-xs font-bold"
                                            >
                                                {EXTRA_DAMAGE_OPTIONS.map(opt => (
                                                    <option key={opt.val} value={opt.val}>{lang === 'pt' ? opt.pt : opt.en}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs text-gray-400 font-semibold mb-1 block">{t.spellEffectLevel}</label>
                                            <select
                                                value={itemForm.spellEffectTier}
                                                onChange={e => updateItemField('spellEffectTier', parseInt(e.target.value))}
                                                className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 outline-none focus:border-[#FF1457] text-xs font-bold"
                                            >
                                                {SPELL_TIER_OPTIONS.map(opt => (
                                                    <option key={opt.val} value={opt.val}>{lang === 'pt' ? opt.pt : opt.en}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="text-xs text-gray-400 font-semibold mb-1 block uppercase">{t.itemRarity}</label>
                                        <select
                                            value={itemForm.manualRarity}
                                            onChange={e => updateItemField('manualRarity', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 outline-none focus:border-[#FF1457] text-xs font-bold"
                                        >
                                            {RARITY_TABLE.map(r => (
                                                <option key={r.id} value={r.id}>{translateTerm(r.id, lang)}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="pt-1 space-y-2 border-t border-[#453745]/60">
                                    <label className="flex items-center gap-2 text-xs text-gray-200 font-semibold cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={itemForm.requiresAttunement}
                                            onChange={e => updateItemField('requiresAttunement', e.target.checked)}
                                            className="accent-[#FF1457] w-4 h-4 rounded"
                                        />
                                        {t.requiresAttunement}
                                    </label>
                                    {itemForm.requiresAttunement && (
                                        <input
                                            type="text"
                                            placeholder={t.attunementDetail}
                                            value={itemForm.attunementDetail}
                                            onChange={e => updateItemField('attunementDetail', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs outline-none focus:border-[#FF1457]"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Estatísticas de Combate / Equipamento */}
                            <div className="bg-[#35313B] p-4 rounded-2xl border border-[#453745] space-y-3 shadow-md">
                                <h4 className="font-bold text-[#FF1457] text-xs uppercase tracking-wider border-b border-[#453745] pb-1.5">
                                    {lang === 'pt' ? 'Estatísticas & Propriedades' : 'Stats & Properties'}
                                </h4>

                                {itemForm.category === 'Weapon' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-xs text-gray-400 font-semibold mb-1 block">{t.damageDice}</label>
                                                <input
                                                    type="text"
                                                    placeholder="1d8"
                                                    value={itemForm.damageDice}
                                                    onChange={e => updateItemField('damageDice', e.target.value)}
                                                    className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs font-bold outline-none focus:border-[#FF1457]"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-400 font-semibold mb-1 block">{t.damageType}</label>
                                                <select
                                                    value={itemForm.damageType}
                                                    onChange={e => updateItemField('damageType', e.target.value)}
                                                    className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs font-bold outline-none focus:border-[#FF1457]"
                                                >
                                                    {DAMAGE_TYPES.map(dt => (
                                                        <option key={dt} value={dt}>{translateTerm(dt, lang)}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs text-gray-400 font-semibold mb-1.5 block">{t.weaponProperties}</label>
                                            <div className="flex flex-wrap gap-1.5">
                                                {WEAPON_PROPERTIES.map(prop => {
                                                    const active = itemForm.properties.includes(prop);
                                                    return (
                                                        <button
                                                            key={prop}
                                                            type="button"
                                                            onClick={() => toggleWeaponProperty(prop)}
                                                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                                                                active
                                                                    ? 'bg-[#FF1457] text-white border-[#FF1457]'
                                                                    : 'bg-[#2B2C30] text-gray-400 border-[#453745] hover:text-white'
                                                            }`}
                                                        >
                                                            {translateTerm(prop, lang)}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {(itemForm.category === 'Armor' || itemForm.category === 'Shield') && (
                                    <div>
                                        <label className="text-xs text-gray-400 font-semibold mb-1 block">{t.armorClassString}</label>
                                        <input
                                            type="text"
                                            placeholder={itemForm.category === 'Shield' ? '+2 CA' : '15 + Mod. DES (máx 2)'}
                                            value={itemForm.acString}
                                            onChange={e => updateItemField('acString', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs font-bold outline-none focus:border-[#FF1457]"
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[11px] text-gray-400 font-semibold mb-1 block">{t.itemCost}</label>
                                        <input
                                            type="text"
                                            placeholder={lang === 'pt' ? itemPowerResult.defaultCostPt : itemPowerResult.defaultCostEn}
                                            value={itemForm.cost}
                                            onChange={e => updateItemField('cost', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs outline-none focus:border-[#FF1457]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] text-gray-400 font-semibold mb-1 block">{t.itemWeight}</label>
                                        <input
                                            type="text"
                                            placeholder="1.5 kg / 3 lb."
                                            value={itemForm.weight}
                                            onChange={e => updateItemField('weight', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs outline-none focus:border-[#FF1457]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 font-semibold mb-1 block uppercase">
                                        {lang === 'pt' ? 'Descrição & Efeitos Mágicos' : 'Description & Magical Effects'}
                                    </label>
                                    <textarea
                                        rows={4}
                                        placeholder={t.itemDescPlaceholder}
                                        value={itemForm.desc}
                                        onChange={e => updateItemField('desc', e.target.value)}
                                        className="w-full bg-[#2B2C30] border border-[#453745] text-gray-200 rounded-xl p-3 text-xs outline-none focus:border-[#FF1457] leading-relaxed"
                                    />
                                </div>
                            </div>

                            {/* Botões de Salvar Item */}
                            <div className="space-y-2 pt-2">
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-[#453745] hover:bg-[#613C4C] border border-[#613C4C] text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs transition-colors"
                                    >
                                        <Check size={16} /> {t.saveHomebrewItem}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => handleSaveHomebrewItem(e, true)}
                                        className="flex-1 bg-gradient-to-r from-[#FF1457] to-[#613C4C] hover:opacity-90 text-white font-black py-3.5 rounded-xl shadow-lg shadow-[#FF1457]/30 flex items-center justify-center gap-2 text-xs transition-all"
                                    >
                                        <Book size={16} /> {t.save} & {t.sendToCompendium}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {itemActiveTab === 'list' && (
                        <div className="space-y-3 animate-in fade-in">
                            {homebrewItems.length === 0 ? (
                                <div className="text-center py-12 text-gray-500 italic bg-[#35313B] rounded-2xl border border-[#453745] border-dashed p-6">
                                    <Gem size={40} className="mx-auto mb-2 opacity-40 text-[#FF1457]" />
                                    <p>{t.noHomebrewItems}</p>
                                </div>
                            ) : (
                                homebrewItems.map(item => {
                                    const isExp = !!expandedItems[item.slug];
                                    const inComp = isInCompendium(item.slug);
                                    return (
                                        <div key={item.slug} className="bg-[#35313B] rounded-2xl overflow-hidden border border-[#453745] shadow-md">
                                            <div
                                                onClick={() => setExpandedItems(prev => ({ ...prev, [item.slug]: !isExp }))}
                                                className="p-4 flex justify-between items-center cursor-pointer hover:bg-[#453745]/50 transition-colors"
                                            >
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className="font-bold text-white leading-tight">{item.name}</h4>
                                                        {inComp && (
                                                            <span className="text-[10px] font-bold bg-[#FF1457]/20 text-[#FF1457] px-2 py-0.5 rounded-full border border-[#FF1457]/40">
                                                                {t.inCompendium}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {translateTerm(item.type, lang)} • {translateTerm(item.rarity, lang)}
                                                        {item.cost ? ` • ${item.cost}` : ''}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => handleEditHomebrewItem(item)}
                                                        className="p-2 text-gray-400 hover:text-white bg-[#2B2C30] rounded-lg border border-[#453745]"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDeleteItemSlug(item.slug)}
                                                        className="p-2 text-gray-400 hover:text-[#FF1457] bg-[#2B2C30] rounded-lg border border-[#453745]"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <span className="text-gray-500 pl-1">
                                                        {isExp ? <X size={18} /> : <ArrowRight size={18} className="rotate-90" />}
                                                    </span>
                                                </div>
                                            </div>

                                            {isExp && (
                                                <div className="p-4 bg-[#2B2C30] border-t border-[#453745] space-y-3">
                                                    <div className="flex flex-wrap gap-2">
                                                        {!inComp ? (
                                                            <button
                                                                onClick={() => sendHomebrewToItems(item)}
                                                                className="flex-1 bg-[#FF1457] hover:opacity-90 text-white py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                                                            >
                                                                <Book size={14} /> {t.sendToCompendium}
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => removeItemFromCompendium(item.slug, item.name)}
                                                                className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-gray-200 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 border border-[#613C4C]"
                                                            >
                                                                <X size={14} /> {t.removeFromCompendium}
                                                            </button>
                                                        )}
                                                    </div>
                                                    {renderItemDetails(item, lang)}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ============================================================== */}
            {/* ABA 3: CRIADOR DE MAGIAS HOMEBREW                              */}
            {/* ============================================================== */}
            {homebrewCategory === 'spells' && (
                <div className="animate-in fade-in">
                    <div className="flex bg-[#35313B] p-1 rounded-xl mb-4 border border-[#453745] shadow-inner">
                        <button
                            onClick={() => setSpellActiveTab('create')}
                            className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${spellActiveTab === 'create' ? 'bg-[#FF1457] text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Sparkles size={14} /> {t.createHomebrewSpell}
                        </button>
                        <button
                            onClick={() => setSpellActiveTab('list')}
                            className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${spellActiveTab === 'list' ? 'bg-[#FF1457] text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Wand2 size={14} /> {t.myHomebrewSpells} ({homebrewSpells.length})
                        </button>
                    </div>

                    {spellActiveTab === 'create' && (
                        <form onSubmit={(e) => handleSaveHomebrewSpell(e, false)} className="space-y-4">
                            {/* Painel de Círculo & Balanceamento de Magia ao Vivo (DMG p. 283-284) */}
                            <div className="bg-gradient-to-br from-[#613C4C] to-[#35313B] p-4 rounded-2xl border border-[#FF1457]/50 shadow-lg sticky top-[68px] z-20 backdrop-blur-md">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-200 flex items-center gap-1.5">
                                        <Wand2 size={14} className="text-[#FF1457]" /> {t.calculatedSpellLevel} (DMG)
                                    </span>
                                    {editingSpellSlug && (
                                        <button
                                            type="button"
                                            onClick={() => { setEditingSpellSlug(null); setSpellForm(initialSpellFormState); }}
                                            className="text-[10px] bg-[#2B2C30] px-2 py-1 rounded text-gray-300 hover:text-white"
                                        >
                                            {t.cancel}
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-[#2B2C30]/80 p-2 rounded-xl border border-[#FF1457]/40">
                                        <div className="text-sm font-black text-[#FF1457] truncate">
                                            {spellPowerResult.level === 0
                                                ? (lang === 'pt' ? 'Truque (0)' : 'Cantrip (0)')
                                                : (lang === 'pt' ? `${spellPowerResult.level}º Círculo` : `Level ${spellPowerResult.level}`)}
                                        </div>
                                        <div className="text-[9px] text-gray-400 uppercase font-bold">
                                            {translateTerm(spellForm.school, lang)}
                                        </div>
                                    </div>
                                    <div className="bg-[#2B2C30]/80 p-2 rounded-xl border border-[#453745]">
                                        <div className="text-xs font-bold text-white truncate">
                                            {spellForm.targetScope === 'aoe' ? spellPowerResult.benchmarkMultiDice : spellPowerResult.benchmarkSingleDice}
                                        </div>
                                        <div className="text-[9px] text-gray-400 uppercase">
                                            {t.benchmarkDamage} (~{spellPowerResult.benchmarkAvg})
                                        </div>
                                    </div>
                                    <div className="bg-[#2B2C30]/80 p-2 rounded-xl border border-[#453745]">
                                        <div className="text-sm font-bold text-white">Nv. {spellPowerResult.minCasterLevel}+</div>
                                        <div className="text-[9px] text-gray-400 uppercase">
                                            {translateTerm(spellPowerResult.scrollRarity, lang)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Identidade & Escola da Magia */}
                            <div className="bg-[#35313B] p-4 rounded-2xl border border-[#453745] space-y-3">
                                <h3 className="text-xs font-bold text-[#FF1457] uppercase tracking-wider flex items-center gap-1.5">
                                    <Wand2 size={14} /> {lang === 'pt' ? 'Identidade & Escola da Magia' : 'Spell Identity & School'}
                                </h3>
                                <div>
                                    <label className="text-xs text-gray-400 font-semibold mb-1 block">{t.spellName} *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder={lang === 'pt' ? 'Ex: Lança Astral de Hércules' : 'e.g., Astral Lance'}
                                        value={spellForm.name}
                                        onChange={e => updateSpellField('name', e.target.value)}
                                        className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-3 text-sm outline-none focus:border-[#FF1457]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-gray-400 font-semibold mb-1 block">{t.spellSchool}</label>
                                        <select
                                            value={spellForm.school}
                                            onChange={e => updateSpellField('school', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs font-bold outline-none focus:border-[#FF1457]"
                                        >
                                            {SPELL_SCHOOLS.map(sch => (
                                                <option key={sch} value={sch}>
                                                    {translateTerm(sch, lang)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 font-semibold mb-1 block">{t.castingTime}</label>
                                        <select
                                            value={spellForm.castingTime}
                                            onChange={e => updateSpellField('castingTime', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs font-bold outline-none focus:border-[#FF1457]"
                                        >
                                            {CASTING_TIME_PRESETS.map(ct => (
                                                <option key={ct.id} value={ct.id}>
                                                    {lang === 'pt' ? ct.pt : ct.en}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-gray-400 font-semibold mb-1 block">{t.range}</label>
                                        <select
                                            value={spellForm.range}
                                            onChange={e => updateSpellField('range', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs font-bold outline-none focus:border-[#FF1457]"
                                        >
                                            {RANGE_PRESETS.map(rg => (
                                                <option key={rg.id} value={rg.id}>
                                                    {lang === 'pt' ? rg.pt : rg.en}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 font-semibold mb-1 block">{t.duration}</label>
                                        <select
                                            value={spellForm.duration}
                                            onChange={e => updateSpellField('duration', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs font-bold outline-none focus:border-[#FF1457]"
                                        >
                                            {DURATION_PRESETS.map(dur => (
                                                <option key={dur.id} value={dur.id}>
                                                    {lang === 'pt' ? dur.pt : dur.en}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Tags de Concentração e Ritual */}
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer bg-[#2B2C30] p-2.5 rounded-xl border border-[#453745]">
                                        <input
                                            type="checkbox"
                                            checked={spellForm.concentration}
                                            onChange={e => updateSpellField('concentration', e.target.checked)}
                                            className="accent-[#FF1457] w-4 h-4"
                                        />
                                        <span className="font-bold">{t.concentration} (C)</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer bg-[#2B2C30] p-2.5 rounded-xl border border-[#453745]">
                                        <input
                                            type="checkbox"
                                            checked={spellForm.ritual}
                                            onChange={e => updateSpellField('ritual', e.target.checked)}
                                            className="accent-[#FF1457] w-4 h-4"
                                        />
                                        <span className="font-bold">{t.ritual} (R)</span>
                                    </label>
                                </div>
                            </div>

                            {/* Calculadora de Círculo & Poder da Magia (DMG p. 283-284) */}
                            <div className="bg-[#35313B] p-4 rounded-2xl border border-[#453745] space-y-3">
                                <h3 className="text-xs font-bold text-[#FF1457] uppercase tracking-wider flex items-center gap-1.5">
                                    <Sparkles size={14} /> {lang === 'pt' ? 'Poder & Cálculo de Círculo (DMG)' : 'Spell Power & Level Calculator (DMG)'}
                                </h3>

                                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer bg-[#2B2C30] p-2.5 rounded-xl border border-[#453745]">
                                    <input
                                        type="checkbox"
                                        checked={spellForm.autoLevel}
                                        onChange={e => updateSpellField('autoLevel', e.target.checked)}
                                        className="accent-[#FF1457] w-4 h-4"
                                    />
                                    <span className="font-bold">{t.autoSpellLevel}</span>
                                </label>

                                {!spellForm.autoLevel && (
                                    <div>
                                        <label className="text-[11px] text-gray-400 font-semibold mb-1 block">{t.spellLevel}</label>
                                        <select
                                            value={spellForm.manualLevel}
                                            onChange={e => updateSpellField('manualLevel', Number(e.target.value))}
                                            className="w-full bg-[#2B2C30] border border-[#FF1457]/50 text-white rounded-xl p-2.5 text-xs font-bold outline-none focus:border-[#FF1457]"
                                        >
                                            {SPELL_LEVEL_TABLE.map(row => (
                                                <option key={row.level} value={row.level}>
                                                    {row.level === 0
                                                        ? t.cantrips
                                                        : (lang === 'pt' ? `${row.level}º Círculo` : `Level ${row.level}`)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[11px] text-gray-400 font-semibold mb-1 block">{t.damageDice}</label>
                                        <input
                                            type="text"
                                            placeholder="2d10, 8d6, 0..."
                                            value={spellForm.damageDice}
                                            onChange={e => updateSpellField('damageDice', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs font-bold outline-none focus:border-[#FF1457]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] text-gray-400 font-semibold mb-1 block">{t.damageType}</label>
                                        <select
                                            value={spellForm.damageType}
                                            onChange={e => updateSpellField('damageType', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs font-bold outline-none focus:border-[#FF1457]"
                                        >
                                            {DAMAGE_TYPES.map(dt => (
                                                <option key={dt} value={dt}>{translateTerm(dt, lang)}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[11px] text-gray-400 font-semibold mb-1 block">{t.spellTargetScope}</label>
                                        <select
                                            value={spellForm.targetScope}
                                            onChange={e => updateSpellField('targetScope', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs font-bold outline-none focus:border-[#FF1457]"
                                        >
                                            <option value="single">{t.singleTarget}</option>
                                            <option value="aoe">{t.multiTargetAoE}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[11px] text-gray-400 font-semibold mb-1 block">{t.spellControlTier}</label>
                                        <select
                                            value={spellForm.effectTier}
                                            onChange={e => updateSpellField('effectTier', Number(e.target.value))}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs font-bold outline-none focus:border-[#FF1457]"
                                        >
                                            {SPELL_CONTROL_OPTIONS.map(opt => (
                                                <option key={opt.val} value={opt.val}>{lang === 'pt' ? opt.pt : opt.en}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer bg-[#2B2C30] p-2.5 rounded-xl border border-[#453745]">
                                    <input
                                        type="checkbox"
                                        checked={spellForm.halfOnSave}
                                        onChange={e => updateSpellField('halfOnSave', e.target.checked)}
                                        className="accent-[#FF1457] w-4 h-4"
                                    />
                                    <span>{t.halfDamageOnSave}</span>
                                </label>
                            </div>

                            {/* Componentes (V, S, M) e Classes Conjuradoras */}
                            <div className="bg-[#35313B] p-4 rounded-2xl border border-[#453745] space-y-3">
                                <h3 className="text-xs font-bold text-[#FF1457] uppercase tracking-wider flex items-center gap-1.5">
                                    <Book size={14} /> {t.components} & {t.spellClasses}
                                </h3>

                                <div>
                                    <label className="text-[11px] text-gray-400 font-semibold mb-1.5 block uppercase">{t.components}</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { key: 'verbal', label: 'Verbal (V)' },
                                            { key: 'somatic', label: lang === 'pt' ? 'Somático (S)' : 'Somatic (S)' },
                                            { key: 'material', label: 'Material (M)' }
                                        ].map(comp => {
                                            const active = !!spellForm[comp.key];
                                            return (
                                                <button
                                                    key={comp.key}
                                                    type="button"
                                                    onClick={() => updateSpellField(comp.key, !active)}
                                                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                                                        active
                                                            ? 'bg-[#FF1457]/20 border-[#FF1457] text-[#FF1457]'
                                                            : 'bg-[#2B2C30] border-[#453745] text-gray-400 hover:text-white'
                                                    }`}
                                                >
                                                    {comp.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {spellForm.material && (
                                    <div>
                                        <label className="text-[11px] text-gray-400 font-semibold mb-1 block">{t.materialComponentDesc}</label>
                                        <input
                                            type="text"
                                            placeholder={lang === 'pt' ? 'Ex: um rubi em pó valendo 100 PO' : 'e.g., powdered ruby worth 100 GP'}
                                            value={spellForm.materialDesc}
                                            onChange={e => updateSpellField('materialDesc', e.target.value)}
                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs outline-none focus:border-[#FF1457]"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="text-[11px] text-gray-400 font-semibold mb-1.5 block uppercase">{t.spellClasses}</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {SPELL_CLASSES.map(cls => {
                                            const active = spellForm.classes.includes(cls);
                                            return (
                                                <button
                                                    key={cls}
                                                    type="button"
                                                    onClick={() => toggleSpellClass(cls)}
                                                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                                                        active
                                                            ? 'bg-[#FF1457]/20 border-[#FF1457] text-[#FF1457]'
                                                            : 'bg-[#2B2C30] border-[#453745] text-gray-400 hover:text-white'
                                                    }`}
                                                >
                                                    {translateTerm(cls, lang)}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 font-semibold mb-1 block uppercase">
                                        {lang === 'pt' ? 'Descrição da Magia' : 'Spell Description'}
                                    </label>
                                    <textarea
                                        rows={4}
                                        placeholder={t.spellDescPlaceholder}
                                        value={spellForm.desc}
                                        onChange={e => updateSpellField('desc', e.target.value)}
                                        className="w-full bg-[#2B2C30] border border-[#453745] text-gray-200 rounded-xl p-3 text-xs outline-none focus:border-[#FF1457] leading-relaxed"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 font-semibold mb-1 block uppercase">
                                        {t.higherLevelsDesc}
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder={lang === 'pt' ? 'Ex: O dano aumenta em 1d10 para cada círculo acima do 1º.' : 'e.g., The damage increases by 1d10 for each spell slot level above 1st.'}
                                        value={spellForm.higherLevel}
                                        onChange={e => updateSpellField('higherLevel', e.target.value)}
                                        className="w-full bg-[#2B2C30] border border-[#453745] text-gray-200 rounded-xl p-3 text-xs outline-none focus:border-[#FF1457] leading-relaxed"
                                    />
                                </div>
                            </div>

                            {/* Botões de Salvar Magia */}
                            <div className="space-y-2 pt-2">
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-[#453745] hover:bg-[#613C4C] border border-[#613C4C] text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs transition-colors"
                                    >
                                        <Check size={16} /> {t.saveHomebrewSpell}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => handleSaveHomebrewSpell(e, true)}
                                        className="flex-1 bg-gradient-to-r from-[#FF1457] to-[#613C4C] hover:opacity-90 text-white font-black py-3.5 rounded-xl shadow-lg shadow-[#FF1457]/30 flex items-center justify-center gap-2 text-xs transition-all"
                                    >
                                        <Wand2 size={16} /> {t.save} & {t.sendToGrimoire}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {spellActiveTab === 'list' && (
                        <div className="space-y-3 animate-in fade-in">
                            {homebrewSpells.length === 0 ? (
                                <div className="text-center py-12 text-gray-500 italic bg-[#35313B] rounded-2xl border border-[#453745] border-dashed p-6">
                                    <Wand2 size={40} className="mx-auto mb-2 opacity-40 text-[#FF1457]" />
                                    <p>{t.noHomebrewSpells}</p>
                                </div>
                            ) : (
                                homebrewSpells.map(spell => {
                                    const isExp = !!expandedSpells[spell.slug];
                                    const inGrim = isInGrimoire(spell.slug);
                                    const schoolName = typeof spell.school === 'object' ? (spell.school?.name || '') : String(spell.school || '');
                                    const lvlText = (spell.level ?? 0) === 0
                                        ? t.cantrips
                                        : (lang === 'pt' ? `${spell.level}º Círculo` : `Level ${spell.level}`);

                                    return (
                                        <div key={spell.slug} className="bg-[#35313B] rounded-2xl overflow-hidden border border-[#453745] shadow-md">
                                            <div
                                                onClick={() => setExpandedSpells(prev => ({ ...prev, [spell.slug]: !isExp }))}
                                                className="p-4 flex justify-between items-center cursor-pointer hover:bg-[#453745]/50 transition-colors"
                                            >
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className="font-bold text-white leading-tight">{spell.name}</h4>
                                                        {inGrim && (
                                                            <span className="text-[10px] font-bold bg-[#FF1457]/20 text-[#FF1457] px-2 py-0.5 rounded-full border border-[#FF1457]/40">
                                                                {t.inGrimoire}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {lvlText} • {translateTerm(schoolName, lang)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => handleEditHomebrewSpell(spell)}
                                                        className="p-2 text-gray-400 hover:text-white bg-[#2B2C30] rounded-lg border border-[#453745]"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDeleteSpellSlug(spell.slug)}
                                                        className="p-2 text-gray-400 hover:text-[#FF1457] bg-[#2B2C30] rounded-lg border border-[#453745]"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <span className="text-gray-500 pl-1">
                                                        {isExp ? <X size={18} /> : <ArrowRight size={18} className="rotate-90" />}
                                                    </span>
                                                </div>
                                            </div>

                                            {isExp && (
                                                <div className="p-4 bg-[#2B2C30] border-t border-[#453745] space-y-3">
                                                    <div className="flex flex-wrap gap-2">
                                                        {!inGrim ? (
                                                            <button
                                                                onClick={() => sendHomebrewToGrimoire(spell)}
                                                                className="flex-1 bg-[#FF1457] hover:opacity-90 text-white py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                                                            >
                                                                <Wand2 size={14} /> {t.sendToGrimoire}
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => removeSpellFromGrimoire(spell.slug, spell.name)}
                                                                className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-gray-200 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 border border-[#613C4C]"
                                                            >
                                                                <X size={14} /> {t.removeFromGrimoire}
                                                            </button>
                                                        )}
                                                    </div>
                                                    <SpellDetailsCard spell={spell} lang={lang} t={t} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Modal de Confirmação de Exclusão de Monstro Homebrew */}
            {confirmDeleteSlug && (
                <div className="fixed inset-0 bg-[#2B2C30]/90 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#35313B] p-6 rounded-2xl border border-[#FF1457]/50 shadow-2xl max-w-sm w-full text-center">
                        <Trash2 size={40} className="mx-auto text-[#FF1457] mb-3" />
                        <p className="text-white font-bold mb-6 text-sm">{t.deleteHomebrewConfirm}</p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmDeleteSlug(null)} className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-white font-bold py-2.5 rounded-xl text-sm">
                                {t.cancel}
                            </button>
                            <button onClick={() => handleDeleteHomebrew(confirmDeleteSlug)} className="flex-1 bg-[#FF1457] hover:bg-[#d10e46] text-white font-bold py-2.5 rounded-xl text-sm">
                                <Trash2 size={16} className="inline mr-1" /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Exclusão de Item Homebrew */}
            {confirmDeleteItemSlug && (
                <div className="fixed inset-0 bg-[#2B2C30]/90 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#35313B] p-6 rounded-2xl border border-[#FF1457]/50 shadow-2xl max-w-sm w-full text-center">
                        <Trash2 size={40} className="mx-auto text-[#FF1457] mb-3" />
                        <p className="text-white font-bold mb-6 text-sm">{t.deleteHomebrewItemConfirm}</p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmDeleteItemSlug(null)} className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-white font-bold py-2.5 rounded-xl text-sm">
                                {t.cancel}
                            </button>
                            <button onClick={() => handleDeleteHomebrewItem(confirmDeleteItemSlug)} className="flex-1 bg-[#FF1457] hover:bg-[#d10e46] text-white font-bold py-2.5 rounded-xl text-sm">
                                <Trash2 size={16} className="inline mr-1" /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Exclusão de Magia Homebrew */}
            {confirmDeleteSpellSlug && (
                <div className="fixed inset-0 bg-[#2B2C30]/90 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#35313B] p-6 rounded-2xl border border-[#FF1457]/50 shadow-2xl max-w-sm w-full text-center">
                        <Trash2 size={40} className="mx-auto text-[#FF1457] mb-3" />
                        <p className="text-white font-bold mb-6 text-sm">{t.deleteHomebrewSpellConfirm}</p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmDeleteSpellSlug(null)} className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-white font-bold py-2.5 rounded-xl text-sm">
                                {t.cancel}
                            </button>
                            <button onClick={() => handleDeleteHomebrewSpell(confirmDeleteSpellSlug)} className="flex-1 bg-[#FF1457] hover:bg-[#d10e46] text-white font-bold py-2.5 rounded-xl text-sm">
                                <Trash2 size={16} className="inline mr-1" /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
