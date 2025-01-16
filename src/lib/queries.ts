import { db } from '@/lib/db'
import { Agency, User, SubAccount, Permissions, Tag, Pipeline, Lane, Ticket, Notification, Prisma } from '@prisma/client'
import { v4 } from 'uuid'

// Agency Queries
export async function getAgencyDetails(agencyId: string) {
  const agency = await db.agency.findUnique({
    where: {
      id: agencyId,
    },
    include: {
      users: true,
      SubAccount: true,
    },
  })
  return agency
}

export async function createAgency(data: Partial<Agency>, userId: string) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!user) throw new Error('User not found')

  const agency = await db.agency.create({
    data: {
      name: data.name || 'Agency',
      agencyLogo: data.agencyLogo || '',
      companyEmail: data.companyEmail || user.email,
      companyPhone: data.companyPhone || '',
      whiteLabel: data.whiteLabel || true,
      address: data.address || '',
      city: data.city || '',
      zipCode: data.zipCode || '',
      state: data.state || '',
      country: data.country || '',
      users: {
        connect: {
          id: userId,
        },
      },
    },
  })

  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      role: 'AGENCY_OWNER',
      agencyId: agency.id,
    },
  })

  return agency
}

export async function updateAgency(agencyId: string, data: Partial<Agency>) {
  const agency = await db.agency.update({
    where: {
      id: agencyId,
    },
    data: {
      name: data.name,
      agencyLogo: data.agencyLogo,
      companyEmail: data.companyEmail,
      companyPhone: data.companyPhone,
      whiteLabel: data.whiteLabel,
      address: data.address,
      city: data.city,
      zipCode: data.zipCode,
      state: data.state,
      country: data.country,
    },
  })

  return agency
}

export async function deleteAgency(agencyId: string) {
  const agency = await db.agency.delete({
    where: {
      id: agencyId,
    },
  })
  return agency
}

// User Queries
export async function getUser(userId: string) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      Agency: true,
      Permissions: {
        include: {
          SubAccount: true,
        },
      },
    },
  })
  return user
}

export async function updateUser(userId: string, data: Partial<User>) {
  const user = await db.user.update({
    where: {
      id: userId,
    },
    data,
  })
  return user
}

// SubAccount Queries
export async function getSubAccountDetails(subaccountId: string) {
  const subaccount = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
    include: {
      Agency: true,
      Permissions: {
        include: {
          User: true,
        },
      },
    },
  })
  return subaccount
}

export async function createSubAccount(data: Partial<SubAccount> & { agencyId: string }) {
  const subaccount = await db.subAccount.create({
    data: {
      name: data.name || 'Subaccount',
      subAccountLogo: data.subAccountLogo || '',
      companyEmail: data.companyEmail || '',
      companyPhone: data.companyPhone || '',
      address: data.address || '',
      city: data.city || '',
      zipCode: data.zipCode || '',
      state: data.state || '',
      country: data.country || '',
      Agency: {
        connect: {
          id: data.agencyId,
        },
      },
    },
  })
  return subaccount
}

export async function updateSubAccount(subaccountId: string, data: Partial<SubAccount>) {
  const subaccount = await db.subAccount.update({
    where: {
      id: subaccountId,
    },
    data: {
      name: data.name,
      subAccountLogo: data.subAccountLogo,
      companyEmail: data.companyEmail,
      companyPhone: data.companyPhone,
      address: data.address,
      city: data.city,
      zipCode: data.zipCode,
      state: data.state,
      country: data.country,
    },
  })
  return subaccount
}

export async function deleteSubAccount(subaccountId: string) {
  const subaccount = await db.subAccount.delete({
    where: {
      id: subaccountId,
    },
  })
  return subaccount
}

// Pipeline Queries
export async function getPipelines(subAccountId: string) {
  const pipelines = await db.pipeline.findMany({
    where: {
      subAccountId,
    },
    include: {
      Lane: {
        include: {
          Tickets: {
            include: {
              Tags: true,
              Assigned: true,
            },
          },
        },
      },
    },
  })
  return pipelines
}

export async function getPipelineDetails(pipelineId: string) {
  const response = await db.pipeline.findUnique({
    where: {
      id: pipelineId,
    },
  })
  return response
}

export async function upsertPipeline(pipeline: Prisma.PipelineUncheckedCreateInput) {
  const response = await db.pipeline.upsert({
    where: { id: pipeline.id || v4() },
    update: pipeline,
    create: pipeline,
  })

  return response
}

export async function deletePipeline(pipelineId: string) {
  const pipeline = await db.pipeline.delete({
    where: { id: pipelineId },
  })
  return pipeline
}

// Lane Queries
export async function getLanesWithTicketAndTags(pipelineId: string) {
  const response = await db.lane.findMany({
    where: {
      pipelineId,
    },
    orderBy: { order: 'asc' },
    include: {
      Tickets: {
        orderBy: {
          order: 'asc',
        },
        include: {
          Tags: true,
          Assigned: true,
        },
      },
    },
  })
  return response
}

export async function upsertLane(lane: Prisma.LaneUncheckedCreateInput) {
  let order: number

  if (!lane.order) {
    const lanes = await db.lane.findMany({
      where: {
        pipelineId: lane.pipelineId,
      },
    })

    order = lanes.length
  } else {
    order = lane.order
  }

  const response = await db.lane.upsert({
    where: { id: lane.id || v4() },
    update: lane,
    create: { ...lane, order },
  })

  return response
}

export async function updateLanesOrder(lanes: Lane[]) {
  try {
    const updateTrans = lanes.map((lane) =>
      db.lane.update({
        where: {
          id: lane.id,
        },
        data: {
          order: lane.order,
        },
      })
    )

    await db.$transaction(updateTrans)
  } catch (error) {
    console.log(error, 'ERROR UPDATE LANES ORDER')
  }
}

export async function deleteLane(laneId: string) {
  const lane = await db.lane.delete({
    where: { id: laneId },
  })
  return lane
}

// Ticket Queries
export async function getTicketsWithTags(pipelineId: string) {
  const response = await db.ticket.findMany({
    where: {
      Lane: {
        pipelineId,
      },
    },
    include: { Tags: true, Assigned: true },
  })
  return response
}

export async function upsertTicket(
  ticket: Prisma.TicketUncheckedCreateInput,
  tags: Tag[]
) {
  let order: number
  if (!ticket.order) {
    const tickets = await db.ticket.findMany({
      where: { laneId: ticket.laneId },
    })
    order = tickets.length
  } else {
    order = ticket.order
  }

  const response = await db.ticket.upsert({
    where: {
      id: ticket.id || v4(),
    },
    update: { ...ticket, Tags: { set: tags } },
    create: { ...ticket, Tags: { connect: tags }, order },
    include: {
      Tags: true,
      Assigned: true,
      Lane: true,
    },
  })

  return response
}

export async function updateTicketsOrder(tickets: Ticket[]) {
  try {
    const updateTrans = tickets.map((ticket) =>
      db.ticket.update({
        where: {
          id: ticket.id,
        },
        data: {
          order: ticket.order,
          laneId: ticket.laneId,
        },
      })
    )

    await db.$transaction(updateTrans)
  } catch (error) {
    console.log(error, 'ERROR UPDATE TICKET ORDER')
  }
}

export async function deleteTicket(ticketId: string) {
  const ticket = await db.ticket.delete({
    where: {
      id: ticketId,
    },
  })
  return ticket
}

// Tag Queries
export async function upsertTag(
  subaccountId: string,
  tag: Prisma.TagUncheckedCreateInput
) {
  const response = await db.tag.upsert({
    where: { id: tag.id || v4(), subAccountId: subaccountId },
    update: tag,
    create: { ...tag, subAccountId: subaccountId },
  })

  return response
}

export async function getTagsForSubaccount(subaccountId: string) {
  const response = await db.subAccount.findUnique({
    where: { id: subaccountId },
    select: { Tags: true },
  })
  return response
}

export async function deleteTag(tagId: string) {
  const tag = await db.tag.delete({ where: { id: tagId } })
  return tag
}

// Permission Queries
export async function getPermissions(subaccountId: string) {
  const permissions = await db.permissions.findMany({
    where: {
      subAccountId: subaccountId,
    },
    include: {
      User: true,
      SubAccount: true,
    },
  })
  return permissions
}

export async function createPermission(data: {
  subAccountId: string;
  email: string;
  access?: boolean;
}) {
  const permission = await db.permissions.create({
    data: {
      access: data.access || false,
      email: data.email,
      subAccountId: data.subAccountId,
    },
  })
  return permission
}

export async function updatePermission(permissionId: string, data: { access?: boolean }) {
  const permission = await db.permissions.update({
    where: {
      id: permissionId,
    },
    data: {
      access: data.access,
    },
  })
  return permission
}

export async function deletePermission(permissionId: string) {
  const permission = await db.permissions.delete({
    where: {
      id: permissionId,
    },
  })
  return permission
}

export async function upsertFunnel(
  subAccountId: string,
  funnel: Prisma.FunnelUncheckedCreateInput,
  funnelId: string
) {
  const response = await db.funnel.upsert({
    where: { id: funnelId },
    update: funnel,
    create: { ...funnel, subAccountId },
  })
  return response
}

// Trigger Queries
export async function getTriggers(subAccountId: string) {
  const triggers = await db.trigger.findMany({
    where: {
      subAccountId,
    },
    include: {
      Automations: true,
    },
  })
  return triggers
}

export async function upsertTrigger(
  trigger: Prisma.TriggerUncheckedCreateInput
) {
  const response = await db.trigger.upsert({
    where: { id: trigger.id || v4() },
    update: trigger,
    create: trigger,
  })
  return response
}

export async function deleteTrigger(triggerId: string) {
  const response = await db.trigger.delete({
    where: { id: triggerId },
  })
  return response
}

// Automation Queries
export async function getAutomations(subAccountId: string) {
  const automations = await db.automation.findMany({
    where: {
      subAccountId,
    },
    include: {
      Action: true,
      Trigger: true,
      AutomationInstance: true,
    },
  })
  return automations
}

export async function upsertAutomation(
  automation: Prisma.AutomationUncheckedCreateInput
) {
  const response = await db.automation.upsert({
    where: { id: automation.id || v4() },
    update: automation,
    create: automation,
    include: {
      Action: true,
      Trigger: true,
    },
  })
  return response
}

export async function deleteAutomation(automationId: string) {
  const response = await db.automation.delete({
    where: { id: automationId },
  })
  return response
}

// Action Queries
export async function upsertAction(
  action: Prisma.ActionUncheckedCreateInput
) {
  let order: number
  if (!action.order) {
    const actions = await db.action.findMany({
      where: { automationId: action.automationId },
    })
    order = actions.length
  } else {
    order = action.order
  }

  const response = await db.action.upsert({
    where: { id: action.id || v4() },
    update: action,
    create: { ...action, order },
  })
  return response
}

export async function deleteAction(actionId: string) {
  const response = await db.action.delete({
    where: { id: actionId },
  })
  return response
}

export async function updateActionsOrder(actions: Action[]) {
  const updateTrans = actions.map((action) =>
    db.action.update({
      where: {
        id: action.id,
      },
      data: {
        order: action.order,
      },
    })
  )

  await db.$transaction(updateTrans)
}

export async function saveActivityLogsNotification(data: {
  agencyId?: string
  subaccountId?: string
  description: string
}) {
  try {
    const createData = {
      description: data.description,
      ...(data.agencyId ? { agencyId: data.agencyId } : {}),
      ...(data.subaccountId ? { subaccountId: data.subaccountId } : {})
    };

    const notification = await db.notification.create({
      data: createData as any,
      select: {
        id: true,
        description: true,
        agencyId: true,
        subaccountId: true,
        createdAt: true
      }
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}