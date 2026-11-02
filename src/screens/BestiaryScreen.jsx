import React, { useState } from 'react';
import { Search, X, ArrowRight, Swords, Shield } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { safeText } from '../utils/helpers';
import { translateName, translateTerm, matchesBilingualSearch } from '../utils/translators';
import { StatBlock } from '../components/StatBlock';

export const BestiaryScreen = () => {
    const { t, monsters, lang, addMonsterToEncounter, addDirectlyToTracker } = useAppContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("Any");
    const [expanded, setExpanded] = useState({});

    const types = ['Any', 'Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon', 'Elemental', 'Fey', 'Fiend', 'Giant', 'Humanoid', 'Monstrosity', 'Ooze', 'Plant', 'Undead'];

    const filteredMonsters = monsters.filter(m => {
        const matchesSearch = matchesBilingualSearch(safeText(m.name), searchTerm);
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
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-white leading-tight">{translateName(safeText(m.name), lang)}</h4>
                                        {m.isHomebrew && (
                                            <span className="text-[9px] font-bold uppercase tracking-wider bg-[#FF1457]/20 text-[#FF1457] px-2 py-0.5 rounded-full border border-[#FF1457]/40">
                                                Homebrew
                                            </span>
                                        )}
                                    </div>
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
