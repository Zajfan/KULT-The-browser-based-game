import { ITEMS } from '../../data/items.js';
import styles from './InventoryView.module.css';

const TYPES = ['weapon','armor','consumable','artifact','key_item'];
const TLABEL = { weapon:'Weapons', armor:'Armor', consumable:'Consumables', artifact:'Artifacts', key_item:'Key Items' };
const TBADGE = { weapon:'badge-red', armor:'badge-dim', consumable:'badge-vital', artifact:'badge-veil', key_item:'badge-gold' };
const EFFECTS = { heal_wound:'Heals 1 wound', heal_stability:'Restores Stability', restore_stability:'Restores Stability', gain_insight:'+1 Insight −1 Stability', restore_ap:'Restores AP' };

export default function InventoryView({ character, onUse, onEquip, onSell }) {
  const { inventory, equippedWeapon, equippedArmor } = character;
  if (!inventory.length) return (
    <div className={styles.page}>
      <h2 className={styles.title}>Possessions</h2>
      <div className='rule-gold' />
      <p className='italic dim' style={{marginTop:20}}>You carry nothing remarkable. Visit the Black Market or complete actions to acquire items.</p>
    </div>
  );

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Possessions</h2>
      <div className='rule-gold' />
      {TYPES.map(type => {
        const items = inventory.filter(i => i.type === type);
        if (!items.length) return null;
        return (
          <section key={type} className={styles.group}>
            <h3 className={styles.groupHead}><span className={`badge ${TBADGE[type]}`}>{TLABEL[type]}</span></h3>
            <div className={styles.items}>
              {items.map((item, idx) => {
                const isWeapon = item.id === equippedWeapon;
                const isArmor  = item.id === equippedArmor;
                const isEquipped = isWeapon || isArmor;
                const base = ITEMS[item.id];
                return (
                  <div key={`${item.id}-${idx}`} className={`${styles.item} ${isEquipped?styles.equipped:''}`}>
                    <div className={styles.itemRow}>
                      <span className={styles.iIcon}>{item.icon}</span>
                      <div className={styles.iInfo}>
                        <span className={styles.iName}>{item.name}</span>
                        <div style={{display:'flex',gap:4,flexWrap:'wrap',marginTop:2}}>
                          {isEquipped && <span className='badge badge-gold'>Equipped</span>}
                          {item.supernatural && <span className='badge badge-veil'>Occult</span>}
                        </div>
                      </div>
                      {(item.qty||1) > 1 && <span className={styles.qty}>×{item.qty}</span>}
                    </div>
                    <p className={styles.iDesc}>{item.description}</p>
                    {item.damage && <span className='mono red' style={{fontSize:'0.68rem'}}>DMG {item.damage} / Bonus +{item.bonus}</span>}
                    {item.effect && EFFECTS[item.effect] && <span style={{fontSize:'0.68rem',color:'var(--vital-lit)',fontStyle:'italic'}}>{EFFECTS[item.effect]}</span>}
                    <div className={styles.actions}>
                      {(type==='weapon'||type==='armor') && !isEquipped && <button className='act act-gold act-sm' onClick={()=>onEquip(item.id)}>Equip</button>}
                      {type==='consumable' && <button className='act act-sm' style={{color:'var(--vital-lit)',borderColor:'var(--vital-dark)'}} onClick={()=>onUse(item.id)}>Use</button>}
                      {(base?.price||0) > 0 && <button className='act act-sm' onClick={()=>onSell(item.id)}>Sell ₮{Math.floor((base?.price||0)*0.6)}</button>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
