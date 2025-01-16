import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAgency, deleteAgency, getAgencyDetails, updateAgency } from '@/lib/queries'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const agency = await createAgency(body, userId)

    return NextResponse.json(agency)
  } catch (error) {
    console.error('Error creating agency:', error)
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
    const agencyId = searchParams.get('agencyId')

    if (!agencyId) {
      return new NextResponse('Agency ID is required', { status: 400 })
    }

    const agency = await getAgencyDetails(agencyId)
    if (!agency) {
      return new NextResponse('Agency not found', { status: 404 })
    }

    return NextResponse.json(agency)
  } catch (error) {
    console.error('Error getting agency:', error)
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
    const agencyId = searchParams.get('agencyId')

    if (!agencyId) {
      return new NextResponse('Agency ID is required', { status: 400 })
    }

    const agency = await updateAgency(agencyId, body)
    return NextResponse.json(agency)
  } catch (error) {
    console.error('Error updating agency:', error)
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
    const agencyId = searchParams.get('agencyId')

    if (!agencyId) {
      return new NextResponse('Agency ID is required', { status: 400 })
    }

    const agency = await deleteAgency(agencyId)
    return NextResponse.json(agency)
  } catch (error) {
    console.error('Error deleting agency:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}