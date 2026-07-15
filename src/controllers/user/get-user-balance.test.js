import { faker } from '@faker-js/faker'
import { GetUserBalanceController } from './get-user-balance'

describe('Get User Balance', () => {
    class GetUserBalanceUseCaseStub {
        async execute() {
            return faker.finance.amount()
        }
    }

    const makeSut = () => {
        const getUserBalanceUseCaseStub = new GetUserBalanceUseCaseStub()
        const sut = new GetUserBalanceController(getUserBalanceUseCaseStub)

        return { sut, getUserBalanceUseCaseStub }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid()
        }
    }

    it('should return 200 when getting user balance', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when userId is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            params: { userId: 'invalid_id' }
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 500 if GetUserBalanceUseCase throws', async () => {
        // arrange
        const { sut, getUserBalanceUseCaseStub } = makeSut()
        jest.spyOn(getUserBalanceUseCaseStub, 'execute').mockRejectedValueOnce(
            new Error()
        )

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })
})
