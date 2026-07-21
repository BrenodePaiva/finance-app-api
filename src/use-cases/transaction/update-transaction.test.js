import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transaction'
import { transaction } from '../../tests'

describe('UpdateTransaction', () => {
    class UpdateTransactionRepositoryStub {
        async execute() {
            return transaction
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
