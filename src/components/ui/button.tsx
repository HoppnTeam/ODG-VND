import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-950",
        destructive: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",
        outline: "border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-950",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-950",
        ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-950",
        link: "text-slate-900 underline-offset-4 hover:underline focus-visible:ring-slate-950",
        hoppn: "bg-[#F15029] text-white font-semibold hover:bg-[#E04420] focus-visible:ring-[#F15029] focus-visible:ring-opacity-50 shadow-md",
        hoppnSecondary: "bg-[#4C8BF5] text-white font-semibold hover:bg-[#3B7CE8] focus-visible:ring-[#4C8BF5] focus-visible:ring-opacity-50 shadow-md",
        hoppnOutline: "border-2 border-[#F15029] bg-white text-[#F15029] font-semibold hover:bg-[#F15029] hover:text-white focus-visible:ring-[#F15029] focus-visible:ring-opacity-50",
        hoppnGhost: "text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-950"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        hoppn: "h-11 px-6 py-3"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild) {
      return (
        <span className={cn(buttonVariants({ variant, size, className }))} {...props} />
      )
    }
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }