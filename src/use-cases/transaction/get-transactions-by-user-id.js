import { UserNotFoundError } from '../../errors/user'

export class GetTransactionsByUserIdUseCase {
    constructor(getUserByIdRepository, getTransactionsByUserIdRepository) {
        this.getUserByIdRepository = getUserByIdRepository
        this.getTransactionsByUserIdRepository =
            getTransactionsByUserIdRepository
    }
    async execute(params) {
        const user = await this.getUserByIdRepository.execute(params.userId)

        if (!user) {
            throw new UserNotFoundError()
        }

        return await this.getTransactionsByUserIdRepository.execute(
            params.userId
        )
    }
}
