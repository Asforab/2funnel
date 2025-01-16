import {
  Contact,
  Lane,
  Notification,
  Prisma,
  Role,
  Tag,
  Ticket,
  User,
} from '@prisma/client'
import {
  getPipelineDetails,
  getTicketsWithTags,
  getPermissions,
} from './queries'
import { db } from './db'
import { z } from 'zod'

import Stripe from 'stripe'

export type NotificationWithUser = Notification & {
  User: {
    id: string
    name: string
    avatarUrl: string
    email: string
    createdAt: Date
    updatedAt: Date
    role: Role
    agencyId: string | null
  }
}

export type UserWithPermissionsAndSubAccounts = {
  id: string
  name: string
  email: string
  role: Role
  agencyId: string | null
  Permissions: {
    id: string
    access: boolean
    email: string
    subAccountId: string
    userId: string
  }[]
}

export const FunnelPageSchema = z.object({
  name: z.string().min(1),
  pathName: z.string().optional(),
})

export type CreateMediaType = {
  link: string
  name: string
  subAccountId: string
}

export type TicketAndTags = Ticket & {
  Tags: Tag[]
  Assigned: User | null
  Customer: Contact | null
}

export type LaneDetail = Lane & {
  Tickets: TicketAndTags[]
}

export const CreatePipelineFormSchema = z.object({
  name: z.string().min(1),
})

export const CreateFunnelFormSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  subDomainName: z.string().optional(),
  favicon: z.string().optional(),
})

export type PipelineDetailsWithLanesCardsTagsTickets = Prisma.PromiseReturnType<
  typeof getPipelineDetails
>

export const LaneFormSchema = z.object({
  name: z.string().min(1),
})

export type TicketWithTags = Prisma.PromiseReturnType<typeof getTicketsWithTags>

const currencyNumberRegex = /^\d+(\.\d{1,2})?$/

export const TicketFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  value: z.string().refine((value) => currencyNumberRegex.test(value), {
    message: 'Value must be a valid price.',
  }),
})

export type TicketDetails = Ticket & {
  Tags: Tag[]
  Assigned: User | null
  Customer: Contact | null
  Lane: Lane
}

export const ContactUserFormSchema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email(),
})

export type Address = {
  city: string
  country: string
  line1: string
  postal_code: string
  state: string
}

export type ShippingInfo = {
  address: Address
  name: string
}

export type StripeCustomerType = {
  email: string
  name: string
  shipping: ShippingInfo
  address: Address
}

export type PricesList = Stripe.ApiList<Stripe.Price>

export type FunnelsForSubAccount = {
  id: string
  name: string
  description: string
  subDomainName: string
  favicon: string
  subAccountId: string
  createdAt: Date
  updatedAt: Date
}

export type UpsertFunnelPage = {
  name: string
  pathName: string
  funnelId: string
  content: string
}