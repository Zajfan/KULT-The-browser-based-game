import { FACTIONS } from '../../data/factions.js';
import { deleteSave } from '../../utils/saveLoad.js';
import styles from './CharacterView.module.css';

const ATTRS = [['reason','REA'],['intuition','INT'],['perception','PER'],['coolness','COO'],['violence','VIO'],['soul','SOL'],['willpower','WIL'],['fortitude','FOR'],['reflexes','REF']];
const STATS = [['actionsPerformed','Actions'],['crimesCommitted','Crimes'],['entitiesDefeated','Entities Defeated'],['ritualsPerformed','Rituals'],['stabilityLost','Stability Lost'],['insightGained','Insight Gained'],['thalersEarned','Thalers Earned'],['daysPlayed','Days']];

export default function CharacterView({ character }) {
  const session = character.createdAt ? Math.floor((Date.now()-character.createdAt)/60000) : 0;
  const activePassions = (character.passions || []).filter(p => p?.description);
  return (
    <div className={styles.page}>
      <div className={styles.identity}>
        <span className={styles.sigil}>⛧</span>
        <div>
          <h1 className={styles.name}>{character.name}</h1>
          <div className={styles.secret}>{character.darkSecret?.name} — <em>{character.darkSecret?.subtitle}</em></div>
          <p className={styles.ability}>{character.darkSecret?.specialAbility}</p>
        </div>
      </div>
      <div className='rule-gold' />

      <div className={styles.grid}>
        <section>
          <h3 className={styles.sh}>Attributes</h3>
          <div className={styles.attrs}>
            {ATTRS.map(([k,abbr])=>{
              const v = character.attributes[k]||0;
              return (
                <div key={k} className={styles.attr}>
                  <span className={styles.attrLabel}>{abbr}</span>
                  <span className={`mono ${styles.attrVal} ${v>0?styles.pos:v<0?styles.neg:''}`}>{v>0?'+':''}{v}</span>
                </div>
              );
            })}
          </div>
          {(character.advantages?.length||0)>0 && (
            <>
              <h3 className={styles.sh} style={{marginTop:18}}>Advantages</h3>
              <div className={styles.traits}>
                {character.advantages.map(a=>(
                  <div key={a.id} className={styles.trait}>
                    <span className='badge badge-gold'>{a.name}</span>
                    <span style={{fontSize:'0.7rem',color:'var(--ink-dim)',fontStyle:'italic'}}>{a.description}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          {(character.disadvantages?.length||0)>0 && (
            <>
              <h3 className={styles.sh} style={{marginTop:14}}>Disadvantages</h3>
              <div className={styles.traits}>
                {character.disadvantages.map(d=>(
                  <div key={d.id} className={styles.trait}>
                    <span className='badge badge-red'>{d.name}</span>
                    <span style={{fontSize:'0.7rem',color:'var(--ink-dim)',fontStyle:'italic'}}>{d.description}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          {activePassions.length > 0 && (
            <>
              <h3 className={styles.sh} style={{marginTop:14}}>Passions</h3>
              <div className={styles.traits}>
                {activePassions.map(p => (
                  <div key={`${p.typeId}-${p.description}`} className={styles.trait}>
                    <span style={{fontSize:'0.78rem',color:'var(--ink)',fontStyle:'italic'}}>{p.description}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <section>
          <h3 className={styles.sh}>Statistics</h3>
          <div className={styles.stats}>
            {STATS.map(([k,l])=>(
              <div key={k} className={styles.statRow}>
                <span style={{fontSize:'0.75rem',color:'var(--ink-dim)'}}>{l}</span>
                <span className='mono' style={{fontSize:'0.78rem',color:'var(--gold-lit)'}}>{character.stats?.[k]??0}</span>
              </div>
            ))}
            <div className={styles.statRow}>
              <span style={{fontSize:'0.75rem',color:'var(--ink-dim)'}}>Session</span>
              <span className='mono' style={{fontSize:'0.78rem',color:'var(--ink)'}}>{session}m</span>
            </div>
          </div>

          <h3 className={styles.sh} style={{marginTop:18}}>Progression</h3>
          <div className={styles.progBlock}>
            <div className={styles.progItem}>
              <span style={{fontSize:'0.75rem',color:'var(--ink-dim)'}}>Ascension</span>
              <div className='bar-wrap'><div className='bar-fill' style={{width:`${character.ascensionProgress||0}%`,background:'var(--veil-lit)'}}/></div>
              <span className='mono' style={{fontSize:'0.68rem',color:'var(--veil-vivid)'}}>{character.ascensionProgress||0}/100</span>
            </div>
            <div className={styles.progItem}>
              <span style={{fontSize:'0.75rem',color:'var(--ink-dim)'}}>Guilt Stacks</span>
              <div className='pips'>
                {Array.from({length:10},(_,i)=>(
                  <div key={i} className={`pip ${i<(character.guiltStacks||0)?'red-on':''}`}/>
                ))}
              </div>
              <span className='mono' style={{fontSize:'0.68rem',color:'var(--red-lit)'}}>{character.guiltStacks||0}/10</span>
            </div>
          </div>

          {Object.keys(character.trainingProgress||{}).length > 0 && (
            <>
              <h3 className={styles.sh} style={{marginTop:18}}>Training Progress</h3>
              <div className={styles.trainProgress}>
                {Object.entries(character.trainingProgress||{}).map(([attr,prog])=>(
                  <div key={attr} className={styles.trainProg}>
                    <span style={{fontSize:'0.72rem',color:'var(--ink-dim)',textTransform:'uppercase',letterSpacing:'0.08em'}}>{attr}</span>
                    <div className='bar-wrap' style={{flex:1}}>
                      <div className='bar-fill' style={{width:`${Math.min(prog*100,100)}%`,background:'var(--gold)'}}/>
                    </div>
                    <span className='mono' style={{fontSize:'0.65rem',color:'var(--gold)'}}>{(prog*100).toFixed(0)}%</span>
                  </div>
                ))}
                <p style={{fontSize:'0.68rem',color:'var(--ink-faint)',marginTop:4,fontStyle:'italic'}}>Progress toward next attribute increase.</p>
              </div>
            </>
          )}

          <div className={styles.danger}>
            <button className='act act-danger act-sm' onClick={()=>{if(confirm('Delete save?')){deleteSave();location.reload();}}}>
              Delete Save
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
