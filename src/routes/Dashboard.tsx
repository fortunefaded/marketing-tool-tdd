import { useEffect } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useVibeLogger } from '../hooks/useVibeLogger'

export default function Dashboard() {
  const logger = useVibeLogger('Dashboard')

  const campaigns = useQuery(api.campaigns.list, {})
  const tasks = useQuery(api.tasks.list, {})

  const activeCampaigns = campaigns?.filter((c) => c.status === 'active').length ?? 0
  const pendingTasks = tasks?.filter((t) => t.status === 'pending').length ?? 0
  const completedTasks = tasks?.filter((t) => t.status === 'completed').length ?? 0
  const totalTasks = tasks?.length ?? 0
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  useEffect(() => {
    if (campaigns && tasks) {
      logger.info('ダッシュボード統計情報を取得しました', {
        キャンペーン総数: campaigns.length,
        アクティブキャンペーン数: activeCampaigns,
        タスク総数: totalTasks,
        保留中タスク数: pendingTasks,
        完了タスク数: completedTasks,
        完了率: `${completionRate}%`,
      })
    } else {
      logger.debug('統計情報を読み込み中...')
    }
  }, [
    campaigns,
    tasks,
    logger,
    activeCampaigns,
    pendingTasks,
    completedTasks,
    totalTasks,
    completionRate,
  ])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">ダッシュボード</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">アクティブキャンペーン</h3>
          <p className="text-3xl font-bold text-blue-600">{activeCampaigns}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">保留中のタスク</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">完了率</h3>
          <p className="text-3xl font-bold text-green-600">{completionRate}%</p>
        </div>
      </div>
    </div>
  )
}
