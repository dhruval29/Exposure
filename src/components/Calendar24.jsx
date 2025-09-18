import * as React from "react"
import { ChevronDown as ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function Calendar24({ value, onChange }) {
  const [open, setOpen] = React.useState(false)
  const [isAnimating, setIsAnimating] = React.useState(false)
  const [date, setDate] = React.useState(value instanceof Date ? value : value ? new Date(value) : undefined)
  const [hours, setHours] = React.useState(0)
  const [minutes, setMinutes] = React.useState(0)

  React.useEffect(() => {
    if (value) {
      const d = value instanceof Date ? value : new Date(value)
      if (!isNaN(d)) {
        setDate(d)
        setHours(d.getHours())
        setMinutes(d.getMinutes())
      }
    }
  }, [value])

  function commit(nextDate, h = hours, m = minutes) {
    const d = nextDate ?? date
    if (!d) return
    const out = new Date(d)
    out.setHours(Number(h) || 0)
    out.setMinutes(Number(m) || 0)
    out.setSeconds(0)
    onChange?.(out)
  }

  const handleOpenChange = (newOpen) => {
    if (newOpen) {
      setIsAnimating(true)
      setOpen(true)
      // Reset animation state after animation completes
      setTimeout(() => setIsAnimating(false), 300)
    } else {
      setIsAnimating(true)
      // Start closing animation
      setTimeout(() => {
        setOpen(false)
        setIsAnimating(false)
      }, 200)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-w-[10rem] justify-between font-normal focus:outline-none focus-visible:outline-none focus-visible:ring-0 hover:border-transparent hover:shadow-none data-[state=open]:border-transparent data-[state=open]:shadow-none transition-transform duration-200 ease-out hover:scale-[1.01] active:scale-[0.99]" style={{ fontFamily: "'PP Editorial New', serif" }}>
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0 border border-white/50 shadow-2xl rounded-xl backdrop-blur-3xl bg-white/40 z-[100] outline-none"
          align="start"
          side="top"
          sideOffset={8}
          avoidCollisions={false}
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(80px) saturate(200%)',
            WebkitBackdropFilter: 'blur(80px) saturate(200%)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.15)',
            animation: open ? 'slideInFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'slideOutFade 0.4s cubic-bezier(0.4, 0, 1, 1) forwards',
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Semi-opaque white background layer */}
          <div 
            className="absolute inset-0 rounded-xl"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(80px)',
              WebkitBackdropFilter: 'blur(80px)'
            }}
          />
          <div 
            className="relative rounded-xl backdrop-blur-3xl bg-white/15" 
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(80px) saturate(200%)',
              WebkitBackdropFilter: 'blur(80px) saturate(200%)'
            }}
          >
            <Calendar
              className="bg-transparent p-3 text-black"
              mode="single"
              selected={date}
              captionLayout="dropdown"
              style={{ fontFamily: "'PP Editorial New', serif" }}
              onSelect={(d) => {
                setDate(d)
                setOpen(false)
                commit(d)
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
