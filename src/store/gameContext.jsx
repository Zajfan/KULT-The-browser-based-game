import { createContext, useContext, useReducer, useCallback } from 'react';
import { gameReducer, A }      from './gameReducer.js';
import { createInitialState }  from './initialState.js';
import { rollCheck, OUTCOMES } from '../utils/dice.js';

const GameContext   = createContext(null);
const DispatchCtx   = createContext(null);

// Load saved game on first render if one exists
import { loadGame } from '../utils/saveLoad.js';

function getStartingState() {
  const saved = loadGame();
  // Only use saved state if there IS a character (mid-game save)
  if (saved && saved.character && saved.phase === 'game') {
    return { ...saved, settings: { apiKey: localStorage.getItem('kult_api_key') || '', aiNarrative: !!localStorage.getItem('kult_api_key') } };
  }
  return createInitialState();
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, null, getStartingState);
  return (
    <GameContext.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>
        {children}
      </DispatchCtx.Provider>
    </GameContext.Provider>
  );
}

export function useGame()     { return useContext(GameContext); }
export function useDispatch() { return useContext(DispatchCtx); }

// ── Convenience action helpers used by components ─────────────────────────────
export function useGameActions() {
  const dispatch = useDispatch();
  const state    = useGame();

  const log = useCallback((text, type = 'info', icon = null) => {
    dispatch({ type: A.LOG, payload: { text, type, icon } });
  }, [dispatch]);

  const performCheck = useCallback((attribute, onResult) => {
    const attrValue = state.character.attributes[attribute] || 0;
    const result    = rollCheck(attrValue);
    dispatch({ type: A.SET_DICE_RESULT, payload: result });
    if (onResult) onResult(result);
    return result;
  }, [dispatch, state.character]);

  const spendAP = useCallback((amount) => {
    dispatch({ type: A.SPEND_AP, payload: amount });
  }, [dispatch]);

  const canAffordAP = useCallback((amount) => {
    return state.character.resources.ap.current >= amount;
  }, [state.character]);

  const canAffordNerve = useCallback((amount) => {
    return state.character.resources.nerve.current >= amount;
  }, [state.character]);

  const canAffordThalers = useCallback((amount) => {
    return state.character.resources.thalers >= amount;
  }, [state.character]);

  const gainXP = useCallback((amount) => {
    dispatch({ type: A.GAIN_XP, payload: amount });
  }, [dispatch]);

  const navigate = useCallback((locationId) => {
    dispatch({ type: A.NAVIGATE, payload: locationId });
  }, [dispatch]);

  const changeView = useCallback((view) => {
    dispatch({ type: A.CHANGE_VIEW, payload: view });
  }, [dispatch]);

  const startCombat = useCallback((enemy) => {
    const combatEnemy = { ...enemy, hp: enemy.maxHp || enemy.hp };
    dispatch({ type: A.START_COMBAT, payload: combatEnemy });
  }, [dispatch]);

  return {
    log,
    performCheck,
    spendAP,
    canAffordAP,
    canAffordNerve,
    canAffordThalers,
    gainXP,
    navigate,
    changeView,
    startCombat,
    dispatch,
    state,
  };
}
