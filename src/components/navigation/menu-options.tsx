'use client'

import * as React from 'react'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { Menu } from 'lucide-react'
import clsx from 'clsx'
import { AspectRatio } from '../ui/aspect-ratio'
import Image from 'next/image'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
import Link from 'next/link'
import { Separator } from '../ui/separator'
import { icons } from '@/lib/constants'
import { LucideIcon } from 'lucide-react'

interface IconType {
  value: string
  label: string
  path: LucideIcon
}

export interface MenuOptionsProps {
  defaultOpen?: boolean
  sidebarLogo: string
}

const MenuOptions = ({
  sidebarLogo,
  defaultOpen,
}: MenuOptionsProps) => {
  const [isMounted, setIsMounted] = React.useState(false)

  const openState = React.useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  )

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <Sheet
      modal={false}
      {...openState}
    >
      <SheetTrigger
        asChild
        className="absolute left-4 top-4 z-[100] md:!hidden flex"
      >
        <Button
          variant="outline"
          size="icon"
        >
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent
        showX={!defaultOpen}
        side="left"
        className={clsx(
          'bg-background/80 backdrop-blur-xl fixed top-0 border-r-[1px] p-6',
          {
            'hidden md:inline-block z-0 w-[300px]': defaultOpen,
            'inline-block md:hidden z-[100] w-full': !defaultOpen,
          }
        )}
      >
        <div>
          <AspectRatio ratio={16 / 5}>
            <Image
              src={sidebarLogo}
              alt="Sidebar Logo"
              fill
              className="rounded-md object-contain"
            />
          </AspectRatio>
          
          <p className="text-muted-foreground text-xs mb-2 mt-4">MENU LINKS</p>
          <Separator className="mb-4" />
          <nav className="relative">
            <Command className="rounded-lg overflow-visible bg-transparent">
              <CommandInput placeholder="Search..." />
              <CommandList className="py-4 overflow-visible">
                <CommandEmpty>No Results Found</CommandEmpty>
                <CommandGroup className="overflow-visible">
                  {icons.map((icon: IconType) => {
                    return (
                      <CommandItem
                        key={icon.value}
                        className="md:w-[320px] w-full"
                      >
                        <Link
                          href={`/${icon.value}`}
                          className="flex items-center gap-2 hover:bg-transparent rounded-md transition-all md:w-full w-[320px]"
                        >
                          <icon.path className="h-4 w-4" />
                          <span>{icon.label}</span>
                        </Link>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MenuOptions