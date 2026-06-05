"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps
  extends React.ComponentProps<
    typeof ProgressPrimitive.Root
  > {
  showValue?: boolean
}

function Progress({
  className,
  value = 0,
  showValue = false,
  ...props
}: ProgressProps) {
  return (
    <div className="w-full">
      <ProgressPrimitive.Root
        data-slot="progress"
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-full bg-gray-200",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={cn(
            "h-full w-full flex-1 rounded-full",
            "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500",
            "transition-all duration-500 ease-in-out"
          )}
          style={{
            transform: `translateX(-${
              100 - Number(value || 0)
            }%)`,
          }}
        />
      </ProgressPrimitive.Root>

      {showValue && (
        <div className="mt-2 flex justify-end">
          <span className="text-xs font-medium text-gray-600">
            {value}%
          </span>
        </div>
      )}
    </div>
  )
}

export { Progress }