import { useState, useEffect } from 'react';
import { startAmbience, stopAmbience, setVolume, resumeCtx } from '../../utils/audio.js';
import styles from './AudioToggle.module.css';

export default function AudioToggle() {
  const [on, setOn]       = useState(false);
  const [vol, setVol]     = useState(0.18);
  const [showVol, setShow]= useState(false);

  const toggle = () => {
    resumeCtx();
    if (on) { stopAmbience(); setOn(false); }
    else    { startAmbience(); setOn(true); }
  };

  useEffect(() => { setVolume(vol); }, [vol]);

  return (
    <div className={styles.wrap}>
      <button className={`${styles.btn} ${on ? styles.on : ''}`}
        onClick={toggle} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        title={on ? 'Ambient sound on — click to mute' : 'Click to enable ambient sound'}>
        {on ? '♪' : '♩'}
      </button>
      {showVol && on && (
        <div className={styles.volSlider}>
          <input type='range' min={0} max={1} step={0.01} value={vol}
            onChange={e => setVol(parseFloat(e.target.value))}
            className={styles.range} />
        </div>
      )}
    </div>
  );
}
