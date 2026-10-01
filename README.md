# 星座占卜所

先輸入暱稱和生日，接著回答 10 題心理與行為問題，最後依生日揭曉你的星座，並產生一張寫著暱稱、可以分享的星座卡片。

## 生成星座圖片（Codex）

```sh
codex exec -s workspace-write --skip-git-repo-check - < codex_prompt.txt
```

Codex 產出的原始 PNG 放在 `images-src/`（不進版控，舊版風格在 `images-src/v1/`），網站使用轉成 JPEG 的 `images/<sign>.jpg`。圖片不存在時，卡片會改用程式繪製的星空背景加星座符號。

## 執行

```sh
python3 -m http.server 8000
# 開啟 http://localhost:8000
```

請透過本機伺服器開啟。如果直接雙擊 `index.html`，瀏覽器會擋下從 canvas 匯出圖片，下載與分享功能就無法使用。
