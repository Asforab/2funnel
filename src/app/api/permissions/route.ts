import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createPermission, deletePermission, getPermissions, updatePermission } from '@/lib/queries'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const permission = await createPermission(body)

    return NextResponse.json(permission)
  } catch (error) {
    console.error('Error creating permission:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const subaccountId = searchParams.get('subaccountId')

    if (!subaccountId) {
      return new NextResponse('Subaccount ID is required', { status: 400 })
    }

    const permissions = await getPermissions(subaccountId)
    return NextResponse.json(permissions)
  } catch (error) {
    console.error('Error getting permissions:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { searchParams } = new URL(req.url)
    const permissionId = searchParams.get('permissionId')

    if (!permissionId) {
      return new NextResponse('Permission ID is required', { status: 400 })
    }

    const permission = await updatePermission(permissionId, body)
    return NextResponse.json(permission)
  } catch (error) {
    console.error('Error updating permission:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const permissionId = searchParams.get('permissionId')

    if (!permissionId) {
      return new NextResponse('Permission ID is required', { status: 400 })
    }

    const permission = await deletePermission(permissionId)
    return NextResponse.json(permission)
  } catch (error) {
    console.error('Error deleting permission:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}