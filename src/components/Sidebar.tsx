import { Link, useLocation } from 'react-router-dom'
import { useVibeLogger } from '../hooks/useVibeLogger'
import {
  Squares2X2Icon,
  PuzzlePieceIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline'
import { ComponentType } from 'react'

interface MenuItem {
  name: string
  path?: string
  icon?: ComponentType<{ className?: string }>
  isHeader?: boolean
  isExpanded?: boolean
  children?: MenuItem[]
}

export default function Sidebar() {
  const location = useLocation()
  const logger = useVibeLogger('Sidebar')

  const menuItems: MenuItem[] = [
    {
      name: '統合ダッシュボード',
      path: '/',
      icon: Squares2X2Icon,
    },
    {
      name: 'Meta広告詳細',
      path: '/meta-dashboard',
      icon: ChartBarIcon,
    },
    {
      name: '広告疲労度分析',
      path: '/ad-fatigue',
      icon: ExclamationTriangleIcon,
    },
    {
      name: '疲労度教育センター',
      path: '/fatigue-education',
      icon: AcademicCapIcon,
    },
    {
      name: 'ECForce詳細',
      path: '/ecforce',
      icon: ChartBarIcon,
    },
    {
      name: 'カテゴリ分析',
      path: '/category-analysis',
      icon: PuzzlePieceIcon,
    },
    {
      name: '詳細分析',
      path: '/details',
      icon: MagnifyingGlassIcon,
    },
    {
      name: '期間分析',
      path: '/period',
      icon: CalendarDaysIcon,
    },
  ]

  const handleMenuClick = (menuName: string) => {
    logger.action('メニュー項目クリック', { menuName })
  }

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon
    const isActive = location.pathname === item.path

    return (
      <li key={item.path}>
        <Link
          to={item.path!}
          onClick={() => handleMenuClick(item.name)}
          className={`
            flex items-center space-x-3 px-3 py-2 text-sm font-medium transition-colors rounded
            ${
              isActive
                ? 'bg-[#fef3c7] text-gray-800 border-l-4 border-[#f6d856]'
                : 'text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          {Icon && <Icon className="w-5 h-5 text-[#f6d856]" />}
          <span>{item.name}</span>
        </Link>
      </li>
    )
  }

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200">
      <nav className="p-3">
        <ul className="space-y-0.5">{menuItems.map((item) => renderMenuItem(item))}</ul>
      </nav>
    </aside>
  )
}
