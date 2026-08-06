import { ForbiddenError } from '../../errors/index.js'

export class UpdateTransactionUseCase {
    constructor(getTransactionByIdRepository, updateTransactionRepository) {
        this.getTransactionByIdRepository = getTransactionByIdRepository
        this.updateTransactionRepository = updateTransactionRepository
    }
    async execute(transactionId, params) {
        const transaction =
            await this.getTransactionByIdRepository.execute(transactionId)

        if (params?.userId && transaction.user_id !== params.user_id) {
            throw new ForbiddenError()
        }

        return await this.updateTransactionRepository.execute(
            transactionId,
            params
        )
    }
}
