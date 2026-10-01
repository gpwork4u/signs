"use strict";

// ---------- 星座資料 ----------
// element：fire 火 / earth 土 / air 風 / water 水
// element 決定圖片缺失時替代背景的光暈色。
const SIGNS = [
  { id: "capricorn", name: "摩羯座", glyph: "♑", from: [12, 22], to: [1, 19], element: "earth" },
  { id: "aquarius", name: "水瓶座", glyph: "♒", from: [1, 20], to: [2, 18], element: "air" },
  { id: "pisces", name: "雙魚座", glyph: "♓", from: [2, 19], to: [3, 20], element: "water" },
  { id: "aries", name: "牡羊座", glyph: "♈", from: [3, 21], to: [4, 19], element: "fire" },
  { id: "taurus", name: "金牛座", glyph: "♉", from: [4, 20], to: [5, 20], element: "earth" },
  { id: "gemini", name: "雙子座", glyph: "♊", from: [5, 21], to: [6, 21], element: "air" },
  { id: "cancer", name: "巨蟹座", glyph: "♋", from: [6, 22], to: [7, 22], element: "water" },
  { id: "leo", name: "獅子座", glyph: "♌", from: [7, 23], to: [8, 22], element: "fire" },
  { id: "virgo", name: "處女座", glyph: "♍", from: [8, 23], to: [9, 22], element: "earth" },
  { id: "libra", name: "天秤座", glyph: "♎", from: [9, 23], to: [10, 23], element: "air" },
  { id: "scorpio", name: "天蠍座", glyph: "♏", from: [10, 24], to: [11, 22], element: "water" },
  { id: "sagittarius", name: "射手座", glyph: "♐", from: [11, 23], to: [12, 21], element: "fire" },
];

const ELEMENT_HUE = { fire: "#ff8a4c", earth: "#9fcf7a", air: "#9fd8ff", water: "#5fd0c8" };

// ---------- 題目 ----------
// 每個選項加分到某個元素 (e) 或模式 (m)
const QUESTIONS = [
  { text: "週末突然空出一整天，你最可能…", options: [
    { label: "臨時揪人去爬山、衝浪或來場說走就走", e: "fire" },
    { label: "把家裡整理乾淨，順便完成拖很久的待辦", e: "earth" },
    { label: "去新開的展覽或咖啡廳，跟朋友聊一整天", e: "air" },
    { label: "窩在家追劇，或陪陪重要的人", e: "water" } ] },
  { text: "朋友哭著跟你吐苦水，你的第一反應是…", options: [
    { label: "「走！我陪你去討回公道」", e: "fire" },
    { label: "冷靜幫他列出幾個可行的解決方案", e: "earth" },
    { label: "分析來龍去脈，幫他換個角度看事情", e: "air" },
    { label: "先抱抱他，陪他一起難過", e: "water" } ] },
  { text: "面臨人生重大決定時，你最相信…", options: [
    { label: "直覺和當下的衝勁", e: "fire" },
    { label: "現實條件和數字", e: "earth" },
    { label: "邏輯推演和多方意見", e: "air" },
    { label: "內心最真實的感受", e: "water" } ] },
  { text: "你理想中的旅行是…", options: [
    { label: "高空跳傘、潛水，越刺激越好", e: "fire" },
    { label: "行程排好排滿的美食巡禮", e: "earth" },
    { label: "在陌生城市漫遊，跟當地人聊天", e: "air" },
    { label: "海邊小鎮，看著浪發呆一整天", e: "water" } ] },
  { text: "朋友最常用哪個詞形容你？", options: [
    { label: "熱情、有活力", e: "fire" },
    { label: "可靠、很穩", e: "earth" },
    { label: "有趣、腦筋動很快", e: "air" },
    { label: "溫柔、很懂人", e: "water" } ] },
  { text: "壓力爆表的時候，你會…", options: [
    { label: "去運動流一身汗", e: "fire" },
    { label: "吃頓好的、睡飽，照表操課", e: "earth" },
    { label: "找人聊天或滑手機轉移注意力", e: "air" },
    { label: "一個人聽音樂，好好哭一場", e: "water" } ] },
  { text: "在團隊裡，你通常是…", options: [
    { label: "提出點子、帶頭衝的發起人", m: "cardinal" },
    { label: "撐到最後、把事情做完的中堅", m: "fixed" },
    { label: "協調大家、隨時補位的潤滑劑", m: "mutable" } ] },
  { text: "精心安排的計畫臨時被打亂，你會…", options: [
    { label: "立刻擬出新計畫，繼續前進", m: "cardinal" },
    { label: "有點不爽，盡量照原本的方式走", m: "fixed" },
    { label: "沒差啊，隨機應變反而更好玩", m: "mutable" } ] },
  { text: "看到一個全新的 App 或潮流，你…", options: [
    { label: "我要當第一個嘗試的人", m: "cardinal" },
    { label: "舊的用得很習慣，確定好用再說", m: "fixed" },
    { label: "什麼都想碰一下，玩膩就換", m: "mutable" } ] },
  { text: "你做事的節奏比較像…", options: [
    { label: "開頭衝超快，進入軌道後就交棒", m: "cardinal" },
    { label: "慢熱，但一旦開始就會堅持到底", m: "fixed" },
    { label: "同時開好幾條線，靈活切換", m: "mutable" } ] },
];

// ---------- 工具 ----------
const $ = (sel) => document.querySelector(sel);

function signFromDate(month, day) {
  // 以 月*100+日 比較；摩羯座跨年需特別處理
  const md = month * 100 + day;
  for (const s of SIGNS) {
    const from = s.from[0] * 100 + s.from[1];
    const to = s.to[0] * 100 + s.to[1];
    if (from <= to ? md >= from && md <= to : md >= from || md <= to) return s;
  }
  return SIGNS[0];
}

function rangeText(s) {
  return `${s.from[0]}/${s.from[1]} – ${s.to[0]}/${s.to[1]}`;
}

function show(id) {
  document.querySelectorAll(".screen").forEach((el) => el.classList.remove("is-active"));
  $(id).classList.add("is-active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------- 狀態 ----------
const state = { nickname: "", month: 0, day: 0, answers: [], index: 0 };

// ---------- 第一頁 ----------
$("#intro-form").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const nickname = $("#nickname").value.trim();
  const birthday = $("#birthday").value; // YYYY-MM-DD
  const err = $("#intro-error");
  if (!nickname) return (err.textContent = "請輸入暱稱，讓星星知道怎麼稱呼你。");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) return (err.textContent = "請選擇你的生日。");
  err.textContent = "";
  const [, m, d] = birthday.split("-").map(Number);
  Object.assign(state, { nickname, month: m, day: d, answers: [], index: 0 });
  renderQuestion();
  show("#screen-quiz");
});

// ---------- 問答 ----------
function renderQuestion() {
  const q = QUESTIONS[state.index];
  $("#q-count").textContent = `第 ${state.index + 1} / ${QUESTIONS.length} 題`;
  $("#progress-bar").style.width = `${(state.index / QUESTIONS.length) * 100}%`;
  $("#q-text").textContent = q.text;
  $("#q-back").style.visibility = state.index === 0 ? "hidden" : "visible";

  const box = $("#q-options");
  box.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option" + (state.answers[state.index] === i ? " is-picked" : "");
    btn.innerHTML = `<span class="mark">${"ABCD"[i]}</span><span></span>`;
    btn.lastChild.textContent = opt.label;
    btn.addEventListener("click", () => pick(i, btn));
    box.appendChild(btn);
  });
}

function pick(i, btn) {
  state.answers[state.index] = i;
  btn.classList.add("is-picked");
  setTimeout(() => {
    if (state.index < QUESTIONS.length - 1) {
      state.index += 1;
      renderQuestion();
    } else {
      $("#progress-bar").style.width = "100%";
      finish();
    }
  }, 220);
}

$("#q-back").addEventListener("click", () => {
  if (state.index > 0) {
    state.index -= 1;
    renderQuestion();
  }
});

// ---------- 結果 ----------
function finish() {
  show("#screen-loading");
  const lines = ["星星正在排列中…", "解讀你的元素能量…", "對照你的出生星空…"];
  let n = 0;
  $("#loading-text").textContent = lines[0];
  const timer = setInterval(() => {
    n += 1;
    if (n < lines.length) $("#loading-text").textContent = lines[n];
  }, 700);
  setTimeout(() => {
    clearInterval(timer);
    renderResult();
  }, 2200);
}

async function renderResult() {
  const real = signFromDate(state.month, state.day);
  $("#share-msg").textContent = "";
  show("#screen-result");
  await drawShareCard(real);
}

// ---------- 分享卡片 ----------
function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawFallbackArt(ctx, W, H, sign) {
  // 圖片不存在時的替代背景：漸層夜空 + 星點 + 大符號
  const g = ctx.createRadialGradient(W / 2, H * 0.35, 40, W / 2, H * 0.4, H * 0.8);
  g.addColorStop(0, "#3a2f86");
  g.addColorStop(0.5, "#16133b");
  g.addColorStop(1, "#07061a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 220; i++) {
    ctx.fillStyle = `rgba(246,226,168,${Math.random() * 0.8})`;
    ctx.beginPath();
    ctx.arc(Math.random() * W, Math.random() * H * 0.75, Math.random() * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.save();
  ctx.shadowColor = ELEMENT_HUE[sign.element];
  ctx.shadowBlur = 60;
  ctx.fillStyle = "#f6e2a8";
  ctx.font = "420px 'Noto Serif TC', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(sign.glyph + "︎", W / 2, H * 0.36);
  ctx.restore();
}

async function drawShareCard(sign) {
  const canvas = $("#share-canvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  if (document.fonts?.ready) await document.fonts.ready;

  const img = await loadImage(`images/${sign.id}.jpg`);
  if (img) {
    // cover 填滿
    const scale = Math.max(W / img.width, H / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
  } else {
    drawFallbackArt(ctx, W, H, sign);
  }

  // 底部暗化，讓文字清楚
  const shade = ctx.createLinearGradient(0, H * 0.5, 0, H);
  shade.addColorStop(0, "rgba(7,6,26,0)");
  shade.addColorStop(0.45, "rgba(7,6,26,0.82)");
  shade.addColorStop(1, "rgba(7,6,26,0.96)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, H * 0.5, W, H * 0.5);

  // 外框
  ctx.strokeStyle = "rgba(232,199,122,0.55)";
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  ctx.textAlign = "center";
  ctx.fillStyle = "#e8c77a";
  ctx.font = "500 30px 'Noto Sans TC', sans-serif";
  ctx.fillText("✦ 星座占卜結果 ✦", W / 2, 1110);

  // 暱稱：放大置中，過長時縮字以免超出外框
  let size = 68;
  ctx.font = `700 ${size}px 'Noto Sans TC', sans-serif`;
  while (ctx.measureText(state.nickname).width > W - 160 && size > 36) {
    size -= 4;
    ctx.font = `700 ${size}px 'Noto Sans TC', sans-serif`;
  }
  ctx.fillStyle = "#ffffff";
  ctx.fillText(state.nickname, W / 2, 1200);

  ctx.fillStyle = "#f6e2a8";
  ctx.font = "900 140px 'Noto Serif TC', serif";
  ctx.fillText(sign.name, W / 2, 1350);

  ctx.fillStyle = "#d9d3ea";
  ctx.font = "500 44px 'Noto Sans TC', sans-serif";
  ctx.fillText(rangeText(sign), W / 2, 1425);

  ctx.fillStyle = "#b3aec9";
  ctx.font = "400 28px 'Noto Sans TC', sans-serif";
  ctx.fillText("星座占卜所", W / 2, H - 80);
}

function canvasBlob() {
  return new Promise((resolve, reject) => {
    try {
      $("#share-canvas").toBlob((b) => (b ? resolve(b) : reject(new Error("empty"))), "image/png");
    } catch (e) {
      reject(e);
    }
  });
}

function fileName() {
  return `${state.nickname}-${signFromDate(state.month, state.day).id}.png`;
}

function explainError(e) {
  $("#share-msg").textContent =
    e && e.name === "SecurityError"
      ? "無法輸出圖片：請用本機伺服器開啟（python3 -m http.server），不要直接雙擊 index.html。"
      : "圖片輸出失敗，請再試一次。";
}

$("#btn-download").addEventListener("click", async () => {
  try {
    const blob = await canvasBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName();
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $("#share-msg").textContent = "已下載圖片 ✓";
  } catch (e) {
    explainError(e);
  }
});

$("#btn-share").addEventListener("click", async () => {
  try {
    const blob = await canvasBlob();
    const file = new File([blob], fileName(), { type: "image/png" });
    const sign = signFromDate(state.month, state.day);
    const data = { files: [file], title: "星座占卜所", text: `我是${sign.name}！來測測你的星座吧 ✨` };
    if (navigator.canShare && navigator.canShare(data)) {
      await navigator.share(data);
    } else {
      $("#btn-download").click();
      $("#share-msg").textContent = "這個瀏覽器不支援直接分享，已改為下載圖片 ✓";
    }
  } catch (e) {
    if (e && e.name === "AbortError") return; // 使用者取消分享
    explainError(e);
  }
});

$("#btn-again").addEventListener("click", () => {
  state.answers = [];
  state.index = 0;
  show("#screen-intro");
});

// ---------- 背景星空 ----------
// 模擬夜空周日運動：星星繞同一個天極點緩慢旋轉，並拖出弧形星軌（長曝光效果）。
// 星軌直接畫成弧線而非殘影疊加，所以畫布保持透明、不蓋住頁面漸層。
(function sky() {
  const c = $("#sky");
  const ctx = c.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const SPEED = 0.012; // 每秒旋轉的弧度（約 9 分鐘轉一圈）
  const TRAIL = 0.045; // 星軌長度（弧度），分三段由亮到淡
  const COLORS = ["#f6e2a8", "#ffffff", "#cfd8ff", "#ffd9c2"];
  let stars = [];
  let pole = { x: 0, y: 0 };
  let dpr = 1;
  let meteor = null;
  let nextMeteor = 4000;
  let last = 0;

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    c.width = innerWidth * dpr;
    c.height = innerHeight * dpr;
    // 天極點放在畫面上方偏右，旋轉時星軌呈現斜向弧線
    pole = { x: c.width * 0.72, y: c.height * 0.12 };
    // 半徑需覆蓋到離天極最遠的角落，旋轉時畫面才不會出現空洞
    const R = Math.hypot(Math.max(pole.x, c.width - pole.x), c.height - pole.y);
    const count = Math.round(Math.min(320, (innerWidth * innerHeight) / 4500));
    stars = Array.from({ length: count }, () => ({
      d: Math.sqrt(Math.random()) * R, // 開根號讓星星在面積上均勻分布
      a: Math.random() * Math.PI * 2,
      r: (Math.random() ** 2 * 1.4 + 0.4) * dpr,
      p: Math.random() * Math.PI * 2,
      color: COLORS[(Math.random() * COLORS.length) | 0],
    }));
  }

  function drawStars(t, rot) {
    for (const s of stars) {
      const a = s.a + rot;
      const x = pole.x + Math.cos(a) * s.d;
      const y = pole.y + Math.sin(a) * s.d;
      if (x < -20 || y < -20 || x > c.width + 20 || y > c.height + 20) continue;
      const twinkle = 0.45 + 0.55 * Math.abs(Math.sin(t / 1600 + s.p));
      if (!reduce.matches) {
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.r * 0.8;
        for (let i = 0; i < 3; i++) {
          ctx.globalAlpha = (0.16 - i * 0.05) * twinkle;
          ctx.beginPath();
          ctx.arc(pole.x, pole.y, s.d, a - (TRAIL * (i + 1)) / 3, a - (TRAIL * i) / 3);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawMeteor(dt) {
    if (!meteor) {
      nextMeteor -= dt;
      if (nextMeteor > 0) return;
      nextMeteor = 5000 + Math.random() * 7000;
      const ang = Math.PI * (0.15 + Math.random() * 0.2); // 往右下方劃過
      meteor = {
        x: Math.random() * c.width * 0.7,
        y: Math.random() * c.height * 0.4,
        vx: Math.cos(ang) * 1.1 * dpr,
        vy: Math.sin(ang) * 1.1 * dpr,
        life: 0,
        max: 900,
      };
    }
    meteor.life += dt;
    meteor.x += meteor.vx * dt;
    meteor.y += meteor.vy * dt;
    const k = 1 - meteor.life / meteor.max;
    if (k <= 0) return (meteor = null);
    const len = 120 * dpr;
    const tx = meteor.x - meteor.vx * (len / (1.1 * dpr));
    const ty = meteor.y - meteor.vy * (len / (1.1 * dpr));
    const g = ctx.createLinearGradient(meteor.x, meteor.y, tx, ty);
    g.addColorStop(0, `rgba(255,248,225,${0.9 * k})`);
    g.addColorStop(1, "rgba(255,248,225,0)");
    ctx.globalAlpha = 1;
    ctx.strokeStyle = g;
    ctx.lineWidth = 1.6 * dpr;
    ctx.beginPath();
    ctx.moveTo(meteor.x, meteor.y);
    ctx.lineTo(tx, ty);
    ctx.stroke();
  }

  function tick(t) {
    const dt = Math.min(t - last, 50); // 分頁切回來時避免一次跳太多
    last = t;
    ctx.clearRect(0, 0, c.width, c.height);
    drawStars(t, reduce.matches ? 0 : (t / 1000) * SPEED);
    if (!reduce.matches) drawMeteor(dt);
    requestAnimationFrame(tick);
  }

  addEventListener("resize", resize);
  resize();
  requestAnimationFrame((t) => {
    last = t;
    tick(t);
  });
})();
