import { useState, useEffect } from 'react';
import { hasSave, loadGame } from '../utils/saveLoad.js';
import styles from './TitleScreen.module.css';

const GLYPHS = ['◈', '⛧', '☯', '∞', '◎', '⊝', '☠', '◆', '◉'];

export default function TitleScreen({ onNewGame, onLoadGame }) {
  const [glitchActive, setGlitchActive] = useState(false);
  const [currentGlyph, setCurrentGlyph] = useState(0);
  const savedGame = hasSave() ? loadGame() : null;

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 4000 + Math.random() * 3000);

    const glyphInterval = setInterval(() => {
      setCurrentGlyph(i => (i + 1) % GLYPHS.length);
    }, 2500);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(glyphInterval);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* Scanline overlay */}
      <div className={styles.scanlines} />

      {/* Background sigil */}
      <div className={styles.bgSigil}>{GLYPHS[currentGlyph]}</div>

      {/* Vignette */}
      <div className={styles.vignette} />

      <div className={styles.content}>
        {/* Eyebrow */}
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          <span className={styles.eyebrowText}>City of Chains</span>
          <span className={styles.eyebrowLine} />
        </div>

        {/* Title */}
        <div className={`${styles.titleBlock} ${glitchActive ? styles.glitch : ''}`}>
          <h1 className={styles.titleKult}>KULT</h1>
          <div className={styles.titleGlyph}>⛧</div>
        </div>

        {/* Tagline */}
        <p className={styles.tagline}>
          <em>The Illusion holds. Until it doesn't.</em>
        </p>

        {/* Lore snippet */}
        <div className={styles.lore}>
          <p>
            Humanity has been imprisoned since before memory. The Archons constructed a world 
            of false reality — a perfect cage where the inmates do not know they are imprisoned. 
            You are awakening. This is the most dangerous thing you have ever done.
          </p>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={`btn btn-primary btn-lg ${styles.mainBtn}`} onClick={onNewGame}>
            ◈ Begin Awakening
          </button>

          {savedGame && (
            <button
              className={`btn btn-gold btn-lg ${styles.mainBtn}`}
              onClick={() => onLoadGame(savedGame)}
            >
              ∞ Continue — {savedGame.character?.name}
            </button>
          )}

          <button
            className={`btn btn-sm ${styles.creditBtn}`}
            onClick={() => window.open('https://github.com/Zajfan/KULT-The-browser-based-game', '_blank')}
          >
            ⊝ GitHub Repository
          </button>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span>Based on KULT: Divinity Lost by Helmgast AB</span>
          <span className={styles.dot}>·</span>
          <span>Fan-made browser adaptation</span>
          <span className={styles.dot}>·</span>
          <span>AI-powered narrative</span>
        </div>
      </div>
    </div>
  );
}
