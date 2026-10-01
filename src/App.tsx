import { useCallback, useState } from "react"

import { StarSky } from "@/components/star-sky"
import { Toaster } from "@/components/ui/sonner"
import { signFromDate } from "@/data/signs"
import { Intro } from "@/screens/intro"
import { Loading } from "@/screens/loading"
import { Quiz } from "@/screens/quiz"
import { Result } from "@/screens/result"

type Screen = "intro" | "quiz" | "loading" | "result"

export default function App() {
  const [screen, setScreen] = useState<Screen>("intro")
  const [nickname, setNickname] = useState("")
  const [birthday, setBirthday] = useState<Date>()

  const go = useCallback((s: Screen) => {
    setScreen(s)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])
  const toResult = useCallback(() => go("result"), [go])

  return (
    <>
      <StarSky />
      <main className="relative mx-auto max-w-[560px] px-4 pt-12 pb-16">
        <div className="screen-in" key={screen}>
          {screen === "intro" && (
            <Intro
              defaultBirthday={birthday}
              defaultNickname={nickname}
              onStart={(name, date) => {
                setNickname(name)
                setBirthday(date)
                go("quiz")
              }}
            />
          )}
          {screen === "quiz" && <Quiz onDone={() => go("loading")} />}
          {screen === "loading" && <Loading onDone={toResult} />}
          {screen === "result" && birthday && (
            <Result nickname={nickname} onRestart={() => go("intro")} sign={signFromDate(birthday)} />
          )}
        </div>
      </main>
      <Toaster position="top-center" theme="dark" />
    </>
  )
}
