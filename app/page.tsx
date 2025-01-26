import { getUser } from '@/lib/auth'
import prisma from '@/prisma/db'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { FaHandsHelping, FaTree, FaUsers } from 'react-icons/fa'

const homeApp = process.env.NEXT_PUBLIC_HOME_APP
const oldApp = process.env.NEXT_PUBLIC_OLD_APP

export default async function Home() {
  const [userCount, ot4ocCount, treeCount] = await Promise.all([
    prisma.user.count(),
    prisma.ot4oc.count(),
    prisma.tree.count(),
  ])
  const user = await getUser(headers)

  return (
    <div className=" min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          GCO Statistics Dashboard
        </h1>
        <div className="flex gap-4 justify-center items-center">
          <a
            href={homeApp}
            className="text-blue-600 cursor-pointer dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            Main Website
          </a>
          <a
            href={oldApp}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer"
          >
            Legacy App
          </a>
          <Link
            href={user ? '/d' : '/join'}
            className="ml-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 
                     text-white rounded-full hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-500 
                     dark:hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform 
                     hover:-translate-y-0.5"
          >
            {user ? 'Go to Dashboard' : 'Login / Join'}
          </Link>
        </div>
      </header>

      {user && (
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Image
                  height={100}
                  width={100}
                  src={user.image || '/imgs/avatar.png'}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900"
                />
                <span
                  className={`absolute bottom-1 right-1 w-4 h-4 rounded-full ${
                    user.active ? 'bg-green-400' : 'bg-gray-400'
                  } border-2 border-white dark:border-gray-800`}
                ></span>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {user.name}
                </h2>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      Email:
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {user.email}
                    </span>
                    {user.emailVerified && (
                      <span className="text-green-500 dark:text-green-400 text-sm">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  {user.role && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400">
                        Role:
                      </span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                        {user.role}
                      </span>
                    </div>
                  )}
                </div>
                {user.permissions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {user.permissions.split(',').map((permission, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-sm"
                      >
                        {permission.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        DB Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
        {[
          {
            icon: FaUsers,
            title: 'Total Users',
            count: userCount,
            color: 'blue',
          },
          {
            icon: FaHandsHelping,
            title: 'OT4OC Count',
            count: ot4ocCount,
            color: 'purple',
          },
          {
            icon: FaTree,
            title: 'Trees Planted',
            count: treeCount,
            color: 'green',
          },
        ].map(({ icon: Icon, title, count, color }) => (
          <div
            key={title}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <Icon
                className={`text-4xl text-${color}-500 dark:text-${color}-400`}
              />
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                {title}
              </h2>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {count.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
