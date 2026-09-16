import { Router } from 'express'

export const healthRouter = Router()

healthRouter.get('/', (request, response) => {
    response.status(200).send({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    })
})
