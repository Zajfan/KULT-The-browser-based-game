import { useState, useEffect } from 'react';
import { hasSave, loadGame } from '../utils/saveLoad.js';
import styles from './TitleScreen.module.css';

const GLYPHS = ['⛧','◈','∞','☯','◉','⊝','☠'];

export default function TitleScreen({ onNewGame, onLoadGame }) {
  const [glyph, setGlyph] = useState(0);
  const saved = hasSave() ? loadGame() : null;

  useEffect(() => {
    const t = setInterval(() => setGlyph(g => (g + 1) % GLYPHS.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.bgGlyph}>{GLYPHS[glyph]}</div>
      <div className={styles.vignette} />

      <div className={styles.content}>
        <div className={styles.eyebrow}>
          <span className="line" />
          <span className="text">City of Chains</span>
          <span className="line" />
        </div>

        <div className={styles.titleBlock}>
          <h1 className={styles.titleText}>KULT</h1>
          <div className={styles.underGlyph}>⛧</div>
        </div>

        <p className={styles.tagline}>
          <em>The Illusion holds. Until it doesn't.</em>
        </p>

        <div className={styles.lore}>
          <p>
            Humanity has been imprisoned since before memory. The Archons constructed
            a world of false reality — a perfect cage where the inmates do not know
            they are imprisoned. You are awakening. This is the most dangerous thing
            you have ever done.
          </p>
        </div>

        <div className={styles.actions}>
          <button className="act act-danger act-lg act-block" onClick={onNewGame}>
            ◈ Begin Awakening
          </button>
          {saved && (
            <button className="act act-gold act-lg act-block" onClick={() => onLoadGame(saved)}>
              ∞ Continue — {saved.character?.name}
            </button>
          )}
          <button className="act act-sm act-block" style={{opacity:0.4}}
            onClick={() => window.open('https://github.com/Zajfan/KULT-The-browser-based-game','_blank')}>
            ⊝ GitHub
          </button>
        </div>

        <div className={styles.footer}>
          <span>Based on KULT: Divinity Lost by Helmgast AB</span>
          <span className="dot">·</span>
          <span>Fan-made</span>
          <span className="dot">·</span>
          <span>AI-powered narrative</span>
        </div>
      </div>
    </div>
  );
}
