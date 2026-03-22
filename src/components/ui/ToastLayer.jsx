import { useState, useCallback } from 'react';
import styles from './ToastLayer.module.css';

let n = 0;
export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((msg, type='info', ms=3800) => {
    const id = ++n;
    setToasts(t => [...t, {id, msg, type}]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), ms);
    return id;
  }, []);
  const removeToast = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), []);
  return {toasts, addToast, removeToast};
}

const COLORS = {
  info:   'var(--ink-dim)',
  warn:   'var(--gold-lit)',
  danger: 'var(--red-vivid)',
  veil:   'var(--veil-vivid)',
  vital:  'var(--vital-lit)',
};

export function ToastLayer({toasts, onRemove}) {
  return (
    <div className={styles.layer}>
      {toasts.map(t => (
        <div key={t.id} className={styles.toast} style={{'--c': COLORS[t.type]||COLORS.info}} onClick={() => onRemove(t.id)}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
