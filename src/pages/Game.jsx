import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitAnswers } from '../services/api';

function Game({ playerId, questions, setGameData }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { 題號: "A" }
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const currentQ = questions[currentIndex];
  // 依題號加上亂數種子，確保每關關主不同
  const bossSeed = `boss_${currentQ.id}_${currentIndex}`;

  const handleAnswer = async (optionKey) => {
    const newAnswers = {
      ...answers,
      [currentQ.id]: optionKey
    };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 最後一題，送出答案
      setSubmitting(true);
      try {
        const res = await submitAnswers(playerId, newAnswers);
        if (res.status === 'success') {
          setGameData(res.data);
          navigate('/result');
        } else {
          alert('ERROR SUBMITTING: ' + res.message);
          setSubmitting(false);
        }
      } catch (err) {
        alert('NETWORK ERROR');
        setSubmitting(false);
      }
    }
  };

  if (submitting) {
    return (
      <div className="pixel-box">
        <h2 className="loading blink-text">CALCULATING SCORE...</h2>
      </div>
    );
  }

  return (
    <div className="pixel-box">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px' }}>
        <span>PLAYER: {playerId}</span>
        <span>STAGE: {currentIndex + 1} / {questions.length}</span>
      </div>

      <div className="boss-image">
        <img 
          src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${bossSeed}`} 
          alt="Boss"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <h3 style={{ margin: '20px 0', lineHeight: '1.8' }}>
        {currentQ.question}
      </h3>

      <div className="options-grid">
        <button className="pixel-btn option-btn" onClick={() => handleAnswer('A')}>
          A: {currentQ.A}
        </button>
        <button className="pixel-btn option-btn" onClick={() => handleAnswer('B')}>
          B: {currentQ.B}
        </button>
        <button className="pixel-btn option-btn" onClick={() => handleAnswer('C')}>
          C: {currentQ.C}
        </button>
        <button className="pixel-btn option-btn" onClick={() => handleAnswer('D')}>
          D: {currentQ.D}
        </button>
      </div>
    </div>
  );
}

export default Game;
