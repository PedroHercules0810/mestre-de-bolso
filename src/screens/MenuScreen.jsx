import React from 'react';
import { Skull, Package, Settings, RotateCcw, Download, Info } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const MenuScreen = () => {
    const { lang, setLang, t, monsters, items, isSyncing, syncData, debugLogs } = useAppContext();
    
    return (
      <div className="p-4 pb-8 max-w-lg mx-auto space-y-4 animate-in fade-in">
        
        <div className="text-center mb-6">
            <h2 className="text-white font-bold text-lg mb-1">Bem-vindo(a) ao seu Bolso!</h2>
            <p className="text-gray-400 text-xs">Abra o menu lateral (≡) no canto superior esquerdo para navegar.</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
            <div className="bg-gradient-to-br from-[#613C4C] to-[#453745] p-4 rounded-2xl border border-[#FF1457]/30 shadow-lg flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-white">{monsters.length}</h3>
                    <p className="text-[10px] text-gray-300 font-semibold uppercase">{lang === 'pt' ? 'Monstros' : 'Monsters'}</p>
                </div>
                <Skull size={24} className="text-[#FF1457]/50" />
            </div>
            <div className="bg-gradient-to-br from-[#613C4C] to-[#453745] p-4 rounded-2xl border border-[#FF1457]/30 shadow-lg flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-white">{items.length}</h3>
                    <p className="text-[10px] text-gray-300 font-semibold uppercase">{lang === 'pt' ? 'Itens' : 'Items'}</p>
                </div>
                <Package size={24} className="text-[#FF1457]/50" />
            </div>
        </div>

        <div className="bg-[#35313B] rounded-2xl border border-[#453745] overflow-hidden shadow-sm">
            <div className="p-4 bg-[#2B2C30] border-b border-[#453745]">
                <h4 className="font-bold text-white flex items-center gap-2 uppercase tracking-wider text-xs"><Settings size={16} className="text-[#FF1457]" /> {t.settings}</h4>
            </div>
            
            <div className="p-4 space-y-4">
                <div>
                    <label className="text-xs text-gray-400 font-semibold mb-2 block uppercase">{t.language}</label>
                    <div className="flex gap-2">
                        <button onClick={() => setLang('en')} className={`flex-1 py-2 rounded-lg font-bold border transition-colors ${lang === 'en' ? 'bg-[#FF1457] border-[#FF1457] text-white shadow-inner' : 'bg-[#2B2C30] border-[#453745] text-gray-400 hover:text-white'}`}>English</button>
                        <button onClick={() => setLang('pt')} className={`flex-1 py-2 rounded-lg font-bold border transition-colors ${lang === 'pt' ? 'bg-[#FF1457] border-[#FF1457] text-white shadow-inner' : 'bg-[#2B2C30] border-[#453745] text-gray-400 hover:text-white'}`}>Português</button>
                    </div>
                </div>
                <div>
                    <label className="text-xs text-gray-400 font-semibold mb-2 block uppercase">Databases (Offline Cache)</label>
                    <div className="flex gap-2 mb-2">
                        <button onClick={() => syncData('monsters')} disabled={isSyncing} className={`flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-xs ${isSyncing ? 'bg-[#453745] text-gray-500 cursor-not-allowed' : 'bg-[#2B2C30] border border-[#FF1457]/50 hover:bg-[#453745] text-white'}`}>
                            {isSyncing ? <RotateCcw size={16} className="animate-spin" /> : <Download size={16} />} {isSyncing ? t.syncing : t.syncBestiary}
                        </button>
                        <button onClick={() => syncData('items')} disabled={isSyncing} className={`flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-xs ${isSyncing ? 'bg-[#453745] text-gray-500 cursor-not-allowed' : 'bg-[#2B2C30] border border-[#FF1457]/50 hover:bg-[#453745] text-white'}`}>
                            {isSyncing ? <RotateCcw size={16} className="animate-spin" /> : <Download size={16} />} {isSyncing ? t.syncing : t.syncItems}
                        </button>
                    </div>
                    
                    <div className="mt-4 bg-[#2B2C30] p-3 rounded-xl border border-[#453745] shadow-inner h-40 overflow-y-auto font-mono text-[10px] text-[#FF1457] flex flex-col-reverse">
                        {debugLogs.map((log, i) => (
                            <div key={i} className="opacity-80 hover:opacity-100 py-0.5 border-b border-[#FF1457]/20">{log}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-[#35313B] rounded-2xl p-5 border border-[#453745] shadow-sm text-center">
            <Info size={24} className="mx-auto text-[#FF1457] mb-2" />
            <h3 className="text-white font-bold mb-2 uppercase text-xs tracking-wider">{t.credits}</h3>
            <p className="text-[10px] text-gray-400 mb-4">{t.creditsText}</p>
            <div className="border-t border-[#453745] pt-4 mt-2">
                <p className="text-sm font-bold text-[#FF1457] mb-2">{t.creator}</p>
                <p className="text-[10px] text-gray-500 leading-relaxed mb-1">{t.aiDisclaimer}</p>
                <a href={`mailto:${t.email}`} className="text-xs font-bold text-[#FF1457] hover:text-white transition-colors inline-flex items-center gap-1">{t.email}</a>
            </div>
        </div>
      </div>
    );
};
