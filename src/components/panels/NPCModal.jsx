import { useState, useEffect } from 'react';
import { useClaude } from '../../hooks/useClaude.js';
import styles from './NPCModal.module.css';

export default function NPCModal({ npc, character, onClose }) {
  const { loading, generateNarrative } = useClaude();
  const [dialogue, setDialogue] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const trust = character.npcTrust?.[npc.id] || 0;
  const trustLabel = trust < 20 ? 'Untrusted' : trust < 60 ? 'Known' : trust < 100 ? 'Allied' : 'Trusted';

  useEffect(() => {
    const greetings = npc.dialogue.greeting;
    setDialogue(greetings[Math.floor(Math.random() * greetings.length)]);
  }, [npc.id]);

  const askQuestion = async () => {
    if (!userInput.trim()) return;
    const question = userInput.trim();
    setUserInput('');

    setChatHistory(h => [...h, { role: 'user', text: question }]);

    const trustLevel = trust < 20 ? 'low' : trust < 60 ? 'mid' : 'high';
    const context = npc.dialogue[`trust_${trustLevel}`] || '';

    const prompt = `You are ${npc.name}, ${npc.title}. Background: ${npc.description}
Lore: ${npc.lore}
Your current trust level with this character: ${trustLabel}.
Trust context: ${context}

The player (${character.name}, dark secret: ${character.darkSecret?.name}) asks: "${question}"

Respond in character. 2-3 sentences max. Dark, atmospheric, guarded unless trust is high. Never break character.`;

    const response = await generateNarrative(prompt);
    if (response) {
      setChatHistory(h => [...h, { role: 'npc', text: response }]);
    }
  };

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.npcInfo}>
            <span className={styles.npcIcon}>{npc.icon}</span>
            <div>
              <div className={styles.npcName}>{npc.name}</div>
              <div className={styles.npcTitle}>{npc.title}</div>
            </div>
          </div>
          <div className={styles.trustBlock}>
            <span className={styles.trustLabel}>Trust</span>
            <span className={`tag ${trust >= 60 ? 'tag-gold' : 'tag-dim'}`}>{trustLabel}</span>
          </div>
          <button className={`btn btn-sm`} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          {/* NPC description */}
          <div className={styles.npcDesc}>
            <p>{npc.description}</p>
          </div>

          {/* Dialogue area */}
          <div className={styles.dialogueArea}>
            {dialogue && chatHistory.length === 0 && (
              <div className={styles.npcLine}>
                <span className={styles.npcLineIcon}>{npc.icon}</span>
                <p>"{dialogue}"</p>
              </div>
            )}
            {chatHistory.map((entry, i) => (
              <div key={i} className={`${styles.chatLine} ${entry.role === 'user' ? styles.userLine : styles.npcChatLine}`}>
                {entry.role === 'npc' && <span className={styles.npcLineIcon}>{npc.icon}</span>}
                <p>"{entry.text}"</p>
                {entry.role === 'user' && <span className={styles.userIcon}>👤</span>}
              </div>
            ))}
            {loading && (
              <div className={styles.typingIndicator}>
                <span /><span /><span />
              </div>
            )}
          </div>

          {/* Input */}
          <div className={styles.inputArea}>
            <input
              className={styles.input}
              type='text'
              placeholder='Ask something...'
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && askQuestion()}
              disabled={loading}
            />
            <button className='btn btn-gold' onClick={askQuestion} disabled={loading || !userInput.trim()}>
              Ask
            </button>
          </div>

          {/* Lore / intel */}
          {trust >= 40 && (
            <div className={styles.loreBox}>
              <span className={styles.loreLabel}>Known Intel</span>
              <p>{npc.lore}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
