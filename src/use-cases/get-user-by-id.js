import { PostgresGetUserByIdRepository } from '../repositories/postgres/index.js'

export class GetUserByIdUseCase {
    async execute(userId) {
        const postgresGetUserByIdRepository =
            new PostgresGetUserByIdRepository()
        return await postgresGetUserByIdRepository.execute(userId)
    }
}
