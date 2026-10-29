import React from 'react';
import { safeText, getDeepStat } from '../utils/helpers';
import { translateName, translateTerm } from '../utils/translators';

export const StatBlock = ({ monster, lang }) => {
  const getMod = (score) => {
      if (score === null || isNaN(score)) return "N/A";
      const mod = Math.floor((score - 10) / 2);
      return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const getStat = (name) => getDeepStat(monster, name);

  let speedText = '';
  if (monster.speed) {
      if (typeof monster.speed === 'string') {
          speedText = monster.speed;
      } else if (typeof monster.speed === 'object') {
          const speedDict = { 'walk': 'Terrestre', 'fly': 'Voo', 'swim': 'Natação', 'climb': 'Escalada', 'burrow': 'Escavação' };
          speedText = Object.entries(monster.speed)
              .filter(([key, val]) => key !== 'unit' && key !== 'hover' && val)
              .map(([key, val]) => `${lang === 'pt' ? (speedDict[key] || key) : key} ${safeText(val)} ft.`)
              .join(' • ');
      }
  }
  speedText = speedText.replace(/(\d+)\s*(ft\.?|feet)/gi, (match, p1) => {
      const meters = Math.round((parseInt(p1) / 5) * 1.5);
      return `${p1} ft. (${meters}m)`;
  });

  const formatUsageLimits = (usage) => {
      if (!usage || typeof usage !== 'object') return '';
      if (usage.type === 'RECHARGE_ON_ROLL' && usage.param) {
          const range = usage.param < 6 ? `${usage.param}–6` : '6';
          return lang === 'pt' ? ` (Recarga ${range})` : ` (Recharge ${range})`;
      }
      if (usage.type === 'PER_DAY' && usage.param) {
          return lang === 'pt' ? ` (${usage.param}/Dia)` : ` (${usage.param}/Day)`;
      }
      if (usage.type === 'RECHARGE' && usage.param) {
          return ` (${safeText(usage.param)})`;
      }
      return '';
  };

  const sortByOrder = (list) => {
      return [...list].sort((a, b) => {
          const oa = a.order_in_statblock !== undefined && a.order_in_statblock !== null ? a.order_in_statblock : 999;
          const ob = b.order_in_statblock !== undefined && b.order_in_statblock !== null ? b.order_in_statblock : 999;
          return oa - ob;
      });
  };

  const allRawActions = Array.isArray(monster.actions) ? monster.actions : [];
  const hasTypedActions = allRawActions.some(a => a && a.action_type);

  const traitsList = [
      ...(Array.isArray(monster.special_abilities) ? monster.special_abilities : []),
      ...(Array.isArray(monster.traits) ? monster.traits : [])
  ].filter(item => item && (item.name || item.desc));

  const standardActions = sortByOrder(
      hasTypedActions
          ? allRawActions.filter(a => !a.action_type || a.action_type === 'ACTION')
          : allRawActions
  );

  const bonusActions = sortByOrder([
      ...(hasTypedActions ? allRawActions.filter(a => a.action_type === 'BONUS_ACTION') : []),
      ...(Array.isArray(monster.bonus_actions) ? monster.bonus_actions : [])
  ]);

  const reactions = sortByOrder([
      ...(hasTypedActions ? allRawActions.filter(a => a.action_type === 'REACTION') : []),
      ...(Array.isArray(monster.reactions) ? monster.reactions : [])
  ]);

  const legendaryActions = sortByOrder([
      ...(hasTypedActions ? allRawActions.filter(a => a.action_type === 'LEGENDARY_ACTION') : []),
      ...(Array.isArray(monster.legendary_actions) ? monster.legendary_actions : [])
  ]);

  const mythicActions = sortByOrder([
      ...(hasTypedActions ? allRawActions.filter(a => a.action_type === 'MYTHIC_ACTION') : []),
      ...(Array.isArray(monster.mythic_actions) ? monster.mythic_actions : [])
  ]);

  const formatRichDesc = (text) => {
      if (!text) return null;
      const lines = safeText(text).split('\n');
      return lines.map((line, i) => (
          <React.Fragment key={i}>
              {line.replace(/\*\*/g, '')}
              {i < lines.length - 1 && <br />}
          </React.Fragment>
      ));
  };

  const renderSection = (titlePt, titleEn, data, isLegendary = false) => {
      if (!data || !Array.isArray(data) || data.length === 0) return null;
      const validItems = data.filter(item => item && (item.name || item.desc));
      if (validItems.length === 0) return null;

      return (
          <div className="mt-3 pt-2 border-t border-[#453745]/70">
            <h5 className="font-black text-xs uppercase tracking-wider text-[#FF1457] border-b border-[#FF1457]/40 pb-1 mb-2.5">
                {lang === 'pt' ? titlePt : titleEn}
            </h5>
            <div className="space-y-2">
                {validItems.map((item, idx) => {
                  const costBadge = isLegendary && item.legendary_action_cost && item.legendary_action_cost > 1
                      ? (lang === 'pt' ? ` (Custa ${item.legendary_action_cost} Ações)` : ` (Costs ${item.legendary_action_cost} Actions)`)
                      : '';
                  const usageBadge = formatUsageLimits(item.usage_limits);
                  return (
                    <div key={idx} className="bg-[#35313B]/60 p-2.5 rounded-lg border border-[#453745]/60 text-xs leading-relaxed text-gray-300">
                        <span className="font-bold text-white">
                            {translateTerm(safeText(item.name), lang)}{usageBadge}{costBadge}.
                        </span>{' '}
                        {formatRichDesc(item.desc)}
                    </div>
                  );
                })}
            </div>
          </div>
      );
  };

  const savesText = monster.saving_throws && typeof monster.saving_throws === 'object'
      ? Object.entries(monster.saving_throws)
          .filter(([, val]) => val !== null && val !== undefined)
          .map(([k, val]) => `${k.substring(0, 3).toUpperCase()} ${val >= 0 ? `+${val}` : val}`)
          .join(', ')
      : '';

  const skillsText = monster.skill_bonuses && typeof monster.skill_bonuses === 'object'
      ? Object.entries(monster.skill_bonuses)
          .filter(([, val]) => val !== null && val !== undefined)
          .map(([k, val]) => `${k.replace(/_/g, ' ')} ${val >= 0 ? `+${val}` : val}`)
          .join(', ')
      : '';

  const immunitiesText = monster.resistances_and_immunities?.damage_immunities_display || safeText(monster.damage_immunities);
  const resistancesText = monster.resistances_and_immunities?.damage_resistances_display || safeText(monster.damage_resistances);
  const condImmunitiesText = monster.resistances_and_immunities?.condition_immunities_display || safeText(monster.condition_immunities);
  const languagesText = monster.languages?.as_string || safeText(monster.languages);

  return (
    <div className="bg-[#2B2C30] border border-[#453745] text-gray-200 p-4 rounded-xl mt-2 shadow-inner text-sm font-sans">
      <div className="border-b-2 border-[#453745] pb-2 mb-2.5">
          <h4 className="font-bold text-lg text-[#FF1457] capitalize tracking-wide">{translateName(safeText(monster.name), lang)}</h4>
          <p className="italic text-xs text-gray-400 capitalize">
              {translateTerm(safeText(monster.size), lang)} {translateTerm(safeText(monster.type), lang)}, {translateTerm(safeText(monster.alignment), lang) || 'Any alignment'}
          </p>
      </div>

      <div className="border-b-2 border-[#453745] pb-2.5 mb-2.5 text-xs space-y-1">
          <p>
              <span className="font-bold text-[#FF1457]">{lang === 'pt' ? 'Classe de Armadura' : 'Armor Class'}:</span>{' '}
              {safeText(monster.armor_class) || '10'}
              {monster.armor_detail ? ` (${safeText(monster.armor_detail)})` : ''}
          </p>
          <p>
              <span className="font-bold text-[#FF1457]">{lang === 'pt' ? 'Pontos de Vida' : 'Hit Points'}:</span>{' '}
              {safeText(monster.hit_points) || '10'}
              {monster.hit_dice ? ` (${safeText(monster.hit_dice)})` : ''}
          </p>
          <p>
              <span className="font-bold text-[#FF1457]">{lang === 'pt' ? 'Deslocamento' : 'Speed'}:</span>{' '}
              {speedText || '30 ft. (9m)'}
          </p>
      </div>

      <div className="border-b-2 border-[#453745] pb-2.5 mb-2.5 grid grid-cols-6 gap-1 text-center bg-[#35313B] p-2.5 rounded-lg">
          {[
              {l: lang === 'pt' ? 'FOR' : 'STR', k: 'strength'},
              {l: lang === 'pt' ? 'DES' : 'DEX', k: 'dexterity'},
              {l: 'CON', k: 'constitution'},
              {l: 'INT', k: 'intelligence'},
              {l: lang === 'pt' ? 'SAB' : 'WIS', k: 'wisdom'},
              {l: lang === 'pt' ? 'CAR' : 'CHA', k: 'charisma'}
          ].map(stat => {
              const val = getStat(stat.k);
              return (
                <div key={stat.k} className="bg-[#2B2C30]/60 py-1.5 rounded border border-[#453745]/50">
                    <div className="font-bold text-[10px] text-[#FF1457]">{stat.l}</div>
                    <div className="text-white font-bold text-xs">{val !== null ? val : '-'}</div>
                    <div className="text-[10px] text-gray-400">({getMod(val)})</div>
                </div>
              );
          })}
      </div>

      {(savesText || skillsText || immunitiesText || resistancesText || condImmunitiesText || languagesText || monster.passive_perception) && (
          <div className="border-b-2 border-[#453745] pb-2.5 mb-2.5 text-xs space-y-1 text-gray-300">
              {savesText && <p><span className="font-bold text-[#FF1457]">{lang === 'pt' ? 'Salvaguardas' : 'Saving Throws'}:</span> {savesText}</p>}
              {skillsText && <p className="capitalize"><span className="font-bold text-[#FF1457]">{lang === 'pt' ? 'Perícias' : 'Skills'}:</span> {skillsText}</p>}
              {resistancesText && <p className="capitalize"><span className="font-bold text-[#FF1457]">{lang === 'pt' ? 'Resistências' : 'Resistances'}:</span> {resistancesText}</p>}
              {immunitiesText && <p className="capitalize"><span className="font-bold text-[#FF1457]">{lang === 'pt' ? 'Imunidades a Dano' : 'Damage Immunities'}:</span> {immunitiesText}</p>}
              {condImmunitiesText && <p className="capitalize"><span className="font-bold text-[#FF1457]">{lang === 'pt' ? 'Imunidades a Condição' : 'Condition Immunities'}:</span> {condImmunitiesText}</p>}
              {monster.passive_perception && (
                  <p>
                      <span className="font-bold text-[#FF1457]">{lang === 'pt' ? 'Sentidos' : 'Senses'}:</span>{' '}
                      {monster.blindsight_range ? `Blindsight ${monster.blindsight_range} ft., ` : ''}
                      {monster.darkvision_range ? `Darkvision ${monster.darkvision_range} ft., ` : ''}
                      {monster.tremorsense_range ? `Tremorsense ${monster.tremorsense_range} ft., ` : ''}
                      {monster.truesight_range ? `Truesight ${monster.truesight_range} ft., ` : ''}
                      Passive Perception {monster.passive_perception}
                  </p>
              )}
              {languagesText && <p><span className="font-bold text-[#FF1457]">{lang === 'pt' ? 'Idiomas' : 'Languages'}:</span> {languagesText}</p>}
          </div>
      )}

      {renderSection('Traços & Características', 'Traits', traitsList)}
      {renderSection('Ações', 'Actions', standardActions)}
      {renderSection('Ações Bônus', 'Bonus Actions', bonusActions)}
      {renderSection('Reações', 'Reactions', reactions)}
      {renderSection('Ações Lendárias', 'Legendary Actions', legendaryActions, true)}
      {renderSection('Ações Míticas', 'Mythic Actions', mythicActions)}
    </div>
  );
};
