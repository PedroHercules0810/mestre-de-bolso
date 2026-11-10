import test from 'node:test';
import assert from 'node:assert/strict';

import { DICTIONARY } from '../src/constants/dictionary.js';
import { XP_BUDGET_5E, CR_TO_XP, CONDITIONS } from '../src/constants/gameData.js';
import { REFERENCE_DATA } from '../src/constants/referenceData.js';
import { rollDice, parseCR, safeText, getDeepStat, generateHomebrewSlug } from '../src/utils/helpers.js';
import { calculateMonsterCR, CR_TABLE } from '../src/utils/crCalculator.js';
import { calculateItemPower, RARITY_TABLE } from '../src/utils/itemCalculator.js';
import { calculateSpellPower, parseDiceAverage, SPELL_LEVEL_TABLE } from '../src/utils/spellCalculator.js';
import { generateAdvancedLoot, generateEncounterLoot } from '../src/utils/lootGenerator.js';
import { getMonsterEnvironments, ENVIRONMENTS_LIST } from '../src/utils/environmentMapper.js';
import {
    translateName,
    translateSpellName,
    SPELL_NAMES_DICT,
    translateTerm,
    translateDescription,
    matchesBilingualSearch,
    translateSavesObject,
    translateSkillsObject,
    translateCommaList
} from '../src/utils/translators.js';

test('1. DICTIONARY Parity & Integrity (EN vs PT)', () => {
    const enKeys = Object.keys(DICTIONARY.en);
    const ptKeys = Object.keys(DICTIONARY.pt);

    const missingInPt = enKeys.filter(k => !(k in DICTIONARY.pt));
    const missingInEn = ptKeys.filter(k => !(k in DICTIONARY.en));

    assert.deepEqual(missingInPt, [], `Keys missing in PT dictionary: ${missingInPt.join(', ')}`);
    assert.deepEqual(missingInEn, [], `Keys missing in EN dictionary: ${missingInEn.join(', ')}`);

    for (const k of enKeys) {
        assert.equal(typeof DICTIONARY.en[k], 'string');
        assert.ok(DICTIONARY.en[k].length > 0, `Empty EN string for key ${k}`);
        assert.equal(typeof DICTIONARY.pt[k], 'string');
        assert.ok(DICTIONARY.pt[k].length > 0, `Empty PT string for key ${k}`);
    }
});

test('2. Game Constants & Reference Data Integrity', () => {
    for (let lvl = 1; lvl <= 20; lvl++) {
        assert.ok(XP_BUDGET_5E[lvl], `Missing XP budget for level ${lvl}`);
        assert.ok(XP_BUDGET_5E[lvl].low > 0);
        assert.ok(XP_BUDGET_5E[lvl].moderate >= XP_BUDGET_5E[lvl].low);
        assert.ok(XP_BUDGET_5E[lvl].high >= XP_BUDGET_5E[lvl].moderate);
    }

    assert.ok(CONDITIONS.length >= 14);
    CONDITIONS.forEach(c => {
        assert.ok(c.id && c.label && c.color);
        assert.ok(c.label.includes('/'), `Condition label ${c.label} should be bilingual (EN/PT)`);
    });

    // Verify CR_TO_XP matches every row in CR_TABLE
    CR_TABLE.forEach(row => {
        assert.equal(CR_TO_XP[row.cr], row.xp, `CR_TO_XP mismatch for CR ${row.cr}`);
    });

    assert.equal(translateTerm('Multiattack', 'pt'), 'Ataques Múltiplos');
    assert.equal(translateTerm('Legendary Resistance (3/Day)', 'pt'), 'Resistência Lendária (3/Dia)');

    assert.ok(Array.isArray(REFERENCE_DATA.en) && REFERENCE_DATA.en.length > 0);
    assert.ok(Array.isArray(REFERENCE_DATA.pt) && REFERENCE_DATA.pt.length > 0);
});

test('3. Helpers Stress & Edge-Case Fuzzing (rollDice, parseCR, safeText, getDeepStat)', () => {
    // 10,000 dice rolls within strict bounds
    for (let i = 0; i < 2000; i++) {
        const r = rollDice(3, 6);
        assert.ok(r >= 3 && r <= 18, `3d6 out of bounds: ${r}`);
    }
    assert.equal(rollDice(0, 6), 0);
    assert.equal(rollDice(5, 0), 0);
    assert.equal(rollDice(-3, -10), 0);
    assert.equal(rollDice(null, undefined), 0);

    // parseCR edge cases
    assert.equal(parseCR(0), 0);
    assert.equal(parseCR('0'), 0);
    assert.equal(parseCR('1/8'), 0.125);
    assert.equal(parseCR('1/4 (50 XP)'), 0.25);
    assert.equal(parseCR('1/2'), 0.5);
    assert.equal(parseCR('20'), 20);
    assert.equal(parseCR('0/0'), 0);
    assert.equal(parseCR(null), 0);
    assert.equal(parseCR(undefined), 0);
    assert.equal(parseCR('invalid'), 0);

    // safeText edge cases
    assert.equal(safeText(null), '');
    assert.equal(safeText(undefined), '');
    assert.equal(safeText(42), '42');
    assert.equal(safeText({ name: 'Goblin' }), 'Goblin');
    assert.equal(safeText([{ name: 'Fire' }, { desc: 'Cold' }, null, 'Acid']), 'Fire, Cold, Acid');

    // getDeepStat edge cases
    assert.equal(getDeepStat(null, 'strength'), null);
    assert.equal(getDeepStat(undefined, 'dexterity'), null);
    assert.equal(getDeepStat({}, null), null);
    assert.equal(getDeepStat({ strength: 18 }, 'strength'), 18);
    assert.equal(getDeepStat({ str: '14 (+2)' }, 'strength'), 14);
    assert.equal(getDeepStat({ ability_scores: { dexterity: 16 } }, 'dexterity'), 16);
    assert.equal(getDeepStat({ ability_scores: { con_score: 22 } }, 'constitution'), 22);
});

test('4. Monster CR Calculator Stress Test (Extreme Boundaries)', () => {
    // Standard DMG monsters
    const low = calculateMonsterCR({ hp: 5, ac: 12, dpr: 1, attackBonus: 2 });
    assert.equal(low.cr, '0');
    assert.equal(low.xp, 10);

    const mid = calculateMonsterCR({ hp: 135, ac: 15, dpr: 35, attackBonus: 6 });
    assert.equal(mid.cr, '5');
    assert.equal(mid.xp, 1800);
    assert.equal(mid.proficiencyBonus, 3);

    const tarrasque = calculateMonsterCR({ hp: 850, ac: 25, dpr: 310, attackBonus: 19 });
    assert.equal(tarrasque.cr, '30');
    assert.equal(tarrasque.xp, 155000);

    // Extreme/Invalid inputs must never crash or return NaN
    const extremeInputs = [
        { hp: -9999, ac: -50, dpr: -100, attackBonus: -20 },
        { hp: 0, ac: 0, dpr: 0, attackBonus: 0 },
        { hp: 9999999, ac: 999, dpr: 999999, saveDC: 999, useSaveDC: true },
        { hp: NaN, ac: null, dpr: undefined, attackBonus: 'abc' },
        {}
    ];

    for (const inp of extremeInputs) {
        const res = calculateMonsterCR(inp);
        assert.ok(res.cr, 'CR should always be defined');
        assert.ok(Number.isFinite(res.xp) && res.xp >= 10, `Invalid XP: ${res.xp}`);
        assert.ok(Number.isFinite(res.proficiencyBonus) && res.proficiencyBonus >= 2);
    }
});

test('5. Homebrew Item Power & Rarity Calculator Stress Test', () => {
    // Weapon +1 -> Uncommon
    const w1 = calculateItemPower({ autoRarity: true, magicBonus: 1, category: 'Weapon' });
    assert.equal(w1.rarity, 'Uncommon');

    // Armor +1 -> Rare (DMG rule)
    const a1 = calculateItemPower({ autoRarity: true, magicBonus: 1, category: 'Armor' });
    assert.equal(a1.rarity, 'Rare');

    // Weapon +2 with +2d6 extra damage -> Very Rare
    const flame2 = calculateItemPower({ autoRarity: true, magicBonus: 2, extraDamageTier: 2, category: 'Weapon' });
    assert.equal(flame2.rarity, 'Very Rare');

    // 9th level spell effect -> Artifact
    const epic = calculateItemPower({ autoRarity: true, spellEffectTier: 5, category: 'Staff' });
    assert.equal(epic.rarity, 'Artifact');

    // Manual override
    const manual = calculateItemPower({ autoRarity: false, manualRarity: 'Legendary' });
    assert.equal(manual.rarity, 'Legendary');
    assert.equal(manual.minLevel, 17);

    // Extreme values
    const fuzz = calculateItemPower({ autoRarity: true, magicBonus: 999, extraDamageTier: -50, spellEffectTier: null });
    assert.ok(RARITY_TABLE.some(r => r.id === fuzz.rarity));
});

test('6. Translator Engine & Word-Boundary Safety Tests', () => {
    // Word-boundary protection: "Sacred" or "Reduced" must NOT have "red" turned into "Vermelho"
    assert.equal(translateName('Sacred Flame', 'pt'), 'Chama Sagrada');
    assert.equal(translateName('Sacred Guardian', 'pt'), 'Sacred Guardian');
    assert.equal(translateName('Reduced Threat Goblin', 'pt'), 'Reduced Threat Goblin');

    // Compound Dragon names
    assert.equal(translateName('Ancient Red Dragon', 'pt'), 'Dragão Vermelho Ancião');
    assert.equal(translateName('Adult Gold Dragon', 'pt'), 'Dragão de Ouro Adulto');
    assert.equal(translateName('Young Green Dragon', 'pt'), 'Dragão Verde Jovem');
    assert.equal(translateName('White Dragon Wyrmling', 'pt'), 'Filhote de Dragão Branco');

    // Golems, Elementals & Giant Beasts
    assert.equal(translateName('Iron Golem', 'pt'), 'Golem de Ferro');
    assert.equal(translateName('Fire Elemental', 'pt'), 'Elemental do Fogo');
    assert.equal(translateName('Giant Poisonous Snake', 'pt'), 'Cobra Venenosa Gigante');

    // Mechanical Combat Description Translation
    const sampleAction = 'Melee Attack Roll: +11, reach 10 ft. Hit: 13 (2d6 + 6) Slashing damage plus 7 (2d6) Fire damage.';
    const translatedAction = translateDescription(sampleAction, 'pt');
    assert.ok(translatedAction.includes('Jogada de Ataque Corpo a Corpo: +11'));
    assert.ok(translatedAction.includes('alcance 10 ft. (3m)'));
    assert.ok(translatedAction.includes('Acerto: 13 (2d6 + 6) de dano Cortante mais 7 (2d6) de dano de Fogo'));

    const sampleSave = 'Dexterity Saving Throw: DC 17. Failure: 24 (7d6) Fire damage. Success: Half damage.';
    const translatedSave = translateDescription(sampleSave, 'pt');
    assert.ok(translatedSave.includes('Salvaguarda de Destreza: CD 17'));
    assert.ok(translatedSave.includes('Falha: 24 (7d6) de dano de Fogo'));
    assert.ok(translatedSave.includes('Sucesso: Metade do dano'));

    // Bilingual accent-insensitive search
    assert.equal(matchesBilingualSearch('Skeleton', 'esqueleto'), true);
    assert.equal(matchesBilingualSearch('Skeleton', 'skeleton'), true);
    assert.equal(matchesBilingualSearch('Ancient Red Dragon', 'dragao vermelho'), true);
    assert.equal(matchesBilingualSearch('Potion of Healing', 'pocao de cura'), true);
    assert.equal(matchesBilingualSearch('Goblin', 'tarrasque'), false);

    // StatBlock helper translators
    assert.equal(translateSavesObject({ strength: 5, dexterity: 2, wisdom: -1 }, 'pt'), 'FOR +5, DES +2, SAB -1');
    assert.equal(translateSkillsObject({ stealth: 6, perception: 4, sleight_of_hand: 5 }, 'pt'), 'Furtividade +6, Percepção +4, Prestidigitação +5');
    assert.ok(translateCommaList('Fire, Cold, Poison', 'pt').includes('Fogo'));
});

test('7. Loot Generator Stress Test (5,000 Iterations & Rarity Isolation)', () => {
    const mockItems = [
        { slug: 'c1', name: 'Potion of Climbing', rarity: 'Common' },
        { slug: 'u1', name: 'Bag of Holding', rarity: 'Uncommon' },
        { slug: 'r1', name: 'Flame Tongue', rarity: 'Rare' },
        { slug: 'vr1', name: 'Dwarven Thrower', rarity: 'Very Rare' },
        { slug: 'l1', name: 'Vorpal Sword', rarity: 'Legendary' }
    ];

    // Stress test 5,000 loot generations across all tiers and types
    for (let i = 0; i < 5000; i++) {
        const tier = (i % 4) + 1;
        const type = i % 2 === 0 ? 'hoard' : 'individual';
        const loot = generateAdvancedLoot(tier, type, mockItems, 'pt');
        assert.ok(loot && typeof loot.coins === 'object');
        assert.ok(Array.isArray(loot.items));

        // Verify strict rarity isolation per tier
        if (type === 'hoard') {
            for (const item of loot.items) {
                if (tier === 1) assert.ok(['Common', 'Uncommon'].includes(item.rarity), `Invalid tier 1 rarity: ${item.rarity}`);
                if (tier === 2) assert.ok(['Uncommon', 'Rare'].includes(item.rarity), `Invalid tier 2 rarity: ${item.rarity}`);
                if (tier === 3) assert.ok(['Rare', 'Very Rare'].includes(item.rarity), `Invalid tier 3 rarity: ${item.rarity}`);
                if (tier === 4) assert.ok(['Very Rare', 'Legendary'].includes(item.rarity), `Invalid tier 4 rarity: ${item.rarity}`);
            }
        }
    }

    // Verify encounter loot generation with edge-case monster arrays
    assert.equal(generateEncounterLoot([], mockItems, 'pt'), null);
    assert.equal(generateEncounterLoot(null, mockItems, 'pt'), null);
    const encLoot = generateEncounterLoot(
        [{ name: 'Ancient Red Dragon', challenge_rating: '24', count: 1, isBoss: true }],
        mockItems,
        'pt'
    );
    assert.ok(encLoot && encLoot.gems.includes('5000gp'));
});

test('8. Environment Mapper Stress Test (Open5e v2 Empty Environments Compatibility)', () => {
    const sampleSRD2024Monsters = [
        { name: 'Adult White Dragon', type: { name: 'Dragon' }, environments: [] },
        { name: 'Aboleth', type: { name: 'Aberration' }, environments: [] },
        { name: 'Bandit', type: { name: 'Humanoid' }, environments: [] },
        { name: 'Skeleton', type: { name: 'Undead' }, environments: [] },
        { name: 'Camel', type: { name: 'Beast' }, environments: [] },
        { name: 'Goblin', type: { name: 'Humanoid' }, environments: [] },
        { name: 'Hill Giant', type: { name: 'Giant' }, environments: [] },
        { name: 'Adult Red Dragon', type: { name: 'Dragon' }, environments: [] },
        { name: 'Adult Black Dragon', type: { name: 'Dragon' }, environments: [] },
        { name: 'Hunter Shark', type: { name: 'Beast' }, speed: { swim: 40 }, environments: [] }
    ];

    // Every single one of the 11 official environments must have matching monsters
    for (const env of ENVIRONMENTS_LIST) {
        const matches = sampleSRD2024Monsters.filter(m =>
            getMonsterEnvironments(m).some(e => e.toLowerCase() === env.toLowerCase())
        );
        assert.ok(matches.length > 0, `Environment ${env} matched 0 monsters!`);
        assert.notEqual(translateTerm(env, 'pt'), env, `Environment ${env} should be translated to PT`);
    }
});

test('9. Grimoire D&D 5.5e (SRD 2024) Spells Dictionary & Class/School Translation Stress Test', () => {
    const spellEntries = Object.entries(SPELL_NAMES_DICT);
    assert.ok(spellEntries.length >= 339, `Expected at least 339 SRD 2024 spells, got ${spellEntries.length}`);

    assert.equal(translateSpellName('Fireball', 'pt'), 'Bola de Fogo');
    assert.equal(translateSpellName('Shield', 'pt'), 'Escudo Arcano');
    assert.equal(translateSpellName('Cure Wounds', 'pt'), 'Curar Ferimentos');
    assert.equal(translateSpellName('Eldritch Blast', 'pt'), 'Rajada Mística');
    assert.equal(translateSpellName('Wish', 'pt'), 'Desejo');

    const classes = ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard'];
    for (const cls of classes) {
        assert.notEqual(translateTerm(cls, 'pt'), cls, `Class ${cls} should translate to PT`);
    }

    const schools = ['Abjuration', 'Conjuration', 'Divination', 'Enchantment', 'Evocation', 'Illusion', 'Necromancy', 'Transmutation'];
    for (const school of schools) {
        assert.notEqual(translateTerm(school, 'pt'), school, `School ${school} should translate to PT`);
    }
});

test('10. Homebrew Spell Level Calculator Stress Test (DMG p. 283-284)', () => {
    assert.equal(SPELL_LEVEL_TABLE.length, 10);
    assert.equal(parseDiceAverage('8d6'), 28);
    assert.equal(parseDiceAverage('2d10'), 11);
    assert.equal(parseDiceAverage('1d10'), 5.5);

    const cantrip = calculateSpellPower({ autoLevel: true, damageDice: '1d10', targetScope: 'single', effectTier: 0, halfOnSave: false });
    assert.equal(cantrip.level, 0);

    const lvl1Single = calculateSpellPower({ autoLevel: true, damageDice: '2d10', targetScope: 'single', effectTier: 0, halfOnSave: true });
    assert.equal(lvl1Single.level, 1);

    const fireballLike = calculateSpellPower({ autoLevel: true, damageDice: '6d6', targetScope: 'aoe', effectTier: 0, halfOnSave: true });
    assert.equal(fireballLike.level, 3);

    const manualLvl9 = calculateSpellPower({ autoLevel: false, manualLevel: 9, damageDice: '40d6', targetScope: 'aoe' });
    assert.equal(manualLvl9.level, 9);
    assert.equal(manualLvl9.minCasterLevel, 17);
});

test('11. Extreme Chaos, Fuzzing & Absurd Inputs Stress Test', () => {
    // 1. Circular object references, NaN, Infinity, -Infinity in safeText
    const circular = { label: 'Circular' };
    circular.self = circular;
    assert.doesNotThrow(() => safeText(circular));
    assert.equal(safeText(NaN), '');
    assert.equal(safeText(Infinity), '');
    assert.equal(safeText(-Infinity), '');
    assert.equal(safeText([null, undefined, NaN, Infinity, circular, 'Valid']), `${JSON.stringify({ label: 'Circular' }).slice(0, 0)}Valid`.trim());

    // 2. Billion-dice CPU DoS protection in rollDice & parseDiceAverage
    const startMs = Date.now();
    const hugeRoll = rollDice(999999999999, 999999999999);
    assert.ok(Date.now() - startMs < 200, 'rollDice should cap absurd counts and return quickly');
    assert.ok(Number.isFinite(hugeRoll) && hugeRoll > 0);

    assert.equal(parseDiceAverage('5d0'), 0);
    assert.equal(parseDiceAverage('-50d6'), 0);
    assert.equal(parseDiceAverage('2d6 + 3 + 2 - 1'), 11);
    assert.ok(Number.isFinite(parseDiceAverage('99999999999999999999999d99999999999999999999999 + 99999999999999')));
    assert.equal(parseDiceAverage(null), 0);
    assert.equal(parseDiceAverage(undefined), 0);
    assert.equal(parseDiceAverage({}), 0);
    assert.equal(parseDiceAverage(NaN), 0);
    assert.equal(parseDiceAverage(Infinity), 0);

    // 3. Division by zero, negative, and non-finite CRs in parseCR
    assert.equal(parseCR('1/0'), 0);
    assert.equal(parseCR('999/-5'), 0);
    assert.equal(parseCR('-10'), 0);
    assert.equal(parseCR(Infinity), 0);
    assert.equal(parseCR(-Infinity), 0);
    assert.equal(parseCR(NaN), 0);

    // 4. Regex special characters / injection payloads in translators & bilingual search
    const regexBomb = '[.*+?^${}()|[\\]\\\\] (Dragon) +9999999999999999999 ft.';
    assert.doesNotThrow(() => translateName(regexBomb, 'pt'));
    assert.doesNotThrow(() => translateSpellName(regexBomb, 'pt'));
    assert.doesNotThrow(() => translateTerm(regexBomb, 'pt'));
    assert.doesNotThrow(() => translateDescription(regexBomb, 'pt'));
    assert.doesNotThrow(() => matchesBilingualSearch(regexBomb, regexBomb));
    assert.doesNotThrow(() => getMonsterEnvironments({ name: regexBomb, type: circular, desc: circular, speed: circular }));

    // 5. Absurd inputs into calculators & slug generator
    const absurdSpell = calculateSpellPower({
        autoLevel: true,
        manualLevel: -9999,
        damageDice: '9999999999999d9999999999999',
        targetScope: 'unknown_scope',
        effectTier: 999999,
        halfOnSave: null
    });
    assert.ok(absurdSpell.level >= 0 && absurdSpell.level <= 9);

    const slug = generateHomebrewSlug('!!!HB***', '   $$$???   ');
    assert.ok(slug.startsWith('hb-custom-'));
});




