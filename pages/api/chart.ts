import { NextApiRequest, NextApiResponse } from 'next'
import api from '../../shared/common/api'
import { DEFAULT_MAX_REQUEST_AMOUNT } from '../../shared/common/chart'
import XYChart from '../../shared/packages/xy-chart'
import { JSDOM } from 'jsdom'
import sharp from 'sharp'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: '只支持GET请求' })
    }

    const { repo, token, type = 'Date', format = 'svg' } = req.query

    if (!repo || typeof repo !== 'string') {
        return res.status(400).json({ error: '缺少repo参数' })
    }

    try {
        // 获取star历史数据
        const starRecords = await api.getRepoStarRecords(repo, token as string || "", DEFAULT_MAX_REQUEST_AMOUNT)
        
        // 创建虚拟DOM环境
        const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
        const document = dom.window.document
        
        // 创建SVG元素，使用固定的宽高比
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        const width = 864
        const height = 576
        svg.setAttribute('width', width.toString())
        svg.setAttribute('height', height.toString())
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
        
        // 计算自适应的字体大小
        const baseFontSize = Math.min(width, height) * 0.03 // 基础字体大小为容器较小边的3%
        const titleFontSize = baseFontSize * 1.2 // 标题字体稍大
        const labelFontSize = baseFontSize * 0.9 // 标签字体稍小
        
        // 生成图表
        XYChart(svg, {
            title: 'Star History',
            xLabel: type === 'Timeline' ? 'Timeline' : 'Date',
            yLabel: 'GitHub Stars',
            data: {
                datasets: [{
                    label: repo,
                    logo: 'https://avatars.githubusercontent.com/u/49056179?v=4',
                    data: starRecords.map(record => ({
                        x: type === 'Timeline' ? new Date(record.date).getTime() : new Date(record.date),
                        y: record.count
                    }))
                }]
            },
            showDots: false,
            transparent: false,
            theme: 'light',
            fontSize: {
                title: titleFontSize,
                label: labelFontSize,
                axis: baseFontSize
            }
        }, {
            xTickLabelType: type === 'Date' ? 'Date' : 'Number',
            envType: 'node'
        })

        const svgString = svg.outerHTML
        
        // 根据请求的格式返回不同类型的响应
        if (format === 'png') {
            // 转换SVG为PNG，保持合适的分辨率
            const pngBuffer = await sharp(Buffer.from(svgString))
                .resize(width * 2, height * 2) // 2倍分辨率以确保清晰度
                .png()
                .toBuffer()
            
            res.setHeader('Content-Type', 'image/png')
            res.setHeader('Cache-Control', 'public, max-age=3600')
            res.status(200).send(pngBuffer)
        } else {
            res.setHeader('Content-Type', 'image/svg+xml')
            res.setHeader('Cache-Control', 'public, max-age=3600')
            res.status(200).send(svgString)
        }
        
    } catch (error: any) {
        let message = "生成图表失败"
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