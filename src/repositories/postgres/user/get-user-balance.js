import { prisma } from '../../../../prisma/prisma.js'
import { Prisma } from '../../../generated/prisma/client.ts'

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
        const {
            _sum: { amount: totalEarnings }
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: 'EARNING'
            },
            _sum: {
                amount: true
            }
        })

        const {
            _sum: { amount: totalExpenses }
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: 'EXPENSE'
            },
            _sum: {
                amount: true
            }
        })

        const {
            _sum: { amount: totalInvestiments }
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: 'INVESTMENT'
            },
            _sum: {
                amount: true
            }
        })

        const _totalEarnings = totalEarnings || Prisma.Decimal(0)
        const _totalExpenses = totalExpenses || Prisma.Decimal(0)
        const _totalInvestiments = totalInvestiments || Prisma.Decimal(0)

        const balance = Prisma.Decimal(
            _totalEarnings - _totalExpenses - _totalInvestiments
        )

        return {
            earnings: _totalEarnings,
            expenses: _totalExpenses,
            investiments: _totalInvestiments,
            balance
        }
    }
}
