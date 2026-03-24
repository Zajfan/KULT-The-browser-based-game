import { ITEMS } from '../../data/items.js';
import { RECIPES, RECIPE_CATEGORIES, getRecipesForInsight } from '../../data/crafting.js';
import styles from './CraftingView.module.css';

function hasIngredients(inventory, ingredients) {
  const needed = {};
  ingredients.forEach(id => { needed[id] = (needed[id] || 0) + 1; });
  return Object.entries(needed).every(([id, count]) => {
    const found = inventory.find(i => i.id === id);
    return found && (found.qty || 1) >= count;
  });
}

export default function CraftingView({ character, onCraft }) {
  const recipes = getRecipesForInsight(character.insight || 0);
  const lockedCount = RECIPES.length - recipes.length;

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Crafting & Alchemy</h2>
      <div className='rule-gold' />
      <p className={styles.sub}>
        Combine materials to produce items that cannot be purchased. Knowledge of forbidden subjects
        expands what you can create.
      </p>

      {recipes.length === 0 && (
        <p className='italic dim' style={{marginTop:20}}>
          No recipes available yet. Increase your Insight to unlock crafting knowledge.
        </p>
      )}

      <div className={styles.recipeList}>
        {recipes.map(recipe => {
          const result = ITEMS[recipe.resultId];
          const canCraft = hasIngredients(character.inventory, recipe.ingredients) && character.ap >= recipe.apCost;
          const cat = RECIPE_CATEGORIES[recipe.category];
          // Tally what ingredients are available
          const needed = {};
          recipe.ingredients.forEach(id => { needed[id] = (needed[id] || 0) + 1; });

          return (
            <div key={recipe.id} className={`${styles.recipe} ${canCraft ? styles.ready : ''}`}>
              <div className={styles.recipeHead}>
                <span className={styles.recipeIcon}>{result?.icon || '⚗'}</span>
                <div className={styles.recipeMeta}>
                  <span className={styles.recipeName}>{recipe.name}</span>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:3}}>
                    <span className='badge badge-dim'>{cat.glyph} {cat.label}</span>
                    <span className='badge' style={{color:'var(--gold)',borderColor:'var(--gold-dark)'}}>−{recipe.apCost} AP</span>
                    {recipe.insightRequired > 0 && (
                      <span className='badge badge-veil'>Insight {recipe.insightRequired}+</span>
                    )}
                  </div>
                </div>
              </div>

              <p className={styles.recipeDesc}>{recipe.description}</p>

              {result && (
                <p className={styles.resultDesc}>
                  <span className='mono gold'>Creates:</span>{' '}
                  <span style={{color:'var(--ink-bright)'}}>{result.name}</span>
                  {' — '}<span className='italic dim'>{result.description}</span>
                </p>
              )}

              <div className={styles.ingredients}>
                <span className={styles.ingLabel}>Ingredients:</span>
                {Object.entries(needed).map(([id, count]) => {
                  const item = ITEMS[id];
                  const inInv = character.inventory.find(i => i.id === id);
                  const available = inInv ? (inInv.qty || 1) : 0;
                  const sufficient = available >= count;
                  return (
                    <span key={id} className={`${styles.ingredient} ${sufficient ? styles.ingHave : styles.ingMissing}`}
                      aria-label={`${item?.name || id}: ${available} of ${count} available`}>
                      {item?.icon || '?'} {item?.name || id}{count > 1 ? ` ×${count}` : ''} ({available}/{count})
                    </span>
                  );
                })}
              </div>

              <div style={{marginTop:8}}>
                <button
                  className={`act ${canCraft ? 'act-gold' : ''} act-sm`}
                  onClick={() => onCraft(recipe.id)}
                  disabled={!canCraft}
                  title={!canCraft ? 'Missing ingredients or insufficient AP' : `Craft ${recipe.name}`}
                >
                  ⚗ Craft {recipe.name}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {lockedCount > 0 && (
        <div className={styles.locked}>
          <span className='dim italic'>
            {lockedCount} recipe{lockedCount > 1 ? 's' : ''} locked — increase Insight to unlock.
          </span>
        </div>
      )}
    </div>
  );
}
