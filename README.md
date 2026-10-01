# 星座占卜所

先輸入暱稱和生日，接著回答 10 題心理與行為問題，最後依生日揭曉你的星座，並產生一張寫著暱稱、可以分享的星座卡片。
（問答只是梗，結果一律以生日決定。）

線上版：https://gpwork4u.github.io/signs/

## 技術

- Vite + React + TypeScript
- Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com)（Button、Input、Label、Card、Calendar、Popover、Progress、Sonner）
- 主題色定義在 `src/index.css` 的 `:root`（深靛藍夜空＋金色）

## 開發

```sh
npm install
npm run dev      # http://localhost:5173/signs/
npm run lint
npm run build    # 輸出到 dist/
```

推上 `main` 後，GitHub Actions（`.github/workflows/deploy.yml`）會自動建置並部署到 GitHub Pages。

## 目錄

| 路徑 | 說明 |
| --- | --- |
| `src/data/signs.ts` | 12 星座資料與生日判斷 |
| `src/data/questions.ts` | 問答題目 |
| `src/lib/share.ts` | 分享卡片繪製、社群分享連結 |
| `src/components/star-sky.tsx` | 旋轉星空背景 |
| `src/components/birthday-picker.tsx` | shadcn Date Picker（年月下拉） |
| `public/images/` | 12 星座插圖（Codex 生成） |
| `public/og/`、`public/s/` | 社群預覽圖與各星座分享頁（由 `tools/build_share.sh` 產生） |

## 生成星座圖片（Codex）

```sh
codex exec -s workspace-write --skip-git-repo-check - < codex_prompt.txt
```

原始 PNG 會輸出到 `images-src/`（不進版控），再轉成 JPEG 放到 `public/images/<sign>.jpg`。

## 更新社群預覽圖

改了星座圖或星座資料後執行：

```sh
tools/build_share.sh   # 需要 Google Chrome、python3 + Pillow
```
