"use client"

import * as React from "react"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/global"
import MenuOptions from "./menu-options"

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({
  className,
  ...props
}: SidebarProps) {
  return (
    <div
      className={cn(
        "flex h-screen flex-col justify-between border-r bg-background",
        className
      )}
      {...props}
    >
      <MenuOptions 
        defaultOpen={true}
        sidebarLogo="/assets/logo.png"
      />
      
      <div className="border-t p-2">
        <div className="flex items-center justify-between gap-2">
          <ModeToggle />
          <button
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
            onClick={() => {/* Implementar logout */}}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}