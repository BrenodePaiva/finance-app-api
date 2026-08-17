import { prisma } from '../../../../prisma/prisma.js'
import { Prisma, TransactionType } from '../../../generated/prisma/client.ts'

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
        const {
            _sum: { amount: totalEarnings }
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: TransactionType.EARNING
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
                type: TransactionType.EXPENSE
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
                type: TransactionType.INVESTMENT
            },
            _sum: {
                amount: true
            }
        })

        const _totalEarnings = totalEarnings || Prisma.Decimal(0)
        const _totalExpenses = totalExpenses || Prisma.Decimal(0)
        const _totalInvestiments = totalInvestiments || Prisma.Decimal(0)

        const total = _totalEarnings
            .plus(_totalExpenses)
            .plus(_totalInvestiments)

        const balance = _totalEarnings
            .minus(_totalExpenses)
            .minus(_totalInvestiments)

        const earningsPercentage = total.isZero()
            ? 0
            : _totalEarnings.div(total).times(100).floor()

        const expensesPrecentage = total.isZero()
            ? 0
            : _totalExpenses.div(total).times(100).floor()

        const investimentsPercentage = total.isZero()
            ? 0
            : _totalInvestiments.div(total).times(100).floor()

        return {
            earnings: _totalEarnings,
            expenses: _totalExpenses,
            investiments: _totalInvestiments,
            earningsPercentage,
            expensesPrecentage,
            investimentsPercentage,
            balance
        }
    }
}
