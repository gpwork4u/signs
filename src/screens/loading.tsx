import { useEffect, useState } from "react"

const LINES = ["星星正在排列中…", "解讀你的元素能量…", "對照你的出生星空…"]

export function Loading({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setN((v) => Math.min(v + 1, LINES.length - 1)), 700)
    const done = setTimeout(onDone, 2200)
    return () => {
      clearInterval(timer)
      clearTimeout(done)
    }
  }, [onDone])

  return (
    <section className="text-center">
      <div aria-hidden="true" className="orb mx-auto mt-20 mb-8" />
      <p className="text-muted-foreground">{LINES[n]}</p>
    </section>
  )
}
