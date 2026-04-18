import { useNavigate } from 'react-router-dom';

function Result({ gameData, setQuestions }) {
  const navigate = useNavigate();
  const { score, total, isPass, isHighScore, attempts } = gameData;

  const handleRestart = () => {
    setQuestions([]); // 清空題目，重新開始
    navigate('/');
  };

  return (
    <div className="pixel-box">
      <h1 style={{ color: isPass ? 'var(--accent-color)' : 'var(--primary-color)', marginBottom: '20px' }}>
        {isPass ? 'STAGE CLEAR!' : 'GAME OVER'}
      </h1>
      
      <div style={{ fontSize: '20px', marginBottom: '15px' }}>
        SCORE: {score} / {total}
      </div>

      <div style={{ fontSize: '14px', marginBottom: '30px', color: '#bdc3c7', lineHeight: '1.8' }}>
        {isHighScore && <div className="blink-text" style={{ color: '#f1c40f' }}>NEW HIGH SCORE!</div>}
        <div>TOTAL ATTEMPTS: {attempts}</div>
      </div>

      <div style={{ marginBottom: '30px', fontSize: '16px' }}>
        {isPass 
          ? "YOU DEFEATED ALL BOSSES!" 
          : "THE BOSS WAS TOO STRONG... TRY AGAIN!"}
      </div>

      <button className="pixel-btn blink-text" onClick={handleRestart}>
        PLAY AGAIN
      </button>
    </div>
  );
}

export default Result;
