export class DeleteTransactionUseCase {
    constructor(deleteTransactionRepository) {
        this.deleteTransactionRepository = deleteTransactionRepository
    }
    async execute(transactionId) {
        return await this.deleteTransactionRepository.execute(transactionId)
    }
}
