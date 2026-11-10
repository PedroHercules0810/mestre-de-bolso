import React, { useState, useEffect, useRef } from 'react';
import {
    Search, X, ArrowRight, Sparkles, Download, RotateCcw, ChevronDown, ChevronRight
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { safeText } from '../utils/helpers';
import {
    translateSpellName,
    translateTerm,
    matchesBilingualSearch
} from '../utils/translators';
import { SpellDetailsCard } from '../components/SpellDetails';

const SPELL_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const SPELL_CLASSES = [
    'Any',
    'Bard',
    'Cleric',
    'Druid',
    'Paladin',
    'Ranger',
    'Sorcerer',
    'Warlock',
    'Wizard'
];

export const GrimoireScreen = () => {
    const { t, spells, lang, isSyncing, syncData } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState('Any');
    const [classFilter, setClassFilter] = useState('Any');
    const [collapsedLevels, setCollapsedLevels] = useState({});
    const [expandedSpells, setExpandedSpells] = useState({});
    const autoSyncedRef = useRef(false);

    // Faz o download automático das magias do D&D 5.5e na primeira abertura caso o cache esteja vazio
    useEffect(() => {
        if (spells.length === 0 && !isSyncing && !autoSyncedRef.current) {
            autoSyncedRef.current = true;
            syncData('spells');
        }
    }, [spells.length, isSyncing, syncData]);

    const formatLevelHeader = (lvl) => {
        if (lvl === 0) return t.cantrips;
        return lang === 'pt' ? `${lvl}º Círculo` : `Level ${lvl}`;
    };

    const getSpellLevel = (s) => {
        const parsed = parseInt(s.level ?? s.level_int ?? 0, 10);
        return Number.isNaN(parsed) ? 0 : parsed;
    };

    const spellHasClass = (s, targetClass) => {
        if (targetClass === 'Any') return true;
        const targetLower = targetClass.toLowerCase();
        if (Array.isArray(s.classes)) {
            return s.classes.some(c => {
                const cName = typeof c === 'object' ? String(c.name || c.key || '') : String(c || '');
                return cName.toLowerCase().includes(targetLower);
            });
        }
        if (s.dnd_class) {
            return String(s.dnd_class).toLowerCase().includes(targetLower);
        }
        return false;
    };

    const filteredSpells = spells.filter(s => {
        const matchesSearch = matchesBilingualSearch(safeText(s.name), searchTerm);
        const matchesLevel = levelFilter === 'Any' || getSpellLevel(s) === parseInt(levelFilter, 10);
        const matchesClass = spellHasClass(s, classFilter);
        return matchesSearch && matchesLevel && matchesClass;
    });

    // Agrupa as magias filtradas por nível (0 a 9) e ordena alfabeticamente pelo nome traduzido
    const spellsByLevel = SPELL_LEVELS.reduce((acc, lvl) => {
        const list = filteredSpells
            .filter(s => getSpellLevel(s) === lvl)
            .sort((a, b) =>
                translateSpellName(safeText(a.name), lang).localeCompare(
                    translateSpellName(safeText(b.name), lang),
                    lang === 'pt' ? 'pt-BR' : 'en-US'
                )
            );
        if (list.length > 0) {
            acc.push({ level: lvl, spells: list });
        }
        return acc;
    }, []);

    const toggleLevelSection = (lvl) => {
        setCollapsedLevels(prev => ({
            ...prev,
            [lvl]: !prev[lvl]
        }));
    };

    const expandAllLevels = () => {
        setCollapsedLevels({});
    };

    const collapseAllLevels = () => {
        const allCollapsed = {};
        SPELL_LEVELS.forEach(lvl => {
            allCollapsed[lvl] = true;
        });
        setCollapsedLevels(allCollapsed);
    };

    const toggleSpellCard = (slug) => {
        setExpandedSpells(prev => ({
            ...prev,
            [slug]: !prev[slug]
        }));
    };

    return (
        <div className="p-4 pb-8 max-w-lg mx-auto animate-in fade-in">
            {/* Barra de Busca */}
            <div className="relative mb-3">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                    type="text"
                    placeholder={t.searchSpells}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-[#35313B] text-white p-3 pl-10 rounded-xl border border-[#453745] outline-none focus:border-[#FF1457] transition-colors shadow-inner text-sm"
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Filtros Duplos: Nível da Magia & Classe */}
            <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block ml-1">
                        {t.spellLevel}
                    </label>
                    <select
                        value={levelFilter}
                        onChange={e => setLevelFilter(e.target.value)}
                        className="w-full bg-[#35313B] border border-[#453745] text-gray-200 rounded-xl p-2.5 outline-none focus:border-[#FF1457] font-bold text-xs"
                    >
                        <option value="Any">{t.anyLevel}</option>
                        {SPELL_LEVELS.map(lvl => (
                            <option key={lvl} value={String(lvl)}>
                                {formatLevelHeader(lvl)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block ml-1">
                        {t.spellClasses}
                    </label>
                    <select
                        value={classFilter}
                        onChange={e => setClassFilter(e.target.value)}
                        className="w-full bg-[#35313B] border border-[#453745] text-gray-200 rounded-xl p-2.5 outline-none focus:border-[#FF1457] font-bold text-xs"
                    >
                        {SPELL_CLASSES.map(cls => (
                            <option key={cls} value={cls}>
                                {cls === 'Any' ? t.anyClass : translateTerm(cls, lang)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Barra de Contagem e Controle de Expandir/Minimizar Níveis */}
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={expandAllLevels}
                        className="text-[10px] font-bold uppercase tracking-wider text-gray-300 hover:text-white bg-[#35313B] px-2.5 py-1 rounded-lg border border-[#453745] transition-colors"
                    >
                        {t.expandAllLevels}
                    </button>
                    <button
                        type="button"
                        onClick={collapseAllLevels}
                        className="text-[10px] font-bold uppercase tracking-wider text-gray-300 hover:text-white bg-[#35313B] px-2.5 py-1 rounded-lg border border-[#453745] transition-colors"
                    >
                        {t.collapseAllLevels}
                    </button>
                </div>
                <p className="text-xs text-gray-500 font-semibold uppercase">
                    {filteredSpells.length} {t.spells}
                </p>
            </div>

            {/* Estado de Cache Vazio / Sincronização */}
            {spells.length === 0 ? (
                <div className="text-center py-10 px-6 bg-[#35313B] rounded-2xl border border-[#453745] border-dashed space-y-4">
                    <Sparkles size={40} className="mx-auto text-[#FF1457] opacity-70" />
                    <p className="text-xs text-gray-300 leading-relaxed">{t.noSpellsCache}</p>
                    <button
                        onClick={() => syncData('spells')}
                        disabled={isSyncing}
                        className="bg-gradient-to-r from-[#FF1457] to-[#613C4C] hover:opacity-90 text-white font-black py-3 px-6 rounded-xl shadow-lg inline-flex items-center gap-2 text-xs transition-all"
                    >
                        {isSyncing ? <RotateCcw size={16} className="animate-spin" /> : <Download size={16} />}
                        {isSyncing ? t.syncing : t.syncSpells}
                    </button>
                </div>
            ) : spellsByLevel.length === 0 ? (
                <div className="text-center py-10 text-gray-500 italic bg-[#35313B] rounded-xl border border-[#453745] border-dashed">
                    {t.noSpells}
                </div>
            ) : (
                <div className="space-y-4">
                    {spellsByLevel.map(({ level, spells: levelSpells }) => {
                        const isLevelCollapsed = !!collapsedLevels[level];
                        return (
                            <div
                                key={level}
                                className="bg-[#35313B]/50 rounded-2xl border border-[#453745] overflow-hidden shadow-md"
                            >
                                {/* Cabeçalho do Nível (Minimizável / Expansível) */}
                                <button
                                    type="button"
                                    onClick={() => toggleLevelSection(level)}
                                    className="w-full p-3.5 bg-gradient-to-r from-[#35313B] to-[#453745]/80 hover:from-[#453745] hover:to-[#613C4C]/60 flex items-center justify-between transition-colors text-left"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-7 h-7 rounded-lg bg-[#2B2C30] border border-[#FF1457]/40 flex items-center justify-center font-black text-xs text-[#FF1457]">
                                            {level === 0 ? '0' : `${level}º`}
                                        </span>
                                        <div>
                                            <h3 className="font-black text-white text-sm uppercase tracking-wider">
                                                {formatLevelHeader(level)}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold bg-[#2B2C30] text-gray-300 px-2.5 py-1 rounded-full border border-[#453745]">
                                            {levelSpells.length} {t.spells}
                                        </span>
                                        <span className="text-[#FF1457]">
                                            {isLevelCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                                        </span>
                                    </div>
                                </button>

                                {/* Lista de Magias do Nível (Visível apenas quando expandido) */}
                                {!isLevelCollapsed && (
                                    <div className="p-2.5 space-y-2 bg-[#2B2C30]/50 border-t border-[#453745]">
                                        {levelSpells.map(spell => {
                                            const isExp = !!expandedSpells[spell.slug];
                                            const schoolRaw = typeof spell.school === 'object'
                                                ? (spell.school?.name || spell.school?.key || '')
                                                : String(spell.school || '');
                                            const classesStr = Array.isArray(spell.classes)
                                                ? spell.classes.map(c => translateTerm(typeof c === 'object' ? (c.name || c.key) : String(c), lang)).join(', ')
                                                : '';

                                            return (
                                                <div
                                                    key={spell.slug}
                                                    className="bg-[#35313B] rounded-xl overflow-hidden border border-[#453745] shadow-sm"
                                                >
                                                    <div
                                                        onClick={() => toggleSpellCard(spell.slug)}
                                                        className="p-3.5 flex justify-between items-center cursor-pointer hover:bg-[#453745] transition-colors gap-2"
                                                    >
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                                <h4 className="font-bold text-white leading-tight text-sm">
                                                                    {translateSpellName(safeText(spell.name), lang)}
                                                                </h4>
                                                                {spell.concentration && (
                                                                    <span className="text-[9px] font-black bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/40" title={t.concentration}>
                                                                        C
                                                                    </span>
                                                                )}
                                                                {spell.ritual && (
                                                                    <span className="text-[9px] font-black bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40" title={t.ritual}>
                                                                        R
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-[11px] text-gray-400 truncate mt-0.5">
                                                                {translateTerm(schoolRaw, lang)}
                                                                {classesStr ? ` • ${classesStr}` : ''}
                                                            </p>
                                                        </div>
                                                        <span className="text-gray-500 shrink-0">
                                                            {isExp ? <X size={18} /> : <ArrowRight size={18} className="rotate-90" />}
                                                        </span>
                                                    </div>

                                                    {isExp && (
                                                        <div className="p-3 bg-[#2B2C30] border-t border-[#453745] animate-in fade-in">
                                                            <SpellDetailsCard spell={spell} lang={lang} t={t} />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
