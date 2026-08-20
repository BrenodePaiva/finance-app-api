import { ForbiddenError, TransactionNotFoundError } from '../../errors/index.js'

export class DeleteTransactionUseCase {
    constructor(getTransactionByIdRepository, deleteTransactionRepository) {
        this.getTransactionByIdRepository = getTransactionByIdRepository
        this.deleteTransactionRepository = deleteTransactionRepository
    }
    async execute(transactionId, userId) {
        const transaction =
            await this.getTransactionByIdRepository.execute(transactionId)

        if (!transaction) {
            throw new TransactionNotFoundError(transactionId)
        }

        if (transaction.user_id !== userId) {
            throw new ForbiddenError()
        }

        return await this.deleteTransactionRepository.execute(transactionId)
    }
}
