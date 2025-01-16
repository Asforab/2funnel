'use client'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Loading from '@/components/global/loading'
import { saveActivityLogsNotification, upsertAutomation, upsertAction, getTriggers } from '@/lib/queries'
import { v4 } from 'uuid'
import { toast } from '@/components/ui/use-toast'
import { useModal } from '@/providers/modal-provider'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Trigger } from '@prisma/client'
import { PlusCircle, Trash2 } from 'lucide-react'

const AutomationFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  triggerId: z.string().optional(),
  published: z.boolean().default(false),
  actions: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['CREATE_CONTACT']),
    laneId: z.string().optional(),
  })),
})

interface AutomationFormProps {
  defaultData?: {
    id: string
    name: string
    triggerId?: string
    published: boolean
    Action: {
      id: string
      name: string
      type: 'CREATE_CONTACT'
      laneId?: string
    }[]
  }
  subAccountId: string
}

const AutomationForm: React.FC<AutomationFormProps> = ({
  defaultData,
  subAccountId,
}) => {
  const { setClose } = useModal()
  const router = useRouter()
  const [triggers, setTriggers] = useState<Trigger[]>([])
  const [loading, setLoading] = useState(true)

  const form = useForm<z.infer<typeof AutomationFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(AutomationFormSchema),
    defaultValues: {
      name: defaultData?.name || '',
      triggerId: defaultData?.triggerId,
      published: defaultData?.published || false,
      actions: defaultData?.Action || [],
    },
  })

  useEffect(() => {
    const fetchTriggers = async () => {
      try {
        const response = await getTriggers(subAccountId)
        setTriggers(response)
      } catch (error) {
        console.error('Error fetching triggers:', error)
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível carregar os gatilhos',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTriggers()
  }, [subAccountId])

  const addAction = () => {
    const currentActions = form.getValues('actions')
    form.setValue('actions', [
      ...currentActions,
      {
        id: v4(),
        name: 'Nova Ação',
        type: 'CREATE_CONTACT',
        laneId: '0',
      },
    ])
  }

  const removeAction = (index: number) => {
    const currentActions = form.getValues('actions')
    form.setValue('actions', currentActions.filter((_, i) => i !== index))
  }

  const onSubmit = async (values: z.infer<typeof AutomationFormSchema>) => {
    try {
      const automationId = defaultData?.id || v4()
      
      const automation = await upsertAutomation({
        id: automationId,
        name: values.name,
        triggerId: values.triggerId,
        published: values.published,
        subAccountId,
      })

      if (automation) {
        // Criar/atualizar ações
        const actionPromises = values.actions.map((action, index) =>
          upsertAction({
            id: action.id,
            name: action.name,
            type: action.type,
            order: index,
            automationId: automation.id,
            laneId: action.laneId || '0',
          })
        )

        await Promise.all(actionPromises)

        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Atualizada automação | ${automation.name}`,
          subaccountId: subAccountId,
        })

        toast({
          title: 'Sucesso',
          description: 'Automação salva com sucesso',
        })

        router.refresh()
      }
    } catch (error) {
      console.error('Error saving automation:', error)
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível salvar a automação',
      })
    }

    setClose()
  }

  if (loading) {
    return <Loading />
  }

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Detalhes da Automação</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Automação</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="triggerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gatilho</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um gatilho" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {triggers.map((trigger) => (
                        <SelectItem key={trigger.id} value={trigger.id}>
                          {trigger.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Ações</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAction}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adicionar Ação
                </Button>
              </div>

              {form.watch('actions').map((action, index) => (
                <div key={action.id} className="flex gap-4 items-start">
                  <FormField
                    control={form.control}
                    name={`actions.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Nome da ação"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeAction(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Publicar Automação</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              className="w-20 mt-4"
              disabled={form.formState.isSubmitting}
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

export default AutomationForm