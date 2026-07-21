import { faker } from '@faker-js/faker'
import { GetUserBalanceUseCase } from './get-user-balance'
import { UserNotFoundError } from '../../errors/user'
import { user, userBalance } from '../../tests'

describe('GetUserBalanceUseCase', () => {
    class GetUserByIdRepositoryStub {
        async execute() {
            return user
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

    it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
        // arrange
        const { sut, getUserByIdRepositoryStub } = makeSut()
        jest.spyOn(getUserByIdRepositoryStub, 'execute').mockReturnValueOnce(
            null
        )
        const userId = faker.string.uuid()

        // act
        const promise = sut.execute(userId)

        // assert
        expect(promise).rejects.toThrow(new UserNotFoundError(userId))
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        // arrange
        const { sut, getUserByIdRepositoryStub } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdRepositoryStub, 'execute')
        const userId = faker.string.uuid()

        // act
        await sut.execute(userId)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should call GetUserBalanceRepository with correct params', async () => {
        // arrange
        const { sut, getUserBalanceRepositoryStub } = makeSut()
        const executeSpy = jest.spyOn(getUserBalanceRepositoryStub, 'execute')
        const userId = faker.string.uuid()

        // act
        await sut.execute(userId)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        // arrange
        const { sut, getUserByIdRepositoryStub } = makeSut()
        jest.spyOn(getUserByIdRepositoryStub, 'execute').mockRejectedValueOnce(
            new Error()
        )
        const userId = faker.string.uuid()

        // act
        const promise = sut.execute(userId)

        // assert
        expect(promise).rejects.toThrow()
    })

    it('should throw if GetUserBalanceRepository throws', async () => {
        // arrange
        const { sut, getUserBalanceRepositoryStub } = makeSut()
        jest.spyOn(
            getUserBalanceRepositoryStub,
            'execute'
        ).mockRejectedValueOnce(new Error())
        const userId = faker.string.uuid()

        // act
        const promise = sut.execute(userId)

        // assert
        expect(promise).rejects.toThrow()
    })
})
