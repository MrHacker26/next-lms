import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'

type PurchaseWithCourse = Prisma.PurchaseGetPayload<{ include: { course: true } }>

function groupByCourse(purchases: PurchaseWithCourse[]) {
  const grouped: { [courseTitle: string]: number } = {}

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0
    }

    grouped[courseTitle] += purchase.course.price!
  })

  return grouped
}

export async function getAnalytics(userId: string) {
  try {
    const purchases = await db.purchase.findMany({
      where: { course: { createdById: userId } },
      include: { course: true },
    })

    const groupedEarnings = groupByCourse(purchases)
    const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
      name: courseTitle,
      total,
    }))

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0)
    const totalSales = purchases.length

    return {
      data,
      totalRevenue,
      totalSales,
    }
  } catch {
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    }
  }
}
