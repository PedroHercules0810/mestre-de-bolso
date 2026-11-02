import React, { useState } from 'react';
import { Lock, Unlock, Dices, Skull } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { XP_BUDGET_5E } from '../constants/gameData';
import { translateTerm } from '../utils/translators';

export const HomeScreen = ({ onNavigate }) => {
  const { t, generateEncounter, encounterError, setEncounterError, lang } = useAppContext();
  const [partySize, setPartySize] = useState(4);
  const [avgLevel, setAvgLevel] = useState(1);
  const [difficulty, setDifficulty] = useState('moderate');
  const [typeFilter, setTypeFilter] = useState('Any');
  const [envFilter, setEnvFilter] = useState('Any');
  const [styleFilter, setStyleFilter] = useState('balanced');
  const [budgetMult, setBudgetMult] = useState(100);
  const [showFilters, setShowFilters] = useState(false);

  const handleGenerate = (force = false) => {
    const success = generateEncounter(partySize, avgLevel, difficulty, { type: typeFilter, environment: envFilter }, budgetMult / 100, styleFilter, force);
    if (success) onNavigate('encounter');
  };

  const baseBudget = (XP_BUDGET_5E[avgLevel]?.[difficulty] || XP_BUDGET_5E[1][difficulty]) * partySize;
  const currentBudget = Math.floor(baseBudget * (budgetMult / 100));

  return (
    <div className="p-4 space-y-4 pb-8 max-w-lg mx-auto">
      <div className="bg-[#35313B] p-5 rounded-3xl shadow-xl border border-[#453745]">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="text-xs text-gray-400 font-semibold mb-1 block uppercase tracking-wider">{t.partySize}</label>
            <div className="flex items-center bg-[#2B2C30] rounded-xl p-1 border border-[#453745]">
              <button onClick={() => setPartySize(Math.max(1, partySize - 1))} className="p-2 text-gray-400 hover:text-white transition-colors">-</button>
              <span className="flex-1 text-center font-bold text-lg text-white">{partySize}</span>
              <button onClick={() => setPartySize(partySize + 1)} className="p-2 text-gray-400 hover:text-white transition-colors">+</button>
            </div>
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-400 font-semibold mb-1 block uppercase tracking-wider">{t.avgLevel}</label>
            <div className="flex items-center bg-[#2B2C30] rounded-xl p-1 border border-[#453745]">
              <button onClick={() => setAvgLevel(Math.max(1, avgLevel - 1))} className="p-2 text-gray-400 hover:text-white transition-colors">-</button>
              <span className="flex-1 text-center font-bold text-lg text-white">{avgLevel}</span>
              <button onClick={() => setAvgLevel(Math.min(20, avgLevel + 1))} className="p-2 text-gray-400 hover:text-white transition-colors">+</button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs text-gray-400 font-semibold mb-2 block uppercase tracking-wider">{t.difficulty}</label>
          <div className="flex gap-2 bg-[#2B2C30] p-1 rounded-xl border border-[#453745]">
            {['low', 'moderate', 'high'].map(d => (
              <button key={d} onClick={() => setDifficulty(d)} 
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${difficulty === d ? 'bg-[#FF1457] text-white shadow-md' : 'text-gray-400 hover:text-gray-200 hover:bg-[#35313B]'}`}>
                {t[d]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{t.budgetAdj}</label>
                <span className="text-[#FF1457] font-bold">{budgetMult}%</span>
            </div>
            <input type="range" min="50" max="300" step="10" value={budgetMult} onChange={(e) => setBudgetMult(Number(e.target.value))}
                className="w-full h-2 bg-[#453745] rounded-lg appearance-none cursor-pointer accent-[#FF1457]" />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>{currentBudget} XP</span>
                {budgetMult !== 100 && <span>({t.recommended}: {baseBudget} XP)</span>}
            </div>
        </div>

        <button onClick={() => setShowFilters(!showFilters)} className="w-full text-left flex items-center justify-between py-2 text-gray-400 hover:text-[#FF1457] border-b border-[#453745] mb-4 transition-colors">
          <span className="font-semibold">{t.filters}</span>
          {showFilters ? <Lock size={16}/> : <Unlock size={16}/>}
        </button>

        {showFilters && (
          <div className="space-y-4 mb-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">{t.style}</label>
              <select value={styleFilter} onChange={(e) => setStyleFilter(e.target.value)} className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-lg p-3 outline-none focus:border-[#FF1457] transition-colors">
                <option value="balanced">{t.balanced}</option>
                <option value="boss">{t.boss}</option>
                <option value="horde">{t.horde}</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">{t.type}</label>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-lg p-3 outline-none focus:border-[#FF1457] transition-colors">
                {['Any', 'Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon', 'Elemental', 'Fey', 'Fiend', 'Giant', 'Humanoid', 'Monstrosity', 'Ooze', 'Plant', 'Undead'].map(tOption => 
                    <option key={tOption} value={tOption}>{tOption === 'Any' ? t.any : translateTerm(tOption, lang)}</option>
                )}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">{t.environment}</label>
              <select value={envFilter} onChange={(e) => setEnvFilter(e.target.value)} className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-lg p-3 outline-none focus:border-[#FF1457] transition-colors">
                {['Any', 'Arctic', 'Coastal', 'Desert', 'Forest', 'Grassland', 'Hill', 'Mountain', 'Swamp', 'Underdark', 'Underwater', 'Urban'].map(env => <option key={env} value={env}>{env === 'Any' ? t.any : env}</option>)}
              </select>
            </div>
          </div>
        )}

        <button onClick={() => handleGenerate(false)} className="w-full bg-gradient-to-r from-[#FF1457] to-[#613C4C] hover:opacity-90 text-white font-black py-4 rounded-2xl shadow-lg shadow-[#FF1457]/30 flex items-center justify-center gap-2 transform active:scale-95 transition-all">
          <Dices size={24} /> {t.generateBtn}
        </button>
      </div>
      
      {encounterError && (
        <div className="fixed inset-0 bg-[#2B2C30]/90 flex items-center justify-center p-4 z-50">
          <div className="bg-[#35313B] p-6 rounded-2xl border border-[#FF1457]/50 shadow-2xl max-w-sm w-full text-center">
            <Skull size={48} className="mx-auto text-[#FF1457] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t.error}</h3>
            <p className="text-gray-300 mb-6">{t[encounterError] || encounterError}</p>
            <div className="flex flex-col gap-3">
              {(encounterError === 'partyTooWeak' || encounterError === 'budgetTooLow') && (
                <button onClick={() => { setEncounterError(null); handleGenerate(true); }} className="w-full bg-[#FF1457] hover:bg-[#d10e46] text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2">
                  <Skull size={18} /> {t.forceGenerate}
                </button>
              )}
              <button onClick={() => setEncounterError(null)} className="w-full bg-[#453745] hover:bg-[#613C4C] text-white font-bold py-3 rounded-xl transition-colors">
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
