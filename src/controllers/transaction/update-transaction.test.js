import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from './update-transaction'

describe('UpdateTransactioController', () => {
    class UpdateTransactionUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                user_id: faker.string.uuid(),
                name: faker.string.alpha(10),
                date: faker.date.anytime().toISOString(),
                amount: Number(faker.finance.amount()),
                type: 'EXPENSE'
            }
        }
    }

    const makeSut = () => {
        const updateTransactionUseCaseStub = new UpdateTransactionUseCaseStub()
        const sut = new UpdateTransactionController(
            updateTransactionUseCaseStub
        )

        return { sut, updateTransactionUseCaseStub }
    }

    const httpRequest = {
        params: {
            transactionId: faker.string.uuid()
        },
        body: {
            name: faker.string.alpha(10),
            date: faker.date.anytime().toISOString(),
            amount: Number(faker.finance.amount()),
            type: 'EXPENSE'
        }
    }

    it('should return 200 when updating a transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when transaction id is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            params: { transactionId: 'invalid_id' }
        })

        // assert
        expect(result.statusCode).toBe(400)
    })
})
