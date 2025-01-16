import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createSubAccount, deleteSubAccount, getSubAccountDetails, updateSubAccount } from '@/lib/queries'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const subaccount = await createSubAccount(body)

    return NextResponse.json(subaccount)
  } catch (error) {
    console.error('Error creating subaccount:', error)
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

    const subaccount = await getSubAccountDetails(subaccountId)
    if (!subaccount) {
      return new NextResponse('Subaccount not found', { status: 404 })
    }

    return NextResponse.json(subaccount)
  } catch (error) {
    console.error('Error getting subaccount:', error)
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
    const subaccountId = searchParams.get('subaccountId')

    if (!subaccountId) {
      return new NextResponse('Subaccount ID is required', { status: 400 })
    }

    const subaccount = await updateSubAccount(subaccountId, body)
    return NextResponse.json(subaccount)
  } catch (error) {
    console.error('Error updating subaccount:', error)
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
    const subaccountId = searchParams.get('subaccountId')

    if (!subaccountId) {
      return new NextResponse('Subaccount ID is required', { status: 400 })
    }

    const subaccount = await deleteSubAccount(subaccountId)
    return NextResponse.json(subaccount)
  } catch (error) {
    console.error('Error deleting subaccount:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}