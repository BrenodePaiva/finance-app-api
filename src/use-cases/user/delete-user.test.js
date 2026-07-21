import { faker } from '@faker-js/faker'
import { DeleteUserUseCase } from './delete-user'
import { user } from '../../tests'

describe('DeleteUserUseCase', () => {
    class DeleteUserRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const deleteUserRepositoryStub = new DeleteUserRepositoryStub()

        const sut = new DeleteUserUseCase(deleteUserRepositoryStub)

        return { sut, deleteUserRepositoryStub }
    }

    it('should successfully delete a user', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const deletedUser = await sut.execute(faker.string.uuid())

        // assert
        expect(deletedUser).toEqual(user)
    })

    it('should calls DeleteUserRepository with correct params', async () => {
        // arrange
        const { sut, deleteUserRepositoryStub } = makeSut()
        const executeSpy = jest.spyOn(deleteUserRepositoryStub, 'execute')

        // act
        await sut.execute(user.id)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(user.id)
    })

    it('should throw if DeleteUserRepository throws', async () => {
        // arrange
        const { sut, deleteUserRepositoryStub } = makeSut()
        jest.spyOn(deleteUserRepositoryStub, 'execute').mockRejectedValueOnce(
            new Error()
        )

        // act
        const promise = sut.execute(user.id)

        // assert
        expect(promise).rejects.toThrow()
    })
})
