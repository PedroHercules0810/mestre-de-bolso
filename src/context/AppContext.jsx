import React, { useState, useEffect, createContext, useContext } from 'react';
import { DICTIONARY } from '../constants/dictionary';
import { XP_BUDGET_5E } from '../constants/gameData';
import { STORE_MONSTERS, STORE_ITEMS, saveDataToDB, getAllDataFromDB, deleteDataFromDB } from '../services/db';
import { initTranslationCache } from '../services/translatorService';
import { safeText, getDeepStat } from '../utils/helpers';
import { translateName } from '../utils/translators';
import { getMonsterEnvironments } from '../utils/environmentMapper';
import { generateEncounterLoot } from '../utils/lootGenerator';

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState('pt');
  const [monsters, setMonsters] = useState([]);
  const [items, setItems] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [itemsTab, setItemsTab] = useState('compendium'); 
  
  const [encounter, setEncounter] = useState(null);
  const [tracker, setTracker] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(-1);
  const [round, setRound] = useState(1);
  const [encounterError, setEncounterError] = useState(null);
  const [campaigns, setCampaigns] = useState(() => {
    try {
      const saved = localStorage.getItem('mestre_campaigns');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load campaigns", e);
      return [];
    }
  });
  const [homebrewMonsters, setHomebrewMonsters] = useState(() => {
    try {
      const saved = localStorage.getItem('mestre_homebrew_monsters');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load homebrew monsters", e);
      return [];
    }
  });
  const [homebrewItems, setHomebrewItems] = useState(() => {
    try {
      const saved = localStorage.getItem('mestre_homebrew_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load homebrew items", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mestre_campaigns', JSON.stringify(campaigns));
    } catch (e) {
      console.error("Failed to save campaigns", e);
    }
  }, [campaigns]);

  useEffect(() => {
    try {
      localStorage.setItem('mestre_homebrew_monsters', JSON.stringify(homebrewMonsters));
    } catch (e) {
      console.error("Failed to save homebrew monsters", e);
    }
  }, [homebrewMonsters]);

  useEffect(() => {
    try {
      localStorage.setItem('mestre_homebrew_items', JSON.stringify(homebrewItems));
    } catch (e) {
      console.error("Failed to save homebrew items", e);
    }
  }, [homebrewItems]);
  
  const [debugLogs, setDebugLogs] = useState(["[SISTEMA] Aguardando ações..."]);
  const t = DICTIONARY[lang];

  const addLog = (msg) => {
    setDebugLogs(prev => {
        const time = new Date().toLocaleTimeString('pt-BR', {hour12: false});
        return [`[${time}] ${msg}`, ...prev].slice(0, 40);
    });
  };

  const showToast = (msg) => {
    setToastMsg(msg);
  };

  const loadCache = async () => {
    try {
      const transCount = await initTranslationCache();
      const monsterData = await getAllDataFromDB(STORE_MONSTERS);
      const sortedMonsters = monsterData.sort((a, b) => (safeText(a.name) > safeText(b.name)) ? 1 : -1);
      setMonsters(sortedMonsters);
      
      const itemData = await getAllDataFromDB(STORE_ITEMS);
      const sortedItems = itemData.sort((a, b) => (safeText(a.name) > safeText(b.name)) ? 1 : -1);
      setItems(sortedItems);

      addLog(`Cache carregado: ${sortedMonsters.length} monstros, ${sortedItems.length} itens, ${transCount} traduções.`);
    } catch (e) {
      console.error("Cache Error:", e);
      addLog("Erro crítico ao carregar cache local.");
    }
  };

  useEffect(() => { loadCache(); }, []);

  const syncData = async (type) => {
    setIsSyncing(true);
    let totalSaved = 0;
    
    const fetchPageAndSave = async (fetchUrl, storeName) => {
        addLog(`Baixando...`);
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            let itemsToSave = data.results;
            if(storeName === STORE_ITEMS) {
                 itemsToSave = itemsToSave.map(i => ({...i, open5e_category: type}));
            }
            const savedCount = await saveDataToDB(storeName, itemsToSave);
            totalSaved += savedCount;
            addLog(`Sucesso: ${totalSaved} registros salvos.`);
        }
        return data.next;
    };

    try {
        if (type === 'monsters') {
            addLog("Iniciando sync de Monstros (SRD 2024)...");
            let url = 'https://api.open5e.com/v2/creatures/?document__key__in=srd-2024&limit=100';
            while (url) { url = await fetchPageAndSave(url, STORE_MONSTERS); }
        } else if (type === 'items') {
             addLog("Iniciando sync de Itens...");
             const endpoints = ['magicitems', 'weapons', 'armor'];
             for (const ep of endpoints) {
                 addLog(`Baixando categoria: ${ep}...`);
                 let url = `https://api.open5e.com/v1/${ep}/?limit=100`;
                 while (url) { url = await fetchPageAndSave(url, STORE_ITEMS); }
             }
        }
        addLog(`Sincronização concluída!`);
        await loadCache();
    } catch (error) {
        console.error(error);
        addLog(`Falha na Sincronização: ${error.message}`);
    } finally {
        setIsSyncing(false);
    }
  };

  const generateEncounter = (partySize, level, difficulty, filters, budgetMultiplier = 1, style = 'balanced', force = false) => {
    setEncounterError(null);
    if (monsters.length === 0) {
        addLog("ERRO: O Cache de monstros está vazio.");
        return false;
    }

    const perCharBudget = XP_BUDGET_5E[level]?.[difficulty] || XP_BUDGET_5E[1][difficulty];
    const baseTotalBudget = perCharBudget * partySize;
    let totalBudget = Math.floor(baseTotalBudget * budgetMultiplier);
    
    let availableMonsters = monsters.filter(m => {
      let typeMatch = true;
      let envMatch = true;
      
      if (filters.type && filters.type !== 'Any') {
          const typeString = typeof m.type === 'object' ? String(m.type.name || m.type.desc || m.type) : String(m.type || '');
          typeMatch = typeString.toLowerCase().includes(filters.type.toLowerCase());
      }
      if (filters.environment && filters.environment !== 'Any') {
          const monsterEnvs = getMonsterEnvironments(m);
          envMatch = monsterEnvs.some(env => env.toLowerCase() === filters.environment.toLowerCase());
      }
      return typeMatch && envMatch && m.xp && m.xp > 0;
    });

    if (style === 'horde') {
        availableMonsters = availableMonsters.filter(m => m.xp <= (totalBudget / 4));
    }

    if (availableMonsters.length === 0) {
        addLog(`Falha Crítica: Orçamento de ${totalBudget} XP. Monstros compatíveis = 0.`);
        setEncounterError("noMonsters");
        return false;
    }

    const selected = {};
    let currentTotalXP = 0;
    let availableBudget = totalBudget;
    
    if (style === 'boss' && !force) {
        const bossBudget = totalBudget * 0.7;
        const potentialBosses = availableMonsters.filter(m => m.xp <= bossBudget * 1.1 && m.xp >= bossBudget * 0.5);
        if (potentialBosses.length > 0) {
            const boss = potentialBosses[Math.floor(Math.random() * potentialBosses.length)];
            selected[boss.slug] = { ...boss, count: 1, isBoss: true };
            currentTotalXP += boss.xp;
            availableBudget -= boss.xp;
            addLog(`BOSS Selecionado: ${safeText(boss.name)} (${boss.xp} XP)`);
        }
    }

    let attempts = 0;
    let addedSomething = true;

    while (availableBudget > 0 && addedSomething && attempts < 200) {
      addedSomething = false;
      const affordable = availableMonsters.filter(m => m.xp <= availableBudget * 1.1); 
      
      if (affordable.length > 0) {
        const choice = affordable[Math.floor(Math.random() * affordable.length)];
        if (selected[choice.slug]) {
          selected[choice.slug].count += 1;
        } else {
          selected[choice.slug] = { ...choice, count: 1 };
        }
        addedSomething = true;
        availableBudget -= choice.xp;
        currentTotalXP += choice.xp;
      }
      attempts++;
    }

    if (Object.keys(selected).length === 0) {
        if (force && availableMonsters.length > 0) {
            const weakest = availableMonsters.reduce((prev, curr) => (prev.xp < curr.xp) ? prev : curr);
            selected[weakest.slug] = { ...weakest, count: 1, isBoss: style === 'boss' };
            currentTotalXP += weakest.xp;
            addLog(`GERAÇÃO FORÇADA: Risco de TPK. Puxado: ${safeText(weakest.name)}.`);
        } else {
            if (budgetMultiplier >= 3) {
                addLog(`FALHA: Grupo fraco demais para os filtros escolhidos.`);
                setEncounterError("partyTooWeak");
            } else {
                addLog(`FALHA: Orçamento (${totalBudget} XP) baixo demais.`);
                setEncounterError("budgetTooLow");
            }
            return false;
        }
    }
    
    const finalMonsters = Object.values(selected);
    setEncounter({
      budget: totalBudget,
      totalXP: currentTotalXP,
      monsters: finalMonsters,
      loot: generateEncounterLoot(finalMonsters, items, lang)
    });
    return true;
  };

  const addMonsterToEncounter = (monster) => {
    const monsterXp = Number(monster.xp) || 0;
    setEncounter(prev => {
        const current = prev || { budget: 0, totalXP: 0, monsters: [], loot: null };
        const existingIdx = current.monsters.findIndex(m => m.slug === monster.slug);
        const newMonsters = current.monsters.map((m, idx) =>
            idx === existingIdx ? { ...m, count: (Number(m.count) || 1) + 1 } : { ...m }
        );
        
        if (existingIdx < 0) {
            newMonsters.push({ ...monster, xp: monsterXp, count: 1, isBoss: false });
        }
        
        const newTotalXP = (Number(current.totalXP) || 0) + monsterXp;
        return { 
            ...current, 
            totalXP: newTotalXP, 
            monsters: newMonsters,
            loot: generateEncounterLoot(newMonsters, items, lang)
        };
    });
    showToast(`${translateName(safeText(monster.name), lang)} ${t.addedToEncounter}`);
  };

  const updateMonsterCount = (slug, delta) => {
    if (!encounter) return;
    const idx = encounter.monsters.findIndex(m => m.slug === slug);
    if (idx === -1) return;

    const targetMonster = encounter.monsters[idx];
    const monsterXP = Number(targetMonster.xp) || 0;
    const updatedCount = (Number(targetMonster.count) || 1) + delta;
    
    const newMonsters = encounter.monsters
        .map((m, i) => i === idx ? { ...m, count: updatedCount } : { ...m })
        .filter(m => m.count > 0);
    
    const newTotalXP = Math.max(0, (Number(encounter.totalXP) || 0) + (delta * monsterXP));

    setEncounter({ 
        ...encounter, 
        totalXP: newTotalXP, 
        monsters: newMonsters,
        loot: newMonsters.length === 0 ? null : generateEncounterLoot(newMonsters, items, lang)
    });
  };

  const parseEntityStats = (m, existingTrackerCount) => {
      let hp = 10, ac = 10;
      try {
           if (m.hit_points != null) {
               if (typeof m.hit_points === 'object') hp = m.hit_points.value || parseInt(m.hit_points.desc) || 10;
               else hp = parseInt(m.hit_points) || 10;
           }
           if (m.armor_class != null) {
               if (Array.isArray(m.armor_class)) ac = m.armor_class[0]?.value || parseInt(m.armor_class[0]?.desc) || 10;
               else if (typeof m.armor_class === 'object') ac = m.armor_class.value || parseInt(m.armor_class.desc) || 10;
               else ac = parseInt(m.armor_class) || 10;
           }
      } catch(e) { console.error("Error parsing stats", e) }

      const dexMod = Math.floor(((getDeepStat(m, 'dexterity') || 10) - 10) / 2);
      const initRoll = Math.floor(Math.random() * 20) + 1 + dexMod;

      const baseOriginalName = safeText(m.name);
      let finalName = translateName(baseOriginalName, lang);
      if (existingTrackerCount > 0) {
          finalName = `${finalName} #${existingTrackerCount + 1}`;
      }

      return {
          id: `${m.slug}-${crypto.randomUUID()}`,
          originalName: baseOriginalName,
          name: finalName,
          initiative: initRoll,
          hp: hp,
          maxHp: hp,
          ac: ac,
          isPlayer: false,
          conditions: []
      };
  };

  const countExistingInTracker = (baseOriginalName, currentTracker) => {
      return currentTracker.filter(e => e.originalName === baseOriginalName).length;
  };

  const addToTracker = (customEncounter = null) => {
    const targetEncounter = customEncounter || encounter;
    if (!targetEncounter) return;
    let newTracker = [...tracker];
    
    targetEncounter.monsters.forEach(m => {
      const baseOriginalName = safeText(m.name);
      for (let i = 0; i < m.count; i++) {
        const existingCount = countExistingInTracker(baseOriginalName, newTracker);
        newTracker.push(parseEntityStats(m, existingCount));
      }
    });
    newTracker.sort((a, b) => b.initiative - a.initiative);
    setTracker(newTracker);
    showToast(t.addToTracker);
    if(currentTurn === -1) setCurrentTurn(0);
  };

  const addEncounterToCampaign = (campaignId, customName = "", encounterData = null) => {
    const targetEncounter = encounterData || encounter;
    if (!targetEncounter || !campaignId) return false;

    setCampaigns(prev => prev.map(camp => {
      if (camp.id !== campaignId) return camp;
      const existingEncounters = camp.encounters || [];
      const encounterIndex = existingEncounters.length;
      const finalName = customName.trim() || `Encounter #${encounterIndex}`;
      const newSavedEncounter = {
        id: `enc-${Date.now()}`,
        name: finalName,
        budget: targetEncounter.budget || 0,
        totalXP: targetEncounter.totalXP || 0,
        monsters: targetEncounter.monsters.map(m => ({ ...m })),
        loot: targetEncounter.loot ? { ...targetEncounter.loot } : null,
        createdAt: new Date().toISOString()
      };
      return {
        ...camp,
        encounters: [...existingEncounters, newSavedEncounter]
      };
    }));

    showToast(t.encounterSaved);
    return true;
  };

  const addDirectlyToTracker = (monster) => {
      const baseOriginalName = safeText(monster.name);
      const existingCount = countExistingInTracker(baseOriginalName, tracker);

      const newEntity = parseEntityStats(monster, existingCount);
      const newTracker = [...tracker, newEntity].sort((a, b) => b.initiative - a.initiative);
      setTracker(newTracker);
      showToast(`${newEntity.name} ${t.addedToTracker}`);
      if(currentTurn === -1) setCurrentTurn(0);
  };

  const sendHomebrewToBestiary = async (monsterObj) => {
      try {
          const toSave = { ...monsterObj, isHomebrew: true };
          await saveDataToDB(STORE_MONSTERS, [toSave]);
          await loadCache();
          showToast(`${safeText(monsterObj.name)} ${t.sentToBestiaryToast}`);
          return true;
      } catch (e) {
          console.error("Error sending homebrew to bestiary", e);
          return false;
      }
  };

  const removeMonsterFromBestiary = async (slug, monsterName = "") => {
      try {
          await deleteDataFromDB(STORE_MONSTERS, slug);
          await loadCache();
          if (monsterName) {
              showToast(`${safeText(monsterName)} ${t.removedFromBestiaryToast}`);
          }
          return true;
      } catch (e) {
          console.error("Error removing monster from bestiary", e);
          return false;
      }
  };

  const sendHomebrewToItems = async (itemObj) => {
      try {
          const toSave = { ...itemObj, isHomebrew: true };
          await saveDataToDB(STORE_ITEMS, [toSave]);
          await loadCache();
          showToast(`${safeText(itemObj.name)} ${t.sentToCompendiumToast}`);
          return true;
      } catch (e) {
          console.error("Error sending homebrew item to compendium", e);
          return false;
      }
  };

  const removeItemFromCompendium = async (slug, itemName = "") => {
      try {
          await deleteDataFromDB(STORE_ITEMS, slug);
          await loadCache();
          if (itemName) {
              showToast(`${safeText(itemName)} ${t.removedFromCompendiumToast}`);
          }
          return true;
      } catch (e) {
          console.error("Error removing item from compendium", e);
          return false;
      }
  };

  return (
    <AppContext.Provider value={{
      lang, setLang, t, monsters, items, syncData, isSyncing, debugLogs, addLog,
      generateEncounter, encounter, setEncounter, encounterError, setEncounterError,
      addMonsterToEncounter, updateMonsterCount, addDirectlyToTracker,
      tracker, setTracker, addToTracker, currentTurn, setCurrentTurn, round, setRound,
      toastMsg, setToastMsg, itemsTab, setItemsTab,
      campaigns, setCampaigns, addEncounterToCampaign,
      homebrewMonsters, setHomebrewMonsters, sendHomebrewToBestiary, removeMonsterFromBestiary,
      homebrewItems, setHomebrewItems, sendHomebrewToItems, removeItemFromCompendium,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};
