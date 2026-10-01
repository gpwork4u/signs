import { useState, type FormEvent } from "react"
import { ArrowRightIcon } from "lucide-react"

import { BirthdayPicker } from "@/components/birthday-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  defaultNickname: string
  defaultBirthday?: Date
  onStart: (nickname: string, birthday: Date) => void
}

export function Intro({ defaultNickname, defaultBirthday, onStart }: Props) {
  const [nickname, setNickname] = useState(defaultNickname)
  const [birthday, setBirthday] = useState<Date | undefined>(defaultBirthday)
  const [error, setError] = useState<"nickname" | "birthday" | null>(null)

  function submit(e: FormEvent) {
    e.preventDefault()
    const name = nickname.trim()
    if (!name) return setError("nickname")
    if (!birthday) return setError("birthday")
    setError(null)
    onStart(name, birthday)
  }

  return (
    <section className="text-center">
      <p className="eyebrow">✦ Celestial Oracle ✦</p>
      <h1 className="title-gold mb-3 font-serif text-[clamp(40px,11vw,60px)] font-black tracking-[0.08em]">
        星座占卜所
      </h1>
      <p className="mb-7 text-muted-foreground">
        回答幾個關於你的小問題，
        <br />
        讓星星為你揭曉專屬星座。
      </p>

      <Card className="text-left">
        <CardContent>
          <form className="grid gap-5" noValidate onSubmit={submit}>
            <div className="grid gap-2">
              <Label className="text-accent-foreground" htmlFor="nickname">
                你的暱稱
              </Label>
              <Input
                aria-invalid={error === "nickname" || undefined}
                className="h-11 text-base"
                id="nickname"
                maxLength={12}
                onChange={(e) => {
                  setNickname(e.target.value)
                  if (error === "nickname") setError(null)
                }}
                placeholder="例如：小星星"
                value={nickname}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-accent-foreground" htmlFor="birthday">
                你的生日
              </Label>
              <BirthdayPicker
                id="birthday"
                invalid={error === "birthday"}
                onChange={(d) => {
                  setBirthday(d)
                  if (d && error === "birthday") setError(null)
                }}
                value={birthday}
              />
            </div>
            <p className="-mt-2 min-h-5 text-sm text-destructive" role="alert">
              {error === "nickname" && "請輸入暱稱，讓星星知道怎麼稱呼你。"}
              {error === "birthday" && "請選擇你的生日。"}
            </p>
            <Button className="h-11 rounded-full text-base font-bold" size="lg" type="submit">
              開始占卜
              <ArrowRightIcon />
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="mt-4 text-xs text-muted-foreground/80">生日只在你的瀏覽器裡使用，不會上傳到任何地方。</p>
    </section>
  )
}
