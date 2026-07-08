import { PostgresHelper } from '../../db/postgres/helper'

export class PostgresGetTransactionsByUserIdRepository {
    async execute(userId) {
        const transaction = await PostgresHelper.query(
            'SELECT * FROM transactions WHERE user_id = $1',
            [userId]
        )
        return transaction
    }
}
