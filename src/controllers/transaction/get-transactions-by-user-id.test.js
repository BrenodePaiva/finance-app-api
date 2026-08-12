import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id'
import { UserNotFoundError } from '../../errors/user'
import { transaction } from '../../tests'

describe('GetTransactionsByUserIdController', () => {
    class GetTransactionsByUserIdUseCaseStub {
        async execute() {
            return [transaction]
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdUseCaseStub =
            new GetTransactionsByUserIdUseCaseStub()
        const sut = new GetTransactionsByUserIdController(
            getTransactionsByUserIdUseCaseStub
        )

        return { sut, getTransactionsByUserIdUseCaseStub }
    }

    const httpRequest = {
        query: {
            userId: faker.string.uuid(),
            from: '2026-01-01',
            to: '2026-01-31'
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

    it('should return 400 when missing userId param', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            query: { userId: undefined }
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when userId param is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            query: { userId: 'invalid_user_id' }
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 when GetTransactionByUserIdUseCase throws UserNotFoundError', async () => {
        // arrange
        const { sut, getTransactionsByUserIdUseCaseStub } = makeSut()
        jest.spyOn(
            getTransactionsByUserIdUseCaseStub,
            'execute'
        ).mockRejectedValueOnce(new UserNotFoundError())

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 when GetTransactionByUserIdUseCase throws generic error', async () => {
        // arrange
        const { sut, getTransactionsByUserIdUseCaseStub } = makeSut()
        jest.spyOn(
            getTransactionsByUserIdUseCaseStub,
            'execute'
        ).mockRejectedValueOnce(new Error())

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })

    it('should call GetTransactionByUserIdUseCase with correct params', async () => {
        // arrange
        const { sut, getTransactionsByUserIdUseCaseStub } = makeSut()
        const executeSpy = jest.spyOn(
            getTransactionsByUserIdUseCaseStub,
            'execute'
        )

        // act
        await sut.execute(httpRequest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.query.userId)
    })
})
