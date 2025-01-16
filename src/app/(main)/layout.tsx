import { Sidebar } from "@/components/navigation"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar className="w-64 shrink-0" />
      <main className="flex-1 overflow-y-auto p-8 bg-muted/10">
        {children}
      </main>
    </div>
  )
}