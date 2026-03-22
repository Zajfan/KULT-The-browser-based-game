import { ITEMS } from '../../data/items.js';
import styles from './InventoryPanel.module.css';

const TYPE_LABELS = { weapon: 'Weapon', armor: 'Armor', consumable: 'Consumable', artifact: 'Artifact', key_item: 'Key Item' };
const TYPE_COLORS = { weapon: 'tag-red', armor: 'tag-blue', consumable: 'tag-green', artifact: 'tag-purple', key_item: 'tag-gold' };

const CONSUMABLE_EFFECTS = {
  heal_wound: 'Heals 1 wound level',
  heal_stability: 'Restores Stability',
  restore_stability: 'Restores Stability',
  gain_insight: '+1 Insight, -1 Stability',
  restore_ap: 'Restores Action Points',
};

export default function InventoryPanel({ character, onUse, onEquip, onSell }) {
  const { inventory, equippedWeapon, equippedArmor } = character;

  const grouped = {
    weapon: inventory.filter(i => i.type === 'weapon'),
    armor: inventory.filter(i => i.type === 'armor'),
    consumable: inventory.filter(i => i.type === 'consumable'),
    artifact: inventory.filter(i => i.type === 'artifact'),
    key_item: inventory.filter(i => i.type === 'key_item'),
  };

  const renderGroup = (type, label) => {
    const items = grouped[type];
    if (!items.length) return null;
    return (
      <div key={type} className={styles.group}>
        <div className={styles.groupHeader}>
          <span className={`tag ${TYPE_COLORS[type]}`}>{label}</span>
          <span className={styles.groupCount}>{items.length}</span>
        </div>
        <div className={styles.itemGrid}>
          {items.map((item, idx) => {
            const isEquipped = item.id === equippedWeapon || item.id === equippedArmor;
            const baseItem = ITEMS[item.id];
            return (
              <div key={`${item.id}-${idx}`} className={`${styles.itemCard} ${isEquipped ? styles.equipped : ''}`}>
                <div className={styles.itemTop}>
                  <span className={styles.itemIcon}>{item.icon}</span>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{item.name}</div>
                    {isEquipped && <span className='tag tag-gold'>Equipped</span>}
                    {item.supernatural && <span className='tag tag-purple'>Occult</span>}
                  </div>
                  {item.qty > 1 && <span className={styles.qty}>×{item.qty}</span>}
                </div>

                <p className={styles.itemDesc}>{item.description}</p>

                {item.damage && (
                  <div className={styles.statRow}>
                    <span>DMG:</span>
                    <span className='red'>{item.damage}</span>
                    {item.bonus > 0 && <span className='green'>+{item.bonus} bonus</span>}
                  </div>
                )}
                {item.defense && (
                  <div className={styles.statRow}>
                    <span>DEF:</span>
                    <span className='gold'>{item.defense}</span>
                  </div>
                )}
                {item.effect && CONSUMABLE_EFFECTS[item.effect] && (
                  <div className={styles.effectLabel}>{CONSUMABLE_EFFECTS[item.effect]}</div>
                )}

                <div className={styles.itemActions}>
                  {(item.type === 'weapon' || item.type === 'armor') && !isEquipped && (
                    <button className='btn btn-sm btn-gold' onClick={() => onEquip(item.id)}>Equip</button>
                  )}
                  {item.type === 'consumable' && (
                    <button className='btn btn-sm btn-primary' onClick={() => onUse(item.id)}>Use</button>
                  )}
                  {baseItem?.price > 0 && (
                    <button className='btn btn-sm' onClick={() => onSell(item.id)}>
                      Sell ₮{Math.floor(baseItem.price * 0.6)}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Inventory</h2>
        <span className={styles.count}>{inventory.length} items</span>
      </div>

      {inventory.length === 0 ? (
        <div className={styles.empty}>
          <span>◈</span>
          <p>Your inventory is empty. Visit the Black Market or complete actions to acquire items.</p>
        </div>
      ) : (
        <div className={styles.content}>
          {renderGroup('weapon', 'Weapons')}
          {renderGroup('armor', 'Armor & Protection')}
          {renderGroup('consumable', 'Consumables')}
          {renderGroup('artifact', 'Artifacts')}
          {renderGroup('key_item', 'Key Items')}
        </div>
      )}
    </div>
  );
}
