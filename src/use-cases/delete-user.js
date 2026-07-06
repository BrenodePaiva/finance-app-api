export class DeleteUserUseCase {
    constructor(deleteUserUseCase) {
        this.deleteUserUseCase = deleteUserUseCase
    }
    async execute(userId) {
        return await this.deleteUserUseCase.execute(userId)
    }
}
