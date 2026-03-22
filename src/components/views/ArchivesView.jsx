// The Archives — Archons, Death Angels, and Entities known to the Awakened.
// Replaces generic Lore view with a more thematic, organized bestiary/codex.
import { useState } from 'react';
import { ARCHONS } from '../../data/archons.js';
import { DEATH_ANGELS, getDeathAngelForSecret } from '../../data/deathAngels.js';
import { getLoreForInsight, LORE_CATEGORIES } from '../../data/lore.js';
import styles from './ArchivesView.module.css';

const TABS = ['Cosmology','Archons','Death Angels','Entities & Places'];

export default function ArchivesView({ character }) {
  const [tab, setTab]       = useState('Cosmology');
  const [active, setActive] = useState(null);

  const loreEntries     = getLoreForInsight(character.insight);
  const cosmologyLore   = loreEntries.filter(e => ['Cosmology','Afterlife'].includes(e.category));
  const entityLore      = loreEntries.filter(e => ['Entities','Places'].includes(e.category));
  const allArchons      = character.insight >= 1 ? ARCHONS : [];
  const allDA           = character.insight >= 2 ? DEATH_ANGELS : [];
  const playerDA        = getDeathAngelForSecret(character.darkSecret?.id);

  const renderLoreEntry = (entry) => (
    <div key={entry.id} className={`${styles.entry} ${active===entry.id?styles.entryOn:''}`}
      onClick={() => setActive(active===entry.id?null:entry.id)}>
      <div className={styles.entryHead}>
        <span className={styles.entryTitle}>{entry.title}</span>
        <span className='badge badge-dim'>{entry.category}</span>
      </div>
      {active===entry.id && (
        <div className={styles.entryBody}>
          {entry.body.split('\n\n').map((p,i)=><p key={i}>{p.trim()}</p>)}
        </div>
      )}
    </div>
  );

  const renderArchon = (a) => (
    <div key={a.id} className={`${styles.entry} ${active===a.id?styles.entryOn:''}`}
      onClick={() => setActive(active===a.id?null:a.id)}>
      <div className={styles.entryHead}>
        <span className={styles.archonGlyph}>{a.icon}</span>
        <div>
          <span className={styles.entryTitle}>{a.name}</span>
          <span className={styles.entryRole}>{a.title}</span>
        </div>
        <span className='badge badge-dim'>{a.domain}</span>
      </div>
      {active===a.id && (
        <div className={styles.entryBody}>
          {a.description.split('\n\n').map((p,i)=><p key={i}>{p.trim()}</p>)}
          <div className={styles.detailsGrid}>
            <div className={styles.detailBlock}>
              <span className={styles.detailLabel}>Servants</span>
              <p>{a.servants.join(', ')}</p>
            </div>
            <div className={styles.detailBlock}>
              <span className={styles.detailLabel}>Goals</span>
              <p>{a.goals}</p>
            </div>
            <div className={styles.detailBlock}>
              <span className={styles.detailLabel}>Weakness</span>
              <p>{a.weakness}</p>
            </div>
            <div className={styles.detailBlock}>
              <span className={styles.detailLabel}>Player Note</span>
              <p style={{color:'var(--gold)'}}>{a.playerNote}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDA = (d) => {
    const isYours = d.id === playerDA?.id;
    return (
      <div key={d.id} className={`${styles.entry} ${active===d.id?styles.entryOn:''} ${isYours?styles.yourDA:''}`}
        onClick={() => setActive(active===d.id?null:d.id)}>
        <div className={styles.entryHead}>
          <span className={styles.archonGlyph}>{d.icon}</span>
          <div>
            <span className={styles.entryTitle}>{d.name}</span>
            <span className={styles.entryRole}>{d.title}</span>
            {isYours && <span className='badge badge-red' style={{marginLeft:6}}>Your Patron</span>}
          </div>
          <span className='badge badge-veil'>{d.aspect}</span>
        </div>
        {active===d.id && (
          <div className={styles.entryBody}>
            {d.description.split('\n\n').map((p,i)=><p key={i}>{p.trim()}</p>)}
            <div className={styles.detailsGrid}>
              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Domain</span>
                <p>{d.domain}</p>
              </div>
              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Manifestation</span>
                <p>{d.manifestation}</p>
              </div>
              <div className={styles.detailBlock} style={{borderColor:'var(--gold-dark)'}}>
                <span className={styles.detailLabel} style={{color:'var(--gold)'}}>Bargain</span>
                <p>{d.bargain}</p>
              </div>
              <div className={styles.detailBlock} style={{borderColor:'var(--vital-dark)'}}>
                <span className={styles.detailLabel} style={{color:'var(--vital-lit)'}}>Liberation</span>
                <p>{d.liberation}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>The Archives</h2>
      <p className={styles.sub}>Accumulated knowledge. Everything here was paid for with something.</p>
      <div className={styles.tabRow}>
        {TABS.map(t => (
          <button key={t} className={`${styles.tabBtn} ${tab===t?styles.tabOn:''}`} onClick={()=>{setTab(t);setActive(null);}}>
            {t}
          </button>
        ))}
      </div>
      <div className='rule-blood' />

      <div className={styles.entries}>
        {tab==='Cosmology' && (
          cosmologyLore.length
            ? cosmologyLore.map(renderLoreEntry)
            : <p className='italic dim' style={{fontSize:'0.84rem',marginTop:12}}>Your Insight is too low to access these records. Investigate, commune, and push further into the Illusion.</p>
        )}
        {tab==='Archons' && (
          allArchons.length
            ? allArchons.map(renderArchon)
            : <p className='italic dim' style={{fontSize:'0.84rem',marginTop:12}}>Insight 1 required to access Archon files.</p>
        )}
        {tab==='Death Angels' && (
          <>
            {playerDA && (
              <div className={styles.yourDAbanner}>
                <span className={styles.ydaGlyph}>{playerDA.icon}</span>
                <div>
                  <div className={styles.ydaTitle}>Your Patron Death Angel: {playerDA.name}</div>
                  <div className={styles.ydaSub}>Bound to your dark secret — {character.darkSecret?.name}</div>
                </div>
              </div>
            )}
            {allDA.length
              ? allDA.map(renderDA)
              : <p className='italic dim' style={{fontSize:'0.84rem',marginTop:12}}>Insight 2 required to access Death Angel records.</p>
            }
          </>
        )}
        {tab==='Entities & Places' && (
          entityLore.length
            ? entityLore.map(renderLoreEntry)
            : <p className='italic dim' style={{fontSize:'0.84rem',marginTop:12}}>No records available at your current Insight level.</p>
        )}
      </div>
    </div>
  );
}
