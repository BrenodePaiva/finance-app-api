import request from 'supertest'
import { app } from '../app'

describe('Health Router E2E Tests', () => {
    it('GET /api/health should return 200 with status, uptime and timestamp', async () => {
        const response = await request(app).get('/api/health')

        expect(response.status).toBe(200)
        expect(response.body.status).toBe('ok')
        expect(typeof response.body.uptime).toBe('number')
        expect(new Date(response.body.timestamp).toISOString()).toBe(
            response.body.timestamp
        )
    })
})
