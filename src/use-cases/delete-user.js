export class DeleteUserUseCase {
    constructor(deleteUserRepository) {
        this.deleteUserRepository = deleteUserRepository
    }
    async execute(userId) {
        return await this.deleteUserRepository.execute(userId)
    }
}
