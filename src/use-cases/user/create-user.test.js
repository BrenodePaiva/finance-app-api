import { CreateUserUseCase } from './create-user'
import { EmailAlreadyInUseError } from '../../errors/user'
import { user as fixtureUser } from '../../tests'

describe('CreateUserUseCase', () => {
    const user = {
        ...fixtureUser,
        id: undefined
    }
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

    class TokensGeneratorAdapterStub {
        execute() {
            return {
                accessToken: 'any_accessToken',
                refreshToken: 'any_refreshToken'
            }
        }
    }

    class CreateUserRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub()

        const idGeneratorAdapterStub = new IdGeneratorAdapterStub()

        const passwordHasherAdapterStub = new PasswordHasherAdapterStub()

        const tokensGeneratorAdapterStub = new TokensGeneratorAdapterStub()

        const createUserRepositoryStub = new CreateUserRepositoryStub()

        const sut = new CreateUserUseCase(
            getUserByEmailRepositoryStub,
            idGeneratorAdapterStub,
            passwordHasherAdapterStub,
            tokensGeneratorAdapterStub,
            createUserRepositoryStub
        )

        return {
            sut,
            getUserByEmailRepositoryStub,
            idGeneratorAdapterStub,
            passwordHasherAdapterStub,
            tokensGeneratorAdapterStub,
            createUserRepositoryStub
        }
    }

    it('should successfully create a user', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const createUser = await sut.execute(user)

        // assert
        expect(createUser).toBeTruthy()
        expect(createUser.tokens.accessToken).toBeDefined()
        expect(createUser.tokens.refreshToken).toBeDefined()
    })

    it('should throw an EmailAlreadyInUseError if GetUserByEmailRepository returns a user', async () => {
        // arrange
        const { sut, getUserByEmailRepositoryStub } = makeSut()
        jest.spyOn(getUserByEmailRepositoryStub, 'execute').mockReturnValueOnce(
            user
        )

        // act
        const promise = sut.execute(user)

        // assert
        expect(promise).rejects.toThrow(new EmailAlreadyInUseError(user.email))
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
        await sut.execute(user)

        // assert
        expect(idGeneratorSpy).toHaveBeenCalled()
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
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
        await sut.execute(user)

        // assert
        expect(passwordHasherSpy).toHaveBeenCalledWith(user.password)
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
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
        const promise = sut.execute(user)

        // assert
        expect(promise).rejects.toThrow()
    })

    it('should throw if IdGenerateAdapter throws', async () => {
        // arrange
        const { sut, idGeneratorAdapterStub } = makeSut()
        jest.spyOn(idGeneratorAdapterStub, 'execute').mockImplementationOnce(
            () => {
                throw new Error()
            }
        )

        // act
        const promise = sut.execute(user)

        // assert
        expect(promise).rejects.toThrow()
    })

    it('should throw if PasswordHasherAdapter throws', async () => {
        // arrange
        const { sut, passwordHasherAdapterStub } = makeSut()
        jest.spyOn(passwordHasherAdapterStub, 'execute').mockRejectedValueOnce(
            new Error()
        )

        // act
        const promise = sut.execute(user)

        // assert
        expect(promise).rejects.toThrow()
    })

    it('should throw if CreateUserRepository throws', async () => {
        // arrange
        const { sut, createUserRepositoryStub } = makeSut()
        jest.spyOn(createUserRepositoryStub, 'execute').mockRejectedValueOnce(
            new Error()
        )

        // act
        const promise = sut.execute(user)

        // assert
        expect(promise).rejects.toThrow()
    })
})
