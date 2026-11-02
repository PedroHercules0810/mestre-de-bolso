import React from 'react';
import { Sparkles } from 'lucide-react';
import { safeText } from '../utils/helpers';
import { translateName, translateTerm } from '../utils/translators';
import { useSmartDescription } from '../services/translatorService';

export const ItemDetailsCard = ({ item, lang }) => {
    const rawDesc = safeText(item.desc);
    const { text: translatedDesc, isNeural } = useSmartDescription(rawDesc, lang);

    const attunementText = item.requires_attunement
        ? (lang === 'pt'
            ? (typeof item.requires_attunement === 'string' && item.requires_attunement.toLowerCase() !== 'requires attunement'
                ? ` (${item.requires_attunement.replace(/requires attunement/gi, 'Requer Sintonia').replace(/\bby a\b/gi, 'por um')})`
                : ' (Requer Sintonia)')
            : ' (Requires Attunement)')
        : '';

    return (
        <div className="bg-[#2B2C30] border border-[#453745] text-gray-200 p-4 rounded-xl shadow-inner text-sm font-sans space-y-3">
            <div className="border-b-2 border-[#453745] pb-2 flex justify-between items-start gap-2">
                <div>
                    <h4 className="font-bold text-lg text-[#FF1457]">{translateName(safeText(item.name), lang)}</h4>
                    <p className="italic text-xs text-gray-400 capitalize">
                        {translateTerm(safeText(item.type) || safeText(item.equipment_category), lang)} 
                        {item.rarity && ` • ${translateTerm(safeText(item.rarity), lang)}`}
                        {attunementText}
                    </p>
                </div>
                {lang === 'pt' && rawDesc && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-[#35313B] text-gray-400 px-2 py-1 rounded-full border border-[#453745] flex items-center gap-1 shrink-0">
                        <Sparkles size={10} className="text-[#FF1457]" />
                        {isNeural ? 'PT-BR' : 'Auto'}
                    </span>
                )}
            </div>
            
            {(item.cost || item.damage_dice || item.ac_string || item.weight || (item.properties && item.properties.length > 0)) && (
                <div className="text-xs space-y-1 font-bold bg-[#35313B] p-3 rounded-lg border border-[#453745]">
                    {item.cost && (
                        <p><span className="text-[#FF1457]">{lang === 'pt' ? 'Custo' : 'Cost'}:</span> {safeText(item.cost)}</p>
                    )}
                    {item.damage_dice && (
                        <p><span className="text-[#FF1457]">{lang === 'pt' ? 'Dano' : 'Damage'}:</span> {safeText(item.damage_dice)} {translateTerm(safeText(item.damage_type), lang)}</p>
                    )}
                    {item.weight && (
                        <p><span className="text-[#FF1457]">{lang === 'pt' ? 'Peso' : 'Weight'}:</span> {safeText(item.weight)}</p>
                    )}
                    {item.ac_string && (
                        <p><span className="text-[#FF1457]">{lang === 'pt' ? 'Classe de Armadura' : 'Armor Class'}:</span> {safeText(item.ac_string)}</p>
                    )}
                    {item.properties && Array.isArray(item.properties) && item.properties.length > 0 && (
                        <p><span className="text-[#FF1457]">{lang === 'pt' ? 'Propriedades' : 'Properties'}:</span> {item.properties.map(p => translateTerm(safeText(p), lang)).join(', ')}</p>
                    )}
                </div>
            )}
            
            {translatedDesc && (
                <div className="whitespace-pre-wrap leading-relaxed text-gray-300 text-xs">
                    {translatedDesc.replace(/\*\*/g, '')}
                </div>
            )}
        </div>
    );
};

export const renderItemDetails = (item, lang) => {
    return <ItemDetailsCard item={item} lang={lang} />;
};
