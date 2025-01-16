'use client'
import React from 'react'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Loading from '@/components/global/loading'
import { CreatePipelineFormSchema } from '@/lib/types'
import { saveActivityLogsNotification, upsertLane, upsertPipeline } from '@/lib/queries'
import { v4 } from 'uuid'
import { toast } from '@/components/ui/use-toast'
import { useModal } from '@/providers/modal-provider'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

interface CreatePipelineProps {
  defaultData?: {
    id: string
    name: string
  }
  subAccountId: string
}

const defaultStages = [
  'Lead',
  'Contato Realizado',
  'Proposta Enviada',
  'Em Negociação',
  'Fechado'
]

const PipelineForm: React.FC<CreatePipelineProps> = ({
  defaultData,
  subAccountId,
}) => {
  const { setClose } = useModal()
  const router = useRouter()
  const form = useForm<z.infer<typeof CreatePipelineFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(CreatePipelineFormSchema),
    defaultValues: {
      name: defaultData?.name || '',
    },
  })

  const isLoading = form.formState.isLoading

  const onSubmit = async (values: z.infer<typeof CreatePipelineFormSchema>) => {
    if (!subAccountId) return

    const pipelineId = defaultData?.id || v4()
    
    const pipeline = await upsertPipeline({
      id: pipelineId,
      name: values.name,
      subAccountId,
    })

    if (pipeline) {
      //Criar lanes padrão se for um novo pipeline
      if (!defaultData?.id) {
        const lanePromises = defaultStages.map((stage, index) =>
          upsertLane({
            id: v4(),
            name: stage,
            order: index,
            pipelineId: pipeline.id,
          })
        )

        await Promise.all(lanePromises)
      }

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Atualizado pipeline | ${pipeline.name}`,
        subaccountId: subAccountId,
      })

      toast({
        title: 'Sucesso',
        description: 'Pipeline salvo com sucesso',
      })

      router.refresh()
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível salvar o pipeline',
      })
    }
    
    setClose()
  }

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Detalhes do Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Pipeline</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className="w-20 mt-4"
              disabled={isLoading}
              type="submit"
            >
              {form.formState.isSubmitting ? <Loading /> : 'Salvar'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default PipelineForm