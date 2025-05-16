import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const publicRoutes = ['/api/webhook']
const isPublicRoute = createRouteMatcher(publicRoutes)

const protectedRoutes = ['/', '/(api|trpc)']
const isProtectedRoute = createRouteMatcher(protectedRoutes)

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req) && isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
