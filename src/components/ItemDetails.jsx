import React from 'react';
import { safeText } from '../utils/helpers';
import { translateName, translateTerm } from '../utils/translators';

export const renderItemDetails = (item, lang) => {
    return (
        <div className="bg-[#2B2C30] border border-[#453745] text-gray-200 p-4 rounded-xl shadow-inner text-sm font-sans space-y-3">
            <div className="border-b-2 border-[#453745] pb-2">
                <h4 className="font-bold text-lg text-[#FF1457]">{translateName(safeText(item.name), lang)}</h4>
                <p className="italic text-xs text-gray-400 capitalize">
                    {translateTerm(safeText(item.type) || safeText(item.equipment_category), lang)} 
                    {item.rarity && ` • ${translateTerm(safeText(item.rarity), lang)}`}
                    {item.requires_attunement && ` (Requires Attunement)`}
                </p>
            </div>
            
            {(item.cost || item.damage_dice || item.ac_string) && (
                <div className="text-xs space-y-1 font-bold bg-[#35313B] p-3 rounded-lg border border-[#453745]">
                    {item.cost && <p><span className="text-[#FF1457]">Cost:</span> {safeText(item.cost)}</p>}
                    {item.damage_dice && <p><span className="text-[#FF1457]">Damage:</span> {safeText(item.damage_dice)} {translateTerm(safeText(item.damage_type), lang)}</p>}
                    {item.weight && <p><span className="text-[#FF1457]">Weight:</span> {safeText(item.weight)}</p>}
                    {item.ac_string && <p><span className="text-[#FF1457]">Armor Class:</span> {safeText(item.ac_string)}</p>}
                    {item.properties && Array.isArray(item.properties) && <p><span className="text-[#FF1457]">Properties:</span> {item.properties.map(p => translateTerm(p, lang)).join(', ')}</p>}
                </div>
            )}
            
            <div className="whitespace-pre-wrap leading-relaxed text-gray-300">
                {safeText(item.desc)}
            </div>
        </div>
    );
};
