import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestions } from '../services/api';

function Home({ playerId, setPlayerId, setQuestions }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStart = async () => {
    if (!playerId.trim()) {
      setError('PLEASE ENTER PLAYER ID');
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
        setError(res.message || 'FAILED TO LOAD QUESTIONS');
      }
    } catch (err) {
      setError('NETWORK ERROR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pixel-box">
      <h1 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>PIXEL QUIZ</h1>
      <h2 style={{ color: 'var(--accent-color)', fontSize: '16px', marginBottom: '30px' }}>ARCADE EDITION</h2>
      
      <div>
        <input 
          type="text" 
          className="pixel-input"
          placeholder="ENTER PLAYER ID"
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
          disabled={loading}
        />
      </div>

      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

      {loading ? (
        <div className="loading blink-text">LOADING...</div>
      ) : (
        <button 
          className="pixel-btn blink-text" 
          onClick={handleStart}
          style={{ marginTop: '20px' }}
        >
          INSERT COIN TO START
        </button>
      )}
    </div>
  );
}

export default Home;
