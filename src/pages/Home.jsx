import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestions } from '../services/api';

function Home({ playerId, setPlayerId, setQuestions }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStart = async () => {
    if (!playerId.trim()) {
      setError('請輸入玩家 ID');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const res = await fetchQuestions();
      
      if (res.status === 'success' && res.data) {
        setQuestions(res.data);
        navigate('/game');
      } else {
        setError(res.message || '載入題目失敗');
      }
    } catch (err) {
      setError('網路連線錯誤');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pixel-box">
      <h1 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>像素問答</h1>
      <h2 style={{ color: 'var(--accent-color)', fontSize: '16px', marginBottom: '30px' }}>街機版</h2>
      
      <div>
        <input 
          type="text" 
          className="pixel-input"
          placeholder="輸入玩家 ID"
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
          disabled={loading}
        />
      </div>

      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

      {loading ? (
        <div className="loading blink-text">載入中...</div>
      ) : (
        <button 
          className="pixel-btn blink-text" 
          onClick={handleStart}
          style={{ marginTop: '20px' }}
        >
          投幣開始遊戲
        </button>
      )}
    </div>
  );
}

export default Home;
