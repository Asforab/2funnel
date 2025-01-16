"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

import { cn } from "@/lib/utils"

interface NavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: {
    title: string
    href: string
  }[]
  hideBreadcrumbs?: boolean
}

export function Navigation({
  items,
  hideBreadcrumbs = false,
  className,
  ...props
}: NavigationProps) {
  const pathname = usePathname()

  const breadcrumbItems = React.useMemo(() => {
    if (items) return items

    return pathname
      .split("/")
      .filter(Boolean)
      .map((segment, index, array) => ({
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: `/${array.slice(0, index + 1).join("/")}`,
      }))
  }, [items, pathname])

  return (
    <div className={cn("flex flex-col space-y-4", className)} {...props}>
      {!hideBreadcrumbs && (
        <nav aria-label="Breadcrumbs" className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Link
            href="/dashboard"
            className="flex items-center hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.href}>
              <ChevronRight className="h-4 w-4" />
              <Link
                href={item.href}
                className={cn(
                  "hover:text-foreground",
                  pathname === item.href
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                {item.title}
              </Link>
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {breadcrumbItems[breadcrumbItems.length - 1]?.title || "Dashboard"}
        </h1>
      </div>
    </div>
  )
}

// Exemplo de uso com items personalizados:
export function CustomNavigation() {
  return (
    <Navigation
      items={[
        { title: "Agência", href: "/agency" },
        { title: "Configurações", href: "/agency/settings" },
      ]}
    />
  )
}