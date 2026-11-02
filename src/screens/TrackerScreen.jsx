import React, { useState } from 'react';
import { Play, X, Plus, Heart, Check, UserPlus, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { CONDITIONS } from '../constants/gameData';
import { safeText } from '../utils/helpers';

export const TrackerScreen = () => {
    const { t, tracker, setTracker, currentTurn, setCurrentTurn, round, setRound, lang } = useAppContext();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newName, setNewName] = useState("");
    const [newInit, setNewInit] = useState("");
    const [newHp, setNewHp] = useState("");
    const [showConditionMenu, setShowConditionMenu] = useState(null);
    const [hpInput, setHpInput] = useState({});

    const nextTurn = () => {
        if (tracker.length === 0) return;
        if (currentTurn >= tracker.length - 1) {
            setCurrentTurn(0);
            setRound(r => r + 1);
        } else {
            setCurrentTurn(c => c + 1);
        }
    };

    const updateHp = (idx, delta) => {
        if (idx < 0 || idx >= tracker.length) return;
        const newTracker = tracker.map((item, i) =>
            i === idx ? { ...item, hp: Math.max(0, (parseInt(item.hp, 10) || 0) + delta) } : item
        );
        setTracker(newTracker);
    };

    const updateInitiative = (id, newInit) => {
        const newTracker = tracker.map(e => e.id === id ? { ...e, initiative: newInit } : e);
        setTracker(newTracker);
    };

    const sortTracker = () => {
        const newTracker = [...tracker].map(e => ({...e, initiative: parseInt(e.initiative) || 0})).sort((a, b) => b.initiative - a.initiative);
        setTracker(newTracker);
        setCurrentTurn(0);
    };

    const toggleCondition = (entityId, conditionId) => {
        const newTracker = tracker.map(entity => {
            if (entity.id === entityId) {
                const has = entity.conditions?.includes(conditionId);
                const conds = entity.conditions || [];
                return { ...entity, conditions: has ? conds.filter(c => c !== conditionId) : [...conds, conditionId] };
            }
            return entity;
        });
        setTracker(newTracker);
        setShowConditionMenu(null);
    };

    const addPlayer = (e) => {
        e.preventDefault();
        const newEntity = {
            id: `custom-${Date.now()}`,
            name: newName || "Player",
            originalName: newName || "Player",
            initiative: parseInt(newInit) || 0,
            hp: parseInt(newHp) || 10,
            maxHp: parseInt(newHp) || 10,
            ac: 10,
            isPlayer: true,
            conditions: []
        };
        const newTracker = [...tracker, newEntity].sort((a, b) => b.initiative - a.initiative);
        setTracker(newTracker);
        setShowAddForm(false);
        setNewName(""); setNewInit(""); setNewHp("");
        if (currentTurn === -1) setCurrentTurn(0);
    };

    const removeEntity = (id) => {
        const removedIdx = tracker.findIndex(e => e.id === id);
        const newTracker = tracker.filter(e => e.id !== id);
        setTracker(newTracker);
        if (newTracker.length === 0) {
            setCurrentTurn(-1);
        } else if (removedIdx !== -1 && removedIdx < currentTurn) {
            setCurrentTurn(c => Math.max(0, c - 1));
        } else if (currentTurn >= newTracker.length) {
            setCurrentTurn(0);
        }
    };

    const handleHpChange = (id, value) => {
        setHpInput({ ...hpInput, [id]: value });
    };

    const applyHpChange = (idx, id) => {
        const delta = parseInt(hpInput[id]);
        if (!isNaN(delta)) {
            updateHp(idx, delta);
        }
        setHpInput({ ...hpInput, [id]: '' });
    };

    return (
        <div className="p-4 pb-8 max-w-lg mx-auto animate-in fade-in">
            <div className="flex gap-2 mb-4">
                <button onClick={nextTurn} className="flex-1 bg-[#FF1457] hover:opacity-90 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors active:scale-95">
                    <Play size={18} fill="currentColor" /> {t.nextTurn}
                </button>
                <div className="bg-[#35313B] px-4 rounded-xl flex items-center justify-center font-bold text-gray-300 border border-[#453745] shadow-inner gap-2 text-sm">
                    <span>{t.round} {round}</span>
                    <span className="text-gray-500">|</span>
                    <span>{t.turn} {currentTurn >= 0 ? currentTurn + 1 : 0}</span>
                </div>
            </div>

            <div className="space-y-2 mb-6">
                {tracker.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 italic">Nenhum combatente na iniciativa.</div>
                ) : (
                    tracker.map((entity, idx) => {
                        const isTurn = currentTurn === idx;
                        const isDead = entity.hp === 0;
                        const isMenuOpen = showConditionMenu === entity.id;
                        return (
                            <div key={entity.id} className={`relative p-3 rounded-xl border transition-all duration-300 ${isMenuOpen ? 'z-50' : 'z-10'} ${isTurn ? 'bg-[#453745] border-[#FF1457] scale-[1.02] shadow-lg shadow-[#FF1457]/20' : 'bg-[#35313B] border-[#453745]'} ${isDead ? 'opacity-50 grayscale' : ''}`}>
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex items-start gap-3 flex-1">
                                        <input
                                            type="number"
                                            value={entity.initiative}
                                            onChange={(e) => updateInitiative(entity.id, e.target.value === '' ? '' : parseInt(e.target.value))}
                                            onBlur={sortTracker}
                                            className={`w-12 h-12 flex-shrink-0 text-center rounded-lg flex items-center justify-center font-black text-lg outline-none focus:ring-2 focus:ring-[#FF1457] transition-colors shadow-inner ${entity.isPlayer ? 'bg-blue-600/80 text-white' : 'bg-[#613C4C] text-white border border-[#FF1457]/30'}`}
                                        />
                                        <div className="flex-1 mt-0.5">
                                            <h4 className={`font-bold text-lg leading-tight ${entity.isPlayer ? 'text-blue-400' : 'text-white'} ${isDead ? 'line-through' : ''}`}>{safeText(entity.name)}</h4>
                                            
                                            <div className="flex flex-wrap gap-1.5 mt-2 relative">
                                                {entity.conditions && entity.conditions.length > 0 && entity.conditions.map(cId => {
                                                    const conf = CONDITIONS.find(c => c.id === cId);
                                                    return conf ? (
                                                        <button key={cId} onClick={() => toggleCondition(entity.id, cId)} className={`text-[10px] font-semibold px-2.5 py-1.5 rounded flex items-center gap-1 text-white shadow-sm transition-transform active:scale-95 ${conf.color}`}>
                                                            {conf.label.split('/')[lang === 'pt' ? 1 : 0] || conf.label.split('/')[0]} <X size={12} />
                                                        </button>
                                                    ) : null;
                                                })}
                                                <button onClick={() => setShowConditionMenu(showConditionMenu === entity.id ? null : entity.id)} className="text-[10px] font-bold px-3 py-1.5 rounded bg-[#453745] hover:bg-[#613C4C] text-gray-300 flex items-center gap-1 transition-colors border border-[#613C4C] shadow-sm">
                                                    <Plus size={12}/> Status
                                                </button>
                                                
                                                {showConditionMenu === entity.id && (
                                                    <div className="absolute top-full left-0 mt-2 w-48 bg-[#2B2C30] border border-[#453745] rounded-lg shadow-2xl z-[100] p-2 grid grid-cols-1 gap-1 max-h-60 overflow-y-auto">
                                                        {CONDITIONS.map(c => {
                                                            const has = entity.conditions?.includes(c.id);
                                                            return (
                                                                <button key={c.id} onClick={() => toggleCondition(entity.id, c.id)} className={`text-left text-xs p-2 rounded transition-colors font-semibold ${has ? 'bg-[#FF1457]/20 text-[#FF1457]' : 'hover:bg-[#453745] text-gray-300'}`}>
                                                                    {has ? '✓ ' : ''}{c.label.split('/')[lang === 'pt' ? 1 : 0] || c.label.split('/')[0]}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => removeEntity(entity.id)} className="text-gray-500 hover:text-[#FF1457] p-2 transition-colors bg-[#2B2C30] rounded-lg border border-[#453745]"><X size={16}/></button>
                                </div>
                                <div className="mt-3 flex items-center justify-between border-t border-[#453745] pt-3">
                                    <div className="text-sm font-bold text-gray-300 bg-[#2B2C30] px-3 py-1.5 rounded-lg border border-[#453745] flex items-center gap-2">
                                        <Heart size={14} className="text-[#FF1457]" fill="currentColor" /> {entity.hp} <span className="text-gray-500">/ {entity.maxHp}</span>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <input 
                                            type="number"
                                            placeholder="-10 ou 5"
                                            value={hpInput[entity.id] || ''}
                                            onChange={(e) => handleHpChange(entity.id, e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') applyHpChange(idx, entity.id) }}
                                            className="w-24 bg-[#2B2C30] border border-[#453745] rounded-lg p-2 text-sm text-center text-white outline-none focus:border-[#FF1457] transition-colors placeholder-gray-600 shadow-inner"
                                        />
                                        <button onClick={() => applyHpChange(idx, entity.id)} className="w-10 h-10 bg-[#FF1457] hover:opacity-90 text-white rounded-lg flex items-center justify-center font-bold shadow transition-colors active:scale-95">
                                            <Check size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {!showAddForm ? (
                <button onClick={() => setShowAddForm(true)} className="w-full bg-[#35313B] hover:bg-[#453745] border border-[#453745] text-gray-300 font-bold py-3 rounded-xl flex items-center justify-center gap-2 mb-4 transition-colors">
                    <UserPlus size={18} /> {t.addPlayer}
                </button>
            ) : (
                <form onSubmit={addPlayer} className="bg-[#35313B] p-4 rounded-xl border border-[#FF1457]/50 mb-4 shadow-lg animate-in fade-in zoom-in-95">
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2"><UserPlus size={16} className="text-[#FF1457]"/> {t.addPlayer}</h4>
                    <div className="flex gap-2 mb-3">
                        <input type="text" placeholder={t.name} value={newName} onChange={e => setNewName(e.target.value)} required className="flex-1 bg-[#2B2C30] border border-[#453745] text-white rounded-lg p-2 outline-none focus:border-[#FF1457] text-sm" />
                        <input type="number" placeholder="Init" value={newInit} onChange={e => setNewInit(e.target.value)} required className="w-16 bg-[#2B2C30] border border-[#453745] text-white rounded-lg p-2 outline-none focus:border-[#FF1457] text-sm text-center" />
                        <input type="number" placeholder="HP" value={newHp} onChange={e => setNewHp(e.target.value)} required className="w-20 bg-[#2B2C30] border border-[#453745] text-white rounded-lg p-2 outline-none focus:border-[#FF1457] text-sm text-center" />
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-white py-2 rounded-lg font-bold text-sm">{t.cancel}</button>
                        <button type="submit" className="flex-1 bg-[#FF1457] hover:opacity-90 text-white py-2 rounded-lg font-bold text-sm">{t.add}</button>
                    </div>
                </form>
            )}

            <button onClick={() => { setTracker([]); setCurrentTurn(-1); setRound(1); }} className="w-full text-[#FF1457] hover:text-white font-semibold py-3 text-sm flex items-center justify-center gap-2 mt-4 transition-colors">
                <Trash2 size={16} /> {t.clearTracker}
            </button>
        </div>
    );
};
