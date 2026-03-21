import { useState, type ReactNode } from 'react'

interface LayoutProps {
  left: ReactNode
  center: ReactNode
  right: ReactNode
}

const TABS = [
  { id: 'tutorial', label: 'Tutorial' },
  { id: 'code', label: 'Code' },
  { id: 'results', label: 'Results' },
] as const

type TabId = (typeof TABS)[number]['id']

export function Layout({ left, center, right }: LayoutProps) {
  const [activeTab, setActiveTab] = useState<TabId>('code')

  return (
    <>
      {/* Mobile tabs */}
      <div className="lg:hidden flex border-b border-gray-200 dark:border-gray-700">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-ruby-600 dark:text-ruby-400 border-b-2 border-ruby-600 dark:border-ruby-400'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mobile content */}
      <div className="lg:hidden flex-1 min-h-0">
        {activeTab === 'tutorial' && left}
        {activeTab === 'code' && center}
        {activeTab === 'results' && right}
      </div>

      {/* Desktop 3-pane */}
      <div className="hidden lg:grid lg:grid-cols-3 flex-1 min-h-0 divide-x divide-gray-200 dark:divide-gray-700">
        <div className="overflow-y-auto">{left}</div>
        <div className="overflow-hidden">{center}</div>
        <div className="overflow-y-auto">{right}</div>
      </div>
    </>
  )
}
