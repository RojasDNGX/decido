import { setUserPlan } from '@/lib/users-db'

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return new Response('Not allowed', { status: 403 })
  }

  let body

  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const { email, plan } = body ?? {}

  if (
    typeof email !== 'string' ||
    (plan !== 'free' && plan !== 'pro')
  ) {
    return new Response('Invalid input', { status: 400 })
  }

  setUserPlan(email, plan)

  return new Response('OK')
}
