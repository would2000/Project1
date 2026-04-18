import { useNavigate } from 'react-router-dom';

function Result({ gameData, setQuestions }) {
  const navigate = useNavigate();
  // 從 gameData 接收 leaderboard
  const { score, total, isPass, isHighScore, attempts, leaderboard } = gameData;

  const handleRestart = () => {
    setQuestions([]); // 清空題目，重新開始
    navigate('/');
  };

  return (
    <div className="pixel-box">
      <h1 style={{ color: isPass ? 'var(--accent-color)' : 'var(--primary-color)', marginBottom: '20px' }}>
        {isPass ? '過關！' : '遊戲結束'}
      </h1>
      
      <div style={{ fontSize: '20px', marginBottom: '15px' }}>
        分數：{score} / {total}
      </div>

      <div style={{ fontSize: '14px', marginBottom: '30px', color: '#bdc3c7', lineHeight: '1.8' }}>
        {isHighScore && <div className="blink-text" style={{ color: '#f1c40f' }}>破紀錄啦！</div>}
        <div>總嘗試次數：{attempts}</div>
      </div>

      <div style={{ marginBottom: '30px', fontSize: '16px' }}>
        {isPass 
          ? "你擊敗了所有魔王！" 
          : "魔王太強了... 再試一次！"}
      </div>

      {leaderboard && leaderboard.length > 0 && (
        <div style={{ marginBottom: '30px', borderTop: '2px dashed #fff', paddingTop: '20px' }}>
          <h3 style={{ color: '#f1c40f', marginBottom: '15px' }}>🏆 排行榜 (Top 3) 🏆</h3>
          {leaderboard.map((player, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
              <span>{index + 1}. {player.id}</span>
              <span>{player.highScore} 分</span>
            </div>
          ))}
        </div>
      )}

      <button className="pixel-btn blink-text" onClick={handleRestart}>
        再玩一次
      </button>
    </div>
  );
}

export default Result;
