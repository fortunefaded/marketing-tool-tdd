import { MetaAPIClientEnhanced } from '../lib/meta-api/client-enhanced'
// Removed unused imports
import { api } from '../../convex/_generated/api'
import { ConvexClient } from 'convex/browser'

interface SyncOptions {
  differential?: boolean
  lookbackDays?: number
  filters?: {
    status?: string[]
    objectives?: string[]
  }
}

export class MetaSyncService {
  private client: MetaAPIClientEnhanced
  private convex: ConvexClient

  constructor() {
    // 環境変数から認証情報を取得
    const accessToken = import.meta.env.VITE_META_ACCESS_TOKEN
    const accountId = import.meta.env.VITE_META_ACCOUNT_ID

    if (!accessToken || !accountId) {
      throw new Error(
        'Meta API credentials not configured. Please set VITE_META_ACCESS_TOKEN and VITE_META_ACCOUNT_ID in .env'
      )
    }

    this.client = new MetaAPIClientEnhanced({
      accessToken,
      accountId,
    })

    // Set up token refresh handler
    this.client.setTokenRefreshHandler(async () => {
      // In a real implementation, this would refresh the token from your auth server
      logger.debug('Token refresh requested')
      // For now, just return the same token
      return accessToken
    })

    // Set up event listeners for monitoring
    this.client.on('request', (event) => {
      logger.debug(`[Meta API] Request: ${event.method} ${event.url}`)
    })

    this.client.on('response', (event) => {
      logger.debug(`[Meta API] Response: ${event.status} in ${event.duration}ms`)
    })

    this.client.on('error', (event) => {
      logger.error(`[Meta API] Error on attempt ${event.attempt}:`, event.error)
    })

    this.client.on('circuit-breaker-open', (event) => {
      logger.warn('[Meta API] Circuit breaker opened:', event)
    })

    this.client.on('rate-limit', (event) => {
      logger.warn('[Meta API] Rate limit approaching:', event)
    })

    this.convex = new ConvexClient(import.meta.env.VITE_CONVEX_URL!)
  }

  async syncCampaigns(options: SyncOptions = {}) {
    try {
      logger.debug('[Sync] Starting campaign sync...')

      // Get campaigns from Meta API with caching
      const campaigns = await this.client.getCampaigns({ cache: true })
      logger.debug(`[Sync] Fetched ${campaigns.length} campaigns from Meta API`)

      // Apply filters if specified
      let filteredCampaigns = campaigns
      if (options.filters) {
        if (options.filters.status) {
          filteredCampaigns = filteredCampaigns.filter((c) =>
            options.filters!.status!.includes(c.status)
          )
        }
        if (options.filters.objectives) {
          filteredCampaigns = filteredCampaigns.filter((c) =>
            options.filters!.objectives!.includes(c.objective)
          )
        }
      }

      // Transform campaigns for Convex
      const transformedCampaigns = await Promise.all(
        filteredCampaigns.map(async (campaign) => {
          // Get insights for each campaign
          const insights = await this.client.getCampaignInsights(campaign.id)

          return {
            metaId: campaign.id,
            accountId: campaign.account_id,
            name: campaign.name,
            objective: campaign.objective,
            status: campaign.status,
            dailyBudget: campaign.daily_budget,
            lifetimeBudget: campaign.lifetime_budget,
            startTime: campaign.start_time,
            stopTime: campaign.stop_time,
            insights:
              insights.data && insights.data.length > 0
                ? {
                    impressions: insights.data[0].impressions || 0,
                    clicks: insights.data[0].clicks || 0,
                    spend: parseFloat(insights.data[0].spend || '0'),
                    conversions: insights.data[0].conversions || 0,
                    revenue: parseFloat(insights.data[0].revenue || '0'),
                  }
                : undefined,
          }
        })
      )

      // Sync to Convex
      const result = await this.convex.mutation(api.metaSync.syncMetaCampaigns, {
        campaigns: transformedCampaigns,
      })

      logger.debug('[Sync] Campaign sync completed:', result)
      return result
    } catch (error) {
      logger.error('[Sync] Campaign sync failed:', error)
      throw error
    }
  }

  async syncCreatives(campaignIds?: string[]) {
    try {
      logger.debug('[Sync] Starting creative sync...')

      // If no campaign IDs provided, get all campaigns first
      if (!campaignIds) {
        const campaigns = await this.client.getCampaigns({ cache: true })
        campaignIds = campaigns.map((c) => c.id)
      }

      const allCreatives = []

      // Get creatives for each campaign
      for (const campaignId of campaignIds) {
        const creatives = await this.client.getCreativesByCampaign(campaignId)
        allCreatives.push(...creatives)
      }

      logger.debug(`[Sync] Fetched ${allCreatives.length} creatives from Meta API`)

      // Transform creatives for Convex
      // TODO: Implement when syncMetaCreatives is available
      // const transformedCreatives = allCreatives.map((creative) => ({
      //   metaId: creative.id,
      //   name: creative.name,
      //   campaignId: creative.campaign_id,
      //   adsetId: creative.adset_id,
      //   creativeType: creative.creative_type,
      //   thumbnailUrl: creative.thumbnail_url,
      //   videoUrl: creative.video_url,
      //   body: creative.body,
      //   title: creative.title,
      //   callToActionType: creative.call_to_action_type,
      // }))

      // Sync to Convex - syncMetaCreatives not implemented yet
      // const result = await this.convex.mutation(api.metaSync.syncMetaCreatives, {
      //   creatives: transformedCreatives,
      // })
      const result = 'Not implemented'

      logger.debug('[Sync] Creative sync completed:', result)
      return result
    } catch (error) {
      logger.error('[Sync] Creative sync failed:', error)
      throw error
    }
  }

  async scheduleSync(
    _type: 'campaigns' | 'creatives' | 'insights',
    _interval: 'hourly' | 'daily' | 'weekly',
    _config?: any
  ) {
    try {
      // scheduleSync not implemented yet
      // const result = await this.convex.mutation(api.metaSync.scheduleSync, {
      //   type,
      //   interval,
      //   config: config || {},
      // })
      const result = { success: false, message: 'Not implemented' }

      logger.debug(`[Sync] Scheduled ${_type} sync with ${_interval} interval:`, result)
      return result
    } catch (error) {
      logger.error('[Sync] Failed to schedule sync:', error)
      throw error
    }
  }

  async getSyncHistory(_limit?: number) {
    try {
      // getSyncHistory not implemented yet
      // const history = await this.convex.query(api.metaSync.getSyncHistory, {
      //   limit,
      // })
      const history: any[] = []
      return history
    } catch (error) {
      logger.error('[Sync] Failed to get sync history:', error)
      throw error
    }
  }

  getMetricsSnapshot() {
    return {
      apiMetrics: this.client.getMetrics(),
      rateLimitStatus: this.client.getRateLimitStatus(),
    }
  }
}
