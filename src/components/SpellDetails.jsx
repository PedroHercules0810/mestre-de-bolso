import React from 'react';
import { Sparkles, Clock, Compass, Layers, Hourglass } from 'lucide-react';
import { safeText } from '../utils/helpers';
import { translateSpellName, translateTerm } from '../utils/translators';
import { useSmartDescription } from '../services/translatorService';

const formatCastingTime = (ct, reactionCond, lang) => {
    const raw = String(ct || 'action').toLowerCase().trim();
    const mapPt = {
        'action': '1 Ação',
        '1 action': '1 Ação',
        'bonus_action': '1 Ação Bônus',
        'bonus action': '1 Ação Bônus',
        '1 bonus action': '1 Ação Bônus',
        'reaction': '1 Reação',
        '1 reaction': '1 Reação',
        'minute': '1 Minuto',
        '1 minute': '1 Minuto',
        '10 minutes': '10 Minutos',
        'hour': '1 Hora',
        '1 hour': '1 Hora',
        '8 hours': '8 Horas',
        '12 hours': '12 Horas',
        '24 hours': '24 Horas'
    };
    const mapEn = {
        'action': '1 Action',
        'bonus_action': '1 Bonus Action',
        'reaction': '1 Reaction',
        'minute': '1 Minute',
        'hour': '1 Hour'
    };
    let base = lang === 'pt' ? (mapPt[raw] || ct) : (mapEn[raw] || ct);
    if (reactionCond) {
        base += ` (${reactionCond})`;
    }
    return base;
};

const formatRange = (rangeText, rangeNum, lang) => {
    const raw = safeText(rangeText || (rangeNum ? `${rangeNum} feet` : 'Self')).trim();
    if (lang !== 'pt') return raw;
    return raw
        .replace(/^Self$/i, 'Pessoal')
        .replace(/^Touch$/i, 'Toque')
        .replace(/^Sight$/i, 'Visão')
        .replace(/^Unlimited$/i, 'Ilimitado')
        .replace(/^Special$/i, 'Especial')
        .replace(/(\d+)\s*(?:feet|ft\.?)/gi, (_, ft) => {
            const meters = Math.round((parseInt(ft, 10) / 5) * 1.5 * 10) / 10;
            return `${ft} ft. (${meters}m)`;
        })
        .replace(/(\d+)\s*miles?/gi, '$1 milha(s)');
};

const formatDuration = (duration, concentration, lang) => {
    const raw = safeText(duration || 'Instantaneous').trim();
    if (lang !== 'pt') {
        const prefix = concentration && !raw.toLowerCase().includes('concentration') ? 'Concentration, up to ' : '';
        return `${prefix}${raw}`;
    }
    let ptDur = raw
        .replace(/^Instantaneous$/i, 'Instantânea')
        .replace(/^Until dispelled$/i, 'Até ser dissipada')
        .replace(/^Until dispelled or triggered$/i, 'Até ser dissipada ou ativada')
        .replace(/^Special$/i, 'Especial')
        .replace(/^1 round$/i, '1 rodada')
        .replace(/(\d+)\s*rounds?/gi, '$1 rodadas')
        .replace(/(\d+)\s*minutes?/gi, '$1 minuto(s)')
        .replace(/(\d+)\s*hours?/gi, '$1 hora(s)')
        .replace(/(\d+)\s*days?/gi, '$1 dia(s)')
        .replace(/^up to\s+/i, 'até ');

    if (concentration && !ptDur.toLowerCase().includes('concentração')) {
        ptDur = `Concentração, até ${ptDur}`;
    }
    return ptDur;
};

const formatComponents = (spell) => {
    if (spell.components && typeof spell.components === 'string') {
        return spell.components;
    }
    const parts = [];
    if (spell.verbal) parts.push('V');
    if (spell.somatic) parts.push('S');
    if (spell.material) {
        parts.push(spell.material_specified ? `M (${spell.material_specified})` : 'M');
    }
    return parts.join(', ') || 'V, S';
};

export const SpellDetailsCard = ({ spell, lang, t }) => {
    const rawDesc = safeText(spell.desc);
    const rawHigher = safeText(spell.higher_level);
    const { text: translatedDesc, isNeural } = useSmartDescription(rawDesc, lang);
    const { text: translatedHigher } = useSmartDescription(rawHigher, lang);

    const levelNum = Number(spell.level ?? spell.level_int ?? 0);
    const schoolRaw = typeof spell.school === 'object' ? (spell.school?.name || spell.school?.key || '') : String(spell.school || '');
    const schoolLabel = translateTerm(schoolRaw, lang);

    const levelSchoolSubtitle = lang === 'pt'
        ? (levelNum === 0 ? `Truque de ${schoolLabel}` : `${levelNum}º Círculo de ${schoolLabel}`)
        : (levelNum === 0 ? `${schoolLabel} Cantrip` : `Level ${levelNum} ${schoolLabel}`);

    const classesList = Array.isArray(spell.classes)
        ? spell.classes.map(c => typeof c === 'object' ? (c.name || c.key) : String(c))
        : spell.dnd_class
            ? String(spell.dnd_class).split(',').map(s => s.trim())
            : [];

    return (
        <div className="bg-[#2B2C30] border border-[#453745] text-gray-200 p-4 rounded-xl shadow-inner text-sm font-sans space-y-3">
            {/* Header */}
            <div className="border-b-2 border-[#453745] pb-2 flex justify-between items-start gap-2">
                <div>
                    <h4 className="font-bold text-lg text-[#FF1457] leading-tight">
                        {translateSpellName(safeText(spell.name), lang)}
                    </h4>
                    <p className="italic text-xs text-gray-400 capitalize mt-0.5">
                        {levelSchoolSubtitle}
                    </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    {spell.concentration && (
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/40">
                            {t.concentration}
                        </span>
                    )}
                    {spell.ritual && (
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40">
                            {t.ritual}
                        </span>
                    )}
                    {lang === 'pt' && rawDesc && (
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-[#35313B] text-gray-400 px-2 py-0.5 rounded-full border border-[#453745] flex items-center gap-1">
                            <Sparkles size={10} className="text-[#FF1457]" />
                            {isNeural ? 'PT-BR' : 'Auto'}
                        </span>
                    )}
                </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-[#35313B] p-3 rounded-lg border border-[#453745]">
                <div>
                    <span className="text-[#FF1457] font-bold flex items-center gap-1 text-[10px] uppercase">
                        <Clock size={11} /> {t.castingTime}
                    </span>
                    <p className="text-white font-semibold mt-0.5">
                        {formatCastingTime(spell.casting_time, spell.reaction_condition, lang)}
                    </p>
                </div>
                <div>
                    <span className="text-[#FF1457] font-bold flex items-center gap-1 text-[10px] uppercase">
                        <Compass size={11} /> {t.range}
                    </span>
                    <p className="text-white font-semibold mt-0.5">
                        {formatRange(spell.range_text, spell.range, lang)}
                    </p>
                </div>
                <div>
                    <span className="text-[#FF1457] font-bold flex items-center gap-1 text-[10px] uppercase">
                        <Layers size={11} /> {t.components}
                    </span>
                    <p className="text-white font-semibold mt-0.5 break-words">
                        {formatComponents(spell)}
                    </p>
                </div>
                <div>
                    <span className="text-[#FF1457] font-bold flex items-center gap-1 text-[10px] uppercase">
                        <Hourglass size={11} /> {t.duration}
                    </span>
                    <p className="text-white font-semibold mt-0.5">
                        {formatDuration(spell.duration, spell.concentration, lang)}
                    </p>
                </div>
            </div>

            {/* Classes Badges */}
            {classesList.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase text-gray-400 mr-1">{t.spellClasses}:</span>
                    {classesList.map((cls, i) => (
                        <span
                            key={i}
                            className="text-[10px] font-bold bg-[#35313B] text-[#FF1457] px-2.5 py-0.5 rounded-full border border-[#FF1457]/30"
                        >
                            {translateTerm(cls, lang)}
                        </span>
                    ))}
                </div>
            )}

            {/* Spell Description */}
            {translatedDesc && (
                <div className="whitespace-pre-wrap leading-relaxed text-gray-300 text-xs">
                    {translatedDesc.replace(/\*\*/g, '')}
                </div>
            )}

            {/* Higher Level Scaling */}
            {translatedHigher && (
                <div className="bg-[#35313B]/80 p-3 rounded-lg border border-[#FF1457]/30 text-xs leading-relaxed text-gray-200">
                    <span className="font-bold text-[#FF1457] block mb-0.5">
                        {t.higherLevels}:
                    </span>
                    {translatedHigher.replace(/\*\*/g, '')}
                </div>
            )}
        </div>
    );
};
