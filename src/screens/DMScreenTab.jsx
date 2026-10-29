import React, { useState } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { REFERENCE_DATA } from '../constants/referenceData';

export const DMScreenTab = () => {
    const { lang, t } = useAppContext();
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
