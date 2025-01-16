import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Rotas públicas que não requerem autenticação
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/uploadthing(.*)',
  '/api/webhook(.*)',
  '/site(.*)',
])

export default clerkMiddleware((auth, req) => {
  // Protege todas as rotas exceto as públicas
  if (!isPublicRoute(req)) {
    auth.protect()
  }
}, { 
  debug: process.env.NODE_ENV === 'development',
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
