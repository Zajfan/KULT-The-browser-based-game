import { useState, useEffect } from 'react';
import { useClaude } from '../../hooks/useClaude.js';
import styles from './NPCOverlay.module.css';

const SERVICE_LABELS = {
  heal_wounds:       { label: 'Treat Wounds',       cost: '₮300',     min: 0  },
  treat_stability:   { label: 'Therapy Session',    cost: '₮200',     min: 20 },
  bribe_doctor:      { label: 'Bribe (Restricted)', cost: '₮150',     min: 40 },
  research_lore:     { label: 'Research Access',    cost: '10 AP',    min: 0  },
  find_pattern:      { label: 'Pattern Analysis',   cost: '20 AP',    min: 20 },
  access_restricted: { label: 'Restricted Files',   cost: '30 AP',    min: 60 },
  network_awakened:  { label: 'Circle Network',     cost: '20 AP',    min: 0  },
  trade_information: { label: 'Trade Intel',        cost: '25 AP',    min: 20 },
  find_ritual:       { label: 'Ritual Contact',     cost: '30 AP',    min: 40 },
  buy_weapon:        { label: 'Browse Weapons',     cost: 'Variable', min: 0  },
  buy_artifact:      { label: 'Browse Artifacts',   cost: 'Variable', min: 20 },
  sell_items:        { label: 'Sell Items',         cost: 'Free',     min: 0  },
  speak_patient:     { label: 'Patient Interview',  cost: '20 AP',    min: 0  },
  examine_records:   { label: 'Examine Records',    cost: '25 AP',    min: 20 },
  steal_secret:      { label: 'Extract Secret',     cost: '35 AP',    min: 60 },
};

export default function NPCOverlay({ npc, character, onClose, onAction }) {
  const { loading, generateNarrative } = useClaude();
  const [greeting, setGreeting] = useState(null);
  const [chat,     setChat]     = useState([]);
  const [input,    setInput]    = useState('');
  const [tab,      setTab]      = useState('talk');

  const trust      = character.npcTrust?.[npc.id] || 0;
  const trustLabel = trust < 20 ? 'Untrusted' : trust < 60 ? 'Known' : trust < 100 ? 'Allied' : 'Trusted';
  const trustPct   = Math.min((trust / 100) * 100, 100);
  const trustColor = trust < 20 ? 'var(--ink-dim)' : trust < 60 ? 'var(--gold)' : trust < 100 ? 'var(--vital-lit)' : 'var(--veil-vivid)';

  useEffect(() => {
    const g = npc.dialogue.greeting;
    setGreeting(g[Math.floor(Math.random() * g.length)]);
  }, [npc.id]);

  const ask = async () => {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput('');
    setChat(h => [...h, { role: 'user', text: q }]);
    const tl  = trust < 20 ? 'low' : trust < 60 ? 'mid' : 'high';
    const ctx = npc.dialogue[`trust_${tl}`] || '';
    const r   = await generateNarrative(
      `You are ${npc.name}, ${npc.title}. Background: ${npc.description} Lore: ${npc.lore} ` +
      `Trust with ${character.name}: ${trustLabel}. Tone: "${ctx}" ` +
      `Player dark secret: ${character.darkSecret?.name}. ` +
      `Question: "${q}". ` +
      `2-3 sentences. Stay in character. Dark and atmospheric.`
    );
    if (r) setChat(h => [...h, { role: 'npc', text: r }]);
  };

  const availableServices = (npc.services || []).filter(s => {
    const info = SERVICE_LABELS[s];
    return info && trust >= (info.min || 0);
  });

  const lockedServices = (npc.services || []).filter(s => {
    const info = SERVICE_LABELS[s];
    return info && trust < (info.min || 0);
  });

  const handleService = (serviceId) => {
    if (onAction) onAction(serviceId);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        <div className={styles.header}>
          <span className={styles.icon}>{npc.icon}</span>
          <div className={styles.info}>
            <div className={styles.nName}>{npc.name}</div>
            <div className={styles.nTitle}>{npc.title}</div>
          </div>
          <div className={styles.trustBlock}>
            <div className={styles.trustRow}>
              <span className={styles.tLabel}>Trust</span>
              <span className={styles.tValue} style={{ color: trustColor }}>{trustLabel}</span>
            </div>
            <div className={styles.trustBar}>
              <div className={styles.trustFill} style={{ width: `${trustPct}%`, background: trustColor }} />
            </div>
          </div>
          <button className='act act-sm' onClick={onClose}>✕</button>
        </div>

        <p className={styles.desc}>{npc.description}</p>

        {npc.services?.length > 0 && (
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab === 'talk' ? styles.tabOn : ''}`} onClick={() => setTab('talk')}>
              Conversation
            </button>
            <button className={`${styles.tab} ${tab === 'services' ? styles.tabOn : ''}`} onClick={() => setTab('services')}>
              Services {availableServices.length > 0 && <span className={styles.badge}>{availableServices.length}</span>}
            </button>
          </div>
        )}

        {tab === 'talk' && (
          <div className={styles.body}>
            <div className={styles.dialogue}>
              {greeting && chat.length === 0 && (
                <div className={styles.npcLine}>
                  <span className={styles.lineIcon}>{npc.icon}</span>
                  <p>"{greeting}"</p>
                </div>
              )}
              {chat.map((e, i) => (
                <div key={i} className={`${styles.line} ${e.role === 'user' ? styles.user : styles.npcChat}`}>
                  {e.role === 'npc' && <span className={styles.lineIcon}>{npc.icon}</span>}
                  <p>"{e.text}"</p>
                  {e.role === 'user' && <span className={styles.lineIcon}>〉</span>}
                </div>
              ))}
              {loading && <div className={styles.typing}><span /><span /><span /></div>}
            </div>
            <div className={styles.inputRow}>
              <input className='field' placeholder="Ask something..."
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && ask()}
                disabled={loading} style={{ flex: 1, fontSize: '0.82rem' }} />
              <button className='act act-gold' onClick={ask} disabled={loading || !input.trim()}>Ask</button>
            </div>
            {trust >= 40 && (
              <div className={styles.lore}>
                <span className={styles.loreLabel}>Intel</span>
                <p>{npc.lore}</p>
              </div>
            )}
          </div>
        )}

        {tab === 'services' && (
          <div className={styles.body}>
            {availableServices.length === 0 && (
              <p className='italic dim' style={{ fontSize: '0.8rem', marginTop: 8 }}>
                Build trust with {npc.name.split(' ')[0]} to unlock services.
              </p>
            )}
            <div className={styles.serviceList}>
              {availableServices.map(s => {
                const info = SERVICE_LABELS[s] || { label: s, cost: '?' };
                return (
                  <button key={s} className={styles.serviceBtn} onClick={() => handleService(s)}>
                    <span className={styles.sLabel}>{info.label}</span>
                    <span className={styles.sCost}>{info.cost}</span>
                  </button>
                );
              })}
            </div>
            {lockedServices.length > 0 && (
              <div className={styles.lockedServices}>
                <div className={styles.lockedHead}>Locked — requires higher trust</div>
                {lockedServices.map(s => {
                  const info = SERVICE_LABELS[s] || { label: s };
                  return (
                    <div key={s} className={styles.lockedService}>
                      <span>{info.label}</span>
                      <span className='mono dim' style={{ fontSize: '0.65rem' }}>Trust {info.min}+</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
