import request from 'supertest'
import { user } from '../tests'
import { app } from '../app'
import { faker } from '@faker-js/faker'
import { TransactionType } from '../generated/prisma/enums'

describe('User Router E2E Tests', () => {
    it('POST /api/users should return 201 when user is created', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined
            })

        expect(response.status).toBe(201)
    })

    it('GET /api/users/:userId should return 200 when user is found', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined
            })

        const response = await request(app).get(`/api/users/${createdUser.id}`)

        expect(response.status).toBe(200)
        expect(response.body).toEqual(createdUser)
    })

    it('PATCH /api/users/:userId should return 200 when user is updated', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined
            })
        const updateUserParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 })
        }

        const response = await request(app)
            .patch(`/api/users/${createdUser.id}`)
            .send(updateUserParams)

        expect(response.status).toBe(200)
        expect(response.body.first_name).toBe(updateUserParams.first_name)
        expect(response.body.last_name).toBe(updateUserParams.last_name)
        expect(response.body.email).toBe(updateUserParams.email)
        expect(response.body.password).not.toBe(createdUser.password)
    })

    it('DELETE /api/users/:userId should return 200 when user is deleted', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined
            })

        const response = await request(app).delete(
            `/api/users/${createdUser.id}`
        )

        expect(response.status).toBe(200)
        expect(response.body).toEqual(createdUser)
    })

    it('GET /api/users/:userId/balance should return 200 and correct balance', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined
            })
        await request(app)
            .post('/api/transactions')
            .send({
                user_id: createdUser.id,
                name: faker.string.alpha(10),
                date: faker.date.anytime().toISOString(),
                amount: 10000,
                type: TransactionType.EARNING
            })
        await request(app)
            .post('/api/transactions')
            .send({
                user_id: createdUser.id,
                name: faker.string.alpha(10),
                date: faker.date.anytime().toISOString(),
                amount: 2000,
                type: TransactionType.EXPENSE
            })
        await request(app)
            .post('/api/transactions')
            .send({
                user_id: createdUser.id,
                name: faker.string.alpha(10),
                date: faker.date.anytime().toISOString(),
                amount: 2000,
                type: TransactionType.INVESTMENT
            })

        const response = await request(app).get(
            `/api/users/${createdUser.id}/balance`
        )

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            earnings: '10000',
            expenses: '2000',
            investiments: '2000',
            balance: '6000'
        })
    })

    it('GET /api/users/:userId should return 404 when user is not found', async () => {
        const response = await request(app).get(
            `/api/users/${faker.string.uuid()}`
        )

        expect(response.status).toBe(404)
    })

    it('GET /api/users/:userId/balance should return 404 when user balance is not found', async () => {
        const response = await request(app).get(
            `/api/users/${faker.string.uuid()}/balance`
        )

        expect(response.status).toBe(404)
    })
})
