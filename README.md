# Pixel Quiz Game

這是一個使用 React + Vite 建立的像素風格問答遊戲，並搭配 Google Apps Script 作為後端。

## 環境變數設定

要讓專案正確運行，需要設定以下環境變數。請參考專案中的 `.env.example` 檔案。

| 變數名稱 | 說明 | 預設值 |
| :--- | :--- | :--- |
| `VITE_GOOGLE_APP_SCRIPT_URL` | Google Apps Script 部署為網頁應用程式後取得的 URL | (必填) |
| `VITE_PASS_THRESHOLD` | 遊戲過關門檻的分數 | `6` |
| `VITE_QUESTION_COUNT` | 遊戲顯示的總題數 | `10` |

## GitHub Pages 自動部署教學

本專案已配置 GitHub Actions 工作流程 (`.github/workflows/deploy.yml`)，當推送到 `main` 或 `master` 分支時，會自動編譯並部署到 GitHub Pages。

### 步驟一：設定 Repository Secrets 和 Variables

由於我們在建置時需要用到上述的環境變數，請在 GitHub Repository 中進行設定：

1. 進入你的 GitHub Repository，點選上方的 **Settings** 標籤。
2. 在左側選單找到 **Security** 區塊，點開 **Secrets and variables** -> **Actions**。

**新增 Secret (適合機密資訊)：**
- 點選 **New repository secret**。
- Name 填入：`VITE_GOOGLE_APP_SCRIPT_URL`
- Secret 填入：你的 Google Apps Script URL (例如 `https://script.google.com/macros/s/.../exec`)
- 點擊 **Add secret** 儲存。

**新增 Variable (適合一般設定，可選)：**
預設情況下，Actions 已設定了過關門檻 6 與題數 10 的預設值。如果你想修改，可以新增變數：
- 切換到 **Variables** 標籤，點選 **New repository variable**。
- Name 填入：`VITE_PASS_THRESHOLD`，Value 填入想要的數字 (例如 `8`)，點擊 **Add variable**。
- Name 填入：`VITE_QUESTION_COUNT`，Value 填入想要的數字 (例如 `15`)，點擊 **Add variable**。

### 步驟二：啟用 GitHub Pages 功能

為了讓 GitHub Actions 能正確部署：

1. 進入 Repository 的 **Settings** -> 左側選單的 **Pages**。
2. 在 **Build and deployment** 區塊中：
   - **Source** 請選擇 **GitHub Actions** (很重要！這樣 Actions 才有權限將檔案推送到 Pages 環境)。

### 步驟三：推送程式碼

當上述設定都完成後，只需將程式碼 commit 並推送到遠端的 `main` 或 `master` 分支。
進入 Repository 的 **Actions** 頁籤，就可以看到 `Deploy to GitHub Pages` 的流程正在執行。完成後即可獲得 GitHub Pages 的專屬網址！
