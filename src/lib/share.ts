import { ELEMENT_HUE, rangeText, type Sign } from "@/data/signs"

// 對外宣傳用的網址；分享連結指向各星座的 s/<id>.html，社群預覽會顯示該星座的圖
export const SITE = "https://gpwork4u.github.io/signs/"
export const SITE_LABEL = "gpwork4u.github.io/signs"

export const CARD_WIDTH = 1080
export const CARD_HEIGHT = 1620

export function shareUrl(sign: Sign): string {
  return `${SITE}s/${sign.id}.html`
}

export function shareText(sign: Sign): string {
  return `我是${sign.name}！來「星座占卜所」測測你是什麼星座 ✨`
}

// 社群快捷分享：網頁版分享連結只能帶文字與網址，圖片靠 s/<id>.html 的 og:image 呈現
export function socialLinks(sign: Sign) {
  const url = encodeURIComponent(shareUrl(sign))
  const text = encodeURIComponent(shareText(sign))
  const withUrl = encodeURIComponent(`${shareText(sign)} ${shareUrl(sign)}`)
  return [
    { name: "Threads", href: `https://www.threads.net/intent/post?text=${withUrl}` },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { name: "LINE", href: `https://social-plugins.line.me/lineit/share?url=${url}&text=${text}` },
    { name: "X", href: `https://twitter.com/intent/tweet?text=${text}&url=${url}` },
  ]
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

function drawFallbackArt(ctx: CanvasRenderingContext2D, W: number, H: number, sign: Sign) {
  // 圖片不存在時的替代背景：漸層夜空 + 星點 + 大符號
  const g = ctx.createRadialGradient(W / 2, H * 0.35, 40, W / 2, H * 0.4, H * 0.8)
  g.addColorStop(0, "#3a2f86")
  g.addColorStop(0.5, "#16133b")
  g.addColorStop(1, "#07061a")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  for (let i = 0; i < 220; i++) {
    ctx.fillStyle = `rgba(246,226,168,${Math.random() * 0.8})`
    ctx.beginPath()
    ctx.arc(Math.random() * W, Math.random() * H * 0.75, Math.random() * 2.2, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.save()
  ctx.shadowColor = ELEMENT_HUE[sign.element]
  ctx.shadowBlur = 60
  ctx.fillStyle = "#f6e2a8"
  ctx.font = "420px 'Noto Serif TC', serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(sign.glyph + "︎", W / 2, H * 0.36)
  ctx.restore()
}

export async function drawShareCard(canvas: HTMLCanvasElement, sign: Sign, nickname: string) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height

  // 字型沒載好就畫會退回系統字，先等需要的字重載入
  await Promise.all([
    document.fonts.load("900 140px 'Noto Serif TC'", sign.name),
    document.fonts.load("700 68px 'Noto Sans TC'", nickname || "暱稱"),
    document.fonts.load("500 30px 'Noto Sans TC'", "星座占卜結果"),
  ]).catch(() => undefined)

  const img = await loadImage(`${import.meta.env.BASE_URL}images/${sign.id}.jpg`)
  if (img) {
    // cover 填滿
    const scale = Math.max(W / img.width, H / img.height)
    const w = img.width * scale
    const h = img.height * scale
    ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h)
  } else {
    drawFallbackArt(ctx, W, H, sign)
  }

  // 底部暗化，讓文字清楚
  const shade = ctx.createLinearGradient(0, H * 0.5, 0, H)
  shade.addColorStop(0, "rgba(7,6,26,0)")
  shade.addColorStop(0.45, "rgba(7,6,26,0.82)")
  shade.addColorStop(1, "rgba(7,6,26,0.96)")
  ctx.fillStyle = shade
  ctx.fillRect(0, H * 0.5, W, H * 0.5)

  // 外框
  ctx.strokeStyle = "rgba(232,199,122,0.55)"
  ctx.lineWidth = 3
  ctx.strokeRect(36, 36, W - 72, H - 72)

  ctx.textAlign = "center"
  ctx.textBaseline = "alphabetic"
  ctx.fillStyle = "#e8c77a"
  ctx.font = "500 30px 'Noto Sans TC', sans-serif"
  ctx.fillText("✦ 星座占卜結果 ✦", W / 2, 1110)

  // 暱稱：放大置中，過長時縮字以免超出外框
  let size = 68
  ctx.font = `700 ${size}px 'Noto Sans TC', sans-serif`
  while (ctx.measureText(nickname).width > W - 160 && size > 36) {
    size -= 4
    ctx.font = `700 ${size}px 'Noto Sans TC', sans-serif`
  }
  ctx.fillStyle = "#ffffff"
  ctx.fillText(nickname, W / 2, 1200)

  ctx.fillStyle = "#f6e2a8"
  ctx.font = "900 140px 'Noto Serif TC', serif"
  ctx.fillText(sign.name, W / 2, 1350)

  ctx.fillStyle = "#d9d3ea"
  ctx.font = "500 44px 'Noto Sans TC', sans-serif"
  ctx.fillText(rangeText(sign), W / 2, 1425)

  ctx.fillStyle = "#b3aec9"
  ctx.font = "400 28px 'Noto Sans TC', sans-serif"
  ctx.fillText(`星座占卜所 · 來測你的星座 → ${SITE_LABEL}`, W / 2, H - 80)
}

export function canvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("empty"))), "image/png")
    } catch (e) {
      reject(e)
    }
  })
}
