import { UserNotFoundError } from '../../errors/user.js'

export class CreateTransactionUseCase {
    constructor(
        getUserByIdRepository,
        idGeneratorAdapter,
        createTransactionRepository
    ) {
        this.getUserByIdRepository = getUserByIdRepository
        this.idGeneratorAdapter = idGeneratorAdapter
        this.createTransactionRepository = createTransactionRepository
    }
    async execute(createTransactionParams) {
        const userId = createTransactionParams.user_id

        const user = await this.getUserByIdRepository.execute(userId)
        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transactionId = this.idGeneratorAdapter.execute()
        const transaction = await this.createTransactionRepository.execute({
            ...createTransactionParams,
            id: transactionId
        })

        return transaction
    }
}
