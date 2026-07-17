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
            return 'generated_id'
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
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

    it('should call IdGeneratorAdapter to generate a random id', async () => {
        // arrange
        const { sut, idGeneratorAdapterStub, createUserRepositoryStub } =
            makeSut()
        const idGeneratorSpy = jest.spyOn(idGeneratorAdapterStub, 'execute')
        const createUserRepositorySpy = jest.spyOn(
            createUserRepositoryStub,
            'execute'
        )

        // act
        await sut.execute(params)

        // assert
        expect(idGeneratorSpy).toHaveBeenCalled()
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...params,
            id: 'generated_id',
            password: 'hashed_password'
        })
    })

    it('should call PasswordHasherAdapter to cryptograph password', async () => {
        // arrange
        const { sut, passwordHasherAdapterStub, createUserRepositoryStub } =
            makeSut()
        const passwordHasherSpy = jest.spyOn(
            passwordHasherAdapterStub,
            'execute'
        )
        const createUserRepositorySpy = jest.spyOn(
            createUserRepositoryStub,
            'execute'
        )

        // act
        await sut.execute(params)

        // assert
        expect(passwordHasherSpy).toHaveBeenCalledWith(params.password)
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...params,
            id: 'generated_id',
            password: 'hashed_password'
        })
    })

    it('should throw if GetUserByEmailRepository throws', async () => {
        // arrange
        const { sut, getUserByEmailRepositoryStub } = makeSut()
        jest.spyOn(
            getUserByEmailRepositoryStub,
            'execute'
        ).mockRejectedValueOnce(new Error())

        // act
        const promise = sut.execute(params)

        // assert
        expect(promise).rejects.toThrow()
    })
})
