import { faker } from '@faker-js/faker'
import { GetUserByIdUseCase } from './get-user-by-id'

describe('GetUserByIdUseCase', () => {
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

    const makeSut = () => {
        const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub()

        const sut = new GetUserByIdUseCase(getUserByIdRepositoryStub)

        return { sut, getUserByIdRepositoryStub }
    }

    it('should get user by id successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(faker.string.uuid())

        // assert
        expect(result).toEqual(user)
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
})
