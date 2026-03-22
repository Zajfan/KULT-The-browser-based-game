import { ITEMS, MARKET_STOCK } from '../../data/items.js';
import styles from './MarketView.module.css';

const TYPE_LABELS = { weapon:'Weapon', armor:'Armor', consumable:'Consumable', artifact:'Artifact', key_item:'Key Item' };

export default function MarketView({ character, onBuy, onSell }) {
  const stock = Object.values(MARKET_STOCK).flat().map(id => ITEMS[id]).filter(Boolean);
  const sellable = character.inventory.filter(i => (ITEMS[i.id]?.price || 0) > 0);

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Black Market</h2>
      <p className={styles.sub}>Goods that exist outside the Illusion's approved catalog. Cash only. No questions from either party.</p>
      <div className='rule-gold' />

      <div className={styles.balance}>
        <span className='mono dim' style={{fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.1em'}}>Balance</span>
        <span className='mono gold' style={{fontSize:'1.1rem'}}>₮{character.thalers.toLocaleString()}</span>
      </div>

      <div className={styles.grid}>
        <section>
          <h3 className={styles.colHead}>Available</h3>
          <div className={styles.itemList}>
            {stock.map(item => {
              const can = character.thalers >= item.price;
              return (
                <div key={item.id} className={`${styles.item} ${!can ? styles.dim : ''}`}>
                  <div className={styles.itemRow}>
                    <span className={styles.icon}>{item.icon}</span>
                    <div className={styles.info}>
                      <span className={styles.iName}>{item.name}</span>
                      <span className={`badge badge-dim`}>{TYPE_LABELS[item.type]}</span>
                      {item.supernatural && <span className='badge badge-veil'>Occult</span>}
                    </div>
                    <span className='mono gold' style={{fontSize:'0.8rem',flexShrink:0}}>₮{item.price}</span>
                  </div>
                  <p className={styles.iDesc}>{item.description}</p>
                  {item.damage && <span className='mono red' style={{fontSize:'0.68rem'}}>DMG {item.damage} +{item.bonus}</span>}
                  <button className='act act-gold act-sm' onClick={() => onBuy(item.id)} disabled={!can}>Acquire</button>
                </div>
              );
            })}
          </div>
        </section>
        <section>
          <h3 className={styles.colHead}>Sell</h3>
          {sellable.length === 0
            ? <p className='italic dim' style={{fontSize:'0.82rem'}}>Nothing sellable in your possession.</p>
            : <div className={styles.itemList}>
                {sellable.map(item => {
                  const sp = Math.floor((ITEMS[item.id]?.price||0) * 0.6);
                  return (
                    <div key={item.id} className={styles.item}>
                      <div className={styles.itemRow}>
                        <span className={styles.icon}>{item.icon}</span>
                        <span className={styles.iName}>{item.name}</span>
                        <span className='mono' style={{color:'var(--gold)',fontSize:'0.8rem',flexShrink:0}}>₮{sp}</span>
                      </div>
                      <button className='act act-sm' onClick={() => onSell(item.id)}>Sell</button>
                    </div>
                  );
                })}
              </div>
          }
        </section>
      </div>
    </div>
  );
}
