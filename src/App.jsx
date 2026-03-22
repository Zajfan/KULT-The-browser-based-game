import { useGameState } from './hooks/useGameState.js';
import TitleScreen from './components/TitleScreen.jsx';
import CharacterCreation from './components/CharacterCreation.jsx';
import GameLayout from './components/GameLayout.jsx';
import './styles/global.css';

export default function App() {
  const {
    screen, setScreen,
    character, setCharacter,
    combat,
    pendingEvent, setPendingEvent,
    startGame, loadSavedGame,
    travel, performAction,
    attackEnemy, fleeCombat,
    commitCrime, performRitual,
    performTraining,
    useItem, equipItem, buyItem, sellItem,
    updateNPCTrust, resolveEvent,
    addLog,
  } = useGameState();

  if (screen === 'title') {
    return (
      <TitleScreen
        onNewGame={() => setScreen('create')}
        onLoadGame={loadSavedGame}
      />
    );
  }

  if (screen === 'create') {
    return (
      <CharacterCreation
        onStart={startGame}
        onBack={() => setScreen('title')}
      />
    );
  }

  if (screen === 'game' && character) {
    return (
      <GameLayout
        character={character}
        combat={combat}
        pendingEvent={pendingEvent}
        actions={{
          travel, performAction,
          attackEnemy, fleeCombat,
          commitCrime, performRitual,
          performTraining,
          useItem, equipItem, buyItem, sellItem,
          updateNPCTrust, resolveEvent,
          setPendingEvent, setCharacter,
          addLog,
        }}
      />
    );
  }

  return null;
}
