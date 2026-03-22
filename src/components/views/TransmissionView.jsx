import { useState, useEffect } from 'react';
import { getTransmission } from '../../data/transmission.js';
import styles from './TransmissionView.module.css';

export default function TransmissionView({ character }) {
  const day = character.gameTime?.day ?? 1;
  const [transmission, setTransmission] = useState(null);

  useEffect(() => {
    setTransmission(getTransmission(day, character.insight));
  }, [day, character.insight]);

  if (!transmission) return null;

  return (
    <div className={styles.page}>
      <div className={styles.masthead}>
        <div className={styles.mastheadLeft}>
          <span className={styles.pub}>City Morning Bulletin</span>
          <span className={styles.edition}>Day {day} Edition</span>
        </div>
        <div className={styles.mastheadRight}>
          <span className={styles.tagline}><em>The city performs normalcy.</em></span>
        </div>
      </div>

      <div className='rule-blood' />

      <div className={styles.columns}>
        <div className={styles.col}>
          <h3 className={styles.colHead}>City News</h3>
          <div className={styles.articles}>
            {transmission.mundane.map((item, i) => (
              <article key={i} className={styles.article}>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </div>

        {transmission.supernatural.length > 0 && (
          <div className={styles.col}>
            <h3 className={`${styles.colHead} ${styles.veiled}`}>
              What the city is not reporting
              <span className='badge badge-veil' style={{marginLeft:8}}>Insight {character.insight}+</span>
            </h3>
            <div className={styles.articles}>
              {transmission.supernatural.map((item, i) => (
                <article key={i} className={`${styles.article} ${styles.veiledArticle}`}>
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <p className='italic dim' style={{fontSize:'0.72rem'}}>
          The Bulletin is published daily. Some of its contents are accurate. Distinguishing between them is an exercise left to the reader.
        </p>
      </div>
    </div>
  );
}
