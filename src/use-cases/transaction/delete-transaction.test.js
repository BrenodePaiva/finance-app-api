import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './delete-transaction'
import { transaction } from '../../tests'

describe('DeleteTransactionUseCase', () => {
    class DeleteTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const deleteTransactionRepositoryStub =
            new DeleteTransactionRepositoryStub()

        const sut = new DeleteTransactionUseCase(
            deleteTransactionRepositoryStub
        )

        return { sut, deleteTransactionRepositoryStub }
    }

    it('should delete transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()
        const id = faker.string.uuid()

        // act
        const result = await sut.execute(id)

        // assert
        expect(result).toEqual(transaction)
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        // arrange
        const { sut, deleteTransactionRepositoryStub } = makeSut()
        const executeSpy = jest.spyOn(
            deleteTransactionRepositoryStub,
            'execute'
        )
        const id = faker.string.uuid()

        // act
        await sut.execute(id)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(id)
    })

    it('should throw if DeleteTransactionRepository throws', async () => {
        // arrange
        const { sut, deleteTransactionRepositoryStub } = makeSut()
        jest.spyOn(
            deleteTransactionRepositoryStub,
            'execute'
        ).mockRejectedValueOnce(new Error())
        const id = faker.string.uuid()

        // act
        const promise = sut.execute(id)

        // assert
        expect(promise).rejects.toThrow()
    })
})
