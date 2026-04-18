const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

export const fetchQuestions = async (playerId) => {
  try {
    const count = import.meta.env.VITE_QUESTION_COUNT || 10;
    const response = await fetch(`${GAS_URL}?action=getQuestions&count=${count}&playerId=${encodeURIComponent(playerId)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

export const submitAnswers = async (playerId, answers) => {
  try {
    const threshold = import.meta.env.VITE_PASS_THRESHOLD || 6;
    const response = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "submitAnswers",
        id: playerId,
        answers: answers,
        passThreshold: parseInt(threshold)
      }),
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    });
    const data = await response.json();
    return data; // { score, total, isPass }
  } catch (error) {
    console.error("Error submitting answers:", error);
    throw error;
  }
};
