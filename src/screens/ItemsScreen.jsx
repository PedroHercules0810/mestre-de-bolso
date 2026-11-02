import React, { useState } from 'react';
import { Book, Gem, Search, X, ArrowRight, Sparkles, Coins, Package } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { safeText } from '../utils/helpers';
import { translateName, translateTerm, matchesBilingualSearch } from '../utils/translators';
import { generateAdvancedLoot } from '../utils/lootGenerator';
import { renderItemDetails } from '../components/ItemDetails';

export const ItemsScreen = () => {
    const { t, items, lang, itemsTab, setItemsTab } = useAppContext();
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
        const matchesSearch = matchesBilingualSearch(safeText(i.name), searchTerm);
        
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
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-white leading-tight">{translateName(safeText(item.name), lang)}</h4>
                                                {item.isHomebrew && (
                                                    <span className="text-[9px] font-bold uppercase tracking-wider bg-[#FF1457]/20 text-[#FF1457] px-2 py-0.5 rounded-full border border-[#FF1457]/40">
                                                        Homebrew
                                                    </span>
                                                )}
                                            </div>
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
