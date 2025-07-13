import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
      </div>
    )
  }
)
Select.displayName = "Select"

// Hoppn specific select variant
const HoppnSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-12 w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-base font-medium text-slate-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F15029] focus:ring-opacity-50 focus:border-[#F15029] focus:shadow-md hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50 shadow-sm appearance-none pr-10",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-slate-700 pointer-events-none" />
      </div>
    )
  }
)
HoppnSelect.displayName = "HoppnSelect"

export { Select, HoppnSelect }