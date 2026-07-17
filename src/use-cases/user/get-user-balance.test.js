import { faker } from '@faker-js/faker'
import { GetUserBalanceUseCase } from './get-user-balance'

describe('GetUserBalanceUseCase', () => {
    const userBalance = {
        earnings: faker.finance.amount(),
        expenses: faker.finance.amount(),
        investiments: faker.finance.amount(),
        balance: faker.finance.amount()
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 })
            }
        }
    }

    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance
        }
    }

    const makeSut = () => {
        const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub()

        const getUserBalanceRepositoryStub = new GetUserBalanceRepositoryStub()

        const sut = new GetUserBalanceUseCase(
            getUserByIdRepositoryStub,
            getUserBalanceRepositoryStub
        )

        return { sut, getUserByIdRepositoryStub, getUserBalanceRepositoryStub }
    }

    it('should get user balance successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(faker.string.uuid())

        // assert
        expect(result).toEqual(userBalance)
    })
})
