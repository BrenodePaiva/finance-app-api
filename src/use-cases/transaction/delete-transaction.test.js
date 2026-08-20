import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './delete-transaction'
import { transaction } from '../../tests'

describe('DeleteTransactionUseCase', () => {
    const user_id = faker.string.uuid()
    class GetTransactionByIdRepositoryStub {
        async execute() {
            return { ...transaction, user_id }
        }
    }
    class DeleteTransactionRepositoryStub {
        async execute() {
            return { ...transaction, user_id }
        }
    }

    const makeSut = () => {
        const getTransactionByIdRepositoryStub =
            new GetTransactionByIdRepositoryStub()

        const deleteTransactionRepositoryStub =
            new DeleteTransactionRepositoryStub()

        const sut = new DeleteTransactionUseCase(
            getTransactionByIdRepositoryStub,
            deleteTransactionRepositoryStub
        )

        return {
            sut,
            getTransactionByIdRepositoryStub,
            deleteTransactionRepositoryStub
        }
    }

    it('should delete transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()
        const id = faker.string.uuid()

        // act
        const result = await sut.execute(id, user_id)

        // assert
        expect(result).toEqual({ ...transaction, user_id })
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
        await sut.execute(id, user_id)

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
        const promise = sut.execute(id, user_id)

        // assert
        expect(promise).rejects.toThrow()
    })
})
