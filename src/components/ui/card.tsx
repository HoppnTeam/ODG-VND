import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border-2 border-slate-200 bg-white text-slate-900 shadow-lg hover:shadow-xl transition-shadow duration-200",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-6 pb-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-bold leading-tight tracking-tight text-slate-900",
      className
    )}
    style={{ fontFamily: 'Montserrat, sans-serif' }}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-600 font-medium leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-2", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-4 border-t border-slate-100", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Hoppn specific card variants
const HoppnCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("hoppn-card", className)}
    {...props}
  />
))
HoppnCard.displayName = "HoppnCard"

const HoppnCardElevated = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("hoppn-card hoppn-card-elevated", className)}
    {...props}
  />
))
HoppnCardElevated.displayName = "HoppnCardElevated"

const MetricCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string
    value: string | number
    trend?: string
    icon?: React.ReactNode
    variant?: 'default' | 'primary'
  }
>(({ className, title, value, trend, icon, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border-2 p-6 shadow-lg hover:shadow-xl transition-all duration-200",
      variant === 'primary' 
        ? "bg-gradient-to-br from-[#F15029] to-[#E04420] text-white border-[#F15029]" 
        : "bg-white border-slate-200 hover:border-slate-300",
      className
    )}
    {...props}
  >
    <div className="flex items-center justify-between mb-3">
      <span className={cn(
        "text-sm font-semibold",
        variant === 'primary' ? "text-white/90" : "text-slate-600"
      )}>
        {title}
      </span>
      {icon && (
        <div className={cn(
          "w-6 h-6",
          variant === 'primary' ? "text-white" : "text-[#F15029]"
        )}>
          {icon}
        </div>
      )}
    </div>
    <div className={cn(
      "text-3xl font-bold mb-2",
      variant === 'primary' ? "text-white" : "text-slate-900"
    )}
    style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {value}
    </div>
    {trend && (
      <div className={cn(
        "text-sm font-semibold",
        variant === 'primary' ? "text-white/90" : "text-slate-600"
      )}>
        {trend}
      </div>
    )}
  </div>
))
MetricCard.displayName = "MetricCard"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  HoppnCard,
  HoppnCardElevated,
  MetricCard
}