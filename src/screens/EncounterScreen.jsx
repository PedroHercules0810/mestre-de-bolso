import React, { useState } from 'react';
import { Swords, Gem, Skull, X, ArrowRight, Minus, Plus, Trash2, Shield, ScrollText } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { safeText } from '../utils/helpers';
import { translateName } from '../utils/translators';
import { StatBlock } from '../components/StatBlock';

export const EncounterScreen = ({ onNavigate }) => {
  const { t, encounter, setEncounter, addToTracker, updateMonsterCount, lang, campaigns, addEncounterToCampaign } = useAppContext();
  const [expanded, setExpanded] = useState({});
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [customEncounterName, setCustomEncounterName] = useState("");

  if (!encounter || !encounter.monsters || encounter.monsters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center pt-24 animate-in fade-in">
        <Swords size={48} className="mb-4 opacity-50 text-[#FF1457]" />
        <p className="mb-6">{t.emptyEncounter}</p>
        <div className="flex gap-4 flex-col sm:flex-row">
            <button onClick={() => onNavigate('home')} className="bg-[#FF1457] hover:opacity-90 text-white px-6 py-3 rounded-full font-bold transition-colors">{t.generator}</button>
            <button onClick={() => onNavigate('bestiary')} className="bg-[#453745] hover:bg-[#613C4C] text-white px-6 py-3 rounded-full font-bold transition-colors">{t.bestiary}</button>
        </div>
      </div>
    );
  }

  const openSaveToCampaignModal = () => {
      if (campaigns.length > 0 && !selectedCampaignId) {
          setSelectedCampaignId(campaigns[0].id);
      }
      setCustomEncounterName("");
      setShowSaveModal(true);
  };

  const handleConfirmSaveToCampaign = (e) => {
      e.preventDefault();
      const targetId = selectedCampaignId || (campaigns[0] && campaigns[0].id);
      if (!targetId) return;
      addEncounterToCampaign(targetId, customEncounterName);
      setShowSaveModal(false);
      setCustomEncounterName("");
  };

  const selectedCampObj = campaigns.find(c => c.id === (selectedCampaignId || (campaigns[0] && campaigns[0].id)));
  const nextEncounterNumber = selectedCampObj ? (selectedCampObj.encounters || []).length : 0;

  const renderEncounterLoot = (loot) => {
      if (!loot) return <p className="text-white text-xs">-</p>;
      const coinsStr = Object.entries(loot.coins || {}).map(([k,v]) => `${v} ${k}`).join(', ');
      const itemsCount = loot.items ? loot.items.length : 0;
      return (
          <div className="text-right flex flex-col items-end">
              <h2 className="text-[#FF1457] font-bold text-sm uppercase flex items-center gap-1"><Gem size={14}/> {t.loot}</h2>
              <p className="text-white text-xs font-bold mt-1 bg-[#2B2C30] px-2 py-1 rounded-md border border-[#453745]">{coinsStr || "0"}</p>
              {loot.gems && <p className="text-gray-400 text-[10px] mt-1 max-w-[150px] truncate">{loot.gems}</p>}
              {itemsCount > 0 && <p className="text-[#FF1457] text-[10px] font-bold bg-[#FF1457]/10 px-2 py-0.5 rounded-full mt-1 border border-[#FF1457]/30">+{itemsCount} {t.magicItems}</p>}
          </div>
      );
  };

  return (
    <div className="p-4 pb-8 max-w-lg mx-auto animate-in fade-in">
      <div className="bg-[#35313B] rounded-2xl p-4 mb-4 shadow-lg border border-[#453745] flex justify-between items-start">
        <div>
          <h2 className="text-white font-bold text-lg">{t.totalBudget}</h2>
          <p className="text-gray-400 text-sm">{encounter.totalXP} {t.xp}</p>
        </div>
        {renderEncounterLoot(encounter.loot)}
      </div>

      <div className="space-y-3 mb-6">
        {encounter.monsters.map((m, idx) => (
          <div key={idx} className="bg-[#35313B] rounded-xl overflow-hidden border border-[#453745] shadow-md transition-all">
            <div className={`p-4 flex flex-col gap-3 ${m.isBoss ? 'border-l-4 border-[#FF1457]' : ''}`}>
                <div className="flex items-center justify-between">
                    <div className="flex-1 cursor-pointer flex items-center gap-2" onClick={() => setExpanded({ ...expanded, [idx]: !expanded[idx] })}>
                        <h3 className="font-bold text-white leading-tight flex items-center gap-2">
                            {translateName(safeText(m.name), lang)} {m.isBoss && <Skull size={14} className="text-[#FF1457]"/>}
                        </h3>
                        {expanded[idx] ? <X size={16} className="text-gray-500"/> : <ArrowRight size={16} className="rotate-90 text-gray-500" />}
                    </div>
                    
                    <div className="flex items-center bg-[#2B2C30] rounded-lg p-1 border border-[#453745] ml-2">
                        <button onClick={(e) => { e.stopPropagation(); updateMonsterCount(m.slug, -1); }} className="p-2 text-gray-400 hover:text-[#FF1457] transition-colors"><Minus size={14}/></button>
                        <span className="w-6 text-center font-bold text-sm text-white">{m.count}</span>
                        <button onClick={(e) => { e.stopPropagation(); updateMonsterCount(m.slug, 1); }} className="p-2 text-gray-400 hover:text-[#FF1457] transition-colors"><Plus size={14}/></button>
                    </div>
                </div>
                <div className="text-xs text-gray-400">CR {safeText(m.challenge_rating)} • {m.xp} XP / un</div>
            </div>
            
            {expanded[idx] && (
              <div className="p-4 bg-[#2B2C30] border-t border-[#453745]">
                <StatBlock monster={m} lang={lang} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
          <div className="flex gap-2">
              <button onClick={() => setEncounter(null)} className="bg-[#453745] hover:bg-[#613C4C] border border-[#613C4C] text-[#FF1457] font-bold p-4 rounded-xl shadow-lg transition-colors flex items-center justify-center">
                <Trash2 size={20} />
              </button>
              <button onClick={openSaveToCampaignModal} className="flex-1 bg-[#35313B] hover:bg-[#453745] border border-[#FF1457]/50 text-white font-bold py-4 px-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors text-sm">
                <ScrollText size={18} className="text-[#FF1457]" /> {t.saveToCampaign}
              </button>
          </div>
          <button onClick={() => { addToTracker(); onNavigate('tracker'); }} className="w-full bg-[#FF1457] hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors">
            <Shield size={20} /> {t.addToTracker}
          </button>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 bg-[#2B2C30]/90 flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#35313B] p-6 rounded-2xl border border-[#FF1457]/50 shadow-2xl max-w-sm w-full">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ScrollText size={20} className="text-[#FF1457]" /> {t.saveToCampaign}
            </h3>

            {campaigns.length === 0 ? (
              <div className="text-center space-y-4">
                <p className="text-gray-300 text-sm">{t.createCampaignFirst}</p>
                <div className="flex gap-2">
                  <button onClick={() => setShowSaveModal(false)} className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-white font-bold py-2.5 rounded-xl text-sm">
                    {t.cancel}
                  </button>
                  <button onClick={() => { setShowSaveModal(false); onNavigate('campaigns'); }} className="flex-1 bg-[#FF1457] hover:opacity-90 text-white font-bold py-2.5 rounded-xl text-sm">
                    {t.campaigns}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmSaveToCampaign} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 font-semibold mb-1.5 block uppercase tracking-wider">
                    {t.selectCampaign}
                  </label>
                  <select
                    value={selectedCampaignId || campaigns[0].id}
                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                    className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-3 outline-none focus:border-[#FF1457] transition-colors font-bold text-sm"
                  >
                    {campaigns.map(camp => (
                      <option key={camp.id} value={camp.id}>{camp.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-semibold mb-1.5 block uppercase tracking-wider">
                    {t.encounterName}
                  </label>
                  <input
                    type="text"
                    placeholder={`Encounter #${nextEncounterNumber}`}
                    value={customEncounterName}
                    onChange={(e) => setCustomEncounterName(e.target.value)}
                    className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-3 outline-none focus:border-[#FF1457] transition-colors text-sm"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSaveModal(false)}
                    className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-white font-bold py-3 rounded-xl text-sm transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#FF1457] hover:opacity-90 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-lg"
                  >
                    {t.save}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
