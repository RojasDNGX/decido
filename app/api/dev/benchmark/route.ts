import { aiOrchestrator } from '@/services/ai/orchestrator'

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

  const { input, plan } = body ?? {}

  if (typeof input !== 'string' || (plan !== 'free' && plan !== 'pro')) {
    return new Response('Invalid input', { status: 400 })
  }

  try {
    const result = await aiOrchestrator(input, undefined, plan)
    return Response.json({ primary_action: result.primary_action })
  } catch (err) {
    return new Response(err instanceof Error ? err.message : 'Error', { status: 500 })
  }
}
