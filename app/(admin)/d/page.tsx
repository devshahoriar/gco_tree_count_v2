import { ContentLayout } from '@/components/admin-panel/content-layout'
import { getUser } from '@/lib/auth'
import prisma from '@/prisma/db'
import { headers } from 'next/headers'

export default async function Page() {
  const user = await getUser(headers)
  if (!user) {
    return <div>Not found</div>
  }
  const totatTreeCountS = await coutnOfTreesbyId(user?.id)
  const totalBabyCountS = await countOfTressbyOt4ocId(user?.id)
  const thisMonthTreeCountS = await thisMonthTreeCount(user?.id)
  const thisMonthOt4ocCountS = await thisMonthOt4ocCount(user?.id)

  return (
    <ContentLayout title="Dashboard">
      <div className="grid gap-6 p-4">
        {/* User Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <span className="text-2xl text-green-600 dark:text-green-400">{user.name?.[0] ?? '?'}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold dark:text-white">{user.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Trees"
            value={totatTreeCountS}
            icon="🌳"
            colorLight="bg-green-100"
            colorDark="dark:bg-green-900"
          />
          <StatCard
            title="Total Babies"
            value={totalBabyCountS}
            icon="👶"
            colorLight="bg-blue-100"
            colorDark="dark:bg-blue-900"
          />
          <StatCard
            title="Trees This Month"
            value={thisMonthTreeCountS}
            icon="📅"
            colorLight="bg-yellow-100"
            colorDark="dark:bg-yellow-900"
          />
          <StatCard
            title="Babies This Month"
            value={thisMonthOt4ocCountS}
            icon="🍼"
            colorLight="bg-purple-100"
            colorDark="dark:bg-purple-900"
          />
        </div>
      </div>
    </ContentLayout>
  )
}

// Stats Card Component
function StatCard({ title, value, icon, colorLight, colorDark }: {
  title: string;
  value: number;
  icon: string;
  colorLight: string;
  colorDark: string;
}) {
  return (
    <div className={`${colorLight} ${colorDark} rounded-lg p-6 transition-colors`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-2 dark:text-white">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  )
}

const coutnOfTreesbyId = async (id: string) => {
  return await prisma.tree.count({
    where: {
      addById: id,
    },
  })
}

const countOfTressbyOt4ocId = async (id: string) => {
  return await prisma.ot4oc.count({
    where: {
      userId: id,
    },
  })
}

const thisMonthTreeCount = async (id: string) => {
  return await prisma.tree.count({
    where: {
      addById: id,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
  })
}

const thisMonthOt4ocCount = async (id: string) => {
  return await prisma.ot4oc.count({
    where: {
      userId: id,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
  })
}
