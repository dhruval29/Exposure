import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

import "react-day-picker/dist/style.css"

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 [&_.rdp-button]:!text-gray-600 [&_.rdp-button]:hover:!text-gray-800 [&_.rdp-day_selected]:!text-gray-800 [&_.rdp-caption_label]:!text-gray-700", className)}
      style={{ fontFamily: "'PP Editorial New', serif" }}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-gray-700",
        nav: "space-x-1 flex items-center",
        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-gray-600 hover:text-gray-800",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-200 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
        day_selected: "bg-gray-300 text-gray-800 hover:bg-gray-400 hover:text-gray-900 focus:bg-gray-400 focus:text-gray-900 !text-gray-800",
        day_today: "bg-gray-200 text-gray-800",
        day_outside: "text-zinc-400 opacity-50",
        day_disabled: "text-zinc-400 opacity-50",
        day_range_middle: "aria-selected:bg-gray-200 aria-selected:text-gray-800",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
