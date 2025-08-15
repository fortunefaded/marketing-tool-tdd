import { Link, useLocation } from 'react-router-dom'
import { useVibeLogger } from '../hooks/useVibeLogger'
import {
  Squares2X2Icon,
  PuzzlePieceIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  FolderIcon,
  PlayIcon,
  NewspaperIcon,
  ArrowRightIcon,
  UserIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { ComponentType, useState } from 'react'

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
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    サイト内分析: true,
    ユーザー分析: true,
  })

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }

  const menuItems: MenuItem[] = [
    {
      name: 'ダッシュボード',
      path: '/',
      icon: Squares2X2Icon,
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
    {
      name: 'ランディングページ分析',
      path: '/landing',
      icon: FolderIcon,
    },
    {
      name: 'コストアロケーション分析',
      path: '/cost-allocation',
      icon: PlayIcon,
    },
    {
      name: 'サイト内分析',
      isHeader: true,
      isExpanded: expandedItems['サイト内分析'],
      icon: NewspaperIcon,
      children: [
        { name: 'ページ別分析', path: '/site/page', icon: ArrowRightIcon },
        { name: '期間分析', path: '/site/period', icon: ArrowRightIcon },
        { name: '経路分析', path: '/site/path', icon: ArrowRightIcon },
      ],
    },
    {
      name: 'ユーザー分析',
      isHeader: true,
      isExpanded: expandedItems['ユーザー分析'],
      icon: UserIcon,
      children: [
        { name: 'カスタマージャーニー分析', path: '/user/journey', icon: ArrowRightIcon },
        { name: 'アクション喚起率分析', path: '/user/action', icon: ArrowRightIcon },
      ],
    },
  ]

  const handleMenuClick = (menuName: string) => {
    logger.action('メニュー項目クリック', { menuName })
  }

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon
    const isActive = location.pathname === item.path
    const isExpanded = item.isExpanded ?? false

    if (item.isHeader) {
      return (
        <li key={item.name} className="mt-4">
          <button
            onClick={() => toggleExpanded(item.name)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded"
          >
            <div className="flex items-center space-x-2">
              {Icon && <Icon className="w-5 h-5 text-[#f6d856]" />}
              <span>{item.name}</span>
            </div>
            {isExpanded ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>
          {isExpanded && item.children && (
            <ul className="mt-1 space-y-0.5">
              {item.children.map((child, idx) => (
                <li key={child.path || idx}>
                  <Link
                    to={child.path!}
                    onClick={() => handleMenuClick(child.name)}
                    className="flex items-center space-x-2 pl-8 pr-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                  >
                    {child.icon && <child.icon className="w-4 h-4" />}
                    <span>{child.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      )
    }

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
