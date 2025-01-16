import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { User } from '@prisma/client'

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return null
    }

    const user = await db.user.findUnique({
      where: {
        email: auth().sessionClaims?.email as string,
      },
    })

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function createOrUpdateUser(userData: {
  name: string
  email: string
  avatarUrl: string
  role?: 'AGENCY_OWNER' | 'AGENCY_ADMIN' | 'SUBACCOUNT_USER' | 'SUBACCOUNT_GUEST'
}): Promise<User> {
  const user = await db.user.upsert({
    where: {
      email: userData.email,
    },
    update: {
      name: userData.name,
      avatarUrl: userData.avatarUrl,
      role: userData.role,
    },
    create: {
      name: userData.name,
      email: userData.email,
      avatarUrl: userData.avatarUrl,
      role: userData.role || 'SUBACCOUNT_USER',
    },
  })

  return user
}

export async function deleteUser(email: string): Promise<void> {
  await db.user.delete({
    where: {
      email,
    },
  })
}

export function getAuthUserDetails() {
  const { userId } = auth()
  return { userId, orgId: auth().orgId }
}

export function getAuthOrganization() {
  const orgId = auth().orgId
  return { orgId }
}

export function validateUserAccess(userId: string | null) {
  const { userId: authUserId } = auth()
  return userId === authUserId
}

export function validateOrgAccess(orgId: string | null) {
  const authOrgId = auth().orgId
  return orgId === authOrgId
}