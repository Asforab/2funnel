# Plura - Plataforma de Gestão de Agências

## Introdução
Plura é uma plataforma completa para gestão de agências e subcontas, construída com Next.js 14, oferecendo recursos avançados de automação, pipeline e gerenciamento de equipes. O projeto utiliza tecnologias modernas como Clerk para autenticação, Prisma para banco de dados, e Tailwind CSS para estilização.

## Funcionalidades Principais

- Sistema completo de autenticação e gerenciamento de usuários com Clerk
- Gestão de agências e subcontas
- Sistema de automações e pipelines
- Gerenciamento de equipes e convites
- Interface responsiva e moderna com Tailwind CSS
- Proteção de rotas e middleware personalizado
- Sistema de notificações e preferências
- Testes unitários com Jest

## Tecnologias Utilizadas

- Next.js 14 (App Router)
- TypeScript
- Prisma
- Clerk Authentication
- Tailwind CSS
- Jest para testes
- Uploadthing para upload de arquivos
- Outros pacotes essenciais listados no package.json

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/Asforab/2funnel.git
```

2. Instale as dependências:
```bash
cd plura-next
npm install
```

3. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env`
- Configure as variáveis necessárias:
  - Chaves do Clerk
  - URL do banco de dados
  - Outras configurações específicas

4. Execute as migrações do Prisma:
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Estrutura do Projeto

```
plura-next/
├── src/
│   ├── app/                 # Rotas e páginas
│   ├── components/          # Componentes reutilizáveis
│   ├── lib/                 # Utilitários e configurações
│   └── providers/           # Providers da aplicação
├── prisma/                  # Schema e migrações
├── public/                  # Arquivos estáticos
└── tests/                   # Testes unitários
```

## Testes

Para executar os testes:
```bash
npm test
```

## Deploy

O projeto está configurado para deploy na Vercel. Configure as variáveis de ambiente necessárias no dashboard da Vercel antes do deploy.

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Suporte

Para suporte e dúvidas, por favor abra uma issue no GitHub.