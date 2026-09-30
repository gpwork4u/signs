# 星座占卜所

先回答暱稱和生日，接著回答 10 題心理與行為問題（6 題測元素、4 題測模式），系統會猜你的星座，
最後用生日揭曉你真正的星座，並產生一張可以分享的星座卡片。

## 生成星座圖片（Codex）

```sh
codex exec --full-auto --skip-git-repo-check - < codex_prompt.txt
```

生成的圖片會放在 `images/<sign>.png`（例如 `aries.png`、`leo.png`）。圖片還沒生成時，卡片會改用程式繪製的星空背景加星座符號。

## 執行

```sh
python3 -m http.server 8000
# 開啟 http://localhost:8000
```

請透過本機伺服器開啟。如果直接雙擊 `index.html`，瀏覽器會擋下從 canvas 匯出圖片，下載與分享功能就無法使用。
