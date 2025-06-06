'use client'

import { Ellipsis, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { CollapseMenuButton } from '@/components/admin-panel/collapse-menu-button'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getUserPermissions, signOut, useSession } from '@/lib/auth-client'
import { getMenuList } from '@/lib/menu-list'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { toast } from 'sonner'

interface MenuProps {
  isOpen: boolean | undefined
}

export function Menu({ isOpen }: MenuProps) {
  const [loading, setLoading] = useState(false)
  const { replace } = useRouter()
  const hendelLogout = async () => {
    setLoading(true)
    try {
      await signOut()
      replace('/')
    } catch (error) {
      console.log(error)
      toast.error('Failed to sign out')
    } finally {
      setLoading(false)
    }
  }

  const { isPending, data } = useSession()
  const permissions = getUserPermissions(data)
  const pathname = usePathname()
  const menuList = getMenuList(permissions)

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-8 h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
          {!isPending && (
            <>
              {menuList.map(({ groupLabel, menus }, index) => (
                <li
                  className={cn('w-full', groupLabel ? 'pt-5' : '')}
                  key={index}
                >
                  {(isOpen && groupLabel) || isOpen === undefined ? (
                    <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                      {groupLabel}
                    </p>
                  ) : !isOpen && isOpen !== undefined && groupLabel ? (
                    <div className="w-full flex justify-center items-center">
                      <Ellipsis className="h-5 w-5" />
                    </div>
                  ) : (
                    <p className="pb-2"></p>
                  )}
                  {menus.map(
                    ({ href, label, icon: Icon, active, submenus }, index) =>
                      !submenus || submenus.length === 0 ? (
                        <div className="w-full" key={index}>
                          <Button
                            variant={
                              (active === undefined &&
                                pathname.startsWith(href)) ||
                              active
                                ? 'secondary'
                                : 'ghost'
                            }
                            className="w-full justify-start h-10 mb-1"
                            asChild
                          >
                            <Link href={href}>
                              <span
                                className={cn(isOpen === false ? '' : 'mr-4')}
                              >
                                <Icon size={18} />
                              </span>
                              <p
                                className={cn(
                                  'max-w-[200px] truncate',
                                  isOpen === false
                                    ? '-translate-x-96 opacity-0'
                                    : 'translate-x-0 opacity-100'
                                )}
                              >
                                {label}
                              </p>
                            </Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="w-full" key={index}>
                          <CollapseMenuButton
                            icon={Icon}
                            label={label}
                            active={
                              active === undefined
                                ? pathname.startsWith(href)
                                : active
                            }
                            submenus={submenus}
                            isOpen={isOpen}
                          />
                        </div>
                      )
                  )}
                </li>
              ))}
            </>
          )}

          <li className="w-full grow flex items-end">
            <Button
              onClick={hendelLogout}
              variant="outline"
              className="w-full justify-center h-10 mt-5"
              disabled={loading}
            >
              <span className={cn(isOpen === false ? '' : 'mr-4')}>
                <LogOut size={18} />
              </span>
              <p
                className={cn(
                  'whitespace-nowrap',
                  isOpen === false ? 'opacity-0 hidden' : 'opacity-100'
                )}
              >
                Sign out
              </p>
            </Button>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  )
}
