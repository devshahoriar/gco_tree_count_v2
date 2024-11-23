import {
  AreaChart,
  LayoutGrid,
  LucideIcon,
  Notebook,
  Settings,
  SquarePen,
  Users,
} from 'lucide-react'

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

export function getMenuList(): Group[] {
  // pathname: string
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/d',
          label: 'Dashboard',
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Links',
      menus: [
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

        {
          href: '',
          label: 'Report',
          icon: Notebook,
          submenus: [
            {
              href: '/d/report/ot4oc',
              label: 'Report OT4OC',
            },
          ],
        },
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
              href: '/d/data/post',
              label: 'Add Post Office',
            },
            {
              href: '/d/data/union',
              label: 'Add Union',
            },
            {
              href: '/d/data/up-zilla',
              label: 'Add Up-Zilla',
            },
            {
              href: '/d/data/zilla',
              label: 'Add Zilla',
            },
            {
              href: '/d/data/tree',
              label: 'Add Tree',
            },
          ],
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        {
          href: '/d/users',
          label: 'Users',
          icon: Users,
        },
        {
          href: '/d/account',
          label: 'Account',
          icon: Settings,
        },
      ],
    },
  ]
}
