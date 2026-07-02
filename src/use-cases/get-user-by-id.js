import { PostgresGetUserByIdRepository } from '../repositories/postgres/get-user-by-id.js'

export class GetUserByIdUseCase {
    async execute(userId) {
        const postgresGetUserByIdRepository =
            new PostgresGetUserByIdRepository()
        return await postgresGetUserByIdRepository.execute(userId)
    }
}
