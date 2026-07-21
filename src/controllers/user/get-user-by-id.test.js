import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id'
import { user } from '../../tests'

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserByIdUseCaseStub = new GetUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserByIdUseCaseStub)

        return { sut, getUserByIdUseCaseStub }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid()
        }
    }

    it('should return 200 if user is found', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if an invalid id is provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            params: { userId: 'invalid_id' }
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if a user is not found', async () => {
        // arrange
        const { sut, getUserByIdUseCaseStub } = makeSut()
        jest.spyOn(getUserByIdUseCaseStub, 'execute').mockResolvedValueOnce(
            null
        )

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if GetUserByIdUseCase throws an error', async () => {
        // arrange
        const { sut, getUserByIdUseCaseStub } = makeSut()
        jest.spyOn(getUserByIdUseCaseStub, 'execute').mockRejectedValueOnce(
            new Error()
        )

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })

    it('should call GetUserByIdUseCase with correct params', async () => {
        // arrange
        const { sut, getUserByIdUseCaseStub } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdUseCaseStub, 'execute')

        // act
        await sut.execute(httpRequest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
    })
})
