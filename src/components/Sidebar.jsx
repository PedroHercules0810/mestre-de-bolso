import React, { useState } from 'react';
import { 
  Skull, Book, Dices, Swords, Package, Search, Gem, Shield, 
  BookOpen, Settings, RotateCcw, ScrollText, X, ArrowRight 
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Sidebar = ({ isOpen, onClose, onNavigate, currentRoute, t, lang }) => {
    const { itemsTab, setItemsTab } = useAppContext();
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
                                        const isActive = currentRoute === subItem.id && (!subItem.tab || itemsTab === subItem.tab);
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
