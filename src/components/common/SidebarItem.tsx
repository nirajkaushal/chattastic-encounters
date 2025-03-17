
import { Accordion, AccordionItem } from '@heroui/react'
import { useLocation, useRouter } from '@tanstack/react-router'
import { Home, Library, HelpCircle } from 'lucide-react'

import { Button } from '../ui/Button'

import { cn } from '@/utils/utils'

type TNavigation = {
  name: string
  href: string
  icon: typeof Home
  filled: typeof Home
  submenu?: Omit<TNavigation, 'filled' | 'icon' | 'submenu'>[]
}

const navigation: TNavigation[] = [
  {
    name: 'Home',
    href: '/events',
    icon: Home,
    filled: Home,
  },
  // {
  //   name: 'My workshops',
  //   href: '/workshops',
  //   icon: LuCalendarHeart,
  // },
  {
    name: 'My Library',
    href: '/library',
    icon: Library,
    filled: Library,
    submenu: [
      {
        name: 'Frames',
        href: '/library/frames',
      },
      {
        name: 'Media',
        href: '/library/media',
      },
    ],
  },
  // {
  //   name: 'Community templates',
  //   href: '/templates',
  //   icon: HiOutlineTemplate,
  // },
  {
    name: 'Help & Support',
    href: '/help',
    icon: HelpCircle,
    filled: HelpCircle,
  },
]

export function SidebarItem() {
  const location = useLocation()
  const { history } = useRouter()

  const renderMenuItem = (item: TNavigation) => {
    const IconComponent = location.pathname.startsWith(item.href) 
      ? item.filled 
      : item.icon;
      
    if (item.submenu) {
      return (
        <Accordion
          keepContentMounted
          isCompact
          defaultExpandedKeys={new Set([item.name])}>
          <AccordionItem
            key={item.name}
            title={item.name}
            indicator={<div />}
            className="ml-2"
            classNames={{
              title: 'text-sm',
            }}
            startContent={
              <IconComponent
                className="shrink-0"
                aria-hidden="true"
                size={20}
              />
            }>
            {item.submenu.map((submenu) => (
              <Button
                key={submenu.name}
                size="sm"
                fullWidth
                className={cn(
                  'flex justify-start items-center gap-3 bg-transparent hover:bg-gray-200 py-5 pl-8',
                  {
                    'bg-primary/15 text-primary font-medium':
                      submenu.href === location.pathname,
                  }
                )}
                onClick={() => {
                  history.push(submenu.href)
                }}>
                {submenu.name}
              </Button>
            ))}
          </AccordionItem>
        </Accordion>
      )
    }

    return (
      <Button
        key={item.name}
        size="md"
        fullWidth
        className={cn(
          'flex justify-start items-center gap-3 bg-transparent hover:bg-gray-200 py-5',
          {
            'bg-primary/15 text-primary font-medium':
              item.href === location.pathname,
          }
        )}
        onClick={() => {
          history.push(item.href)
        }}>
        <IconComponent className="shrink-0" aria-hidden="true" size={22} />
        {item.name}
      </Button>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {navigation.map((item) => renderMenuItem(item))}
    </div>
  )
}
