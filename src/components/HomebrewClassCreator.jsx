import React, { useState } from 'react';
import {
    Award, Sparkles, Plus, Trash2, Edit3, Check, X, ArrowRight,
    Table, Layers, Heart, Copy, ChevronDown, ChevronRight
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { generateHomebrewSlug } from '../utils/helpers';
import {
    createDefault20Levels,
    buildHomebrewClassData,
    getHitPointsDescription,
    getProfBonusForLevel,
    getCasterSlotForLevel
} from '../utils/classCreatorUtils';

const HIT_DICE_OPTIONS = ['d6', 'd8', 'd10', 'd12'];

const SAVING_THROW_OPTIONS_PT = ['Força', 'Destreza', 'Constituição', 'Inteligência', 'Sabedoria', 'Carisma'];
const SAVING_THROW_OPTIONS_EN = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];

const CASTER_TYPES = [
    { id: 'none', pt: 'Nenhuma (Classe Marcial)', en: 'None (Martial Class)' },
    { id: 'full', pt: 'Conjurador Completo (1º ao 9º Círculo)', en: 'Full Caster (1st–9th Level Slots)' },
    { id: 'half', pt: 'Meio-Conjurador (1º ao 5º Círculo)', en: 'Half Caster (1st–5th Level Slots)' },
    { id: 'third', pt: 'Terço-Conjurador (1º ao 4º Círculo)', en: 'Third Caster (1st–4th Level Slots)' },
    { id: 'pact', pt: 'Magia de Pacto (Estilo Bruxo)', en: 'Pact Magic (Warlock Style)' }
];

const createInitialClassForm = (lang = 'pt') => ({
    name: '',
    tagline: '',
    subclass: '',
    hitDie: 'd10',
    primaryAbility: lang === 'pt' ? 'Força ou Destreza' : 'Strength or Dexterity',
    savingThrows: lang === 'pt' ? ['Constituição', 'Sabedoria'] : ['Constitution', 'Wisdom'],
    skills: lang === 'pt'
        ? 'Escolha 2: Acrobacia, Arcanismo, Atletismo, Furtividade, Intuição, Percepção ou Sobrevivência'
        : 'Choose 2: Acrobatics, Arcana, Athletics, Insight, Perception, Stealth, or Survival',
    weapons: lang === 'pt' ? 'Armas Simples e Marciais' : 'Simple and Martial Weapons',
    armor: lang === 'pt' ? 'Armaduras Leves, Médias e Escudos' : 'Light and Medium Armor, Shields',
    tools: lang === 'pt' ? 'Nenhuma' : 'None',
    casterType: 'none',
    customColumns: [
        { key: 'col_1', label: lang === 'pt' ? 'Dado Especial' : 'Special Die' },
        { key: 'col_2', label: lang === 'pt' ? 'Usos / Recursos' : 'Resource Uses' }
    ],
    levels: createDefault20Levels(lang)
});

export const ClassFullPreviewCard = ({ classObj, lang }) => {
    const [showLevelsPreview, setShowLevelsPreview] = useState(false);

    return (
        <div className="space-y-3">
            {/* Core da Classe */}
            <div className="bg-[#2B2C30] p-3.5 rounded-2xl border border-[#453745] space-y-2.5">
                <div className="flex items-start justify-between gap-2 border-b border-[#453745] pb-2.5">
                    <div>
                        <h4 className="text-base font-black text-[#FF1457] leading-tight">
                            {classObj.name[lang] || classObj.name.pt}
                        </h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            {classObj.core.subclass[lang] || classObj.core.subclass.pt}
                        </span>
                        <p className="text-xs text-gray-300 mt-1">
                            {classObj.tagline[lang] || classObj.tagline.pt}
                        </p>
                    </div>
                    <div className="bg-[#35313B] px-2.5 py-1.5 rounded-xl border border-[#FF1457]/40 text-center shrink-0">
                        <div className="text-sm font-black text-[#FF1457]">{classObj.hitDie}</div>
                        <div className="text-[8px] text-gray-400 uppercase font-bold">
                            {lang === 'pt' ? 'Dado PV' : 'Hit Die'}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#35313B] p-2 rounded-xl border border-[#453745]">
                        <span className="text-[9px] font-bold uppercase text-[#FF1457] block">
                            {lang === 'pt' ? 'Atributo Primário' : 'Primary Ability'}
                        </span>
                        <span className="font-bold text-white text-[11px]">
                            {classObj.core.primaryAbility[lang] || classObj.core.primaryAbility.pt}
                        </span>
                    </div>
                    <div className="bg-[#35313B] p-2 rounded-xl border border-[#453745]">
                        <span className="text-[9px] font-bold uppercase text-[#FF1457] block">
                            {lang === 'pt' ? 'Salvaguardas' : 'Saving Throws'}
                        </span>
                        <span className="font-bold text-white text-[11px]">
                            {classObj.core.savingThrows[lang] || classObj.core.savingThrows.pt}
                        </span>
                    </div>
                </div>

                <div className="bg-[#35313B] p-2.5 rounded-xl border border-[#453745] text-[11px] space-y-1 text-gray-300">
                    <p>
                        <strong className="text-[#FF1457]">{lang === 'pt' ? 'Pontos de Vida:' : 'Hit Points:'}</strong>{' '}
                        {classObj.core.hitPoints[lang] || classObj.core.hitPoints.pt}
                    </p>
                    <p>
                        <strong className="text-[#FF1457]">{lang === 'pt' ? 'Perícias:' : 'Skills:'}</strong>{' '}
                        {classObj.core.skills[lang] || classObj.core.skills.pt}
                    </p>
                    <p>
                        <strong className="text-[#FF1457]">{lang === 'pt' ? 'Armas & Armaduras:' : 'Weapons & Armor:'}</strong>{' '}
                        {classObj.core.weapons[lang] || classObj.core.weapons.pt} • {classObj.core.armor[lang] || classObj.core.armor.pt}
                    </p>
                </div>
            </div>

            {/* Tabela de Progressão Completa (1 ao 20) */}
            <div className="bg-[#35313B] rounded-2xl border-2 border-[#FF1457]/40 overflow-hidden shadow-lg">
                <div className="p-3 bg-gradient-to-r from-[#613C4C] to-[#35313B] flex items-center gap-2">
                    <Table size={15} className="text-[#FF1457]" />
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                        {lang === 'pt'
                            ? `Tabela da Classe: ${classObj.name.pt}`
                            : `${classObj.name.en} Progression Table`}
                    </span>
                </div>
                <div className="overflow-x-auto bg-[#2B2C30]">
                    <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                            <tr className="bg-[#35313B] text-[#FF1457] border-b border-[#453745] uppercase text-[10px] font-black tracking-wider">
                                <th className="py-2 px-2 text-center">{lang === 'pt' ? 'Nv.' : 'Lvl'}</th>
                                <th className="py-2 px-2 text-center">Prof.</th>
                                <th className="py-2 px-2.5 min-w-[150px]">
                                    {lang === 'pt' ? 'Características da Classe' : 'Class Features'}
                                </th>
                                {classObj.extraColumns.map(col => (
                                    <th key={col.key} className="py-2 px-2 text-center whitespace-nowrap">
                                        {col.label[lang] || col.label.pt}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#453745]/60">
                            {classObj.levels.map((row, idx) => (
                                <tr
                                    key={row.level}
                                    className={idx % 2 === 0 ? 'bg-[#2B2C30]' : 'bg-[#35313B]/50'}
                                >
                                    <td className="py-1.5 px-2 text-center font-black text-[#FF1457]">{row.level}º</td>
                                    <td className="py-1.5 px-2 text-center font-bold text-gray-300">{row.profBonus}</td>
                                    <td className="py-1.5 px-2.5 font-semibold text-white">
                                        {row.features.map(f => f.name[lang] || f.name.pt).join(', ')}
                                    </td>
                                    {classObj.extraColumns.map(col => (
                                        <td key={col.key} className="py-1.5 px-2 text-center font-bold text-gray-300 whitespace-nowrap">
                                            {row.extra[col.key] || '—'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Botão para Expandir/Minimizar as Descrições Completas dos 20 Níveis */}
            <div className="bg-[#35313B] rounded-2xl border border-[#453745] overflow-hidden">
                <button
                    type="button"
                    onClick={() => setShowLevelsPreview(prev => !prev)}
                    className="w-full p-3 flex items-center justify-between text-left hover:bg-[#453745]/50 transition-colors"
                >
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FF1457] flex items-center gap-1.5">
                        <Layers size={14} />
                        {lang === 'pt'
                            ? 'Descrições Detalhadas de Cada Nível (1º ao 20º)'
                            : 'Detailed Level Descriptions (Levels 1–20)'}
                    </span>
                    <span className="text-[#FF1457]">
                        {showLevelsPreview ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </span>
                </button>

                {showLevelsPreview && (
                    <div className="p-3 bg-[#2B2C30] border-t border-[#453745] space-y-2.5 max-h-96 overflow-y-auto">
                        {classObj.levels.map(lvlObj => (
                            <div key={lvlObj.level} className="bg-[#35313B] p-3 rounded-xl border border-[#453745] space-y-1.5">
                                <div className="flex items-center justify-between border-b border-[#453745] pb-1">
                                    <span className="font-black text-xs text-[#FF1457] uppercase">
                                        {lang === 'pt' ? `${lvlObj.level}º Nível` : `Level ${lvlObj.level}`}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400">
                                        Prof. {lvlObj.profBonus}
                                    </span>
                                </div>
                                {lvlObj.features.map((feat, fIdx) => (
                                    <div key={fIdx} className="text-xs">
                                        <span className="font-bold text-white">{feat.name[lang] || feat.name.pt}: </span>
                                        <span className="text-gray-300 leading-relaxed">{feat.desc[lang] || feat.desc.pt}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export const HomebrewClassCreator = () => {
    const {
        t, lang,
        homebrewClasses, setHomebrewClasses,
        compendiumClasses, sendHomebrewToClasses, removeClassFromCompendium,
        showToast
    } = useAppContext();

    const [classActiveTab, setClassActiveTab] = useState('create');
    const [editingClassId, setEditingClassId] = useState(null);
    const [classForm, setClassForm] = useState(() => createInitialClassForm(lang));
    const [selectedEditLevel, setSelectedEditLevel] = useState(1);
    const [viewAllLevelsMode, setViewAllLevelsMode] = useState(false);
    const [expandedClasses, setExpandedClasses] = useState({});
    const [confirmDeleteClassId, setConfirmDeleteClassId] = useState(null);

    const saveOptions = lang === 'pt' ? SAVING_THROW_OPTIONS_PT : SAVING_THROW_OPTIONS_EN;

    const updateClassField = (key, value) => {
        setClassForm(prev => ({ ...prev, [key]: value }));
    };

    const toggleSavingThrow = (st) => {
        setClassForm(prev => {
            const exists = prev.savingThrows.includes(st);
            return {
                ...prev,
                savingThrows: exists
                    ? prev.savingThrows.filter(s => s !== st)
                    : [...prev.savingThrows, st]
            };
        });
    };

    const handleAddCustomColumn = () => {
        const newKey = `col_${classForm.customColumns.length + 1}_${ rkSuffix(classForm.customColumns.length) }`;
        setClassForm(prev => ({
            ...prev,
            customColumns: [
                ...prev.customColumns,
                { key: newKey, label: lang === 'pt' ? `Recurso ${prev.customColumns.length + 1}` : `Resource ${prev.customColumns.length + 1}` }
            ],
            levels: prev.levels.map(l => ({
                ...l,
                colValues: { ...l.colValues, [newKey]: '1' }
            }))
        }));
    };

    const rkSuffix = (n) => String(n + 10);

    const handleUpdateCustomColumnLabel = (colKey, newLabel) => {
        setClassForm(prev => ({
            ...prev,
            customColumns: prev.customColumns.map(c => c.key === colKey ? { ...c, label: newLabel } : c)
        }));
    };

    const handleRemoveCustomColumn = (colKey) => {
        setClassForm(prev => ({
            ...prev,
            customColumns: prev.customColumns.filter(c => c.key !== colKey)
        }));
    };

    const handleUpdateLevelColValue = (levelNum, colKey, val) => {
        setClassForm(prev => ({
            ...prev,
            levels: prev.levels.map(l =>
                l.level === levelNum
                    ? { ...l, colValues: { ...(l.colValues || {}), [colKey]: val } }
                    : l
            )
        }));
    };

    const handleCopyColValueDown = (fromLevel, colKey) => {
        const sourceLvl = classForm.levels.find(l => l.level === fromLevel);
        const valToCopy = sourceLvl?.colValues?.[colKey] || '';
        setClassForm(prev => ({
            ...prev,
            levels: prev.levels.map(l =>
                l.level >= fromLevel
                    ? { ...l, colValues: { ...(l.colValues || {}), [colKey]: valToCopy } }
                    : l
            )
        }));
        showToast(lang === 'pt' ? `Valor copiado do ${fromLevel}º ao 20º nível!` : `Copied from level ${fromLevel} to 20!`);
    };

    const handleAddFeatureToLevel = (levelNum) => {
        setClassForm(prev => ({
            ...prev,
            levels: prev.levels.map(l =>
                l.level === levelNum
                    ? {
                        ...l,
                        features: [
                            ...l.features,
                            { name: '', desc: '' }
                        ]
                    }
                    : l
            )
        }));
    };

    const handleUpdateLevelFeature = (levelNum, featIdx, field, val) => {
        setClassForm(prev => ({
            ...prev,
            levels: prev.levels.map(l =>
                l.level === levelNum
                    ? {
                        ...l,
                        features: l.features.map((f, idx) => idx === featIdx ? { ...f, [field]: val } : f)
                    }
                    : l
            )
        }));
    };

    const handleRemoveLevelFeature = (levelNum, featIdx) => {
        setClassForm(prev => ({
            ...prev,
            levels: prev.levels.map(l =>
                l.level === levelNum
                    ? {
                        ...l,
                        features: l.features.filter((_, idx) => idx !== featIdx)
                    }
                    : l
            )
        }));
    };

    // Objeto completo gerado em tempo real para o Preview da Tabela no final
    const livePreviewClassObj = buildHomebrewClassData(classForm, editingClassId || 'preview-hb-class');

    const saveClassLocal = (classObj) => {
        setHomebrewClasses(prev => {
            const exists = prev.some(c => c.id === classObj.id);
            if (exists) {
                return prev.map(c => c.id === classObj.id ? classObj : c);
            }
            return [classObj, ...prev];
        });
    };

    const handleSaveHomebrewClass = (e, alsoSendToClasses = false) => {
        if (e) e.preventDefault();
        if (!classForm.name.trim()) return;

        const classObj = buildHomebrewClassData(classForm, editingClassId, generateHomebrewSlug);
        saveClassLocal(classObj);

        if (alsoSendToClasses) {
            sendHomebrewToClasses(classObj);
        } else {
            showToast(t.homebrewClassSaved);
        }

        setEditingClassId(null);
        setClassForm(createInitialClassForm(lang));
        setSelectedEditLevel(1);
        setClassActiveTab('list');
    };

    const handleEditHomebrewClass = (cls) => {
        setEditingClassId(cls.id);
        if (cls.homebrew_meta?.rawForm) {
            setClassForm(cls.homebrew_meta.rawForm);
        } else {
            setClassForm({
                ...createInitialClassForm(lang),
                name: cls.name?.pt || cls.name || '',
                tagline: cls.tagline?.pt || '',
                hitDie: cls.hitDie || 'd10'
            });
        }
        setSelectedEditLevel(1);
        setClassActiveTab('create');
    };

    const handleDeleteHomebrewClass = (id) => {
        const target = homebrewClasses.find(c => c.id === id);
        setHomebrewClasses(prev => prev.filter(c => c.id !== id));
        removeClassFromCompendium(id, target?.name);
        setConfirmDeleteClassId(null);
    };

    const isInClassesCompendium = (id) => Array.isArray(compendiumClasses) && compendiumClasses.some(c => c.id === id);

    const levelsToRenderInEditor = viewAllLevelsMode
        ? classForm.levels
        : classForm.levels.filter(l => l.level === selectedEditLevel);

    return (
        <div className="animate-in fade-in">
            {/* Sub-Abas: Criar Classe vs Minhas Classes */}
            <div className="flex bg-[#35313B] p-1 rounded-xl mb-4 border border-[#453745] shadow-inner">
                <button
                    type="button"
                    onClick={() => setClassActiveTab('create')}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                        classActiveTab === 'create' ? 'bg-[#FF1457] text-white shadow' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <Sparkles size={14} /> {t.createHomebrewClass}
                </button>
                <button
                    type="button"
                    onClick={() => setClassActiveTab('list')}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                        classActiveTab === 'list' ? 'bg-[#FF1457] text-white shadow' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <Award size={14} /> {t.myHomebrewClasses} ({homebrewClasses.length})
                </button>
            </div>

            {classActiveTab === 'create' && (
                <form onSubmit={(e) => handleSaveHomebrewClass(e, false)} className="space-y-4">
                    {/* ========================================================== */}
                    {/* 1. IDENTIDADE, DADO DE VIDA E CORE DA CLASSE               */}
                    {/* ========================================================== */}
                    <div className="bg-[#35313B] p-4 rounded-2xl border border-[#453745] space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-[#FF1457] uppercase tracking-wider flex items-center gap-1.5">
                                <Award size={14} /> {lang === 'pt' ? '1. Core da Classe & Dado de Vida' : '1. Class Core & Hit Die'}
                            </h3>
                            {editingClassId && (
                                <button
                                    type="button"
                                    onClick={() => { setEditingClassId(null); setClassForm(createInitialClassForm(lang)); }}
                                    className="text-[10px] bg-[#2B2C30] px-2 py-1 rounded text-gray-300 hover:text-white"
                                >
                                    {t.cancel}
                                </button>
                            )}
                        </div>

                        <div>
                            <label className="text-xs text-gray-400 font-semibold mb-1 block">{t.className} *</label>
                            <input
                                type="text"
                                required
                                placeholder={lang === 'pt' ? 'Ex: Caçador de Sangue (Blood Hunter)' : 'e.g., Blood Hunter'}
                                value={classForm.name}
                                onChange={e => updateClassField('name', e.target.value)}
                                className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-3 text-sm outline-none focus:border-[#FF1457]"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs text-gray-400 font-semibold mb-1 block">{t.subclassNameLabel}</label>
                                <input
                                    type="text"
                                    placeholder={lang === 'pt' ? 'Ex: Ordem doLobo Fantasma' : 'e.g., Order of the Ghostslayer'}
                                    value={classForm.subclass}
                                    onChange={e => updateClassField('subclass', e.target.value)}
                                    className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs outline-none focus:border-[#FF1457]"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 font-semibold mb-1 block">{t.primaryAbilityLabel}</label>
                                <input
                                    type="text"
                                    placeholder={lang === 'pt' ? 'Ex: Destreza e Inteligência' : 'e.g., Dexterity and Intelligence'}
                                    value={classForm.primaryAbility}
                                    onChange={e => updateClassField('primaryAbility', e.target.value)}
                                    className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs outline-none focus:border-[#FF1457]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-400 font-semibold mb-1 block">{t.classTagline}</label>
                            <input
                                type="text"
                                placeholder={lang === 'pt' ? 'Ex: Um guerreiro sombrio que sacrifica a própria vitalidade para destruir monstros.' : 'e.g., A dark warrior who sacrifices vitality to hunt monsters.'}
                                value={classForm.tagline}
                                onChange={e => updateClassField('tagline', e.target.value)}
                                className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs outline-none focus:border-[#FF1457]"
                            />
                        </div>

                        {/* Seletor de Dado de Vida (d6, d8, d10, d12) */}
                        <div>
                            <label className="text-xs text-gray-400 font-semibold mb-1.5 block flex items-center gap-1">
                                <Heart size={12} className="text-[#FF1457]" /> {t.hitDieLabel}
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {HIT_DICE_OPTIONS.map(die => {
                                    const active = classForm.hitDie === die;
                                    return (
                                        <button
                                            key={die}
                                            type="button"
                                            onClick={() => updateClassField('hitDie', die)}
                                            className={`py-2.5 rounded-xl font-black text-sm border transition-all ${
                                                active
                                                    ? 'bg-gradient-to-br from-[#FF1457] to-[#613C4C] border-[#FF1457] text-white shadow-lg shadow-[#FF1457]/25'
                                                    : 'bg-[#2B2C30] border-[#453745] text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            1{die}
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-[11px] text-gray-400 mt-1.5 bg-[#2B2C30] p-2 rounded-lg border border-[#453745]">
                                {getHitPointsDescription(classForm.hitDie, classForm.name.trim(), lang)}
                            </p>
                        </div>

                        {/* Proficiência em Salvaguardas */}
                        <div>
                            <label className="text-xs text-gray-400 font-semibold mb-1.5 block">{t.savingThrowsLabel}</label>
                            <div className="flex flex-wrap gap-1.5">
                                {saveOptions.map(st => {
                                    const active = classForm.savingThrows.includes(st);
                                    return (
                                        <button
                                            key={st}
                                            type="button"
                                            onClick={() => toggleSavingThrow(st)}
                                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                                                active
                                                    ? 'bg-[#FF1457]/20 border-[#FF1457] text-[#FF1457]'
                                                    : 'bg-[#2B2C30] border-[#453745] text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            {st}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-400 font-semibold mb-1 block">{t.skillProficienciesLabel}</label>
                            <input
                                type="text"
                                value={classForm.skills}
                                onChange={e => updateClassField('skills', e.target.value)}
                                className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs outline-none focus:border-[#FF1457]"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div>
                                <label className="text-[11px] text-gray-400 font-semibold mb-1 block">{t.weaponTrainingLabel}</label>
                                <input
                                    type="text"
                                    value={classForm.weapons}
                                    onChange={e => updateClassField('weapons', e.target.value)}
                                    className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs outline-none focus:border-[#FF1457]"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] text-gray-400 font-semibold mb-1 block">{t.armorTrainingLabel}</label>
                                <input
                                    type="text"
                                    value={classForm.armor}
                                    onChange={e => updateClassField('armor', e.target.value)}
                                    className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs outline-none focus:border-[#FF1457]"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] text-gray-400 font-semibold mb-1 block">{t.toolProficienciesLabel}</label>
                                <input
                                    type="text"
                                    value={classForm.tools}
                                    onChange={e => updateClassField('tools', e.target.value)}
                                    className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs outline-none focus:border-[#FF1457]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ========================================================== */}
                    {/* 2. COLUNAS DA TABELA DA CLASSE & PROGRESSÃO DE MAGIA       */}
                    {/* ========================================================== */}
                    <div className="bg-[#35313B] p-4 rounded-2xl border border-[#453745] space-y-3">
                        <h3 className="text-xs font-bold text-[#FF1457] uppercase tracking-wider flex items-center gap-1.5">
                            <Table size={14} /> {lang === 'pt' ? '2. Colunas da Tabela da Classe' : '2. Class Table Columns'}
                        </h3>

                        <div>
                            <label className="text-xs text-gray-400 font-semibold mb-1 block">{t.casterProgressionLabel}</label>
                            <select
                                value={classForm.casterType}
                                onChange={e => updateClassField('casterType', e.target.value)}
                                className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2.5 text-xs font-bold outline-none focus:border-[#FF1457]"
                            >
                                {CASTER_TYPES.map(ct => (
                                    <option key={ct.id} value={ct.id}>
                                        {lang === 'pt' ? ct.pt : ct.en}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs text-gray-400 font-semibold">{t.customTableColumns}</label>
                                <button
                                    type="button"
                                    onClick={handleAddCustomColumn}
                                    className="text-[11px] font-bold bg-[#FF1457]/20 text-[#FF1457] hover:bg-[#FF1457] hover:text-white px-2.5 py-1 rounded-lg border border-[#FF1457]/40 transition-colors"
                                >
                                    {t.addCustomColumn}
                                </button>
                            </div>

                            {classForm.customColumns.map((col, idx) => (
                                <div key={col.key} className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-gray-400 w-16 shrink-0 uppercase">
                                        Col. {idx + 1}
                                    </span>
                                    <input
                                        type="text"
                                        placeholder={lang === 'pt' ? 'Ex: Dado Hemocraft, Pontos, Fúrias...' : 'e.g., Hemocraft Die, Points...'}
                                        value={col.label}
                                        onChange={e => handleUpdateCustomColumnLabel(col.key, e.target.value)}
                                        className="flex-1 bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-2 text-xs font-bold outline-none focus:border-[#FF1457]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCustomColumn(col.key)}
                                        className="p-2 text-gray-400 hover:text-[#FF1457] bg-[#2B2C30] rounded-lg border border-[#453745]"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ========================================================== */}
                    {/* 3. EDITOR DE CADA NÍVEL (1º AO 20º NÍVEL)                  */}
                    {/* ========================================================== */}
                    <div className="bg-[#35313B] p-4 rounded-2xl border border-[#453745] space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <h3 className="text-xs font-bold text-[#FF1457] uppercase tracking-wider flex items-center gap-1.5">
                                <Layers size={14} /> 3. {t.levelProgressionEditor}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setViewAllLevelsMode(prev => !prev)}
                                className="text-[10px] font-bold uppercase tracking-wider bg-[#2B2C30] text-gray-300 hover:text-white px-2.5 py-1 rounded-lg border border-[#453745] transition-colors"
                            >
                                {viewAllLevelsMode
                                    ? (lang === 'pt' ? 'Editar Nível por Nível' : 'Edit Single Level')
                                    : (lang === 'pt' ? 'Ver Todos os 20 Níveis' : 'View All 20 Levels')}
                            </button>
                        </div>

                        {/* Grade Rápida de Seleção de Nível (1º ao 20º) */}
                        {!viewAllLevelsMode && (
                            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 bg-[#2B2C30] p-2 rounded-xl border border-[#453745]">
                                {classForm.levels.map(l => {
                                    const isSel = l.level === selectedEditLevel;
                                    const hasFeatures = l.features.some(f => (f.name || '').trim());
                                    return (
                                        <button
                                            key={l.level}
                                            type="button"
                                            onClick={() => setSelectedEditLevel(l.level)}
                                            className={`py-1.5 rounded-lg font-black text-xs border transition-all ${
                                                isSel
                                                    ? 'bg-[#FF1457] border-[#FF1457] text-white shadow-md'
                                                    : hasFeatures
                                                        ? 'bg-[#35313B] border-[#453745] text-gray-200 hover:border-[#FF1457]/50'
                                                        : 'bg-[#2B2C30] border-[#453745]/50 text-gray-500'
                                            }`}
                                        >
                                            {l.level}º
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Cartões dos Níveis em Edição */}
                        <div className="space-y-4">
                            {levelsToRenderInEditor.map(lvlObj => {
                                const prof = getProfBonusForLevel(lvlObj.level);
                                const autoSlots = getCasterSlotForLevel(classForm.casterType, lvlObj.level);

                                return (
                                    <div
                                        key={lvlObj.level}
                                        className="bg-[#2B2C30] p-3.5 rounded-2xl border border-[#FF1457]/30 space-y-3"
                                    >
                                        <div className="flex items-center justify-between border-b border-[#453745] pb-2 flex-wrap gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="w-8 h-8 rounded-xl bg-[#FF1457]/20 border border-[#FF1457] flex items-center justify-center font-black text-xs text-[#FF1457]">
                                                    {lvlObj.level}º
                                                </span>
                                                <div>
                                                    <h4 className="font-black text-white text-sm uppercase">
                                                        {lang === 'pt' ? `${lvlObj.level}º Nível` : `Level ${lvlObj.level}`}
                                                    </h4>
                                                    <span className="text-[10px] text-gray-400 font-bold">
                                                        {lang === 'pt' ? `Bônus de Proficiência: ${prof}` : `Proficiency Bonus: ${prof}`}
                                                        {autoSlots ? ` • ${lang === 'pt' ? 'Espaços' : 'Slots'}: ${autoSlots}` : ''}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleAddFeatureToLevel(lvlObj.level)}
                                                className="text-[11px] font-bold bg-[#FF1457] hover:opacity-90 text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow"
                                            >
                                                <Plus size={13} /> {t.addLevelFeature}
                                            </button>
                                        </div>

                                        {/* Valores das Colunas Exclusivas da Tabela naquele Nível */}
                                        {classForm.customColumns.length > 0 && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#35313B] p-2.5 rounded-xl border border-[#453745]">
                                                {classForm.customColumns.map(col => (
                                                    <div key={col.key}>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <label className="text-[10px] font-bold uppercase text-[#FF1457] truncate">
                                                                {col.label || 'Coluna'} ({lvlObj.level}º Nv.)
                                                            </label>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCopyColValueDown(lvlObj.level, col.key)}
                                                                title={lang === 'pt' ? 'Copiar valor até o 20º nível' : 'Copy value down to level 20'}
                                                                className="text-[9px] text-gray-400 hover:text-white flex items-center gap-0.5 bg-[#2B2C30] px-1.5 py-0.5 rounded border border-[#453745]"
                                                            >
                                                                <Copy size={10} /> {lang === 'pt' ? 'Repetir ↓' : 'Fill ↓'}
                                                            </button>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Ex: 1d6, 3, +2..."
                                                            value={lvlObj.colValues?.[col.key] ?? ''}
                                                            onChange={e => handleUpdateLevelColValue(lvlObj.level, col.key, e.target.value)}
                                                            className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-lg p-2 text-xs font-bold outline-none focus:border-[#FF1457]"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Características Ganhas naquele Nível */}
                                        <div className="space-y-2.5">
                                            {lvlObj.features.map((feat, fIdx) => (
                                                <div
                                                    key={fIdx}
                                                    className="bg-[#35313B] p-3 rounded-xl border border-[#453745] space-y-2"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder={lang === 'pt' ? `Nome da Característica (Nv. ${lvlObj.level})` : `Feature Name (Lvl ${lvlObj.level})`}
                                                            value={feat.name}
                                                            onChange={e => handleUpdateLevelFeature(lvlObj.level, fIdx, 'name', e.target.value)}
                                                            className="flex-1 bg-[#2B2C30] border border-[#453745] text-white rounded-lg p-2 text-xs font-bold outline-none focus:border-[#FF1457]"
                                                        />
                                                        {lvlObj.features.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveLevelFeature(lvlObj.level, fIdx)}
                                                                className="p-2 text-gray-400 hover:text-[#FF1457] bg-[#2B2C30] rounded-lg border border-[#453745]"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <textarea
                                                        rows={3}
                                                        placeholder={lang === 'pt' ? 'Descreva tudo o que este nível entrega ao jogador...' : 'Describe everything this feature grants...'}
                                                        value={feat.desc}
                                                        onChange={e => handleUpdateLevelFeature(lvlObj.level, fIdx, 'desc', e.target.value)}
                                                        className="w-full bg-[#2B2C30] border border-[#453745] text-gray-200 rounded-lg p-2.5 text-xs outline-none focus:border-[#FF1457] leading-relaxed"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ========================================================== */}
                    {/* 4. TABELA DA CLASSE GERADA NO FINAL COM TUDO (PREVIEW)     */}
                    {/* ========================================================== */}
                    <div className="space-y-2 pt-2">
                        <h3 className="text-xs font-black text-[#FF1457] uppercase tracking-wider flex items-center gap-1.5 px-1">
                            <Table size={14} /> 4. {t.generatedClassTable}
                        </h3>
                        <ClassFullPreviewCard classObj={livePreviewClassObj} lang={lang} />
                    </div>

                    {/* Botões de Salvar Classe Homebrew */}
                    <div className="flex gap-2 pt-2">
                        <button
                            type="submit"
                            className="flex-1 bg-[#453745] hover:bg-[#613C4C] border border-[#613C4C] text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs transition-colors"
                        >
                            <Check size={16} /> {t.saveHomebrewClass}
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSaveHomebrewClass(e, true)}
                            className="flex-1 bg-gradient-to-r from-[#FF1457] to-[#613C4C] hover:opacity-90 text-white font-black py-3.5 rounded-xl shadow-lg shadow-[#FF1457]/30 flex items-center justify-center gap-2 text-xs transition-all"
                        >
                            <Award size={16} /> {t.save} & {t.sendToClasses}
                        </button>
                    </div>
                </form>
            )}

            {/* ========================================================== */}
            {/* LISTA DE CLASSES HOMEBREW SALVAS ("MINHAS CLASSES")        */}
            {/* ========================================================== */}
            {classActiveTab === 'list' && (
                <div className="space-y-3 animate-in fade-in">
                    {homebrewClasses.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 italic bg-[#35313B] rounded-2xl border border-[#453745] border-dashed p-6">
                            <Award size={40} className="mx-auto mb-2 opacity-40 text-[#FF1457]" />
                            <p>{t.noHomebrewClasses}</p>
                        </div>
                    ) : (
                        homebrewClasses.map(cls => {
                            const isExp = !!expandedClasses[cls.id];
                            const inComp = isInClassesCompendium(cls.id);
                            const displayName = typeof cls.name === 'object' ? (cls.name[lang] || cls.name.pt) : cls.name;
                            const displaySub = typeof cls.core?.subclass === 'object'
                                ? (cls.core.subclass[lang] || cls.core.subclass.pt)
                                : '';

                            return (
                                <div key={cls.id} className="bg-[#35313B] rounded-2xl overflow-hidden border border-[#453745] shadow-md">
                                    <div
                                        onClick={() => setExpandedClasses(prev => ({ ...prev, [cls.id]: !isExp }))}
                                        className="p-4 flex justify-between items-center cursor-pointer hover:bg-[#453745]/50 transition-colors"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="font-bold text-white leading-tight">{displayName}</h4>
                                                <span className="text-[10px] font-black bg-[#2B2C30] text-[#FF1457] px-2 py-0.5 rounded border border-[#FF1457]/40">
                                                    {cls.hitDie}
                                                </span>
                                                {inComp && (
                                                    <span className="text-[10px] font-bold bg-[#FF1457]/20 text-[#FF1457] px-2 py-0.5 rounded-full border border-[#FF1457]/40">
                                                        {t.inClassesCompendium}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {displaySub} • 20 {lang === 'pt' ? 'Níveis' : 'Levels'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                            <button
                                                type="button"
                                                onClick={() => handleEditHomebrewClass(cls)}
                                                className="p-2 text-gray-400 hover:text-white bg-[#2B2C30] rounded-lg border border-[#453745]"
                                            >
                                                <Edit3 size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setConfirmDeleteClassId(cls.id)}
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
                                                        type="button"
                                                        onClick={() => sendHomebrewToClasses(cls)}
                                                        className="flex-1 bg-[#FF1457] hover:opacity-90 text-white py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                                                    >
                                                        <Award size={14} /> {t.sendToClasses}
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeClassFromCompendium(cls.id, cls.name)}
                                                        className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-gray-200 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 border border-[#613C4C]"
                                                    >
                                                        <X size={14} /> {t.removeFromClasses}
                                                    </button>
                                                )}
                                            </div>
                                            <ClassFullPreviewCard classObj={cls} lang={lang} />
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Modal de Confirmação de Exclusão de Classe Homebrew */}
            {confirmDeleteClassId && (
                <div className="fixed inset-0 bg-[#2B2C30]/90 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#35313B] p-6 rounded-2xl border border-[#FF1457]/50 shadow-2xl max-w-sm w-full text-center">
                        <Trash2 size={40} className="mx-auto text-[#FF1457] mb-3" />
                        <p className="text-white font-bold mb-6 text-sm">{t.deleteHomebrewClassConfirm}</p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setConfirmDeleteClassId(null)}
                                className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-white font-bold py-2.5 rounded-xl text-sm"
                            >
                                {t.cancel}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDeleteHomebrewClass(confirmDeleteClassId)}
                                className="flex-1 bg-[#FF1457] hover:bg-[#d10e46] text-white font-bold py-2.5 rounded-xl text-sm"
                            >
                                <Trash2 size={16} className="inline mr-1" /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
