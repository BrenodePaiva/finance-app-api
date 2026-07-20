import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transaction'

describe('UpdateTransaction', () => {
    const transaction = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.string.alpha(10),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: 'EXPENSE'
    }

    class UpdateTransactionRepositoryStub {
        async execute(transactionId) {
            return { ...transaction, id: transactionId }
        }
    }

    const makeSut = () => {
        const updateTransactionRepositoryStub =
            new UpdateTransactionRepositoryStub()

        const sut = new UpdateTransactionUseCase(
            updateTransactionRepositoryStub
        )

        return {
            sut,
            updateTransactionRepositoryStub
        }
    }

    it('should update a transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(transaction.id, {
            amount: Number(faker.finance.amount())
        })

        // assert
        expect(result).toEqual(transaction)
    })
})
