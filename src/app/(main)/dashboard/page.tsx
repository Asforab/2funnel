import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import CircleProgress from "@/components/global/circle-progress"
import { AreaChart } from "@tremor/react"
import { Contact2, DollarSign, Goal, ShoppingCart } from "lucide-react"

export default async function DashboardPage() {
  // TODO: Implementar integração com Stripe e banco de dados
  const mockData = {
    currency: "BRL",
    net: 15000,
    potentialIncome: 25000,
    subaccounts: 5,
    goal: 10,
    closingRate: 65,
    sessions: 100,
    totalClosedSessions: 65,
    transactions: [
      { created: "2024-01-01", amount_total: 1000 },
      { created: "2024-01-15", amount_total: 2000 },
      { created: "2024-02-01", amount_total: 3000 },
      { created: "2024-02-15", amount_total: 4000 },
      { created: "2024-03-01", amount_total: 5000 },
    ]
  }

  return (
    <div className="relative h-full">
      <h1 className="text-4xl">Dashboard</h1>
      <Separator className="my-6" />
      <div className="flex flex-col gap-4 pb-6">
        <div className="flex gap-4 flex-col xl:!flex-row">
          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Receita</CardDescription>
              <CardTitle className="text-4xl">
                {mockData.net ? `${mockData.currency} ${mockData.net.toFixed(2)}` : `R$ 0,00`}
              </CardTitle>
              <small className="text-xs text-muted-foreground">
                Para o ano {new Date().getFullYear()}
              </small>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Receita total gerada conforme refletido no seu dashboard do Stripe.
            </CardContent>
            <DollarSign className="absolute right-4 top-4 text-muted-foreground" />
          </Card>

          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Receita Potencial</CardDescription>
              <CardTitle className="text-4xl">
                {mockData.potentialIncome
                  ? `${mockData.currency} ${mockData.potentialIncome.toFixed(2)}`
                  : `R$ 0,00`}
              </CardTitle>
              <small className="text-xs text-muted-foreground">
                Para o ano {new Date().getFullYear()}
              </small>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Este é o quanto você pode fechar.
            </CardContent>
            <DollarSign className="absolute right-4 top-4 text-muted-foreground" />
          </Card>

          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Clientes Ativos</CardDescription>
              <CardTitle className="text-4xl">{mockData.subaccounts}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Reflete o número de subcontas que você possui e gerencia.
            </CardContent>
            <Contact2 className="absolute right-4 top-4 text-muted-foreground" />
          </Card>

          <Card className="flex-1 relative">
            <CardHeader>
              <CardTitle>Meta da Agência</CardTitle>
              <CardDescription>
                <p className="mt-2">
                  Reflete o número de subcontas que você deseja possuir e gerenciar.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    Atual: {mockData.subaccounts}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    Meta: {mockData.goal}
                  </span>
                </div>
                <Progress
                  value={(mockData.subaccounts / mockData.goal) * 100}
                />
              </div>
            </CardContent>
            <Goal className="absolute right-4 top-4 text-muted-foreground" />
          </Card>
        </div>

        <div className="flex gap-4 xl:!flex-row flex-col">
          <Card className="p-4 flex-1">
            <CardHeader>
              <CardTitle>Histórico de Transações</CardTitle>
            </CardHeader>
            <AreaChart
              className="text-sm stroke-primary"
              data={mockData.transactions}
              index="created"
              categories={["amount_total"]}
              colors={["primary"]}
              yAxisWidth={30}
              showAnimation={true}
            />
          </Card>

          <Card className="xl:w-[400px] w-full">
            <CardHeader>
              <CardTitle>Conversões</CardTitle>
            </CardHeader>
            <CardContent>
              <CircleProgress
                value={mockData.closingRate}
                description={
                  <>
                    <div className="flex flex-col">
                      Abandonados
                      <div className="flex gap-2">
                        <ShoppingCart className="text-rose-700" />
                        {mockData.sessions}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      Carrinhos Ganhos
                      <div className="flex gap-2">
                        <ShoppingCart className="text-emerald-700" />
                        {mockData.totalClosedSessions}
                      </div>
                    </div>
                  </>
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}