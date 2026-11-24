import React, { useState, useEffect } from 'react';
import {
    Dices, Plus, Minus, RotateCcw, Trash2, Sparkles, Skull, History, Play
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { DICE_TYPES, executeDicePoolRoll, formatPoolFormula } from '../utils/diceRoller';

const INITIAL_POOL = { 4: 0, 6: 0, 8: 0, 10: 0, 12: 0, 20: 1, 100: 0 };

export const DiceRollerScreen = () => {
    const { lang, t } = useAppContext();
    const [pool, setPool] = useState(INITIAL_POOL);
    const [modifier, setModifier] = useState(0);
    const [rollMode, setRollMode] = useState('normal'); // 'normal' | 'advantage' | 'disadvantage'
    const [lastResult, setLastResult] = useState(null);
    const [isRollingAnim, setIsRollingAnim] = useState(false);
    const [history, setHistory] = useState(() => {
        try {
            const saved = localStorage.getItem('mestre_dice_history');
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed.slice(0, 20) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('mestre_dice_history', JSON.stringify(history.slice(0, 20)));
        } catch {
            // ignore storage errors
        }
    }, [history]);

    const updateDieCount = (sides, delta) => {
        setPool(prev => {
            const current = prev[sides] || 0;
            const next = Math.max(0, Math.min(99, current + delta));
            return { ...prev, [sides]: next };
        });
    };

    const setSingleDieQuickRoll = (sides) => {
        const freshPool = { 4: 0, 6: 0, 8: 0, 10: 0, 12: 0, 20: 0, 100: 0, [sides]: 1 };
        setPool(freshPool);
        triggerRoll(freshPool, modifier, rollMode);
    };

    const clearPool = () => {
        setPool({ 4: 0, 6: 0, 8: 0, 10: 0, 12: 0, 20: 0, 100: 0 });
        setModifier(0);
        setRollMode('normal');
    };

    const totalDiceInPool = Object.values(pool).reduce((sum, count) => sum + (parseInt(count, 10) || 0), 0);
    const activeFormula = formatPoolFormula(pool, modifier, rollMode, lang);

    const triggerRoll = (customPool = pool, customMod = modifier, customMode = rollMode) => {
        const countSum = Object.values(customPool).reduce((s, c) => s + (parseInt(c, 10) || 0), 0);
        const effectivePool = countSum > 0 ? customPool : { ...customPool, 20: 1 };
        if (countSum === 0) {
            setPool(effectivePool);
        }

        setIsRollingAnim(true);
        setTimeout(() => setIsRollingAnim(false), 180);

        const result = executeDicePoolRoll({
            pool: effectivePool,
            modifier: customMod,
            rollMode: customMode
        });

        const enriched = {
            ...result,
            id: `roll-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            poolSnapshot: { ...effectivePool },
            formulaPt: formatPoolFormula(effectivePool, customMod, customMode, 'pt'),
            formulaEn: formatPoolFormula(effectivePool, customMod, customMode, 'en')
        };

        setLastResult(enriched);
        setHistory(prev => [enriched, ...prev].slice(0, 20));
    };

    const handleRerollHistoryItem = (item) => {
        if (!item?.poolSnapshot) return;
        setPool(item.poolSnapshot);
        setModifier(item.modifier || 0);
        setRollMode(item.rollMode || 'normal');
        triggerRoll(item.poolSnapshot, item.modifier || 0, item.rollMode || 'normal');
    };

    const getDieColorClass = (sides) => {
        const found = DICE_TYPES.find(d => d.sides === sides);
        return found ? found.color : 'border-[#453745] bg-[#35313B] text-white';
    };

    return (
        <div className="p-4 pb-10 max-w-lg mx-auto space-y-4 animate-in fade-in">
            {/* ============================================================== */}
            {/* 1. PAINEL DE VISUALIZAÇÃO DO RESULTADO EM DESTAQUE             */}
            {/* ============================================================== */}
            <div className={`bg-gradient-to-br from-[#613C4C] via-[#35313B] to-[#2B2C30] rounded-2xl border-2 p-5 shadow-xl transition-all duration-200 ${
                lastResult?.isCritSuccess
                    ? 'border-emerald-400 shadow-emerald-500/20'
                    : lastResult?.isCritFail
                        ? 'border-[#FF1457] shadow-[#FF1457]/30'
                        : 'border-[#FF1457]/50'
            } ${isRollingAnim ? 'scale-[0.98] opacity-80' : 'scale-100 opacity-100'}`}>
                {!lastResult ? (
                    <div className="text-center py-6 space-y-2">
                        <Dices size={42} className="mx-auto text-[#FF1457] opacity-80" />
                        <h2 className="text-white font-black text-base uppercase tracking-wider">
                            {t.diceRollerTitle}
                        </h2>
                        <p className="text-xs text-gray-300">
                            {lang === 'pt'
                                ? 'Selecione quantos e quais dados deseja abaixo e toque em Rolar Dados!'
                                : 'Select how many and which dice you want below and tap Roll Dice!'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Cabeçalho do Resultado: Fórmula + Badges de Crítico / Vantagem */}
                        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#453745] pb-2.5">
                            <span className="text-xs font-black uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                                <Dices size={15} className="text-[#FF1457]" />
                                {lang === 'pt' ? lastResult.formulaPt : lastResult.formulaEn}
                            </span>

                            <div className="flex items-center gap-1.5">
                                {lastResult.rollMode === 'advantage' && (
                                    <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                                        {t.advantage}
                                    </span>
                                )}
                                {lastResult.rollMode === 'disadvantage' && (
                                    <span className="text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40">
                                        {t.disadvantage}
                                    </span>
                                )}
                                {lastResult.isCritSuccess && (
                                    <span className="text-[10px] font-black uppercase bg-emerald-500 text-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                                        <Sparkles size={11} /> 20 Natural!
                                    </span>
                                )}
                                {lastResult.isCritFail && (
                                    <span className="text-[10px] font-black uppercase bg-[#FF1457] text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                                        <Skull size={11} /> 1 Natural!
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Número Total Gigante */}
                        <div className="text-center py-1">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                {t.rollResultTotal}
                            </div>
                            <div className={`text-5xl font-black tracking-tight leading-none mt-1 ${
                                lastResult.isCritSuccess
                                    ? 'text-emerald-400'
                                    : lastResult.isCritFail
                                        ? 'text-[#FF1457]'
                                        : 'text-white'
                            }`}>
                                {lastResult.total}
                            </div>
                            {lastResult.modifier !== 0 && (
                                <div className="text-xs text-gray-300 font-bold mt-1.5">
                                    {lang === 'pt' ? 'Dados' : 'Dice'}: {lastResult.diceSubtotal}{' '}
                                    {lastResult.modifier > 0 ? `+ ${lastResult.modifier}` : `- ${Math.abs(lastResult.modifier)}`} ({lang === 'pt' ? 'Mod.' : 'Mod'})
                                </div>
                            )}
                        </div>

                        {/* Detalhamento Visual de Cada Dado Rolado */}
                        <div className="space-y-2 bg-[#2B2C30]/90 p-3 rounded-xl border border-[#453745]">
                            {lastResult.groups.map(grp => (
                                <div key={grp.sides} className="flex items-center justify-between gap-2 flex-wrap border-b border-[#453745]/60 last:border-b-0 pb-2 last:pb-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-[11px] font-black px-2 py-0.5 rounded-lg border ${getDieColorClass(grp.sides)}`}>
                                            {grp.count}{grp.label}
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {grp.rolls.map((r, rIdx) => (
                                                <div
                                                    key={rIdx}
                                                    className={`px-2.5 py-1 rounded-lg border text-xs font-black flex items-center gap-1.5 ${
                                                        r.isMax
                                                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                                            : r.isMin
                                                                ? 'bg-[#FF1457]/20 border-[#FF1457] text-[#FF1457]'
                                                                : 'bg-[#35313B] border-[#453745] text-white'
                                                    }`}
                                                >
                                                    <span>{r.value}</span>
                                                    {r.hasAdvPair && r.droppedValue !== null && (
                                                        <span className="text-[10px] text-gray-500 line-through font-normal">
                                                            ({r.droppedValue})
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-gray-400">
                                        = <strong className="text-white">{grp.subtotal}</strong>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ============================================================== */}
            {/* 2. SELETOR DE MODO: NORMAL | VANTAGEM | DESVANTAGEM            */}
            {/* ============================================================== */}
            <div className="bg-[#35313B] p-3 rounded-2xl border border-[#453745] shadow-md space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block px-1">
                    {t.rollModeLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        type="button"
                        onClick={() => setRollMode('normal')}
                        className={`py-2.5 px-2 rounded-xl font-black text-xs uppercase transition-all border ${
                            rollMode === 'normal'
                                ? 'bg-[#FF1457] border-[#FF1457] text-white shadow-md'
                                : 'bg-[#2B2C30] border-[#453745] text-gray-400 hover:text-white'
                        }`}
                    >
                        {t.normalRoll}
                    </button>
                    <button
                        type="button"
                        onClick={() => setRollMode('advantage')}
                        className={`py-2.5 px-2 rounded-xl font-black text-xs uppercase transition-all border ${
                            rollMode === 'advantage'
                                ? 'bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-600/25'
                                : 'bg-[#2B2C30] border-[#453745] text-gray-400 hover:text-emerald-300'
                        }`}
                    >
                        {t.advantage}
                    </button>
                    <button
                        type="button"
                        onClick={() => setRollMode('disadvantage')}
                        className={`py-2.5 px-2 rounded-xl font-black text-xs uppercase transition-all border ${
                            rollMode === 'disadvantage'
                                ? 'bg-amber-600 border-amber-400 text-white shadow-md shadow-amber-600/25'
                                : 'bg-[#2B2C30] border-[#453745] text-gray-400 hover:text-amber-300'
                        }`}
                    >
                        {t.disadvantage}
                    </button>
                </div>
            </div>

            {/* ============================================================== */}
            {/* 3. MONTADOR DE PARADA DE DADOS (QUANTOS E QUAIS DADOS QUISER)  */}
            {/* ============================================================== */}
            <div className="bg-[#35313B] p-4 rounded-2xl border border-[#453745] shadow-md space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#FF1457] flex items-center gap-1.5">
                        <Dices size={14} /> {t.buildDicePool}
                    </h3>
                    <button
                        type="button"
                        onClick={clearPool}
                        className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white bg-[#2B2C30] px-2.5 py-1 rounded-lg border border-[#453745] flex items-center gap-1 transition-colors"
                    >
                        <RotateCcw size={11} /> {t.clearDicePool}
                    </button>
                </div>

                {/* Grade dos 7 Dados Poliedrais (d4, d6, d8, d10, d12, d20, d100) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {DICE_TYPES.map(die => {
                        const count = pool[die.sides] || 0;
                        const isActive = count > 0;
                        return (
                            <div
                                key={die.sides}
                                className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                                    isActive
                                        ? 'bg-[#2B2C30] border-[#FF1457] shadow-md shadow-[#FF1457]/10'
                                        : 'bg-[#2B2C30]/60 border-[#453745]'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <button
                                        type="button"
                                        onClick={() => updateDieCount(die.sides, 1)}
                                        className={`text-sm font-black px-2.5 py-1 rounded-lg border transition-transform active:scale-95 ${die.color}`}
                                    >
                                        {die.label}
                                    </button>
                                    <span className={`text-sm font-black ${isActive ? 'text-white' : 'text-gray-500'}`}>
                                        {count}x
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => updateDieCount(die.sides, -1)}
                                        disabled={count === 0}
                                        className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center transition-colors ${
                                            count === 0
                                                ? 'bg-[#35313B]/40 border-[#453745]/40 text-gray-600 cursor-not-allowed'
                                                : 'bg-[#35313B] border-[#453745] text-gray-300 hover:text-[#FF1457]'
                                        }`}
                                    >
                                        <Minus size={13} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => updateDieCount(die.sides, 1)}
                                        className="flex-1 py-1.5 rounded-lg bg-[#35313B] border border-[#453745] text-gray-200 hover:text-white hover:border-[#FF1457] flex items-center justify-center transition-colors"
                                    >
                                        <Plus size={13} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSingleDieQuickRoll(die.sides)}
                                        title={lang === 'pt' ? `Rolar 1${die.label} agora` : `Quick roll 1${die.label}`}
                                        className="py-1.5 px-2 rounded-lg bg-[#FF1457]/20 border border-[#FF1457]/40 text-[#FF1457] hover:bg-[#FF1457] hover:text-white text-[10px] font-black transition-colors"
                                    >
                                        1{die.label}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Modificador Fixo (+Bônus / -Penalidade) */}
                <div className="bg-[#2B2C30] p-3 rounded-xl border border-[#453745] flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase text-gray-300">
                        {t.diceModifierLabel}:
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setModifier(m => m - 5)}
                            className="px-2 py-1.5 rounded-lg bg-[#35313B] border border-[#453745] text-xs font-bold text-gray-300 hover:text-white"
                        >
                            -5
                        </button>
                        <button
                            type="button"
                            onClick={() => setModifier(m => m - 1)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#35313B] border border-[#453745] text-xs font-bold text-gray-300 hover:text-white"
                        >
                            -1
                        </button>
                        <input
                            type="number"
                            value={modifier}
                            onChange={e => setModifier(parseInt(e.target.value, 10) || 0)}
                            className="w-16 bg-[#35313B] border border-[#FF1457]/50 rounded-lg py-1.5 text-center font-black text-sm text-white outline-none focus:border-[#FF1457]"
                        />
                        <button
                            type="button"
                            onClick={() => setModifier(m => m + 1)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#35313B] border border-[#453745] text-xs font-bold text-gray-300 hover:text-white"
                        >
                            +1
                        </button>
                        <button
                            type="button"
                            onClick={() => setModifier(m => m + 5)}
                            className="px-2 py-1.5 rounded-lg bg-[#35313B] border border-[#453745] text-xs font-bold text-gray-300 hover:text-white"
                        >
                            +5
                        </button>
                    </div>
                </div>

                {/* Botão Principal de Rolar Parada de Dados */}
                <button
                    type="button"
                    onClick={() => triggerRoll(pool, modifier, rollMode)}
                    className="w-full bg-gradient-to-r from-[#FF1457] to-[#613C4C] hover:opacity-95 active:scale-[0.99] text-white font-black py-4 rounded-xl shadow-lg shadow-[#FF1457]/30 flex items-center justify-center gap-2.5 text-sm uppercase tracking-wider transition-all"
                >
                    <Dices size={20} />
                    {t.rollDiceBtn} ({totalDiceInPool > 0 ? activeFormula : `1d20${modifier ? (modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`) : ''}`})
                </button>
            </div>

            {/* ============================================================== */}
            {/* 4. HISTÓRICO DE ROLAGENS DA SESSÃO                             */}
            {/* ============================================================== */}
            {history.length > 0 && (
                <div className="bg-[#35313B] p-4 rounded-2xl border border-[#453745] shadow-md space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                            <History size={14} className="text-[#FF1457]" /> {t.rollHistoryTitle}
                        </h3>
                        <button
                            type="button"
                            onClick={() => setHistory([])}
                            className="text-[10px] font-bold text-gray-400 hover:text-[#FF1457] flex items-center gap-1"
                        >
                            <Trash2 size={12} /> {lang === 'pt' ? 'Limpar' : 'Clear'}
                        </button>
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {history.map(item => (
                            <div
                                key={item.id}
                                className="bg-[#2B2C30] p-3 rounded-xl border border-[#453745] flex items-center justify-between gap-2"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="font-bold text-xs text-white">
                                            {lang === 'pt' ? item.formulaPt : item.formulaEn}
                                        </span>
                                        {item.isCritSuccess && (
                                            <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/40">
                                                CRIT 20
                                            </span>
                                        )}
                                        {item.isCritFail && (
                                            <span className="text-[9px] font-black bg-[#FF1457]/20 text-[#FF1457] px-1.5 py-0.5 rounded border border-[#FF1457]/40">
                                                FALHA 1
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-[11px] text-gray-400 truncate mt-0.5">
                                        [{item.allKeptRolls.map(r => r.droppedValue !== null ? `${r.value}(${r.droppedValue})` : r.value).join(', ')}]
                                        {item.modifier !== 0 ? ` ${item.modifier > 0 ? `+ ${item.modifier}` : `- ${Math.abs(item.modifier)}`}` : ''}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-lg font-black text-[#FF1457] bg-[#35313B] px-3 py-1 rounded-xl border border-[#453745]">
                                        {item.total}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleRerollHistoryItem(item)}
                                        title={lang === 'pt' ? 'Rolar novamente esta fórmula' : 'Reroll this formula'}
                                        className="p-2 bg-[#35313B] hover:bg-[#FF1457] text-gray-300 hover:text-white rounded-xl border border-[#453745] transition-colors"
                                    >
                                        <Play size={13} fill="currentColor" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
