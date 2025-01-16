import React from 'react'
import { getAutomations } from '@/lib/queries'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AutomationsPageProps {
  params: {
    subaccountId: string
  }
}

const AutomationsPage = async ({ params }: AutomationsPageProps) => {
  const automations = await getAutomations(params.subaccountId)

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Automações</h1>
        <Button
          className="flex items-center gap-2"
          data-modal="/subaccount/[subaccountId]/automations/modal"
        >
          <PlusCircle size={20} />
          Criar Automação
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {automations.map((automation) => (
          <Card key={automation.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{automation.name}</CardTitle>
              <CardDescription>
                {automation.published ? 'Publicado' : 'Rascunho'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span>Gatilho:</span>
                  <span className="text-sm text-muted-foreground">
                    {automation.Trigger?.name || 'Sem gatilho'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ações:</span>
                  <span className="text-sm text-muted-foreground">
                    {automation.Action.length} ações
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Instâncias:</span>
                  <span className="text-sm text-muted-foreground">
                    {automation.AutomationInstance.filter(i => i.active).length} ativas
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AutomationsPage