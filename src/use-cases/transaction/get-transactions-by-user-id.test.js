import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id'
import { UserNotFoundError } from '../../errors/user'

describe('GetTransactionsByUserId', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 })
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    class GetTransactionsByUserIdRepositoryStub {
        async execute() {
            return []
        }
    }

    const makeSut = () => {
        const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub()

        const getTransactionsByUserIdRepositoryStub =
            new GetTransactionsByUserIdRepositoryStub()

        const sut = new GetTransactionsByUserIdUseCase(
            getUserByIdRepositoryStub,
            getTransactionsByUserIdRepositoryStub
        )

        return {
            sut,
            getUserByIdRepositoryStub,
            getTransactionsByUserIdRepositoryStub
        }
    }

    it('should get transactions by user id successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(user.id)

        // assert
        expect(result).toEqual([])
    })

    it('should throw UserNotFoundError if user does not exist', async () => {
        // arrange
        const { sut, getUserByIdRepositoryStub } = makeSut()
        jest.spyOn(getUserByIdRepositoryStub, 'execute').mockResolvedValueOnce(
            null
        )

        // act
        const promise = sut.execute(user.id)

        // assert
        expect(promise).rejects.toThrow(new UserNotFoundError(user.id))
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        // arrange
        const { sut, getUserByIdRepositoryStub } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdRepositoryStub, 'execute')

        // act
        await sut.execute(user.id)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(user.id)
    })

    it('should call GetTransactionsByUserIdRepository with correct params', async () => {
        // arrange
        const { sut, getTransactionsByUserIdRepositoryStub } = makeSut()
        const executeSpy = jest.spyOn(
            getTransactionsByUserIdRepositoryStub,
            'execute'
        )

        // act
        await sut.execute(user.id)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(user.id)
    })

    it('should throw GetUserByIdRepository throws', async () => {
        // arrange
        const { sut, getUserByIdRepositoryStub } = makeSut()
        jest.spyOn(getUserByIdRepositoryStub, 'execute').mockRejectedValueOnce(
            new Error()
        )

        // act
        const promise = sut.execute(user.id)

        // assert
        expect(promise).rejects.toThrow()
    })
})
