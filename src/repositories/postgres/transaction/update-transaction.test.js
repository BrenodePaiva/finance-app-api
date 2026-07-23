import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { transaction, user } from '../../../tests'
import { PostgresUpdateTransactionRepository } from './update-transaction'
import { TransactionType } from '../../../generated/prisma/enums'
import dayjs from 'dayjs'

describe('PostgresUpdateTransactionRepository', () => {
    it('should update a transaction on db', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id }
        })
        const sut = new PostgresUpdateTransactionRepository()
        const params = {
            id: faker.string.uuid(),
            user_id: user.id,
            name: faker.string.alpha(10),
            date: faker.date.anytime().toISOString(),
            amount: Number(faker.finance.amount()),
            type: TransactionType.EXPENSE
        }

        const result = await sut.execute(transaction.id, params)

        expect(result.id).toBe(params.id)
        expect(result.user_id).toBe(params.user_id)
        expect(result.name).toBe(params.name)
        expect(String(result.amount)).toBe(String(params.amount))
        expect(result.type).toBe(params.type)
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(params.date).daysInMonth()
        )
        expect(dayjs(result.date).month()).toBe(dayjs(params.date).month())
        expect(dayjs(result.date).year()).toBe(dayjs(params.date).year())
    })
})
