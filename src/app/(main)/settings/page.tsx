"use client"

import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Bell,
  Settings as SettingsIcon,
  Shield,
  CreditCard
} from "lucide-react"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { PreferencesSettings } from "@/components/settings/preferences-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { BillingSettings } from "@/components/settings/billing-settings"

const sections = [
  {
    id: "profile",
    label: "Perfil",
    icon: User,
    description: "Gerencie suas informações pessoais e preferências"
  },
  {
    id: "notifications",
    label: "Notificações",
    icon: Bell,
    description: "Configure como você recebe notificações"
  },
  {
    id: "preferences",
    label: "Preferências",
    icon: SettingsIcon,
    description: "Personalize sua experiência no sistema"
  },
  {
    id: "security",
    label: "Segurança",
    icon: Shield,
    description: "Gerencie suas configurações de segurança"
  },
  {
    id: "billing",
    label: "Faturamento",
    icon: CreditCard,
    description: "Gerencie suas informações de pagamento e assinatura"
  }
]

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie suas configurações e preferências.
        </p>
      </div>
      <Separator />
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          {sections.map((section) => (
            <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
              <section.icon className="h-4 w-4" />
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {sections.map((section) => (
          <TabsContent key={section.id} value={section.id}>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">{section.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </div>
              <Separator />
              {section.id === "profile" && <ProfileSettings />}
              {section.id === "notifications" && <NotificationSettings />}
              {section.id === "preferences" && <PreferencesSettings />}
              {section.id === "security" && <SecuritySettings />}
              {section.id === "billing" && <BillingSettings />}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}