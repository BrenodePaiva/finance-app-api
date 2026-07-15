import { faker } from '@faker-js/faker'
import { CreateTransactionController } from './create-transaction'

describe('CreateTransactionController', () => {
    class CreateTransactionUseCaseStub {
        async execute(trasanction) {
            return trasanction
        }
    }

    const makeSut = () => {
        const createTransactionUseCaseStub = new CreateTransactionUseCaseStub()
        const sut = new CreateTransactionController(
            createTransactionUseCaseStub
        )

        return { sut, createTransactionUseCaseStub }
    }

    const httpRequest = {
        body: {
            user_id: faker.string.uuid(),
            name: faker.string.alpha(10),
            date: faker.date.anytime().toISOString(),
            amount: Number(faker.finance.amount()),
            type: 'EXPENSE'
        }
    }

    it('should return 201 when creating transaction successfuly', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(201)
    })
})
