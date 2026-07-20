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

    it('should call UpdateTransactionRepository with correct params', async () => {
        // arrange
        const { sut, updateTransactionRepositoryStub } = makeSut()
        const executeSpy = jest.spyOn(
            updateTransactionRepositoryStub,
            'execute'
        )

        // act
        await sut.execute(transaction.id, {
            amount: transaction.amount
        })

        // assert
        expect(executeSpy).toHaveBeenCalledWith(transaction.id, {
            amount: transaction.amount
        })
    })

    it('should throw if UpdateTransactionRepository throws', async () => {
        // arrange
        const { sut, updateTransactionRepositoryStub } = makeSut()
        jest.spyOn(
            updateTransactionRepositoryStub,
            'execute'
        ).mockRejectedValueOnce(new Error())

        // act
        const promise = sut.execute(transaction.id)

        // assert
        expect(promise).rejects.toThrow()
    })
})
