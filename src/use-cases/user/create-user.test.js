import { faker } from '@faker-js/faker'
import { CreateUserUseCase } from './create-user'
import { EmailAlreadyInUseError } from '../../errors/user'

describe('CreateUserUseCase', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'generate_id'
        }
    }

    class PasswordHasherAdapterStub {
        execute() {
            return 'password_hasher'
        }
    }

    class CreateUserRepositoryStub {
        async execute(user) {
            return user
        }
    }

    const makeSut = () => {
        const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub()

        const idGeneratorAdapterStub = new IdGeneratorAdapterStub()

        const passwordHasherAdapterStub = new PasswordHasherAdapterStub()

        const createUserRepositoryStub = new CreateUserRepositoryStub()

        const sut = new CreateUserUseCase(
            getUserByEmailRepositoryStub,
            idGeneratorAdapterStub,
            passwordHasherAdapterStub,
            createUserRepositoryStub
        )

        return {
            sut,
            getUserByEmailRepositoryStub,
            idGeneratorAdapterStub,
            passwordHasherAdapterStub,
            createUserRepositoryStub
        }
    }

    const params = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 })
    }

    it('should successfully create a user', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const createUser = await sut.execute(params)

        // assert
        expect(createUser).toBeTruthy()
    })

    it('should throw an EmailAlreadyInUseError if GetUserByEmailRepository returns a user', async () => {
        // arrange
        const { sut, getUserByEmailRepositoryStub } = makeSut()
        jest.spyOn(getUserByEmailRepositoryStub, 'execute').mockReturnValueOnce(
            params
        )

        // act
        const promise = sut.execute(params)

        // assert
        expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(params.email)
        )
    })
})
