import { useState, useEffect } from 'react';
import { useClaude } from '../../hooks/useClaude.js';
import styles from './NPCOverlay.module.css';
export default function NPCOverlay({ npc, character, onClose }) {
  const { loading, generateNarrative } = useClaude();
  const [greeting, setGreeting] = useState(null);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState('');
  const trust = character.npcTrust?.[npc.id]||0;
  const trustLabel = trust<20?'Untrusted':trust<60?'Known':trust<100?'Allied':'Trusted';
  useEffect(()=>{
    const g = npc.dialogue.greeting;
    setGreeting(g[Math.floor(Math.random()*g.length)]);
  },[npc.id]);
  const ask = async () => {
    if (!input.trim()||loading) return;
    const q=input.trim(); setInput('');
    setChat(h=>[...h,{role:'user',text:q}]);
    const tl = trust<20?'low':trust<60?'mid':'high';
    const ctx = npc.dialogue[`trust_${tl}`]||'';
    const r = await generateNarrative(`You are ${npc.name}, ${npc.title}. Background: ${npc.description} Lore: ${npc.lore} Trust: ${trustLabel}. Context: ${ctx} Player (${character.name}, dark secret: ${character.darkSecret?.name}) asks: "${q}". 2-3 sentences max. Stay in character. Dark and atmospheric.`);
    if(r) setChat(h=>[...h,{role:'npc',text:r}]);
  };
  return (
    <div className={styles.overlay} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.icon}>{npc.icon}</span>
          <div className={styles.info}><div className={styles.nName}>{npc.name}</div><div className={styles.nTitle}>{npc.title}</div></div>
          <div className={styles.trust}><span className={styles.tLabel}>Trust</span><span className={`badge ${trust>=60?'badge-gold':'badge-dim'}`}>{trustLabel}</span></div>
          <button className='act act-sm' onClick={onClose}>✕</button>
        </div>
        <div className={styles.body}>
          <p className={styles.desc}>{npc.description}</p>
          <div className={styles.dialogue}>
            {greeting && chat.length===0 && <div className={styles.npcLine}><span className={styles.lineIcon}>{npc.icon}</span><p>"{greeting}"</p></div>}
            {chat.map((e,i)=>(
              <div key={i} className={`${styles.line} ${e.role==='user'?styles.user:styles.npcChat}`}>
                {e.role==='npc'&&<span className={styles.lineIcon}>{npc.icon}</span>}
                <p>"{e.text}"</p>
                {e.role==='user'&&<span className={styles.lineIcon}>〉</span>}
              </div>
            ))}
            {loading && <div className={styles.typing}><span/><span/><span/></div>}
          </div>
          <div className={styles.inputRow}>
            <input className='field' placeholder="Ask something..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ask()} disabled={loading} style={{flex:1,fontSize:'0.82rem'}}/>
            <button className='act act-gold' onClick={ask} disabled={loading||!input.trim()}>Ask</button>
          </div>
          {trust>=40&&<div className={styles.lore}><span className={styles.loreLabel}>Intel</span><p>{npc.lore}</p></div>}
        </div>
      </div>
    </div>
  );
}
