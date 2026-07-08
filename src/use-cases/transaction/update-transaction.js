import { UserNotFoundError } from '../../errors/user'

export class UpdateTransactionUseCase {
    constructor(getUserByIdRepository, updateTransactionRepository) {
        this.getUserByIdRepository = getUserByIdRepository
        this.updateTransactionRepository = updateTransactionRepository
    }
    async execute(params) {
        const user = await this.getUserByIdRepository.execute(params.userId)
        if (!user) {
            throw new UserNotFoundError(params.userId)
        }

        return await this.updateTransactionRepository.execute(params)
    }
}
