import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-semibold leading-none text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    />
  )
)
Label.displayName = "Label"

// Hoppn specific label variant with enhanced styling
const HoppnLabel = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "block text-sm font-semibold text-slate-700 mb-2 leading-relaxed",
        className
      )}
      {...props}
    />
  )
)
HoppnLabel.displayName = "HoppnLabel"

export { Label, HoppnLabel }