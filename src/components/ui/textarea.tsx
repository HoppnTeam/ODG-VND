import * as React from "react"
import { cn } from "@/lib/utils"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-700 placeholder:font-medium transition-colors resize-vertical focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F15029] focus-visible:ring-opacity-50 focus-visible:border-[#F15029] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50 shadow-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

// Hoppn specific textarea variant with enhanced styling
const HoppnTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-base font-medium text-slate-900 placeholder:text-slate-700 placeholder:font-medium transition-all duration-200 resize-vertical focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 focus:border-[#F15029] focus:shadow-md hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50 shadow-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
HoppnTextarea.displayName = "HoppnTextarea"

export { Textarea, HoppnTextarea }