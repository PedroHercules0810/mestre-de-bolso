import React, { useState } from 'react';
import { ArrowLeft, ScrollText, Plus, FileText, Search, Edit3, Trash2, ArrowRight, Swords, Shield, Skull, X, BookOpen } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { safeText } from '../utils/helpers';
import { translateName } from '../utils/translators';
import { StatBlock } from '../components/StatBlock';

export const CampaignsScreen = ({ onNavigate }) => {
    const { t, lang, campaigns, setCampaigns, showToast, setEncounter, addToTracker } = useAppContext();
    const [selectedCampaignId, setSelectedCampaignId] = useState(null);
    const [activeSection, setActiveSection] = useState('notes');
    const [showNewCampaignForm, setShowNewCampaignForm] = useState(false);
    const [campaignName, setCampaignName] = useState("");
    const [campaignDesc, setCampaignDesc] = useState("");

    const [showNoteForm, setShowNoteForm] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const [searchNoteTerm, setSearchNoteTerm] = useState("");
    const [expandedNote, setExpandedNote] = useState({});

    const [showRuleForm, setShowRuleForm] = useState(false);
    const [editingRuleId, setEditingRuleId] = useState(null);
    const [ruleTitle, setRuleTitle] = useState("");
    const [ruleCategory, setRuleCategory] = useState("");
    const [ruleDesc, setRuleDesc] = useState("");
    const [searchRuleTerm, setSearchRuleTerm] = useState("");
    const [expandedRule, setExpandedRule] = useState({});

    const [expandedEncounter, setExpandedEncounter] = useState({});
    const [expandedMonster, setExpandedMonster] = useState({});
    const [confirmDelete, setConfirmDelete] = useState(null);

    const activeCampaign = campaigns.find(c => c.id === selectedCampaignId);

    const handleCreateCampaign = (e) => {
        e.preventDefault();
        if (!campaignName.trim()) return;
        const newCamp = {
            id: `camp-${Date.now()}`,
            name: campaignName.trim(),
            description: campaignDesc.trim(),
            createdAt: new Date().toISOString(),
            notes: [],
            encounters: [],
            rules: []
        };
        setCampaigns(prev => [newCamp, ...prev]);
        setCampaignName("");
        setCampaignDesc("");
        setShowNewCampaignForm(false);
        showToast(t.campaignCreated);
    };

    const handleDeleteCampaign = (id) => {
        setCampaigns(prev => prev.filter(c => c.id !== id));
        if (selectedCampaignId === id) setSelectedCampaignId(null);
        setConfirmDelete(null);
    };

    const handleSaveNote = (e) => {
        e.preventDefault();
        if (!noteTitle.trim() && !noteContent.trim()) return;
        const finalTitle = noteTitle.trim() || (lang === 'pt' ? 'Nota sem título' : 'Untitled Note');

        setCampaigns(prev => prev.map(c => {
            if (c.id !== selectedCampaignId) return c;
            let updatedNotes = [...(c.notes || [])];
            if (editingNoteId) {
                updatedNotes = updatedNotes.map(n => n.id === editingNoteId ? {
                    ...n,
                    title: finalTitle,
                    content: noteContent,
                    updatedAt: new Date().toISOString()
                } : n);
            } else {
                const newNote = {
                    id: `note-${Date.now()}`,
                    title: finalTitle,
                    content: noteContent,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                updatedNotes = [newNote, ...updatedNotes];
            }
            return { ...c, notes: updatedNotes };
        }));

        setNoteTitle("");
        setNoteContent("");
        setEditingNoteId(null);
        setShowNoteForm(false);
        showToast(t.noteSaved);
    };

    const openEditNote = (note) => {
        setEditingNoteId(note.id);
        setNoteTitle(note.title);
        setNoteContent(note.content);
        setShowNoteForm(true);
    };

    const handleDeleteNote = (noteId) => {
        setCampaigns(prev => prev.map(c => {
            if (c.id !== selectedCampaignId) return c;
            return { ...c, notes: (c.notes || []).filter(n => n.id !== noteId) };
        }));
        setConfirmDelete(null);
    };

    const handleSaveRule = (e) => {
        e.preventDefault();
        if (!ruleTitle.trim() && !ruleDesc.trim()) return;
        const finalTitle = ruleTitle.trim() || (lang === 'pt' ? 'Regra sem título' : 'Untitled Rule');
        const finalCat = ruleCategory.trim() || (lang === 'pt' ? 'Geral' : 'General');

        setCampaigns(prev => prev.map(c => {
            if (c.id !== selectedCampaignId) return c;
            let updatedRules = [...(c.rules || [])];
            if (editingRuleId) {
                updatedRules = updatedRules.map(r => r.id === editingRuleId ? {
                    ...r,
                    title: finalTitle,
                    category: finalCat,
                    desc: ruleDesc,
                    updatedAt: new Date().toISOString()
                } : r);
            } else {
                const newRule = {
                    id: `rule-${Date.now()}`,
                    title: finalTitle,
                    category: finalCat,
                    desc: ruleDesc,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                updatedRules = [newRule, ...updatedRules];
            }
            return { ...c, rules: updatedRules };
        }));

        setRuleTitle("");
        setRuleCategory("");
        setRuleDesc("");
        setEditingRuleId(null);
        setShowRuleForm(false);
        showToast(t.ruleSaved);
    };

    const openEditRule = (rule) => {
        setEditingRuleId(rule.id);
        setRuleTitle(rule.title);
        setRuleCategory(rule.category || "");
        setRuleDesc(rule.desc);
        setShowRuleForm(true);
    };

    const handleDeleteRule = (ruleId) => {
        setCampaigns(prev => prev.map(c => {
            if (c.id !== selectedCampaignId) return c;
            return { ...c, rules: (c.rules || []).filter(r => r.id !== ruleId) };
        }));
        setConfirmDelete(null);
    };

    const handleDeleteSavedEncounter = (encId) => {
        setCampaigns(prev => prev.map(c => {
            if (c.id !== selectedCampaignId) return c;
            return { ...c, encounters: (c.encounters || []).filter(e => e.id !== encId) };
        }));
        setConfirmDelete(null);
    };

    const handleLoadSavedEncounter = (enc) => {
        setEncounter({
            budget: enc.budget || 0,
            totalXP: enc.totalXP || 0,
            monsters: (enc.monsters || []).map(m => ({ ...m })),
            loot: enc.loot ? { ...enc.loot } : null
        });
        if (onNavigate) onNavigate('encounter');
    };

    const handleSendSavedEncounterToCombat = (enc) => {
        addToTracker(enc);
        if (onNavigate) onNavigate('tracker');
    };

    const formatDate = (isoStr) => {
        if (!isoStr) return "";
        try {
            return new Date(isoStr).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', {
                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
            });
        } catch {
            return "";
        }
    };

    if (activeCampaign) {
        const notesList = (activeCampaign.notes || []).filter(n =>
            (n?.title || '').toLowerCase().includes(searchNoteTerm.toLowerCase()) ||
            (n?.content || '').toLowerCase().includes(searchNoteTerm.toLowerCase())
        );
        const encountersList = activeCampaign.encounters || [];
        const rulesList = (activeCampaign.rules || []).filter(r =>
            (r?.title || '').toLowerCase().includes(searchRuleTerm.toLowerCase()) ||
            (r?.category || '').toLowerCase().includes(searchRuleTerm.toLowerCase()) ||
            (r?.desc || '').toLowerCase().includes(searchRuleTerm.toLowerCase())
        );

        return (
            <div className="p-4 pb-8 max-w-lg mx-auto animate-in fade-in">
                <button
                    onClick={() => {
                        setSelectedCampaignId(null);
                        setShowNoteForm(false);
                        setEditingNoteId(null);
                        setSearchNoteTerm("");
                        setShowRuleForm(false);
                        setEditingRuleId(null);
                        setSearchRuleTerm("");
                    }}
                    className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#FF1457] mb-4 transition-colors uppercase tracking-wider"
                >
                    <ArrowLeft size={16} /> {t.backToCampaigns}
                </button>

                <div className="bg-[#35313B] rounded-2xl p-5 mb-4 shadow-lg border border-[#453745]">
                    <div className="flex justify-between items-start gap-2">
                        <div>
                            <h2 className="text-xl font-black text-white flex items-center gap-2">
                                <ScrollText size={20} className="text-[#FF1457] flex-shrink-0" />
                                {activeCampaign.name}
                            </h2>
                            {activeCampaign.description && (
                                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{activeCampaign.description}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex bg-[#35313B] p-1 rounded-xl mb-4 border border-[#453745] shadow-inner gap-1">
                    <button
                        onClick={() => setActiveSection('notes')}
                        className={`flex-1 py-2.5 px-1 rounded-lg font-bold text-[11px] transition-colors flex items-center justify-center gap-1 ${activeSection === 'notes' ? 'bg-[#FF1457] text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        <FileText size={13} /> {t.notes} ({(activeCampaign.notes || []).length})
                    </button>
                    <button
                        onClick={() => setActiveSection('encounters')}
                        className={`flex-1 py-2.5 px-1 rounded-lg font-bold text-[11px] transition-colors flex items-center justify-center gap-1 ${activeSection === 'encounters' ? 'bg-[#FF1457] text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Swords size={13} /> {t.savedEncounters} ({encountersList.length})
                    </button>
                    <button
                        onClick={() => setActiveSection('rules')}
                        className={`flex-1 py-2.5 px-1 rounded-lg font-bold text-[11px] transition-colors flex items-center justify-center gap-1 ${activeSection === 'rules' ? 'bg-[#FF1457] text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        <BookOpen size={13} /> {t.homebrewRules} ({(activeCampaign.rules || []).length})
                    </button>
                </div>

                {activeSection === 'notes' && (
                    <div className="animate-in fade-in">
                        {!showNoteForm ? (
                            <button
                                onClick={() => { setEditingNoteId(null); setNoteTitle(""); setNoteContent(""); setShowNoteForm(true); }}
                                className="w-full bg-gradient-to-r from-[#FF1457] to-[#613C4C] hover:opacity-90 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-[#FF1457]/30 flex items-center justify-center gap-2 mb-4 transform active:scale-95 transition-all text-sm"
                            >
                                <Plus size={18} /> {t.newNote}
                            </button>
                        ) : (
                            <form onSubmit={handleSaveNote} className="bg-[#35313B] p-4 rounded-2xl border border-[#FF1457]/50 mb-4 shadow-xl animate-in fade-in zoom-in-95 space-y-3">
                                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                                    <FileText size={16} className="text-[#FF1457]" /> {editingNoteId ? t.editNote : t.newNote}
                                </h4>
                                <input
                                    type="text"
                                    placeholder={t.noteTitle}
                                    value={noteTitle}
                                    onChange={e => setNoteTitle(e.target.value)}
                                    required
                                    className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-3 outline-none focus:border-[#FF1457] text-sm font-bold"
                                />
                                <textarea
                                    rows={6}
                                    placeholder={t.noteContent}
                                    value={noteContent}
                                    onChange={e => setNoteContent(e.target.value)}
                                    className="w-full bg-[#2B2C30] border border-[#453745] text-gray-200 rounded-xl p-3 outline-none focus:border-[#FF1457] text-sm leading-relaxed resize-y"
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => { setShowNoteForm(false); setEditingNoteId(null); }}
                                        className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-white py-2.5 rounded-xl font-bold text-sm transition-colors"
                                    >
                                        {t.cancel}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-[#FF1457] hover:opacity-90 text-white py-2.5 rounded-xl font-bold text-sm transition-colors shadow-md"
                                    >
                                        {t.save}
                                    </button>
                                </div>
                            </form>
                        )}

                        {(activeCampaign.notes || []).length > 0 && (
                            <div className="relative mb-4">
                                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder={t.searchNotes}
                                    value={searchNoteTerm}
                                    onChange={e => setSearchNoteTerm(e.target.value)}
                                    className="w-full bg-[#35313B] text-white p-3 pl-10 rounded-xl border border-[#453745] outline-none focus:border-[#FF1457] transition-colors shadow-inner text-sm"
                                />
                            </div>
                        )}

                        <div className="space-y-3">
                            {notesList.length === 0 ? (
                                <div className="text-center py-10 text-gray-500 italic bg-[#35313B] rounded-2xl border border-[#453745] border-dashed p-6">
                                    <FileText size={36} className="mx-auto mb-2 opacity-40 text-[#FF1457]" />
                                    {t.noNotes}
                                </div>
                            ) : (
                                notesList.map(note => {
                                    const isExp = expandedNote[note.id] !== undefined ? expandedNote[note.id] : true;
                                    return (
                                        <div key={note.id} className="bg-[#35313B] rounded-2xl border border-[#453745] overflow-hidden shadow-md">
                                            <div
                                                onClick={() => setExpandedNote(prev => ({ ...prev, [note.id]: !isExp }))}
                                                className="p-4 flex justify-between items-start gap-2 cursor-pointer hover:bg-[#453745]/50 transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-white text-base leading-snug">{note.title}</h4>
                                                    <p className="text-[10px] text-gray-500 mt-0.5">{formatDate(note.updatedAt)}</p>
                                                </div>
                                                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => openEditNote(note)}
                                                        className="p-2 text-gray-400 hover:text-white bg-[#2B2C30] rounded-lg border border-[#453745] transition-colors"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDelete({ type: 'note', id: note.id })}
                                                        className="p-2 text-gray-400 hover:text-[#FF1457] bg-[#2B2C30] rounded-lg border border-[#453745] transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            {isExp && note.content && (
                                                <div className="px-4 pb-4 pt-2 border-t border-[#453745]/60 bg-[#2B2C30]/60 text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                                                    {note.content}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

                {activeSection === 'encounters' && (
                    <div className="space-y-3 animate-in fade-in">
                        {encountersList.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 italic bg-[#35313B] rounded-2xl border border-[#453745] border-dashed p-6">
                                <Swords size={36} className="mx-auto mb-2 opacity-40 text-[#FF1457]" />
                                <p>{t.noSavedEncounters}</p>
                            </div>
                        ) : (
                            encountersList.map(enc => {
                                const isExp = !!expandedEncounter[enc.id];
                                const totalMonstersCount = (enc.monsters || []).reduce((acc, m) => acc + (m.count || 1), 0);
                                return (
                                    <div key={enc.id} className="bg-[#35313B] rounded-2xl border border-[#453745] overflow-hidden shadow-md">
                                        <div
                                            onClick={() => setExpandedEncounter(prev => ({ ...prev, [enc.id]: !isExp }))}
                                            className="p-4 flex justify-between items-center gap-2 cursor-pointer hover:bg-[#453745]/50 transition-colors"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-white text-base flex items-center gap-2 truncate">
                                                    <Swords size={16} className="text-[#FF1457] flex-shrink-0" />
                                                    {enc.name}
                                                </h4>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {enc.totalXP} {t.xp} • {totalMonstersCount} {lang === 'pt' ? 'monstro(s)' : 'monster(s)'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                                <button
                                                    onClick={() => setConfirmDelete({ type: 'encounter', id: enc.id })}
                                                    className="p-2 text-gray-400 hover:text-[#FF1457] bg-[#2B2C30] rounded-lg border border-[#453745] transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                                {isExp ? <X size={18} className="text-gray-500" /> : <ArrowRight size={18} className="rotate-90 text-gray-500" />}
                                            </div>
                                        </div>

                                        {isExp && (
                                            <div className="p-4 bg-[#2B2C30] border-t border-[#453745] space-y-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleLoadSavedEncounter(enc)}
                                                        className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#613C4C]"
                                                    >
                                                        <Swords size={14} /> {t.loadEncounter}
                                                    </button>
                                                    <button
                                                        onClick={() => handleSendSavedEncounterToCombat(enc)}
                                                        className="flex-1 bg-[#FF1457] hover:opacity-90 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                                                    >
                                                        <Shield size={14} /> {t.sendEncounterToCombat}
                                                    </button>
                                                </div>

                                                <div className="space-y-2">
                                                    {(enc.monsters || []).map((m, idx) => {
                                                        const mKey = `${enc.id}-${m.slug || idx}`;
                                                        const isMExp = !!expandedMonster[mKey];
                                                        return (
                                                            <div key={mKey} className="bg-[#35313B] rounded-xl border border-[#453745] overflow-hidden">
                                                                <div
                                                                    onClick={() => setExpandedMonster(prev => ({ ...prev, [mKey]: !isMExp }))}
                                                                    className="p-3 flex justify-between items-center cursor-pointer hover:bg-[#453745]/50 transition-colors"
                                                                >
                                                                    <div>
                                                                        <span className="font-bold text-white text-sm flex items-center gap-1.5">
                                                                            {m.count}x {translateName(safeText(m.name), lang)}
                                                                            {m.isBoss && <Skull size={13} className="text-[#FF1457]" />}
                                                                        </span>
                                                                        <span className="text-[11px] text-gray-400">
                                                                            CR {safeText(m.challenge_rating)} • {m.xp} XP / un
                                                                        </span>
                                                                    </div>
                                                                    {isMExp ? <X size={16} className="text-gray-500" /> : <ArrowRight size={16} className="rotate-90 text-gray-500" />}
                                                                </div>
                                                                {isMExp && (
                                                                    <div className="p-3 bg-[#2B2C30] border-t border-[#453745]">
                                                                        <StatBlock monster={m} lang={lang} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {activeSection === 'rules' && (
                    <div className="animate-in fade-in">
                        {!showRuleForm ? (
                            <button
                                onClick={() => { setEditingRuleId(null); setRuleTitle(""); setRuleCategory(""); setRuleDesc(""); setShowRuleForm(true); }}
                                className="w-full bg-gradient-to-r from-[#FF1457] to-[#613C4C] hover:opacity-90 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-[#FF1457]/30 flex items-center justify-center gap-2 mb-4 transform active:scale-95 transition-all text-sm"
                            >
                                <Plus size={18} /> {t.newRule}
                            </button>
                        ) : (
                            <form onSubmit={handleSaveRule} className="bg-[#35313B] p-4 rounded-2xl border border-[#FF1457]/50 mb-4 shadow-xl animate-in fade-in zoom-in-95 space-y-3">
                                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                                    <BookOpen size={16} className="text-[#FF1457]" /> {editingRuleId ? t.editRule : t.newRule}
                                </h4>
                                <input
                                    type="text"
                                    placeholder={t.ruleTitle}
                                    value={ruleTitle}
                                    onChange={e => setRuleTitle(e.target.value)}
                                    required
                                    className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-3 outline-none focus:border-[#FF1457] text-sm font-bold"
                                />
                                <input
                                    type="text"
                                    placeholder={t.ruleCategory}
                                    value={ruleCategory}
                                    onChange={e => setRuleCategory(e.target.value)}
                                    className="w-full bg-[#2B2C30] border border-[#453745] text-gray-200 rounded-xl p-3 outline-none focus:border-[#FF1457] text-xs font-semibold"
                                />
                                <textarea
                                    rows={5}
                                    placeholder={t.ruleDesc}
                                    value={ruleDesc}
                                    onChange={e => setRuleDesc(e.target.value)}
                                    required
                                    className="w-full bg-[#2B2C30] border border-[#453745] text-gray-200 rounded-xl p-3 outline-none focus:border-[#FF1457] text-sm leading-relaxed resize-y"
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => { setShowRuleForm(false); setEditingRuleId(null); }}
                                        className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-white py-2.5 rounded-xl font-bold text-sm transition-colors"
                                    >
                                        {t.cancel}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-[#FF1457] hover:opacity-90 text-white py-2.5 rounded-xl font-bold text-sm transition-colors shadow-md"
                                    >
                                        {t.save}
                                    </button>
                                </div>
                            </form>
                        )}

                        {(activeCampaign.rules || []).length > 0 && (
                            <div className="relative mb-4">
                                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder={t.searchCampaignRules}
                                    value={searchRuleTerm}
                                    onChange={e => setSearchRuleTerm(e.target.value)}
                                    className="w-full bg-[#35313B] text-white p-3 pl-10 rounded-xl border border-[#453745] outline-none focus:border-[#FF1457] transition-colors shadow-inner text-sm"
                                />
                            </div>
                        )}

                        <div className="space-y-3">
                            {rulesList.length === 0 ? (
                                <div className="text-center py-10 text-gray-500 italic bg-[#35313B] rounded-2xl border border-[#453745] border-dashed p-6">
                                    <BookOpen size={36} className="mx-auto mb-2 opacity-40 text-[#FF1457]" />
                                    {t.noHomebrewRules}
                                </div>
                            ) : (
                                rulesList.map(rule => {
                                    const isExp = expandedRule[rule.id] !== undefined ? expandedRule[rule.id] : true;
                                    return (
                                        <div key={rule.id} className="bg-[#35313B] rounded-2xl border border-[#453745] overflow-hidden shadow-md">
                                            <div
                                                onClick={() => setExpandedRule(prev => ({ ...prev, [rule.id]: !isExp }))}
                                                className="p-4 flex justify-between items-start gap-2 cursor-pointer hover:bg-[#453745]/50 transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className="font-bold text-white text-base leading-snug">{rule.title}</h4>
                                                        {rule.category && (
                                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FF1457]/20 text-[#FF1457] px-2 py-0.5 rounded-full border border-[#FF1457]/40">
                                                                {rule.category}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 mt-0.5">{formatDate(rule.updatedAt)}</p>
                                                </div>
                                                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => openEditRule(rule)}
                                                        className="p-2 text-gray-400 hover:text-white bg-[#2B2C30] rounded-lg border border-[#453745] transition-colors"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDelete({ type: 'rule', id: rule.id })}
                                                        className="p-2 text-gray-400 hover:text-[#FF1457] bg-[#2B2C30] rounded-lg border border-[#453745] transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            {isExp && rule.desc && (
                                                <div className="px-4 pb-4 pt-2 border-t border-[#453745]/60 bg-[#2B2C30]/60 text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                                                    {rule.desc}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

                {confirmDelete && (
                    <div className="fixed inset-0 bg-[#2B2C30]/90 flex items-center justify-center p-4 z-50">
                        <div className="bg-[#35313B] p-6 rounded-2xl border border-[#FF1457]/50 shadow-2xl max-w-sm w-full text-center">
                            <Trash2 size={40} className="mx-auto text-[#FF1457] mb-3" />
                            <p className="text-white font-bold mb-6">
                                {confirmDelete.type === 'encounter'
                                    ? t.deleteEncounterConfirm
                                    : confirmDelete.type === 'rule'
                                        ? t.deleteRuleConfirm
                                        : t.deleteNoteConfirm}
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-white font-bold py-2.5 rounded-xl">
                                    {t.cancel}
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirmDelete.type === 'encounter') handleDeleteSavedEncounter(confirmDelete.id);
                                        else if (confirmDelete.type === 'rule') handleDeleteRule(confirmDelete.id);
                                        else handleDeleteNote(confirmDelete.id);
                                    }}
                                    className="flex-1 bg-[#FF1457] hover:bg-[#d10e46] text-white font-bold py-2.5 rounded-xl"
                                >
                                    <Trash2 size={16} className="inline mr-1" /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="p-4 pb-8 max-w-lg mx-auto animate-in fade-in">
            {!showNewCampaignForm ? (
                <button
                    onClick={() => setShowNewCampaignForm(true)}
                    className="w-full bg-gradient-to-r from-[#FF1457] to-[#613C4C] hover:opacity-90 text-white font-black py-4 rounded-2xl shadow-lg shadow-[#FF1457]/30 flex items-center justify-center gap-2 mb-6 transform active:scale-95 transition-all"
                >
                    <Plus size={22} /> {t.newCampaign}
                </button>
            ) : (
                <form onSubmit={handleCreateCampaign} className="bg-[#35313B] p-5 rounded-2xl border border-[#FF1457]/50 mb-6 shadow-xl animate-in fade-in zoom-in-95 space-y-3">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <ScrollText size={18} className="text-[#FF1457]" /> {t.newCampaign}
                    </h3>
                    <input
                        type="text"
                        placeholder={t.campaignName}
                        value={campaignName}
                        onChange={e => setCampaignName(e.target.value)}
                        required
                        className="w-full bg-[#2B2C30] border border-[#453745] text-white rounded-xl p-3 outline-none focus:border-[#FF1457] text-sm font-bold"
                    />
                    <textarea
                        rows={3}
                        placeholder={t.campaignDesc}
                        value={campaignDesc}
                        onChange={e => setCampaignDesc(e.target.value)}
                        className="w-full bg-[#2B2C30] border border-[#453745] text-gray-200 rounded-xl p-3 outline-none focus:border-[#FF1457] text-sm resize-none"
                    />
                    <div className="flex gap-2 pt-1">
                        <button
                            type="button"
                            onClick={() => setShowNewCampaignForm(false)}
                            className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-white py-2.5 rounded-xl font-bold text-sm transition-colors"
                        >
                            {t.cancel}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-[#FF1457] hover:opacity-90 text-white py-2.5 rounded-xl font-bold text-sm transition-colors shadow-md"
                        >
                            {t.save}
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-3">
                {campaigns.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 italic bg-[#35313B] rounded-2xl border border-[#453745] border-dashed p-6">
                        <ScrollText size={48} className="mx-auto mb-3 opacity-40 text-[#FF1457]" />
                        <p>{t.noCampaigns}</p>
                    </div>
                ) : (
                    campaigns.map(camp => (
                        <div
                            key={camp.id}
                            onClick={() => setSelectedCampaignId(camp.id)}
                            className="bg-[#35313B] hover:bg-[#453745]/60 rounded-2xl p-4 border border-[#453745] shadow-md transition-all cursor-pointer flex justify-between items-center gap-3"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <ScrollText size={18} className="text-[#FF1457] flex-shrink-0" />
                                    <h3 className="font-bold text-white text-base truncate">{camp.name}</h3>
                                </div>
                                {camp.description && (
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{camp.description}</p>
                                )}
                                <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500 font-semibold flex-wrap">
                                    <span className="text-[#FF1457] bg-[#2B2C30] px-2 py-0.5 rounded-md border border-[#453745]">
                                        {(camp.notes || []).length} {t.notes}
                                    </span>
                                    <span className="text-[#FF1457] bg-[#2B2C30] px-2 py-0.5 rounded-md border border-[#453745]">
                                        {(camp.encounters || []).length} {t.savedEncounters}
                                    </span>
                                    <span className="text-[#FF1457] bg-[#2B2C30] px-2 py-0.5 rounded-md border border-[#453745]">
                                        {(camp.rules || []).length} {t.homebrewRules}
                                    </span>
                                    <span>{formatDate(camp.createdAt)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                <button
                                    onClick={() => setConfirmDelete({ type: 'campaign', id: camp.id })}
                                    className="p-2.5 text-gray-400 hover:text-[#FF1457] bg-[#2B2C30] rounded-xl border border-[#453745] transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <ArrowRight size={18} className="text-gray-500" onClick={() => setSelectedCampaignId(camp.id)} />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {confirmDelete && confirmDelete.type === 'campaign' && (
                <div className="fixed inset-0 bg-[#2B2C30]/90 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#35313B] p-6 rounded-2xl border border-[#FF1457]/50 shadow-2xl max-w-sm w-full text-center">
                        <Trash2 size={40} className="mx-auto text-[#FF1457] mb-3" />
                        <p className="text-white font-bold mb-6">{t.deleteCampaignConfirm}</p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-[#453745] hover:bg-[#613C4C] text-white font-bold py-2.5 rounded-xl">
                                {t.cancel}
                            </button>
                            <button onClick={() => handleDeleteCampaign(confirmDelete.id)} className="flex-1 bg-[#FF1457] hover:bg-[#d10e46] text-white font-bold py-2.5 rounded-xl">
                                <Trash2 size={16} className="inline mr-1" /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
