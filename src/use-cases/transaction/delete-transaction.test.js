import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './delete-transaction'

describe('DeleteTransactionUseCase', () => {
    const transaction = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.string.alpha(10),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: 'EXPENSE'
    }

    class DeleteTransactionRepositoryStub {
        async execute(transactionId) {
            return { ...transaction, id: transactionId }
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
        expect(result).toEqual({ ...transaction, id })
    })
})
