import { useEffect, useRef } from "react"
import { DownloadIcon, LinkIcon, RotateCcwIcon, Share2Icon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Sign } from "@/data/signs"
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  canvasBlob,
  drawShareCard,
  shareText,
  shareUrl,
  socialLinks,
} from "@/lib/share"

interface Props {
  nickname: string
  sign: Sign
  onRestart: () => void
}

export function Result({ nickname, sign, onRestart }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileName = `${nickname}-${sign.id}.png`

  useEffect(() => {
    if (canvasRef.current) drawShareCard(canvasRef.current, sign, nickname)
  }, [sign, nickname])

  async function getBlob() {
    try {
      return await canvasBlob(canvasRef.current!)
    } catch {
      toast.error("圖片輸出失敗，請再試一次。")
      return null
    }
  }

  async function download() {
    const blob = await getBlob()
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    toast.success("已下載圖片")
  }

  async function share() {
    const blob = await getBlob()
    if (!blob) return
    const file = new File([blob], fileName, { type: "image/png" })
    const data = { files: [file], title: "星座占卜所", text: `${shareText(sign)} ${shareUrl(sign)}` }
    if (navigator.canShare?.(data)) {
      try {
        await navigator.share(data)
      } catch (e) {
        if ((e as Error).name !== "AbortError") toast.error("分享失敗，請改用下載圖片。")
      }
    } else {
      await download()
      toast.info("這個瀏覽器不支援直接分享圖片，已改為下載")
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${shareText(sign)} ${shareUrl(sign)}`)
      toast.success("已複製分享文字與連結")
    } catch {
      toast(shareUrl(sign))
    }
  }

  return (
    <section className="text-center">
      <Card className="mx-auto mb-6 max-w-[400px] overflow-hidden p-0 shadow-2xl shadow-black/50">
        <canvas
          className="block aspect-[2/3] h-auto w-full bg-secondary"
          height={CARD_HEIGHT}
          ref={canvasRef}
          width={CARD_WIDTH}
        />
      </Card>

      <div className="flex flex-wrap justify-center gap-2.5">
        <Button className="h-11 rounded-full px-6 text-base font-bold" onClick={share} size="lg">
          <Share2Icon />
          分享圖片
        </Button>
        <Button className="h-11 rounded-full px-6 text-base" onClick={download} size="lg" variant="outline">
          <DownloadIcon />
          下載圖片
        </Button>
      </div>

      <p className="eyebrow mt-7 mb-2.5">分享到</p>
      <div className="flex flex-wrap justify-center gap-2">
        {socialLinks(sign).map((s) => (
          <Button asChild className="rounded-full px-4" key={s.name} variant="secondary">
            <a href={s.href} rel="noopener" target="_blank">
              {s.name}
            </a>
          </Button>
        ))}
        <Button className="rounded-full px-4" onClick={copyLink} variant="secondary">
          <LinkIcon />
          複製連結
        </Button>
      </div>
      <p className="mx-auto mt-3 max-w-sm text-xs text-muted-foreground/80">
        Threads／Facebook 會附上你的星座預覽圖；想貼出含暱稱的卡片，請先下載圖片再上傳。
      </p>

      <Button className="mt-5 text-muted-foreground" onClick={onRestart} variant="ghost">
        <RotateCcwIcon />
        再玩一次
      </Button>
    </section>
  )
}
