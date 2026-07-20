import { faker } from '@faker-js/faker'
import { CreateTransactionUseCase } from './create-transaction'
import { UserNotFoundError } from '../../errors/user'

describe('CreateTransactionUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 })
    }

    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return { ...user, id: userId }
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'random_id'
        }
    }

    class CreateTransactionRepositoryStub {
        async execute(transaction) {
            return transaction
        }
    }

    const makeSut = () => {
        const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub()

        const idGeneratorAdapterStub = new IdGeneratorAdapterStub()

        const createTransactionRepositoryStub =
            new CreateTransactionRepositoryStub()

        const sut = new CreateTransactionUseCase(
            getUserByIdRepositoryStub,
            idGeneratorAdapterStub,
            createTransactionRepositoryStub
        )

        return {
            sut,
            getUserByIdRepositoryStub,
            idGeneratorAdapterStub,
            createTransactionRepositoryStub
        }
    }

    const params = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.string.alpha(10),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: 'EXPENSE'
    }

    it('should create transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(params)

        // assert
        expect(result).toEqual({ ...params, id: 'random_id' })
    })

    it('should call GetUserByEmailRepository with correct params', async () => {
        // arrange
        const { sut, getUserByIdRepositoryStub } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdRepositoryStub, 'execute')

        // act
        await sut.execute(params)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(params.user_id)
    })

    it('should call IdGeneratorAdapter', async () => {
        // arrange
        const { sut, idGeneratorAdapterStub } = makeSut()
        const executeSpy = jest.spyOn(idGeneratorAdapterStub, 'execute')

        // act
        await sut.execute(params)

        // assert
        expect(executeSpy).toHaveBeenCalled()
    })

    it('should call CreateTransactionRepository with correct params', async () => {
        // arrange
        const { sut, createTransactionRepositoryStub } = makeSut()
        const executeSpy = jest.spyOn(
            createTransactionRepositoryStub,
            'execute'
        )

        // act
        await sut.execute(params)

        // assert
        expect(executeSpy).toHaveBeenCalledWith({ ...params, id: 'random_id' })
    })

    it('should throw UserNotFountError if user does not exist', async () => {
        // arrange
        const { sut, getUserByIdRepositoryStub } = makeSut()
        jest.spyOn(getUserByIdRepositoryStub, 'execute').mockResolvedValueOnce(
            null
        )

        // act
        const promise = sut.execute(params)

        // assert
        expect(promise).rejects.toThrow(new UserNotFoundError(params.user_id))
    })

    it('should throw if GetUserByIdRopository throws', async () => {
        // arrange
        const { sut, getUserByIdRepositoryStub } = makeSut()
        jest.spyOn(getUserByIdRepositoryStub, 'execute').mockRejectedValueOnce(
            new Error()
        )

        // act
        const promise = sut.execute(params)

        // assert
        expect(promise).rejects.toThrow()
    })
})
