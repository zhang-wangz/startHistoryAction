import { NextApiRequest, NextApiResponse } from 'next'
import api from '../../shared/common/api'
import { DEFAULT_MAX_REQUEST_AMOUNT } from '../../shared/common/chart'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: '只支持GET请求' })
    }

    const { repo, token } = req.query

    if (!repo || typeof repo !== 'string') {
        return res.status(400).json({ error: '缺少repo参数' })
    }

    try {
        const starRecords = await api.getRepoStarRecords(repo, token as string || "", DEFAULT_MAX_REQUEST_AMOUNT)
        res.status(200).json({ starRecords })
    } catch (error: any) {
        let message = "获取数据失败"
        let status = 500

        if (error?.response?.status === 404) {
            message = `仓库 ${repo} 未找到`
            status = 404
        } else if (error?.response?.status === 403) {
            message = "GitHub API 请求次数超限"
            status = 403
        } else if (error?.response?.status === 401) {
            message = "GitHub Token 未授权"
            status = 401
        } else if (Array.isArray(error?.data) && error.data?.length === 0) {
            message = `仓库 ${repo} 没有star历史`
            status = 501
        }

        res.status(status).json({ error: message })
    }
} 