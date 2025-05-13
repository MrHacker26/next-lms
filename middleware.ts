import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/api/webhook', '/api/uploadthing'])

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return
  }
  await auth.protect()
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
