import { ITEMS, MARKET_STOCK } from '../../data/items.js';
import styles from './MarketPanel.module.css';

const TYPE_LABELS = { weapon: 'Weapon', armor: 'Armor', consumable: 'Consumable', artifact: 'Artifact', key_item: 'Key Item' };

export default function MarketPanel({ character, onBuy, onSell }) {
  const allStock = Object.values(MARKET_STOCK).flat().map(id => ITEMS[id]).filter(Boolean);

  const owned = character.inventory.filter(i => ITEMS[i.id]?.price > 0);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Black Market</h2>
          <p className={styles.subtitle}>Weapons, artifacts, and substances that exist outside the Illusion's approved catalog.</p>
        </div>
        <div className={styles.balance}>
          <span className={styles.balanceLabel}>Balance</span>
          <span className={styles.balanceVal}>₮{character.thalers.toLocaleString()}</span>
        </div>
      </div>

      <div className={styles.columns}>
        {/* Buy */}
        <div className={styles.column}>
          <div className={styles.columnTitle}>For Sale</div>
          {allStock.map(item => {
            const canAfford = character.thalers >= item.price;
            return (
              <div key={item.id} className={`${styles.itemCard} ${!canAfford ? styles.cantAfford : ''}`}>
                <div className={styles.itemTop}>
                  <span className={styles.itemIcon}>{item.icon}</span>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{item.name}</div>
                    <span className={`tag ${item.supernatural ? 'tag-purple' : 'tag-dim'}`}>{TYPE_LABELS[item.type]}</span>
                  </div>
                  <div className={styles.itemPrice}>₮{item.price}</div>
                </div>
                <p className={styles.itemDesc}>{item.description}</p>
                {item.damage && <div className={styles.itemStat}>DMG: {item.damage} +{item.bonus}</div>}
                {item.defense && <div className={styles.itemStat}>DEF: {item.defense}</div>}
                <button className='btn btn-gold btn-sm' onClick={() => onBuy(item.id)} disabled={!canAfford}>
                  Buy
                </button>
              </div>
            );
          })}
        </div>

        {/* Sell */}
        <div className={styles.column}>
          <div className={styles.columnTitle}>Your Items (Sell)</div>
          {owned.length === 0 && (
            <div className={styles.empty}>No sellable items in your inventory.</div>
          )}
          {owned.map(item => {
            const sellPrice = Math.floor((ITEMS[item.id]?.price || 0) * 0.6);
            return (
              <div key={item.id + '_sell'} className={styles.itemCard}>
                <div className={styles.itemTop}>
                  <span className={styles.itemIcon}>{item.icon}</span>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{item.name}</div>
                    <span className={`tag tag-dim`}>{TYPE_LABELS[item.type]}</span>
                  </div>
                  <div className={styles.itemPrice} style={{ color: 'var(--gold-mid)' }}>₮{sellPrice}</div>
                </div>
                <button className='btn btn-sm' onClick={() => onSell(item.id)}>Sell</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
