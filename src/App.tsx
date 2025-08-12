import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { useEffect } from 'react'
import Dashboard from './routes/Dashboard'
import Campaigns from './routes/Campaigns'
import Tasks from './routes/Tasks'
import { vibe } from './lib/vibelogger'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL!)

// アプリケーション起動時のログ
vibe.vibe('🚀 マーケティングツールを起動しました')
vibe.info('環境情報', {
  mode: import.meta.env.MODE,
  convexUrl: import.meta.env.VITE_CONVEX_URL ? '接続先設定済み' : '未設定',
})

function NavigationLogger() {
  const location = useLocation()

  useEffect(() => {
    vibe.info(`📍 ページ遷移: ${location.pathname}`, {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
    })
  }, [location])

  return null
}

function App() {
  return (
    <ConvexProvider client={convex}>
      <Router>
        <NavigationLogger />
        <div className="min-h-screen bg-gray-50">
          {/* ナビゲーション */}
          <nav className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-8">
                  <h1 className="text-xl font-bold text-gray-900">Marketing Tool</h1>
                  <div className="flex space-x-4">
                    <Link
                      to="/"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      ダッシュボード
                    </Link>
                    <Link
                      to="/campaigns"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      キャンペーン
                    </Link>
                    <Link
                      to="/tasks"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      タスク
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* メインコンテンツ */}
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/tasks" element={<Tasks />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ConvexProvider>
  )
}

export default App
