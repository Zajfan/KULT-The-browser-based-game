import { useState, useCallback } from 'react';

export function useClaude() {
  const [loading, setLoading] = useState(false);

  const generateNarrative = useCallback(async (prompt, systemContext = '') => {
    setLoading(true);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are a narrator for KULT: City of Chains, a dark horror browser RPG inspired by the KULT tabletop game. The setting is a modern city where reality is an Illusion maintained by the Archons — divine jailers who have imprisoned humanity since before memory. The Death Angels are former divine beings now bound to the darkest aspects of human experience. Nepharites serve the Death Angels. The Labyrinth is where souls go after death.

Your writing style: atmospheric, literary, existentially unsettling. Short. Never more than 3 sentences. No clichés. Evocative and specific. The horror is psychological and cosmological, not cheap shock. ${systemContext}`,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await response.json();
      return data.content?.[0]?.text || null;
    } catch (err) {
      console.error('Claude API error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateActionFlavor = useCallback(async (character, actionId, outcome) => {
    const prompt = `Character: ${character.name}, Dark Secret: ${character.darkSecret?.name}, Location: ${actionId}, Roll outcome: ${outcome}. Write a 1-2 sentence atmospheric description of what happens.`;
    return generateNarrative(prompt);
  }, [generateNarrative]);

  const generateCombatFlavor = useCallback(async (character, enemy, round, outcome) => {
    const prompt = `Round ${round} combat between ${character.name} and a ${enemy.name}. Outcome: ${outcome}. Write one visceral sentence describing this exchange.`;
    return generateNarrative(prompt);
  }, [generateNarrative]);

  const generateEntityDialogue = useCallback(async (character, entityType) => {
    const prompt = `An ${entityType} is speaking to the awakened mortal ${character.name} (dark secret: ${character.darkSecret?.name}). Write what it says — cryptic, threatening, or revelatory. One sentence.`;
    return generateNarrative(prompt);
  }, [generateNarrative]);

  const generateDream = useCallback(async (character) => {
    const prompt = `${character.name} with dark secret "${character.darkSecret?.name}" falls asleep. Stability: ${character.stability}/10, Insight: ${character.insight}/10. Write a 2-sentence nightmare or vision they experience.`;
    return generateNarrative(prompt);
  }, [generateNarrative]);

  return { loading, generateNarrative, generateActionFlavor, generateCombatFlavor, generateEntityDialogue, generateDream };
}
