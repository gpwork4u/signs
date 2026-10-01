#!/usr/bin/env bash
# 產生社群分享用的預覽圖（public/og/*.jpg）與各星座分享頁（public/s/*.html）。
# 用法：tools/build_share.sh   （需要 Google Chrome、python3 + Pillow）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE="https://gpwork4u.github.io/signs"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PORT="${PORT:-8799}"

OUT="$ROOT/public"
mkdir -p "$OUT/og" "$OUT/s"

# 從 src/data/signs.ts 讀出 id、名稱與日期，作為 og.html 的參數
DATA="$(python3 - "$ROOT/src/data/signs.ts" <<'EOF'
import re, sys
src = open(sys.argv[1], encoding="utf-8").read()
pat = r'id: "(\w+)", name: "([^"]+)".*?from: \[(\d+), (\d+)\], to: \[(\d+), (\d+)\]'
for m in re.finditer(pat, src):
    i, n, fm, fd, tm, td = m.groups()
    print(f"{i}\t{n}\t{fm}/{fd} – {tm}/{td}")
EOF
)"
python3 -m http.server "$PORT" --directory "$ROOT" >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER' EXIT
until curl -s -o /dev/null "http://localhost:$PORT/tools/og.html"; do :; done

shot() { # $1 = 輸出名稱, $2 = query string
  # headless Chrome 偶爾會卡住：每次最多等 30 秒，失敗就重試，最多 3 次
  local out="$OUT/og/$1.png"
  for _ in 1 2 3; do
    rm -f "$out"
    "$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=1200,630 \
      --user-data-dir="$(mktemp -d)" --virtual-time-budget=6000 --timeout=15000 \
      --screenshot="$out" "http://localhost:$PORT/tools/og.html$2" 2>/dev/null &
    local pid=$!
    (sleep 30 && kill "$pid" 2>/dev/null) &
    local watchdog=$!
    wait "$pid" 2>/dev/null || true
    kill "$watchdog" 2>/dev/null || true
    [ -s "$out" ] && echo "ok: $1" && return 0
  done
  echo "failed: $1" >&2
  return 1
}

urlencode() { python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1]))' "$1"; }

shot index ""
while IFS=$'\t' read -r id name date; do
  shot "$id" "?sign=$id&name=$(urlencode "$name")&date=$(urlencode "$date")"
done <<<"$DATA"

python3 - "$OUT" "$SITE" "$DATA" <<'EOF'
import sys, os
from PIL import Image

out, site, data = sys.argv[1], sys.argv[2], sys.argv[3]
names = dict(line.split("\t")[:2] for line in data.splitlines())
ids = list(names)

for name in ["index", *ids]:
    png = f"{out}/og/{name}.png"
    Image.open(png).convert("RGB").save(f"{out}/og/{name}.jpg", quality=86, optimize=True)
    os.remove(png)

TEMPLATE = """<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>我是{name}｜星座占卜所</title>
    <meta name="description" content="回答 10 題心理測驗，揭曉你的星座並產生專屬分享卡片。" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="星座占卜所" />
    <meta property="og:url" content="{site}/s/{id}.html" />
    <meta property="og:title" content="我是{name}！你是哪個星座？" />
    <meta property="og:description" content="回答 10 題心理測驗，揭曉你的星座並產生專屬分享卡片。" />
    <meta property="og:image" content="{site}/og/{id}.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="{site}/og/{id}.jpg" />
    <style>body{{margin:0;background:#0b0a1f;color:#f4efe3;font-family:sans-serif;display:grid;place-items:center;min-height:100vh}}a{{color:#e8c77a}}</style>
    <!-- 社群爬蟲不執行 JS，會停在本頁讀取預覽資訊；真人則立即導向測驗首頁 -->
    <script>location.replace("../");</script>
  </head>
  <body>
    <p><a href="../">前往星座占卜所 →</a></p>
  </body>
</html>
"""

for id in ids:
    with open(f"{out}/s/{id}.html", "w", encoding="utf-8") as f:
        f.write(TEMPLATE.format(id=id, name=names[id], site=site))
print("done:", len(ids), "share pages")
EOF
