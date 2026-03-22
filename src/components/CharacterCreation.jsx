import { useState } from 'react';
import { DARK_SECRETS } from '../data/darkSecrets.js';
import { ADVANTAGES, DISADVANTAGES } from '../data/advantages.js';
import { FACTIONS } from '../data/factions.js';
import { ITEMS } from '../data/items.js';
import styles from './CharacterCreation.module.css';

const ATTRIBUTES = [
  { id: 'reason',    label: 'Reason',     desc: 'Logic, analysis, problem solving' },
  { id: 'intuition', label: 'Intuition',  desc: 'Gut feelings, subconscious awareness' },
  { id: 'perception',label: 'Perception', desc: 'Attention, observation, noticing details' },
  { id: 'coolness',  label: 'Coolness',   desc: 'Composure, deception, social grace' },
  { id: 'violence',  label: 'Violence',   desc: 'Combat effectiveness, aggression' },
  { id: 'soul',      label: 'Soul',       desc: 'Spiritual depth, connection to true reality' },
  { id: 'willpower', label: 'Willpower',  desc: 'Mental endurance, resistance to horror' },
  { id: 'fortitude', label: 'Fortitude',  desc: 'Physical resilience, pain tolerance' },
  { id: 'reflexes',  label: 'Reflexes',   desc: 'Speed, evasion, reaction time' },
];

const ATTRIBUTE_PRESETS = [
  { label: 'Survivor', points: { fortitude: 2, violence: 1, coolness: 1, willpower: 1 } },
  { label: 'Scholar',  points: { reason: 2, perception: 2, intuition: 1 } },
  { label: 'Occultist',points: { soul: 2, intuition: 2, willpower: 1 } },
  { label: 'Operator', points: { coolness: 2, reflexes: 2, violence: 1 } },
];

const TOTAL_ATTR_POINTS = 5;

export default function CharacterCreation({ onStart, onBack }) {
  const [step, setStep] = useState(0); // 0=secret 1=attributes 2=advantages 3=faction 4=name
  const [form, setForm] = useState({
    name: '',
    darkSecret: null,
    attributePoints: {},
    advantages: [],
    disadvantages: [],
    faction: 'neutral',
    startingItemId: null,
  });

  const totalAttrSpent = Object.values(form.attributePoints).reduce((a, b) => a + b, 0);
  const totalAdvCost = form.advantages.reduce((a, adv) => a + (adv.cost || 1), 0);
  const totalDisBonus = form.disadvantages.reduce((a, dis) => a + (dis.bonus || 1), 0);
  const advBudget = 3 + totalDisBonus;

  const selectSecret = (secret) => {
    const startingItemId = secret.id === 'occultist' ? 'grimoire_fragment'
      : secret.id === 'guilty' ? 'false_papers'
      : secret.id === 'dimensional' ? 'map_nowhere'
      : secret.id === 'cult_leader' ? 'contact_list'
      : secret.id === 'researcher' ? 'research_dossier'
      : secret.id === 'death_wish' ? 'battle_weapon'
      : secret.id === 'unknown_past' ? 'unknown_artifact'
      : secret.id === 'acedia' ? 'worn_rosary'
      : null;
    setForm(f => ({ ...f, darkSecret: secret, startingItemId, faction: secret.startingFaction || 'neutral' }));
    setStep(1);
  };

  const adjustAttr = (attr, delta) => {
    const current = form.attributePoints[attr] || 0;
    const newVal = current + delta;
    if (newVal < -2 || newVal > 3) return;
    if (delta > 0 && totalAttrSpent >= TOTAL_ATTR_POINTS) return;
    setForm(f => ({ ...f, attributePoints: { ...f.attributePoints, [attr]: newVal } }));
  };

  const applyPreset = (preset) => {
    setForm(f => ({ ...f, attributePoints: { ...preset.points } }));
  };

  const toggleAdvantage = (adv) => {
    if (form.advantages.find(a => a.id === adv.id)) {
      setForm(f => ({ ...f, advantages: f.advantages.filter(a => a.id !== adv.id) }));
    } else {
      if (totalAdvCost + adv.cost > advBudget) return;
      setForm(f => ({ ...f, advantages: [...f.advantages, adv] }));
    }
  };

  const toggleDisadvantage = (dis) => {
    if (form.disadvantages.find(d => d.id === dis.id)) {
      setForm(f => ({ ...f, disadvantages: f.disadvantages.filter(d => d.id !== dis.id) }));
    } else {
      setForm(f => ({ ...f, disadvantages: [...f.disadvantages, dis] }));
    }
  };

  const canProceed = () => {
    if (step === 0) return !!form.darkSecret;
    if (step === 1) return totalAttrSpent >= 0;
    if (step === 4) return form.name.trim().length >= 2;
    return true;
  };

  const handleFinish = () => {
    if (!form.name.trim() || !form.darkSecret) return;
    onStart({ ...form });
  };

  // --- STEP RENDERERS ---

  const renderStep0 = () => (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <span className={styles.stepNum}>01</span>
        <div>
          <h2 className={styles.stepTitle}>Dark Secret</h2>
          <p className={styles.stepDesc}>Your hidden truth. The event or circumstance that made you aware of the Illusion.</p>
        </div>
      </div>
      <div className={styles.secretGrid}>
        {DARK_SECRETS.map(secret => (
          <div
            key={secret.id}
            className={`${styles.secretCard} ${form.darkSecret?.id === secret.id ? styles.selected : ''}`}
            onClick={() => selectSecret(secret)}
          >
            <div className={styles.secretName}>{secret.name}</div>
            <div className={styles.secretSub}>{secret.subtitle}</div>
            <p className={styles.secretDesc}>{secret.description}</p>
            <div className={styles.secretMeta}>
              {secret.startingBonus && (
                <div className={styles.bonuses}>
                  {Object.entries(secret.startingBonus).map(([k, v]) => (
                    <span key={k} className={`tag ${v > 0 ? 'tag-green' : 'tag-red'}`}>
                      {k} {v > 0 ? '+' : ''}{v}
                    </span>
                  ))}
                </div>
              )}
              <p className={styles.hint}>💡 {secret.hint}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <span className={styles.stepNum}>02</span>
        <div>
          <h2 className={styles.stepTitle}>Attributes</h2>
          <p className={styles.stepDesc}>Distribute {TOTAL_ATTR_POINTS} points across your attributes. Range: -2 to +3. These modify your 2d10 rolls.</p>
        </div>
      </div>
      <div className={styles.presets}>
        <span className={styles.presetsLabel}>Quick presets:</span>
        {ATTRIBUTE_PRESETS.map(p => (
          <button key={p.label} className='btn btn-sm' onClick={() => applyPreset(p)}>{p.label}</button>
        ))}
      </div>
      <div className={styles.attrBudget}>
        <span className={totalAttrSpent > TOTAL_ATTR_POINTS ? 'red' : 'gold'}>
          {totalAttrSpent} / {TOTAL_ATTR_POINTS} points spent
        </span>
      </div>
      <div className={styles.attrGrid}>
        {ATTRIBUTES.map(attr => {
          const bonus = form.darkSecret?.startingBonus?.[attr.id] || 0;
          const spent = form.attributePoints[attr.id] || 0;
          const total = bonus + spent;
          return (
            <div key={attr.id} className={styles.attrRow}>
              <div className={styles.attrInfo}>
                <span className={styles.attrLabel}>{attr.label}</span>
                <span className={styles.attrDesc}>{attr.desc}</span>
              </div>
              <div className={styles.attrControl}>
                {bonus !== 0 && <span className={`tag ${bonus > 0 ? 'tag-gold' : 'tag-red'}`}>{bonus > 0 ? '+' : ''}{bonus}</span>}
                <button className='btn btn-sm' onClick={() => adjustAttr(attr.id, -1)} disabled={spent <= -2}>−</button>
                <span className={`${styles.attrVal} ${total > 0 ? styles.positive : total < 0 ? styles.negative : ''}`}>
                  {total > 0 ? '+' : ''}{total}
                </span>
                <button className='btn btn-sm' onClick={() => adjustAttr(attr.id, 1)} disabled={spent >= 3 || totalAttrSpent >= TOTAL_ATTR_POINTS}>+</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <span className={styles.stepNum}>03</span>
        <div>
          <h2 className={styles.stepTitle}>Advantages & Disadvantages</h2>
          <p className={styles.stepDesc}>Budget: {advBudget} points (base 3 + {totalDisBonus} from disadvantages). Spent: {totalAdvCost}.</p>
        </div>
      </div>
      <div className={styles.twoCol}>
        <div>
          <h3 className={styles.subHead}>Advantages</h3>
          {ADVANTAGES.map(adv => {
            const active = !!form.advantages.find(a => a.id === adv.id);
            const canAdd = totalAdvCost + adv.cost <= advBudget || active;
            return (
              <div key={adv.id} className={`${styles.advCard} ${active ? styles.advActive : ''} ${!canAdd && !active ? styles.advDisabled : ''}`}
                onClick={() => canAdd && toggleAdvantage(adv)}>
                <div className={styles.advHeader}>
                  <span className={styles.advName}>{adv.name}</span>
                  <span className={`tag tag-gold`}>{adv.cost}pt</span>
                </div>
                <p className={styles.advDesc}>{adv.description}</p>
              </div>
            );
          })}
        </div>
        <div>
          <h3 className={styles.subHead}>Disadvantages <span className='dim'>(grants extra points)</span></h3>
          {DISADVANTAGES.map(dis => {
            const active = !!form.disadvantages.find(d => d.id === dis.id);
            return (
              <div key={dis.id} className={`${styles.advCard} ${styles.disCard} ${active ? styles.disActive : ''}`}
                onClick={() => toggleDisadvantage(dis)}>
                <div className={styles.advHeader}>
                  <span className={styles.advName}>{dis.name}</span>
                  <span className='tag tag-red'>+{dis.bonus}pt</span>
                </div>
                <p className={styles.advDesc}>{dis.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <span className={styles.stepNum}>04</span>
        <div>
          <h2 className={styles.stepTitle}>Faction Alignment</h2>
          <p className={styles.stepDesc}>Choose an initial allegiance. This affects your starting contacts and enemies.</p>
        </div>
      </div>
      <div className={styles.factionGrid}>
        {Object.values(FACTIONS).map(f => (
          <div key={f.id}
            className={`${styles.factionCard} ${form.faction === f.id ? styles.factionSelected : ''}`}
            style={{ '--faction-color': f.color }}
            onClick={() => setForm(prev => ({ ...prev, faction: f.id }))}>
            <span className={styles.factionIcon}>{f.icon}</span>
            <div className={styles.factionName}>{f.name}</div>
            <p className={styles.factionDesc}>{f.description}</p>
            {f.bonuses && (
              <div className={styles.factionBonuses}>
                {Object.entries(f.bonuses).map(([k, v]) => (
                  <div key={k} className={styles.factionBonus}>
                    <span className={`tag ${k === 'enemies' ? 'tag-red' : 'tag-gold'}`}>{k}</span>
                    <span className={styles.factionBonusText}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => {
    const secret = form.darkSecret;
    const startItem = form.startingItemId ? ITEMS[form.startingItemId] : null;
    const allAttrs = {};
    ATTRIBUTES.forEach(a => {
      const bonus = secret?.startingBonus?.[a.id] || 0;
      const spent = form.attributePoints[a.id] || 0;
      allAttrs[a.id] = bonus + spent;
    });
    return (
      <div className={styles.stepContent}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNum}>05</span>
          <div>
            <h2 className={styles.stepTitle}>Name & Finalize</h2>
            <p className={styles.stepDesc}>Give yourself a name. Then enter the Illusion.</p>
          </div>
        </div>
        <div className={styles.nameSection}>
          <input
            className={styles.nameInput}
            type='text'
            placeholder='Enter your name...'
            value={form.name}
            maxLength={30}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            autoFocus
          />
        </div>
        <div className={styles.summary}>
          <div className={styles.summarySection}>
            <h3 className={styles.summaryHead}>Dark Secret</h3>
            <p className='gold'>{secret?.name} — {secret?.subtitle}</p>
            <p className={styles.summaryText}>{secret?.specialAbility}</p>
          </div>
          <div className={styles.summarySection}>
            <h3 className={styles.summaryHead}>Attributes</h3>
            <div className={styles.summaryAttrs}>
              {ATTRIBUTES.map(a => (
                <span key={a.id} className={`${styles.summaryAttr} ${allAttrs[a.id] > 0 ? styles.positive : allAttrs[a.id] < 0 ? styles.negative : ''}`}>
                  {a.label}: {allAttrs[a.id] > 0 ? '+' : ''}{allAttrs[a.id]}
                </span>
              ))}
            </div>
          </div>
          {form.advantages.length > 0 && (
            <div className={styles.summarySection}>
              <h3 className={styles.summaryHead}>Advantages</h3>
              <p>{form.advantages.map(a => a.name).join(', ')}</p>
            </div>
          )}
          {form.disadvantages.length > 0 && (
            <div className={styles.summarySection}>
              <h3 className={styles.summaryHead}>Disadvantages</h3>
              <p className='red'>{form.disadvantages.map(d => d.name).join(', ')}</p>
            </div>
          )}
          {startItem && (
            <div className={styles.summarySection}>
              <h3 className={styles.summaryHead}>Starting Item</h3>
              <p>{startItem.icon} {startItem.name}</p>
            </div>
          )}
          <div className={styles.summarySection}>
            <h3 className={styles.summaryHead}>Faction</h3>
            <p>{FACTIONS[form.faction]?.icon} {FACTIONS[form.faction]?.name}</p>
          </div>
        </div>
      </div>
    );
  };

  const steps = [renderStep0, renderStep1, renderStep2, renderStep3, renderStep4];
  const stepLabels = ['Dark Secret', 'Attributes', 'Advantages', 'Faction', 'Finalize'];

  return (
    <div className={styles.wrapper}>
      <div className={styles.scanlines} />
      <div className={styles.vignette} />
      <div className={styles.container}>
        {/* Progress */}
        <div className={styles.progress}>
          <button className='btn btn-sm' onClick={onBack} style={{ marginRight: 'auto' }}>← Back</button>
          {stepLabels.map((label, i) => (
            <div key={i} className={`${styles.progressStep} ${i === step ? styles.progressActive : ''} ${i < step ? styles.progressDone : ''}`}
              onClick={() => i < step && setStep(i)}>
              <span className={styles.progressNum}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.progressLabel}>{label}</span>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className={styles.stepWrap}>
          {steps[step]?.()}
        </div>

        {/* Navigation */}
        <div className={styles.nav}>
          {step > 0 && (
            <button className='btn' onClick={() => setStep(s => s - 1)}>← Previous</button>
          )}
          <div style={{ flex: 1 }} />
          {step < steps.length - 1 ? (
            <button className='btn btn-primary' onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
              Continue →
            </button>
          ) : (
            <button className='btn btn-primary btn-lg' onClick={handleFinish} disabled={!canProceed()}>
              ⛧ Enter the Illusion
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
