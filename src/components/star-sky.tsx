import { useEffect, useRef } from "react"

// 模擬夜空周日運動：星星繞同一個天極點旋轉，並拖出弧形星軌（長曝光效果）。
// 星軌直接畫成弧線而非殘影疊加，所以畫布保持透明、不蓋住頁面漸層。
const SPEED = 0.042 // 每秒旋轉的弧度（約 2.5 分鐘轉一圈）
const TRAIL = 0.055 // 星軌長度（弧度），分三段由亮到淡
const COLORS = ["#f6e2a8", "#ffffff", "#cfd8ff", "#ffd9c2"]

interface Star {
  d: number
  a: number
  r: number
  p: number
  color: string
}

interface Meteor {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
}

export function StarSky() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = ref.current
    const ctx = c?.getContext("2d")
    if (!c || !ctx) return
    const reduce = matchMedia("(prefers-reduced-motion: reduce)")
    let stars: Star[] = []
    let pole = { x: 0, y: 0 }
    let dpr = 1
    let meteor: Meteor | null = null
    let nextMeteor = 4000
    let last = 0
    let raf = 0

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2)
      c!.width = innerWidth * dpr
      c!.height = innerHeight * dpr
      // 天極點放在畫面上方偏右，旋轉時星軌呈現斜向弧線
      pole = { x: c!.width * 0.72, y: c!.height * 0.12 }
      // 半徑需覆蓋到離天極最遠的角落，旋轉時畫面才不會出現空洞
      const R = Math.hypot(Math.max(pole.x, c!.width - pole.x), c!.height - pole.y)
      const count = Math.round(Math.min(800, (innerWidth * innerHeight) / 1900))
      stars = Array.from({ length: count }, () => ({
        d: Math.sqrt(Math.random()) * R, // 開根號讓星星在面積上均勻分布
        a: Math.random() * Math.PI * 2,
        r: (Math.random() ** 2 * 1.4 + 0.4) * dpr,
        p: Math.random() * Math.PI * 2,
        color: COLORS[(Math.random() * COLORS.length) | 0],
      }))
    }

    function drawStars(t: number, rot: number) {
      for (const s of stars) {
        const a = s.a + rot
        const x = pole.x + Math.cos(a) * s.d
        const y = pole.y + Math.sin(a) * s.d
        if (x < -20 || y < -20 || x > c!.width + 20 || y > c!.height + 20) continue
        const twinkle = 0.45 + 0.55 * Math.abs(Math.sin(t / 1600 + s.p))
        if (!reduce.matches) {
          ctx!.strokeStyle = s.color
          ctx!.lineWidth = s.r * 0.8
          for (let i = 0; i < 3; i++) {
            ctx!.globalAlpha = (0.16 - i * 0.05) * twinkle
            ctx!.beginPath()
            ctx!.arc(pole.x, pole.y, s.d, a - (TRAIL * (i + 1)) / 3, a - (TRAIL * i) / 3)
            ctx!.stroke()
          }
        }
        ctx!.globalAlpha = twinkle
        ctx!.fillStyle = s.color
        ctx!.beginPath()
        ctx!.arc(x, y, s.r, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    function drawMeteor(dt: number) {
      if (!meteor) {
        nextMeteor -= dt
        if (nextMeteor > 0) return
        nextMeteor = 5000 + Math.random() * 7000
        const ang = Math.PI * (0.15 + Math.random() * 0.2) // 往右下方劃過
        meteor = {
          x: Math.random() * c!.width * 0.7,
          y: Math.random() * c!.height * 0.4,
          vx: Math.cos(ang) * 1.1 * dpr,
          vy: Math.sin(ang) * 1.1 * dpr,
          life: 0,
          max: 900,
        }
      }
      meteor.life += dt
      meteor.x += meteor.vx * dt
      meteor.y += meteor.vy * dt
      const k = 1 - meteor.life / meteor.max
      if (k <= 0) {
        meteor = null
        return
      }
      const len = 120 / 1.1
      const tx = meteor.x - meteor.vx * len
      const ty = meteor.y - meteor.vy * len
      const g = ctx!.createLinearGradient(meteor.x, meteor.y, tx, ty)
      g.addColorStop(0, `rgba(255,248,225,${0.9 * k})`)
      g.addColorStop(1, "rgba(255,248,225,0)")
      ctx!.globalAlpha = 1
      ctx!.strokeStyle = g
      ctx!.lineWidth = 1.6 * dpr
      ctx!.beginPath()
      ctx!.moveTo(meteor.x, meteor.y)
      ctx!.lineTo(tx, ty)
      ctx!.stroke()
    }

    function tick(t: number) {
      const dt = Math.min(t - last, 50) // 分頁切回來時避免一次跳太多
      last = t
      ctx!.clearRect(0, 0, c!.width, c!.height)
      drawStars(t, reduce.matches ? 0 : (t / 1000) * SPEED)
      if (!reduce.matches) drawMeteor(dt)
      raf = requestAnimationFrame(tick)
    }

    addEventListener("resize", resize)
    resize()
    raf = requestAnimationFrame((t) => {
      last = t
      tick(t)
    })
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener("resize", resize)
    }
  }, [])

  return <canvas aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 size-full" ref={ref} />
}
