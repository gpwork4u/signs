"use strict";

// ---------- 星座資料 ----------
// element：fire 火 / earth 土 / air 風 / water 水
// mode：cardinal 開創 / fixed 固定 / mutable 變動
// 元素 × 模式剛好對應 12 星座，問答就是在猜這兩個維度。
const SIGNS = [
  { id: "capricorn", name: "摩羯座", glyph: "♑", from: [12, 22], to: [1, 19], element: "earth", mode: "cardinal",
    keywords: ["務實", "有野心", "耐力驚人"], color: "墨綠", number: 8,
    desc: "你是把夢想拆成步驟、一步步爬上山頂的人。外表冷靜，內心其實有很強的責任感，時間越久越顯得可靠。" },
  { id: "aquarius", name: "水瓶座", glyph: "♒", from: [1, 20], to: [2, 18], element: "air", mode: "fixed",
    keywords: ["獨立", "創新", "理想主義"], color: "電光藍", number: 4,
    desc: "你的腦袋常常走在時代前面，重視自由也在乎群體。看似疏離，其實對朋友有著獨特又長久的忠誠。" },
  { id: "pisces", name: "雙魚座", glyph: "♓", from: [2, 19], to: [3, 20], element: "water", mode: "mutable",
    keywords: ["浪漫", "同理心", "想像力"], color: "海霧紫", number: 7,
    desc: "你能感受到別人說不出口的情緒，也擁有豐富的想像世界。溫柔是你的超能力，記得也要好好照顧自己。" },
  { id: "aries", name: "牡羊座", glyph: "♈", from: [3, 21], to: [4, 19], element: "fire", mode: "cardinal",
    keywords: ["勇敢", "直率", "行動派"], color: "火焰紅", number: 9,
    desc: "你是點燃一切的火種，想到就做、做了再說。熱情和衝勁讓身邊的人也跟著熱血起來。" },
  { id: "taurus", name: "金牛座", glyph: "♉", from: [4, 20], to: [5, 20], element: "earth", mode: "fixed",
    keywords: ["穩定", "有品味", "堅持"], color: "橄欖綠", number: 6,
    desc: "你懂得享受生活裡的美好：好吃的、好看的、舒服的。步調不快，但一旦決定就很難被動搖。" },
  { id: "gemini", name: "雙子座", glyph: "♊", from: [5, 21], to: [6, 21], element: "air", mode: "mutable",
    keywords: ["機智", "好奇", "善於溝通"], color: "檸檬黃", number: 5,
    desc: "你的好奇心像停不下來的雷達，什麼都想知道、什麼都能聊。和你相處永遠不會無聊。" },
  { id: "cancer", name: "巨蟹座", glyph: "♋", from: [6, 22], to: [7, 22], element: "water", mode: "cardinal",
    keywords: ["顧家", "溫暖", "保護欲"], color: "月光銀", number: 2,
    desc: "你把在乎的人放在心上最柔軟的地方，也會為了他們變得無比勇敢。你的家就是大家的避風港。" },
  { id: "leo", name: "獅子座", glyph: "♌", from: [7, 23], to: [8, 22], element: "fire", mode: "fixed",
    keywords: ["自信", "大方", "天生主角"], color: "太陽金", number: 1,
    desc: "你天生自帶光芒，走到哪裡都是焦點。慷慨又重義氣，被你當成朋友的人都會感到被照亮。" },
  { id: "virgo", name: "處女座", glyph: "♍", from: [8, 23], to: [9, 22], element: "earth", mode: "mutable",
    keywords: ["細心", "分析力", "追求完美"], color: "麥穗米", number: 3,
    desc: "你看得見別人忽略的細節，也總是默默把事情做到最好。你的貼心常常藏在很小很小的地方。" },
  { id: "libra", name: "天秤座", glyph: "♎", from: [9, 23], to: [10, 23], element: "air", mode: "cardinal",
    keywords: ["優雅", "公正", "人緣好"], color: "玫瑰粉", number: 6,
    desc: "你追求和諧與美感，擅長在不同的人之間找到平衡點。你的溫和與品味讓人很想靠近。" },
  { id: "scorpio", name: "天蠍座", glyph: "♏", from: [10, 24], to: [11, 22], element: "water", mode: "fixed",
    keywords: ["深刻", "專注", "神秘"], color: "酒紅", number: 8,
    desc: "你的情感濃烈而深沉，看人看事都能直達核心。一旦信任某人，你會用全部的力量守護他。" },
  { id: "sagittarius", name: "射手座", glyph: "♐", from: [11, 23], to: [12, 21], element: "fire", mode: "mutable",
    keywords: ["自由", "樂觀", "愛冒險"], color: "天空紫", number: 3,
    desc: "你的心永遠在遠方，熱愛探索、學習與旅行。樂觀和幽默讓你走到哪裡都能交到朋友。" },
];

const ELEMENT_NAME = { fire: "火象", earth: "土象", air: "風象", water: "水象" };
const MODE_NAME = { cardinal: "開創", fixed: "固定", mutable: "變動" };
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

function topKey(scores, order) {
  // 分數相同時以 order 順序為準，確保結果穩定
  return order.reduce((best, k) => (scores[k] > scores[best] ? k : best), order[0]);
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

// ---------- 計算結果 ----------
function predict() {
  const e = { fire: 0, earth: 0, air: 0, water: 0 };
  const m = { cardinal: 0, fixed: 0, mutable: 0 };
  state.answers.forEach((ai, qi) => {
    const opt = QUESTIONS[qi].options[ai];
    if (opt.e) e[opt.e] += 1;
    if (opt.m) m[opt.m] += 1;
  });
  const element = topKey(e, ["fire", "earth", "air", "water"]);
  const mode = topKey(m, ["cardinal", "fixed", "mutable"]);
  const sign = SIGNS.find((s) => s.element === element && s.mode === mode);
  return { sign, element, mode };
}

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
  const guess = predict();
  const real = signFromDate(state.month, state.day);

  $("#guess-sign").textContent = `${guess.sign.glyph} ${guess.sign.name}`;
  $("#guess-why").textContent = `你的回答充滿${ELEMENT_NAME[guess.element]}能量，做事偏向${MODE_NAME[guess.mode]}型。`;

  $("#result-title").textContent = `${real.glyph} ${real.name}`;
  let verdict;
  if (guess.sign.id === real.id) verdict = `完全命中！${state.nickname}，你就是教科書等級的${real.name} ✨`;
  else if (guess.element === real.element) verdict = `差一點！元素猜對了，你是很有${ELEMENT_NAME[real.element]}本色的${real.name}。`;
  else verdict = `星星這次猜錯了——${state.nickname}，你是藏著${ELEMENT_NAME[guess.element]}靈魂的${real.name}！`;
  $("#result-verdict").textContent = verdict;

  $("#result-desc").textContent = real.desc;
  const meta = [
    ["日期", rangeText(real)],
    ["元素", `${ELEMENT_NAME[real.element]} · ${MODE_NAME[real.mode]}`],
    ["關鍵字", real.keywords.join("、")],
    ["幸運色", real.color],
    ["幸運數字", String(real.number)],
  ];
  $("#result-meta").innerHTML = "";
  meta.forEach(([k, v]) => {
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = k;
    dd.textContent = v;
    $("#result-meta").append(dt, dd);
  });

  $("#share-msg").textContent = "";
  show("#screen-result");
  await drawShareCard(real, guess, verdict);
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

async function drawShareCard(sign, guess, verdict) {
  const canvas = $("#share-canvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  if (document.fonts?.ready) await document.fonts.ready;

  const img = await loadImage(`images/${sign.id}.png`);
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
  ctx.font = "500 34px 'Noto Sans TC', sans-serif";
  ctx.fillText(`✦ ${state.nickname} 的星座 ✦`, W / 2, H * 0.72);

  ctx.fillStyle = "#f6e2a8";
  ctx.font = "900 128px 'Noto Serif TC', serif";
  ctx.fillText(sign.name, W / 2, H * 0.72 + 140);

  ctx.fillStyle = "#d9d3ea";
  ctx.font = "400 34px 'Noto Sans TC', sans-serif";
  ctx.fillText(`${rangeText(sign)} · ${ELEMENT_NAME[sign.element]}星座`, W / 2, H * 0.72 + 205);

  ctx.fillStyle = "#f4efe3";
  ctx.font = "500 40px 'Noto Sans TC', sans-serif";
  ctx.fillText(sign.keywords.join("  ·  "), W / 2, H * 0.72 + 275);

  ctx.fillStyle = "#b3aec9";
  ctx.font = "400 28px 'Noto Sans TC', sans-serif";
  const hit = guess.sign.id === sign.id ? "心理測驗完全命中 ✓" : `心理測驗猜我是 ${guess.sign.name}`;
  ctx.fillText(`${hit}　|　星座占卜所`, W / 2, H - 80);
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
(function sky() {
  const c = $("#sky");
  const ctx = c.getContext("2d");
  let stars = [];
  function resize() {
    c.width = innerWidth * devicePixelRatio;
    c.height = innerHeight * devicePixelRatio;
    stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      r: (Math.random() * 1.3 + 0.3) * devicePixelRatio,
      p: Math.random() * Math.PI * 2,
    }));
  }
  function tick(t) {
    ctx.clearRect(0, 0, c.width, c.height);
    for (const s of stars) {
      ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(t / 1400 + s.p));
      ctx.fillStyle = "#f6e2a8";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  addEventListener("resize", resize);
  resize();
  requestAnimationFrame(tick);
})();
