import React from 'react'
import { getPipelines } from '@/lib/queries'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import PipelineForm from '@/components/forms/pipeline-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface PipelinesPageProps {
  params: {
    subaccountId: string
  }
}

const PipelinesPage = async ({ params }: PipelinesPageProps) => {
  const pipelines = await getPipelines(params.subaccountId)

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Funis de Conversão</h1>
        <Button
          className="flex items-center gap-2"
          data-modal="/subaccount/[subaccountId]/pipelines/modal"
        >
          <PlusCircle size={20} />
          Criar Funil
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pipelines.map((pipeline) => (
          <Card key={pipeline.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{pipeline.name}</CardTitle>
              <CardDescription>
                {pipeline.Lane.length} etapas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {pipeline.Lane.map((lane) => (
                  <div key={lane.id} className="flex justify-between items-center">
                    <span>{lane.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {lane.Tickets.length} leads
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default PipelinesPage