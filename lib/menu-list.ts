import { PERMISSIONS } from '@/data/const'
import {
  AreaChart,
  BookText,
  LucideIcon,
  Notebook,
  Settings,
  SquarePen,
  Users,
} from 'lucide-react'

export function getMenuList(p: string[]): Group[] {
  return [
    {
      groupLabel: 'Links',

      menus: [
        {
          href: '/d',
          label: 'Dashboard',
          icon: BookText,
        },
        ...(p?.includes(PERMISSIONS.OT4OC)
          ? [
              {
                href: '',
                label: 'OT40C',
                icon: SquarePen,
                submenus: [
                  {
                    href: '/d/ot4oc/list',
                    label: 'All OT4OC',
                  },
                  {
                    href: '/d/ot4oc/new',
                    label: 'New OT4OC',
                  },
                ],
              },
            ]
          : []),
        ...(p?.includes(PERMISSIONS.REPORT)
          ? [
              {
                href: '',
                label: 'Report',
                icon: Notebook,
                submenus: [
                  {
                    href: '/d/report/mastar_roll',
                    label: 'Master Roll',
                  },
                ],
              },
            ]
          : []),

        ...(p?.includes(PERMISSIONS.DATA)
          ? [
              {
                href: '',
                label: 'Data',
                icon: AreaChart,
                submenus: [
                  {
                    href: '/d/data/division',
                    label: 'Add Division',
                  },
                  {
                    href: '/d/data/zilla',
                    label: 'Add Zilla',
                  },
                  {
                    href: '/d/data/up-zilla',
                    label: 'Add Up-Zilla',
                  },
                  {
                    href: '/d/data/post',
                    label: 'Add Post Office',
                  },
                  {
                    href: '/d/data/union',
                    label: 'Add Union',
                  },

                  {
                    href: '/d/data/tree',
                    label: 'Add Tree',
                  },
                ],
              },
            ]
          : []),
        ...(p?.includes(PERMISSIONS.USER)
          ? [
              {
                href: '/d/users',
                label: 'Users',
                icon: Users,
              },
            ]
          : []),
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        {
          href: '/d/account',
          label: 'Settings',
          icon: Settings,
        },
      ],
    },
  ]
}

type Submenu = {
  href: string
  label: string
  active?: boolean
}

type Menu = {
  href: string
  label: string
  active?: boolean
  icon: LucideIcon
  submenus?: Submenu[]
}

type Group = {
  groupLabel: string
  menus: Menu[]
}
