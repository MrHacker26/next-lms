import { Navbar } from './_components/navbar'
import SideBar from './_components/sidebar'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-50 h-[80px] w-full md:pl-56">
        <Navbar />
      </div>
      <div className="fixed inset-y-0 z-50 hidden h-full w-56 flex-col md:flex">
        <SideBar />
      </div>
      <main className="pl-56 pt-[80px] md:h-full">{children}</main>
    </div>
  )
}

export default DashboardLayout
