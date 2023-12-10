'use client'

import { UserButton } from '@clerk/nextjs'

export const NavbarRoutes = () => {
  return (
    <div className="ml-auto flex gap-x-2">
      <UserButton />
    </div>
  )
}
