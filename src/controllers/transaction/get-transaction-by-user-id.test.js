import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id'

describe('GetTransactionByUserIdController', () => {
    class GetTransactionByUserIdUseCaseStub {
        async execute() {
            return [
                {
                    id: faker.string.uuid(),
                    user_id: faker.string.uuid(),
                    name: faker.string.alpha(10),
                    date: faker.date.anytime().toISOString(),
                    amount: Number(faker.finance.amount()),
                    type: 'EXPENSE'
                }
            ]
        }
    }

    const makeSut = () => {
        const getTransactionByUserIdUseCaseStub =
            new GetTransactionByUserIdUseCaseStub()
        const sut = new GetTransactionsByUserIdController(
            getTransactionByUserIdUseCaseStub
        )

        return { sut, getTransactionByUserIdUseCaseStub }
    }

    const httpRequest = {
        query: {
            userId: faker.string.uuid()
        }
    }

    it('should return 200 when finding transaction by user id successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(200)
    })
})
