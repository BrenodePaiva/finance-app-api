import { InvalidPasswordError, UserNotFoundError } from '../../errors/user'
import { user } from '../../tests/index'
import { LoginUserUseCase } from './login-user'

describe('LoginUserUseCase', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return user
        }
    }

    class PasswordComparatorAdapterStub {
        async execute() {
            return true
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

    const makeSut = () => {
        const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub()

        const passwordComparatorAdapterStub =
            new PasswordComparatorAdapterStub()

        const tokensGeneratorAdapter = new TokensGeneratorAdapterStub()

        const sut = new LoginUserUseCase(
            getUserByEmailRepositoryStub,
            passwordComparatorAdapterStub,
            tokensGeneratorAdapter
        )

        return {
            sut,
            getUserByEmailRepositoryStub,
            passwordComparatorAdapterStub,
            tokensGeneratorAdapter
        }
    }

    it('should throw UserNotFountError if user not found', async () => {
        const { sut, getUserByEmailRepositoryStub } = makeSut()
        jest.spyOn(
            getUserByEmailRepositoryStub,
            'execute'
        ).mockResolvedValueOnce(null)

        const promise = sut.execute('any_email', 'any_password')

        expect(promise).rejects.toThrow(new UserNotFoundError())
    })

    it('should throw InvalidPasswordError if password is invalid', async () => {
        const { sut, passwordComparatorAdapterStub } = makeSut()
        jest.spyOn(
            passwordComparatorAdapterStub,
            'execute'
        ).mockReturnValueOnce(false)

        const promise = sut.execute('any_email', 'any_password')

        expect(promise).rejects.toThrow(new InvalidPasswordError())
    })

    it('should return user with tokens', async () => {
        const { sut } = makeSut()

        const result = await sut.execute('any_email', 'any_password')

        expect(result.tokens.accessToken).toBeDefined()
    })
})
