import { useState, useCallback, useRef } from 'react';
import styles from './ToastSystem.module.css';

let toastIdCounter = 0;

export function useToasts() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++toastIdCounter;
    setToasts(prev => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

const TOAST_ICONS = {
  success:     '✦',
  partial:     '◆',
  failure:     '✖',
  error:       '⚠',
  info:        '◈',
  combat_win:  '⚔',
  insight:     '◉',
  stability:   '♥',
  thalers:     '₮',
  supernatural:'⛧',
};

const TOAST_STYLES = {
  success:     { border: 'var(--gold-bright)', bg: 'rgba(90,74,40,0.95)', color: 'var(--gold-bright)' },
  partial:     { border: '#b87333', bg: 'rgba(60,40,10,0.95)', color: '#c89040' },
  failure:     { border: 'var(--red-bright)', bg: 'rgba(61,10,10,0.95)', color: 'var(--red-vivid)' },
  error:       { border: 'var(--red-bright)', bg: 'rgba(61,10,10,0.95)', color: 'var(--red-vivid)' },
  info:        { border: 'var(--border-bright)', bg: 'rgba(22,22,22,0.97)', color: 'var(--text-primary)' },
  combat_win:  { border: '#e87a3a', bg: 'rgba(40,20,5,0.95)', color: '#e8a060' },
  insight:     { border: 'var(--gold-bright)', bg: 'rgba(40,35,10,0.97)', color: 'var(--gold-vivid)' },
  stability:   { border: 'var(--green-bright)', bg: 'rgba(10,30,10,0.97)', color: 'var(--green-vivid)' },
  thalers:     { border: 'var(--gold-mid)', bg: 'rgba(30,25,5,0.95)', color: 'var(--gold-bright)' },
  supernatural:{ border: 'var(--purple-bright)', bg: 'rgba(26,10,61,0.97)', color: 'var(--purple-bright)' },
};

function Toast({ toast, onRemove }) {
  const s = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
  return (
    <div
      className={styles.toast}
      style={{ '--t-border': s.border, '--t-bg': s.bg, '--t-color': s.color }}
      onClick={() => onRemove(toast.id)}
    >
      <span className={styles.icon}>{TOAST_ICONS[toast.type] || '·'}</span>
      <span className={styles.message}>{toast.message}</span>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className={styles.container}>
      {toasts.map(t => (
        <Toast key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}
