// Google Apps Script (Code.gs)
// 請將此程式碼貼上至您的 Google Sheet -> 擴充功能 -> Apps Script 中

const SHEET_NAME_QUESTIONS = '題目';
const SHEET_NAME_ANSWERS = '答案';

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getQuestions') {
    const count = parseInt(e.parameter.count) || 10;
    return getQuestions(count);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Invalid action' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'submitAnswers') {
      return submitAnswers(data.id, data.answers, data.passThreshold);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Invalid action' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 獲取隨機題目
function getQuestions(count) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_QUESTIONS);
  const data = sheet.getDataRange().getValues();
  
  // 假設第一列是標題 (題號, 題目, A, B, C, D, 解答)
  const headers = data[0];
  const questions = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0]) {
      questions.push({
        id: row[0].toString(),
        question: row[1],
        A: row[2],
        B: row[3],
        C: row[4],
        D: row[5]
      });
    }
  }
  
  // 隨機打亂並取前 count 題
  shuffleArray(questions);
  const selectedQuestions = questions.slice(0, count);
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: selectedQuestions }))
    .setMimeType(ContentService.MimeType.JSON);
}

// 批改並紀錄成績
function submitAnswers(id, answers, passThreshold) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const qSheet = ss.getSheetByName(SHEET_NAME_QUESTIONS);
  const qData = qSheet.getDataRange().getValues();
  
  // 建立解答字典 { '題號': 'A' }
  const answerKey = {};
  for (let i = 1; i < qData.length; i++) {
    if (qData[i][0]) {
      answerKey[qData[i][0].toString()] = qData[i][6]; // 解答在 G 欄 (index 6)
    }
  }
  
  // 計算分數
  let score = 0;
  let total = Object.keys(answers).length;
  
  for (const qId in answers) {
    if (answers[qId] && answerKey[qId] && answers[qId].toUpperCase() === answerKey[qId].toUpperCase()) {
      score++;
    }
  }
  
  const isPass = score >= passThreshold;
  
  // 更新或新增回答紀錄
  const aSheet = ss.getSheetByName(SHEET_NAME_ANSWERS);
  const aData = aSheet.getDataRange().getValues();
  let rowIndex = -1;
  
  for (let i = 1; i < aData.length; i++) {
    if (aData[i][0].toString() === id.toString()) {
      rowIndex = i + 1; // getRange 是 1-indexed
      break;
    }
  }
  
  const now = new Date();
  let isHighScore = false;
  let attempts = 1;
  
  if (rowIndex > 0) {
    // 已存在 ID
    // ID, 闖關次數, 總分, 最高分, 第一次通關分數, 花了幾次通關, 最近遊玩時間
    //  A,        B,   C,      D,              E,            F,            G
    attempts = parseInt(aSheet.getRange(rowIndex, 2).getValue()) || 0;
    attempts += 1;
    aSheet.getRange(rowIndex, 2).setValue(attempts); // 更新次數
    
    // 只更新最近遊玩時間
    aSheet.getRange(rowIndex, 7).setValue(now);
    
    // 總分 (這裡指歷史累積總分或單次總分？依需求通常是覆蓋或不覆蓋，這裡設為本次得分)
    // 依據需求：「若同 ID 已通關過，後續分數不覆蓋，僅在同列增加闖關次數」
    const prevFirstPassScore = aSheet.getRange(rowIndex, 5).getValue();
    const prevHighScore = aSheet.getRange(rowIndex, 4).getValue() || 0;
    
    if (score > prevHighScore) {
      aSheet.getRange(rowIndex, 4).setValue(score);
      isHighScore = true;
    }
    
    // 如果之前未通關，這次通關了
    if (!prevFirstPassScore && isPass) {
      aSheet.getRange(rowIndex, 5).setValue(score); // 第一次通關分數
      aSheet.getRange(rowIndex, 6).setValue(attempts); // 花了幾次通關
    }
    
  } else {
    // 新 ID
    isHighScore = true;
    aSheet.appendRow([
      id, 
      attempts, // 闖關次數
      score, // 總分 (第一次遊玩的總分)
      score, // 最高分
      isPass ? score : '', // 第一次通關分數
      isPass ? attempts : '', // 花了幾次通關
      now // 最近遊玩時間
    ]);
  }
  
  // 取得排行榜前三名
  const finalData = aSheet.getDataRange().getValues();
  const leaderboardData = [];
  for (let i = 1; i < finalData.length; i++) {
    leaderboardData.push({
      id: finalData[i][0].toString(),
      highScore: parseInt(finalData[i][3]) || 0
    });
  }
  
  // 依照最高分降序排序
  leaderboardData.sort((a, b) => b.highScore - a.highScore);
  const top3 = leaderboardData.slice(0, 3);
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    data: {
      score: score,
      total: total,
      isPass: isPass,
      isHighScore: isHighScore,
      attempts: attempts,
      leaderboard: top3
    }
  })).setMimeType(ContentService.MimeType.JSON);
}

// 輔助函數：陣列洗牌 (Fisher-Yates)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// 部署前記得：發佈 -> 部署為網頁應用程式 -> 執行身分：我 -> 誰可以存取：任何人
// 注意：CORS 問題，使用 JSONP 或純 JSON 回傳需確保 Fetch 的設定正確
// 上方回傳 JSON，前端 Fetch 加上 mode: 'cors' 即可。
