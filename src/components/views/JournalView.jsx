import { useState } from 'react';
import styles from './JournalView.module.css';

const ENTRY_TYPES = [
  { id:'clue',      label:'Clue',        icon:'◈', color:'var(--gold-lit)' },
  { id:'contact',   label:'Contact',     icon:'👤', color:'var(--vital-lit)' },
  { id:'location',  label:'Location',    icon:'🏚', color:'var(--gold)' },
  { id:'entity',    label:'Entity',      icon:'⛧', color:'var(--veil-vivid)' },
  { id:'threat',    label:'Threat',      icon:'⚠', color:'var(--red-vivid)' },
  { id:'note',      label:'Note',        icon:'📜', color:'var(--ink)' },
];

export default function JournalView({ character, onUpdate }) {
  const journal    = character.journal || [];
  const [tab,      setTab]      = useState('all');
  const [editing,  setEditing]  = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newBody,  setNewBody]  = useState('');
  const [newType,  setNewType]  = useState('note');
  const [search,   setSearch]   = useState('');

  const filtered = journal
    .filter(e => tab === 'all' || e.type === tab)
    .filter(e => !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.body?.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => b.createdAt - a.createdAt);

  const addEntry = () => {
    if (!newTitle.trim()) return;
    const entry = {
      id: Date.now(),
      type: newType,
      title: newTitle.trim(),
      body: newBody.trim(),
      createdAt: Date.now(),
      day: character.gameTime?.day || 1,
    };
    onUpdate([entry, ...journal]);
    setNewTitle(''); setNewBody(''); setNewType('note');
  };

  const deleteEntry = (id) => {
    onUpdate(journal.filter(e => e.id !== id));
  };

  const updateEntry = (id, changes) => {
    onUpdate(journal.map(e => e.id === id ? {...e, ...changes} : e));
    setEditing(null);
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Field Journal</h2>
      <p className={styles.sub}>Your notes on this investigation. What you know, who you have met, what threatens you.</p>

      {/* Search + New */}
      <div className={styles.topRow}>
        <input className={`field ${styles.search}`} placeholder="Search entries..."
          value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      {/* New entry form */}
      <div className={styles.newEntry}>
        <div className={styles.newRow}>
          <select className={styles.typeSelect} value={newType} onChange={e=>setNewType(e.target.value)}>
            {ENTRY_TYPES.map(t=>(
              <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
            ))}
          </select>
          <input className={`field ${styles.titleInput}`}
            placeholder="Entry title..."
            value={newTitle} onChange={e=>setNewTitle(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&addEntry()} />
        </div>
        <textarea className={`field ${styles.bodyInput}`}
          placeholder="Details, connections, implications... (optional)"
          value={newBody} onChange={e=>setNewBody(e.target.value)}
          rows={2} />
        <button className='act act-gold act-sm' onClick={addEntry} disabled={!newTitle.trim()}>
          + Add Entry
        </button>
      </div>

      <hr className='rule' />

      {/* Filter tabs */}
      <div className={styles.filterRow}>
        <button className={`${styles.filterBtn} ${tab==='all'?styles.fOn:''}`} onClick={()=>setTab('all')}>
          All <span className={styles.fc}>{journal.length}</span>
        </button>
        {ENTRY_TYPES.map(t=>{
          const count = journal.filter(e=>e.type===t.id).length;
          if (!count) return null;
          return (
            <button key={t.id} className={`${styles.filterBtn} ${tab===t.id?styles.fOn:''}`}
              onClick={()=>setTab(t.id)}>
              {t.icon} {t.label} <span className={styles.fc}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Entries */}
      <div className={styles.entries}>
        {filtered.length === 0 && (
          <p className='italic dim' style={{marginTop:16,fontSize:'0.82rem'}}>
            {search ? 'No entries match your search.' : 'No entries yet. Start recording what you find.'}
          </p>
        )}
        {filtered.map(entry => {
          const typeInfo = ENTRY_TYPES.find(t=>t.id===entry.type);
          const isEditing = editing === entry.id;
          return (
            <div key={entry.id} className={`${styles.entry} ${entry.auto ? styles.autoEntry : ''}`} style={{'--ec': typeInfo?.color || 'var(--ink)'}}>
              <div className={styles.entryHead}>
                <span className={styles.entryIcon}>{typeInfo?.icon}</span>
                {isEditing ? (
                  <input className={`field ${styles.editTitle}`}
                    defaultValue={entry.title}
                    onBlur={e=>updateEntry(entry.id,{title:e.target.value})}
                    autoFocus />
                ) : (
                  <span className={styles.entryTitle} onClick={()=>setEditing(entry.id)}>
                    {entry.title}
                  </span>
                )}
                <span className={styles.entryDay}>Day {entry.day}</span>
                {entry.auto && <span className={styles.autoTag}>auto</span>}
                <button className={styles.deleteBtn} onClick={()=>deleteEntry(entry.id)}>✕</button>
              </div>
              {entry.body && !isEditing && (
                <p className={styles.entryBody} onClick={()=>setEditing(entry.id)}>{entry.body}</p>
              )}
              {isEditing && (
                <textarea className={`field ${styles.editBody}`}
                  defaultValue={entry.body}
                  onBlur={e=>updateEntry(entry.id,{body:e.target.value})}
                  rows={3} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
