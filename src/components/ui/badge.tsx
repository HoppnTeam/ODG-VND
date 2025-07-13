import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "hoppn-badge hoppn-badge-success",
        warning: "hoppn-badge hoppn-badge-warning",
        error: "hoppn-badge hoppn-badge-error",
        info: "hoppn-badge hoppn-badge-info",
        pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
        confirmed: "bg-blue-100 text-blue-800 border-blue-200",
        preparing: "bg-orange-100 text-orange-800 border-orange-200",
        ready: "bg-green-100 text-green-800 border-green-200",
        picked_up: "bg-gray-100 text-gray-800 border-gray-200",
        cancelled: "bg-red-100 text-red-800 border-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

// Status badge component
interface StatusBadgeProps extends BadgeProps {
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'cancelled'
}

function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const statusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    ready: 'Ready',
    picked_up: 'Picked Up',
    cancelled: 'Cancelled',
  }

  return (
    <Badge
      variant={status}
      className={className}
      {...props}
    >
      {statusLabels[status]}
    </Badge>
  )
}

// Cuisine badge component
interface CuisineTagProps extends BadgeProps {
  cuisine: 'west_african' | 'east_african' | 'north_african' | 'south_african' | 'central_african'
}

function CuisineTag({ cuisine, className, ...props }: CuisineTagProps) {
  const cuisineLabels = {
    west_african: 'West African',
    east_african: 'East African',
    north_african: 'North African',
    south_african: 'South African',
    central_african: 'Central African',
  }

  const cuisineColors = {
    west_african: 'bg-orange-100 text-orange-800 border-orange-200',
    east_african: 'bg-blue-100 text-blue-800 border-blue-200',
    north_african: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    south_african: 'bg-green-100 text-green-800 border-green-200',
    central_african: 'bg-purple-100 text-purple-800 border-purple-200',
  }

  return (
    <Badge
      className={cn(cuisineColors[cuisine], className)}
      {...props}
    >
      {cuisineLabels[cuisine]}
    </Badge>
  )
}

// Spice level component
interface SpiceLevelProps {
  level: number
  className?: string
}

function SpiceLevel({ level, className }: SpiceLevelProps) {
  const spiceColors = {
    1: 'text-green-600',
    2: 'text-yellow-600',
    3: 'text-orange-600',
    4: 'text-red-600',
    5: 'text-red-700',
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn(
            "text-sm",
            i <= level ? spiceColors[level as keyof typeof spiceColors] : 'text-gray-300'
          )}
        >
          🌶️
        </span>
      ))}
    </div>
  )
}

export { Badge, badgeVariants, StatusBadge, CuisineTag, SpiceLevel }