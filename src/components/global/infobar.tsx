"use client"

import * as React from "react"
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface InfobarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "warning" | "success" | "error"
  message: string
  description?: string
  className?: string
  showIcon?: boolean
}

const variantStyles = {
  info: {
    container: "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900",
    text: "text-blue-800 dark:text-blue-200",
    icon: Info
  },
  warning: {
    container: "bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-900",
    text: "text-yellow-800 dark:text-yellow-200",
    icon: AlertCircle
  },
  success: {
    container: "bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-900",
    text: "text-green-800 dark:text-green-200",
    icon: CheckCircle2
  },
  error: {
    container: "bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900",
    text: "text-red-800 dark:text-red-200",
    icon: XCircle
  }
}

export function Infobar({
  variant = "info",
  message,
  description,
  className,
  showIcon = true,
  ...props
}: InfobarProps) {
  const styles = variantStyles[variant]
  const Icon = styles.icon

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4",
        styles.container,
        className
      )}
      role="alert"
      {...props}
    >
      {showIcon && (
        <Icon className={cn("h-5 w-5 mt-0.5", styles.text)} />
      )}
      <div className="flex-1">
        <p className={cn("text-sm font-medium", styles.text)}>
          {message}
        </p>
        {description && (
          <p className={cn("mt-1 text-sm opacity-90", styles.text)}>
            {description}
          </p>
        )}
      </div>
    </div>
  )
}