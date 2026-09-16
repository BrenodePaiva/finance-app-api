import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { user as fakeUser } from '../../../tests'
import { PostgresGetUserBalanceRepository } from './get-user-balance'
import { TransactionType } from '../../../generated/prisma/enums'

describe('PostgresGetUserBalanceRepository', () => {
    const from = '2026-01-01'
    const to = '2026-01-31'

    it('should get user balance on db', async () => {
        const user = await prisma.user.create({
            data: fakeUser
        })

        await prisma.transaction.createMany({
            data: [
                {
                    user_id: user.id,
                    name: faker.string.alpha(10),
                    date: new Date(from),
                    amount: 5000,
                    type: 'EARNING'
                },
                {
                    user_id: user.id,
                    name: faker.string.alpha(10),
                    date: new Date(from),
                    amount: 5000,
                    type: 'EARNING'
                },
                {
                    user_id: user.id,
                    name: faker.string.alpha(10),
                    date: new Date(from),
                    amount: 1000,
                    type: 'EXPENSE'
                },
                {
                    user_id: user.id,
                    name: faker.string.alpha(10),
                    date: new Date(to),
                    amount: 1000,
                    type: 'EXPENSE'
                },
                {
                    user_id: user.id,
                    name: faker.string.alpha(10),
                    date: new Date(to),
                    amount: 3000,
                    type: 'INVESTMENT'
                },
                {
                    user_id: user.id,
                    name: faker.string.alpha(10),
                    date: new Date(to),
                    amount: 3000,
                    type: 'INVESTMENT'
                }
            ]
        })

        const sut = new PostgresGetUserBalanceRepository()

        const result = await sut.execute(user.id, from, to)

        expect(result.earnings.toString()).toBe('10000')
        expect(result.expenses.toString()).toBe('2000')
        expect(result.investiments.toString()).toBe('6000')
        expect(result.balance.toString()).toBe('2000')
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetUserBalanceRepository()

        const prismaSpy = jest.spyOn(prisma.transaction, 'aggregate')

        await sut.execute(fakeUser.id, from, to)

        expect(prismaSpy).toHaveBeenCalledTimes(3)
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: TransactionType.EARNING,
                date: {
                    gte: new Date(from),
                    lte: new Date(to)
                }
            },
            _sum: {
                amount: true
            }
        })

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: TransactionType.EXPENSE,
                date: {
                    gte: new Date(from),
                    lte: new Date(to)
                }
            },
            _sum: {
                amount: true
            }
        })

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: TransactionType.INVESTMENT,
                date: {
                    gte: new Date(from),
                    lte: new Date(to)
                }
            },
            _sum: {
                amount: true
            }
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresGetUserBalanceRepository()
        jest.spyOn(prisma.user, 'aggregate').mockRejectedValueOnce(new Error())

        const promise = sut.execute({ user_id: fakeUser.id, from, to })

        expect(promise).rejects.toThrow()
    })
})
