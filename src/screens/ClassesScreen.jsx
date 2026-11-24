import React, { useState } from 'react';
import {
    Shield, Swords, Flame, Sparkles, BookOpen, Heart, Award, Search, X,
    ChevronDown, ChevronRight, Table, Layers, Compass, Skull, Crown, Trash2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatDistanceUnits } from '../utils/helpers';
import { CLASSES_DATA } from '../constants/classesData';

const CLASS_ICONS = {
    barbarian: Swords,
    bard: Sparkles,
    warlock: Skull,
    cleric: Crown,
    druid: Compass,
    sorcerer: Flame,
    ranger: Compass,
    fighter: Shield,
    rogue: Swords,
    wizard: BookOpen,
    monk: Flame,
    paladin: Shield
};

export const ClassesScreen = () => {
    const { lang, unitSystem = 'm', t, compendiumClasses, removeClassFromCompendium } = useAppContext();
    const [selectedClassId, setSelectedClassId] = useState('barbarian');
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState('Any');
    const [showTable, setShowTable] = useState(true);
    const [collapsedLevels, setCollapsedLevels] = useState({});

    const allClasses = [...CLASSES_DATA, ...(Array.isArray(compendiumClasses) ? compendiumClasses : [])];
    const activeClass = allClasses.find(c => c.id === selectedClassId) || allClasses[0];
    const ActiveIcon = CLASS_ICONS[activeClass.id] || Award;

    const toggleLevelSection = (lvl) => {
        setCollapsedLevels(prev => ({
            ...prev,
            [lvl]: !prev[lvl]
        }));
    };

    const expandAllLevels = () => setCollapsedLevels({});
    const collapseAllLevels = () => {
        const all = {};
        for (let i = 1; i <= 20; i++) all[i] = true;
        setCollapsedLevels(all);
    };

    const filteredLevels = activeClass.levels.filter(lvlObj => {
        const matchesLvl = levelFilter === 'Any' || lvlObj.level === parseInt(levelFilter, 10);
        if (!matchesLvl) return false;
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return lvlObj.features.some(f =>
            f.name.pt.toLowerCase().includes(q) ||
            f.name.en.toLowerCase().includes(q) ||
            f.desc.pt.toLowerCase().includes(q) ||
            f.desc.en.toLowerCase().includes(q)
        );
    });

    const handleRowClick = (lvl) => {
        setCollapsedLevels(prev => ({ ...prev, [lvl]: false }));
        const el = document.getElementById(`class-level-${lvl}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="p-4 pb-10 max-w-lg mx-auto space-y-4 animate-in fade-in">
            {/* Grade Seletora das Classes D&D 5.5e + Homebrew */}
            <div className="bg-[#35313B] p-3 rounded-2xl border border-[#453745] shadow-md">
                <div className="flex items-center justify-between mb-2.5 px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FF1457] flex items-center gap-1.5">
                        <Award size={13} /> {lang === 'pt' ? 'Classes D&D 5.5e (2024)' : 'D&D 5.5e Classes (2024)'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">
                        {allClasses.length} {lang === 'pt' ? 'Classes' : 'Classes'}
                    </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                    {allClasses.map(cls => {
                        const IconComp = CLASS_ICONS[cls.id] || Award;
                        const isSelected = cls.id === activeClass.id;
                        return (
                            <button
                                key={cls.id}
                                type="button"
                                onClick={() => {
                                    setSelectedClassId(cls.id);
                                    setLevelFilter('Any');
                                }}
                                className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                    isSelected
                                        ? 'bg-gradient-to-br from-[#FF1457] to-[#613C4C] border-[#FF1457] text-white shadow-lg shadow-[#FF1457]/25'
                                        : 'bg-[#2B2C30] border-[#453745] text-gray-300 hover:border-[#FF1457]/50 hover:text-white'
                                }`}
                            >
                                <div className="flex items-center justify-between w-full mb-1">
                                    <div className="flex items-center gap-1">
                                        <IconComp size={14} className={isSelected ? 'text-white' : 'text-[#FF1457]'} />
                                        {cls.isHomebrew && (
                                            <span className="text-[8px] font-black bg-[#FF1457] text-white px-1 rounded">
                                                HB
                                            </span>
                                        )}
                                    </div>
                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                                        isSelected ? 'bg-black/30 text-white' : 'bg-[#35313B] text-gray-400'
                                    }`}>
                                        {cls.hitDie}
                                    </span>
                                </div>
                                <div className="font-bold text-[11px] leading-tight truncate w-full">
                                    {cls.name[lang] || cls.name.pt}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Banner Principal & CORE DA CLASSE */}
            <div className="bg-gradient-to-br from-[#613C4C] via-[#35313B] to-[#2B2C30] rounded-2xl border border-[#FF1457]/40 shadow-xl overflow-hidden">
                <div className="p-4 border-b border-[#453745] flex items-start justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="p-2 rounded-xl bg-[#2B2C30] border border-[#FF1457]/40 text-[#FF1457]">
                                <ActiveIcon size={20} />
                            </span>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="text-xl font-black text-white tracking-tight leading-none">
                                        {activeClass.name[lang] || activeClass.name.pt}
                                    </h2>
                                    {activeClass.isHomebrew && (
                                        <span className="text-[9px] font-black bg-[#FF1457]/20 text-[#FF1457] px-2 py-0.5 rounded-full border border-[#FF1457]/40 uppercase">
                                            Homebrew
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF1457]">
                                    {activeClass.core.subclass[lang] || activeClass.core.subclass.pt}
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-300 mt-2.5 leading-relaxed">
                            {activeClass.tagline[lang] || activeClass.tagline.pt}
                        </p>
                        {activeClass.isHomebrew && (
                            <button
                                type="button"
                                onClick={() => {
                                    removeClassFromCompendium(activeClass.id, activeClass.name);
                                    setSelectedClassId('barbarian');
                                }}
                                className="mt-2.5 bg-[#2B2C30] hover:bg-[#FF1457] text-gray-300 hover:text-white border border-[#453745] py-1.5 px-3 rounded-lg font-bold text-[11px] inline-flex items-center gap-1.5 transition-colors"
                            >
                                <Trash2 size={13} /> {t.removeFromClasses}
                            </button>
                        )}
                    </div>
                    <div className="bg-[#2B2C30] px-3 py-2 rounded-xl border border-[#FF1457]/40 text-center shrink-0">
                        <div className="text-base font-black text-[#FF1457] leading-none">{activeClass.hitDie}</div>
                        <div className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">
                            {lang === 'pt' ? 'Dado PV' : 'Hit Die'}
                        </div>
                    </div>
                </div>

                {/* CORE TRAITS (Núcleo da Classe) */}
                <div className="p-4 bg-[#2B2C30]/75 space-y-2.5">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#FF1457] flex items-center gap-1.5">
                        <Layers size={14} /> {lang === 'pt' ? 'Core da Classe (Traços Principais)' : 'Core Class Traits'}
                    </h3>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-[#35313B] p-2.5 rounded-xl border border-[#453745]">
                            <span className="text-[10px] font-bold uppercase text-[#FF1457] block">
                                {lang === 'pt' ? 'Atributo Primário' : 'Primary Ability'}
                            </span>
                            <span className="font-bold text-white mt-0.5 block">
                                {activeClass.core.primaryAbility[lang]}
                            </span>
                        </div>
                        <div className="bg-[#35313B] p-2.5 rounded-xl border border-[#453745]">
                            <span className="text-[10px] font-bold uppercase text-[#FF1457] block">
                                {lang === 'pt' ? 'Salvaguardas' : 'Saving Throws'}
                            </span>
                            <span className="font-bold text-white mt-0.5 block">
                                {activeClass.core.savingThrows[lang]}
                            </span>
                        </div>
                    </div>

                    <div className="bg-[#35313B] p-2.5 rounded-xl border border-[#453745] text-xs space-y-1.5">
                        <div>
                            <span className="text-[10px] font-bold uppercase text-[#FF1457] flex items-center gap-1">
                                <Heart size={11} /> {lang === 'pt' ? 'Pontos de Vida' : 'Hit Points'}
                            </span>
                            <p className="text-gray-200 text-[11px] leading-relaxed mt-0.5">
                                {activeClass.core.hitPoints[lang]}
                            </p>
                        </div>
                        <div className="border-t border-[#453745] pt-1.5">
                            <span className="text-[10px] font-bold uppercase text-[#FF1457] block">
                                {lang === 'pt' ? 'Perícias Iniciais' : 'Skill Proficiencies'}
                            </span>
                            <p className="text-gray-200 text-[11px] leading-relaxed mt-0.5">
                                {activeClass.core.skills[lang]}
                            </p>
                        </div>
                        <div className="border-t border-[#453745] pt-1.5 grid grid-cols-2 gap-2">
                            <div>
                                <span className="text-[10px] font-bold uppercase text-[#FF1457] block">
                                    {lang === 'pt' ? 'Armas' : 'Weapons'}
                                </span>
                                <p className="text-gray-200 text-[11px] mt-0.5">{activeClass.core.weapons[lang]}</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase text-[#FF1457] block">
                                    {lang === 'pt' ? 'Armaduras' : 'Armor'}
                                </span>
                                <p className="text-gray-200 text-[11px] mt-0.5">{activeClass.core.armor[lang]}</p>
                            </div>
                        </div>
                        {activeClass.core.tools[lang] !== 'Nenhuma' && activeClass.core.tools[lang] !== 'None' && (
                            <div className="border-t border-[#453745] pt-1.5">
                                <span className="text-[10px] font-bold uppercase text-[#FF1457] block">
                                    {lang === 'pt' ? 'Ferramentas' : 'Tools'}
                                </span>
                                <p className="text-gray-200 text-[11px] mt-0.5">{activeClass.core.tools[lang]}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* TABELA DA CLASSE EM DESTAQUE (Níveis 1 a 20) */}
            <div className="bg-[#35313B] rounded-2xl border-2 border-[#FF1457]/40 shadow-xl overflow-hidden">
                <button
                    type="button"
                    onClick={() => setShowTable(prev => !prev)}
                    className="w-full p-3.5 bg-gradient-to-r from-[#613C4C] to-[#35313B] flex items-center justify-between text-left"
                >
                    <div className="flex items-center gap-2">
                        <Table size={16} className="text-[#FF1457]" />
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-wider text-white">
                                {lang === 'pt'
                                    ? `Tabela de Progressão: ${activeClass.name.pt}`
                                    : `${activeClass.name.en} Progression Table`}
                            </h3>
                            <p className="text-[10px] text-gray-300">
                                {lang === 'pt'
                                    ? 'Toque em qualquer nível para ir direto à descrição detalhada'
                                    : 'Tap any level row to jump to its detailed feature breakdown'}
                            </p>
                        </div>
                    </div>
                    <span className="text-[#FF1457]">
                        {showTable ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </span>
                </button>

                {showTable && (
                    <div className="overflow-x-auto bg-[#2B2C30]">
                        <table className="w-full text-left border-collapse text-[11px]">
                            <thead>
                                <tr className="bg-[#35313B] text-[#FF1457] border-b border-[#453745] uppercase text-[10px] font-black tracking-wider">
                                    <th className="py-2.5 px-2.5 text-center">
                                        {lang === 'pt' ? 'Nv.' : 'Lvl'}
                                    </th>
                                    <th className="py-2.5 px-2 text-center">
                                        {lang === 'pt' ? 'Prof.' : 'Prof.'}
                                    </th>
                                    <th className="py-2.5 px-2.5 min-w-[155px]">
                                        {lang === 'pt' ? 'Características da Classe' : 'Class Features'}
                                    </th>
                                    {activeClass.extraColumns.map(col => (
                                        <th key={col.key} className="py-2.5 px-2 text-center whitespace-nowrap">
                                            {col.label[lang]}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#453745]/60">
                                {activeClass.levels.map((row, idx) => (
                                    <tr
                                        key={row.level}
                                        onClick={() => handleRowClick(row.level)}
                                        className={`cursor-pointer transition-colors hover:bg-[#FF1457]/15 ${
                                            idx % 2 === 0 ? 'bg-[#2B2C30]' : 'bg-[#35313B]/50'
                                        }`}
                                    >
                                        <td className="py-2 px-2.5 text-center font-black text-[#FF1457]">
                                            {row.level}º
                                        </td>
                                        <td className="py-2 px-2 text-center font-bold text-gray-300">
                                            {row.profBonus}
                                        </td>
                                        <td className="py-2 px-2.5 font-semibold text-white">
                                            {row.features.map(f => f.name[lang]).join(', ')}
                                        </td>
                                        {activeClass.extraColumns.map(col => (
                                            <td
                                                key={col.key}
                                                className="py-2 px-2 text-center font-bold text-gray-300 whitespace-nowrap"
                                            >
                                                {formatDistanceUnits(row.extra[col.key] || '—', unitSystem)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* BARRA DE BUSCA & FILTRO POR NÍVEL */}
            <div className="bg-[#35313B] p-3 rounded-2xl border border-[#453745] space-y-2.5">
                <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder={lang === 'pt' ? 'Buscar característica ou habilidade...' : 'Search class features...'}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-[#2B2C30] text-white py-2.5 pl-9 pr-8 rounded-xl border border-[#453745] outline-none focus:border-[#FF1457] text-xs"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <div>
                        <select
                            value={levelFilter}
                            onChange={e => setLevelFilter(e.target.value)}
                            className="w-full h-full bg-[#2B2C30] border border-[#453745] text-gray-200 rounded-xl px-2.5 py-2 outline-none focus:border-[#FF1457] font-bold text-xs"
                        >
                            <option value="Any">{t.anyLevel}</option>
                            {activeClass.levels.map(l => (
                                <option key={l.level} value={String(l.level)}>
                                    {lang === 'pt' ? `${l.level}º Nível` : `Level ${l.level}`}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={expandAllLevels}
                            className="text-[10px] font-bold uppercase tracking-wider text-gray-300 hover:text-white bg-[#2B2C30] px-2.5 py-1 rounded-lg border border-[#453745] transition-colors"
                        >
                            {t.expandAllLevels}
                        </button>
                        <button
                            type="button"
                            onClick={collapseAllLevels}
                            className="text-[10px] font-bold uppercase tracking-wider text-gray-300 hover:text-white bg-[#2B2C30] px-2.5 py-1 rounded-lg border border-[#453745] transition-colors"
                        >
                            {t.collapseAllLevels}
                        </button>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-gray-400">
                        {filteredLevels.length} {lang === 'pt' ? 'Níveis' : 'Levels'}
                    </span>
                </div>
            </div>

            {/* DESCRIÇÕES DO QUE CADA NÍVEL ENTREGA (Níveis 1 a 20) */}
            <div className="space-y-3">
                {filteredLevels.map(lvlObj => {
                    const isCollapsed = !!collapsedLevels[lvlObj.level];
                    return (
                        <div
                            key={lvlObj.level}
                            id={`class-level-${lvlObj.level}`}
                            className="bg-[#35313B] rounded-2xl border border-[#453745] overflow-hidden shadow-md"
                        >
                            <button
                                type="button"
                                onClick={() => toggleLevelSection(lvlObj.level)}
                                className="w-full p-3.5 bg-gradient-to-r from-[#35313B] to-[#453745]/80 hover:from-[#453745] hover:to-[#613C4C]/60 flex items-center justify-between text-left transition-colors"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <span className="w-8 h-8 rounded-xl bg-[#2B2C30] border border-[#FF1457]/40 flex items-center justify-center font-black text-xs text-[#FF1457] shrink-0">
                                        {lvlObj.level}º
                                    </span>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="font-black text-white text-sm uppercase tracking-wider">
                                                {lang === 'pt' ? `${lvlObj.level}º Nível` : `Level ${lvlObj.level}`}
                                            </h4>
                                            <span className="text-[10px] font-bold bg-[#2B2C30] text-[#FF1457] px-2 py-0.5 rounded-full border border-[#FF1457]/30">
                                                Prof. {lvlObj.profBonus}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-300 truncate mt-0.5">
                                            {lvlObj.features.map(f => f.name[lang]).join(' • ')}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-[#FF1457] shrink-0 ml-2">
                                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                                </span>
                            </button>

                            {!isCollapsed && (
                                <div className="p-3.5 bg-[#2B2C30]/80 border-t border-[#453745] space-y-2.5">
                                    {/* Resumo Rápido das Colunas da Tabela naquele Nível */}
                                    <div className="flex flex-wrap gap-1.5 pb-1">
                                        {activeClass.extraColumns.map(col => (
                                            <span
                                                key={col.key}
                                                className="text-[10px] font-bold bg-[#35313B] text-gray-300 px-2.5 py-1 rounded-lg border border-[#453745]"
                                            >
                                                <strong className="text-[#FF1457]">{col.label[lang]}:</strong>{' '}
                                                {formatDistanceUnits(lvlObj.extra[col.key] || '—', unitSystem)}
                                            </span>
                                        ))}
                                    </div>

                                    {lvlObj.features.map((feat, fIdx) => (
                                        <div
                                            key={fIdx}
                                            className="bg-[#35313B] p-3 rounded-xl border border-[#453745] space-y-1"
                                        >
                                            <h5 className="font-bold text-white text-sm flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF1457]" />
                                                {formatDistanceUnits(feat.name[lang], unitSystem)}
                                            </h5>
                                            <p className="text-xs text-gray-300 leading-relaxed">
                                                {formatDistanceUnits(feat.desc[lang], unitSystem)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
