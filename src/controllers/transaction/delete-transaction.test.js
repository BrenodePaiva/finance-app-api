import { faker } from '@faker-js/faker'
import { DeleteTransactioController } from './delete-transaction'
import { transaction } from '../../tests'

describe('DeleteTransactioController', () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const deleteTransactionUseCaseStub = new DeleteTransactionUseCaseStub()
        const sut = new DeleteTransactioController(deleteTransactionUseCaseStub)

        return { sut, deleteTransactionUseCaseStub }
    }

    const httpRequest = {
        params: {
            transactionId: faker.string.uuid()
        }
    }

    it('should return 200 when deleting a transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when id is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            params: { transactionId: 'invalid_id' }
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 transaction is not found', async () => {
        // arrange
        const { sut, deleteTransactionUseCaseStub } = makeSut()
        jest.spyOn(
            deleteTransactionUseCaseStub,
            'execute'
        ).mockResolvedValueOnce(null)

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 DeleteTransactionUseCase throws', async () => {
        // arrange
        const { sut, deleteTransactionUseCaseStub } = makeSut()
        jest.spyOn(
            deleteTransactionUseCaseStub,
            'execute'
        ).mockRejectedValueOnce(new Error())

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })

    it('should call DeleteTransactionUseCase with correct params', async () => {
        // arrange
        const { sut, deleteTransactionUseCaseStub } = makeSut()
        const executeSpy = jest.spyOn(deleteTransactionUseCaseStub, 'execute')

        // act
        await sut.execute(httpRequest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.transactionId
        )
    })
})
