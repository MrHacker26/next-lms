import { NavbarRoutes } from '@/components/navbar-routes'
import { MobileSidebar } from './mobile-sidebar'

export const Navbar = () => {
  return (
    <div className="flex h-full items-center border-b bg-white p-4 shadow-sm">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  )
}
