import { faker } from '@faker-js/faker'
import { DeleteTransactioController } from './delete-transaction'

describe('DeleteTransactioController', () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return {
                user_id: faker.string.uuid(),
                name: faker.string.alpha(10),
                date: faker.date.anytime().toISOString(),
                amount: Number(faker.finance.amount()),
                type: 'EXPENSE'
            }
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
})
