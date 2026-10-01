import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { zhTW } from "react-day-picker/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Props {
  id?: string
  value?: Date
  onChange: (date: Date | undefined) => void
  invalid?: boolean
}

function formatDate(d: Date) {
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`
}

// shadcn Date Picker：Popover + Calendar，年份與月份可用下拉選單快速切換，適合選生日
export function BirthdayPicker({ id, value, onChange, invalid }: Props) {
  const [open, setOpen] = useState(false)
  const today = new Date()

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-invalid={invalid || undefined}
          className={cn("h-11 w-full justify-between text-base font-normal", !value && "text-muted-foreground")}
          id={id}
          variant="outline"
        >
          {value ? formatDate(value) : "選擇你的生日"}
          <CalendarIcon className="text-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          autoFocus
          captionLayout="dropdown"
          className="[--cell-size:--spacing(9)]"
          defaultMonth={value ?? new Date(2000, 0)}
          disabled={{ after: today }}
          endMonth={today}
          formatters={{ formatYearDropdown: (d) => `${d.getFullYear()} 年` }}
          locale={zhTW}
          mode="single"
          onSelect={(d) => {
            onChange(d)
            if (d) setOpen(false)
          }}
          selected={value}
          startMonth={new Date(1920, 0)}
        />
      </PopoverContent>
    </Popover>
  )
}
