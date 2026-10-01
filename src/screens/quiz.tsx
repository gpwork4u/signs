import { useState } from "react"
import { ArrowLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { QUESTIONS } from "@/data/questions"
import { cn } from "@/lib/utils"

interface Props {
  onDone: () => void
}

export function Quiz({ onDone }: Props) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const q = QUESTIONS[index]

  function pick(i: number) {
    const next = [...answers]
    next[index] = i
    setAnswers(next)
    // 稍等一下讓選取狀態被看見再換題
    setTimeout(() => {
      if (index < QUESTIONS.length - 1) setIndex(index + 1)
      else onDone()
    }, 220)
  }

  return (
    <section className="text-center" key={index}>
      <Progress className="mb-7 h-1" value={(index / QUESTIONS.length) * 100} />
      <p className="eyebrow">
        第 {index + 1} / {QUESTIONS.length} 題
      </p>
      <h2 className="mb-7 font-serif text-[clamp(22px,6vw,28px)] leading-snug font-semibold">{q.text}</h2>

      <div className="mb-5 grid gap-3">
        {q.options.map((label, i) => (
          <Button
            className={cn(
              "h-auto justify-start gap-3.5 rounded-xl px-4 py-4 text-left text-base font-normal whitespace-normal",
              answers[index] === i && "border-primary bg-accent",
            )}
            key={label}
            onClick={() => pick(i)}
            variant="outline"
          >
            <span className="grid size-7 flex-none place-items-center rounded-full border border-border font-serif text-sm text-primary">
              {"ABCD"[i]}
            </span>
            {label}
          </Button>
        ))}
      </div>

      <Button
        className={cn("text-muted-foreground", index === 0 && "invisible")}
        onClick={() => setIndex(index - 1)}
        variant="ghost"
      >
        <ArrowLeftIcon />
        上一題
      </Button>
    </section>
  )
}
