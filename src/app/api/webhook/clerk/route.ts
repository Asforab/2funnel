import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createOrUpdateUser, deleteUser } from '@/lib/auth'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env')
  }

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, first_name, last_name, email_addresses, image_url } = evt.data

    const email = email_addresses[0].email_address
    const name = [first_name, last_name].filter(Boolean).join(' ')

    try {
      await createOrUpdateUser({
        name: name || 'Unnamed User',
        email,
        avatarUrl: image_url,
      })

      return new Response('User created or updated', { status: 200 })
    } catch (error) {
      console.error('Error creating/updating user:', error)
      return new Response('Error creating/updating user', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    // Para usuários deletados, vamos usar o email do evento
    const email = (evt.data as any).email_addresses?.[0]?.email_address

    if (!email) {
      console.error('No email address found for deleted user')
      return new Response('No email found', { status: 400 })
    }

    try {
      await deleteUser(email)
      return new Response('User deleted', { status: 200 })
    } catch (error) {
      console.error('Error deleting user:', error)
      return new Response('Error deleting user', { status: 500 })
    }
  }

  return new Response('Webhook received', { status: 200 })
}