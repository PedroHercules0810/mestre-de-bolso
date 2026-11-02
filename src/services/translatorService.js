import { useState, useEffect } from 'react';
import { initDB, STORE_TRANSLATIONS, getAllDataFromDB } from './db';
import {
    translateName,
    translateDescription,
    registerDynamicTranslationGetter
} from '../utils/translators';

// Cache em memória sincronizado com IndexedDB para leitura instantânea (0ms)
const memoryCache = new Map();
const pendingRequests = new Map();
let isCacheLoaded = false;
const listeners = new Set();

const notifyListeners = () => {
    listeners.forEach(fn => {
        try { fn(); } catch { /* ignore */ }
    });
};

// Registra o getter dinâmico no módulo síncrono translators.js
registerDynamicTranslationGetter((key) => memoryCache.get(key) || null);

// Carrega todas as traduções salvas no IndexedDB ao iniciar o app
export const initTranslationCache = async () => {
    if (isCacheLoaded) return memoryCache.size;
    try {
        const rows = await getAllDataFromDB(STORE_TRANSLATIONS);
        if (Array.isArray(rows)) {
            rows.forEach(row => {
                if (row && row.key && row.value) {
                    memoryCache.set(row.key, row.value);
                }
            });
        }
        isCacheLoaded = true;
        notifyListeners();
        return memoryCache.size;
    } catch (err) {
        console.warn('Falha ao carregar cache de traduções:', err);
        return 0;
    }
};

const saveTranslationToDB = async (key, value) => {
    memoryCache.set(key, value);
    try {
        const db = await initDB();
        const tx = db.transaction(STORE_TRANSLATIONS, 'readwrite');
        tx.objectStore(STORE_TRANSLATIONS).put({ key, value, updatedAt: Date.now() });
    } catch (err) {
        console.warn('Erro ao salvar tradução no IndexedDB:', err);
    }
};

// Pós-processador de terminologia oficial D&D 5e PT-BR sobre a saída neural
const postProcessDnDTerms = (text) => {
    if (!text) return text;
    return String(text)
        .replace(/\b(lance de salvamento|jogada de salvamento|tiro de economia|teste de resistência)\b/gi, 'salvaguarda')
        .replace(/\b(lances de salvamento|jogadas de salvamento|testes de resistência)\b/gi, 'salvaguardas')
        .replace(/\b(classe de armadura)\b/gi, 'Classe de Armadura')
        .replace(/\b(pontos de vida)\b/gi, 'Pontos de Vida')
        .replace(/\bDC\s*(\d+)/g, 'CD $1')
        .replace(/\bHit:\s*/gi, 'Acerto: ')
        .replace(/\bMelee Weapon Attack:\s*/gi, 'Ataque Corpo a Corpo com Arma: ')
        .replace(/\bRanged Weapon Attack:\s*/gi, 'Ataque à Distância com Arma: ')
        .replace(/\bMelee Attack Roll:\s*/gi, 'Jogada de Ataque Corpo a Corpo: ')
        .replace(/\bRanged Attack Roll:\s*/gi, 'Jogada de Ataque à Distância: ')
        .replace(/(\d+)\s*(?:pés|ft\.)(?!\s*\(\d+m\))/gi, (_, ft) => {
            const meters = Math.round((parseInt(ft) / 5) * 1.5 * 10) / 10;
            return `${ft} ft. (${meters}m)`;
        });
};

// Chamada à API de Tradução Neural (Google GTX com Fallback MyMemory)
const fetchNeuralTranslation = async (rawText) => {
    const clean = String(rawText).trim();
    if (!clean) return clean;

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(clean)}`;
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && Array.isArray(data[0])) {
                const joined = data[0].map(segment => segment[0]).join('');
                if (joined) return postProcessDnDTerms(joined);
            }
        }
    } catch {
        // Continua para o fallback
    }

    if (clean.length <= 480) {
        try {
            const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|pt-br`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                if (data?.responseData?.translatedText) {
                    return postProcessDnDTerms(data.responseData.translatedText);
                }
            }
        } catch {
            // Sem conexão; mantém tradução determinística offline
        }
    }

    return null;
};

// Traduz um texto de forma assíncrona e salva permanentemente no IndexedDB
export const translateTextNeural = async (text, prefix = 'desc') => {
    if (!text) return '';
    const trimmed = String(text).trim();
    if (!trimmed) return '';

    const key = prefix === 'name' ? `name:${trimmed.toLowerCase()}` : `${prefix}:${trimmed}`;
    if (memoryCache.has(key)) {
        return memoryCache.get(key);
    }

    if (pendingRequests.has(key)) {
        return pendingRequests.get(key);
    }

    const promise = (async () => {
        try {
            const translated = await fetchNeuralTranslation(trimmed);
            if (translated) {
                await saveTranslationToDB(key, translated);
                notifyListeners();
                return translated;
            }
        } finally {
            pendingRequests.delete(key);
        }
        return prefix === 'name' ? translateName(trimmed, 'pt') : translateDescription(trimmed, 'pt');
    })();

    pendingRequests.set(key, promise);
    return promise;
};

// Hook para traduzir automaticamente uma descrição (Item ou Regra) com fallback offline imediato
export const useSmartDescription = (text, lang) => {
    const clean = text ? String(text).trim() : '';
    const cacheKey = `desc:${clean}`;
    const [, setTick] = useState(0);

    useEffect(() => {
        if (lang !== 'pt' || !clean || memoryCache.has(cacheKey)) {
            return;
        }
        let active = true;
        translateTextNeural(clean, 'desc').then(() => {
            if (active) setTick(t => t + 1);
        });
        return () => { active = false; };
    }, [clean, lang, cacheKey]);

    if (lang !== 'pt' || !clean) {
        return { text: clean, isNeural: false };
    }
    const isNeural = memoryCache.has(cacheKey);
    const resolvedText = isNeural ? memoryCache.get(cacheKey) : translateDescription(clean, 'pt');
    return { text: resolvedText, isNeural };
};

// Coleta textos pendentes de tradução neural para um monstro
const getPendingMonsterTexts = (monster, lang) => {
    if (lang !== 'pt' || !monster) return [];
    const textsToTranslate = [];
    const rawName = String(monster.name || '').trim();
    if (rawName && translateName(rawName, 'pt').toLowerCase() === rawName.toLowerCase() && !memoryCache.has(`name:${rawName.toLowerCase()}`)) {
        textsToTranslate.push({ text: rawName, prefix: 'name' });
    }

    const collectFromList = (list) => {
        if (!Array.isArray(list)) return;
        list.forEach(item => {
            if (item && item.desc) {
                const d = String(item.desc).trim();
                if (d && !memoryCache.has(`desc:${d}`)) {
                    textsToTranslate.push({ text: d, prefix: 'desc' });
                }
            }
        });
    };

    collectFromList(monster.special_abilities);
    collectFromList(monster.traits);
    collectFromList(monster.actions);
    collectFromList(monster.bonus_actions);
    collectFromList(monster.reactions);
    collectFromList(monster.legendary_actions);
    collectFromList(monster.mythic_actions);

    return textsToTranslate;
};

// Hook que traduz sob demanda todas as habilidades e ações de um Monstro aberto no StatBlock
export const useMonsterNeuralTranslation = (monster, lang) => {
    const [, setTick] = useState(0);
    const pendingList = getPendingMonsterTexts(monster, lang);

    useEffect(() => {
        if (lang !== 'pt' || !monster) return;

        const sub = () => setTick(t => t + 1);
        listeners.add(sub);

        const toFetch = getPendingMonsterTexts(monster, lang);
        let cancelled = false;
        if (toFetch.length > 0) {
            (async () => {
                for (const entry of toFetch) {
                    if (cancelled) break;
                    await translateTextNeural(entry.text, entry.prefix);
                }
                if (!cancelled) {
                    setTick(t => t + 1);
                }
            })();
        }

        return () => {
            cancelled = true;
            listeners.delete(sub);
        };
    }, [monster, lang]);

    return { isTranslating: pendingList.length > 0, cacheCount: memoryCache.size };
};

export const getTranslationCacheStats = () => ({
    count: memoryCache.size
});
