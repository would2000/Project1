import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Game from './pages/Game';
import Result from './pages/Result';

function App() {
  const [playerId, setPlayerId] = useState('');
  const [gameData, setGameData] = useState(null); // { score, total, isPass }
  const [questions, setQuestions] = useState([]);
  
  // 偷背景預載圖片 (100 張)
  useEffect(() => {
    // 建立 10~20 張即可滿足一次遊玩 (或使用者要求100張)
    // 這裡用簡單的 Image object 在背景默默加載
    const preloadCount = 100;
    for (let i = 0; i < preloadCount; i++) {
      const img = new Image();
      img.src = `https://api.dicebear.com/7.x/pixel-art/svg?seed=boss_${i}`;
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              playerId={playerId} 
              setPlayerId={setPlayerId} 
              setQuestions={setQuestions}
            />
          } 
        />
        <Route 
          path="/game" 
          element={
             playerId && questions.length > 0 ? (
              <Game 
                playerId={playerId} 
                questions={questions}
                setGameData={setGameData} 
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/result" 
          element={
            gameData ? (
              <Result gameData={gameData} setQuestions={setQuestions} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
