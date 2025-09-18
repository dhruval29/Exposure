import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"

function pad(value) {
  return String(value).padStart(2, "0")
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick date & time",
  className,
}) {
  const [open, setOpen] = React.useState(false)

  const date = value instanceof Date ? value : value ? new Date(value) : undefined
  const [tempDate, setTempDate] = React.useState(date ?? new Date())
  const [hour, setHour] = React.useState(date ? date.getHours() : 12)
  const [minute, setMinute] = React.useState(date ? date.getMinutes() : 0)

  React.useEffect(() => {
    if (date) {
      setTempDate(date)
      setHour(date.getHours())
      setMinute(date.getMinutes())
    }
  }, [value])

  function commit() {
    const next = new Date(tempDate)
    next.setHours(hour)
    next.setMinutes(minute)
    onChange?.(next)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-zinc-500",
            className
          )}
        >
          <CalendarIcon className="mr-1 h-4 w-4" />
          {date ? format(date, "PP p") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2">
          <Calendar
            mode="single"
            selected={tempDate}
            onSelect={(d) => d && setTempDate(d)}
            initialFocus
          />
          <div className="flex flex-col gap-2 p-2 min-w-[220px]">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-zinc-500" />
              <div className="flex items-center gap-2">
                <Input
                  aria-label="Hours"
                  className="w-16 text-center"
                  type="number"
                  min={0}
                  max={23}
                  value={pad(hour)}
                  onChange={(e) => {
                    const v = Math.max(0, Math.min(23, Number(e.target.value)))
                    setHour(isNaN(v) ? 0 : v)
                  }}
                />
                <span className="text-zinc-500">:</span>
                <Input
                  aria-label="Minutes"
                  className="w-16 text-center"
                  type="number"
                  min={0}
                  max={59}
                  value={pad(minute)}
                  onChange={(e) => {
                    const v = Math.max(0, Math.min(59, Number(e.target.value)))
                    setMinute(isNaN(v) ? 0 : v)
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={commit}>Apply</Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
