import { InvalidPasswordError, UserNotFoundError } from '../../errors/user'
import { user } from '../../tests'
import { LoginUserController } from './login-user'

describe('LoginUserController', () => {
    class LoginUserUseCaseStub {
        async execute() {
            return {
                ...user,
                tokens: {
                    accessToken: 'any_accessToken',
                    refreshToken: 'any_refreshToekn'
                }
            }
        }
    }

    const httpRequest = {
        body: {
            email: user.email,
            password: user.password
        }
    }

    const makeSut = () => {
        const loginUserUseCaseStub = new LoginUserUseCaseStub()

        const sut = new LoginUserController(loginUserUseCaseStub)

        return { sut, loginUserUseCaseStub }
    }

    it('should return 200 with user and tokens', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
        expect(result.body.tokens.accessToken).toBe('any_accessToken')
        expect(result.body.tokens.refreshToken).toBe('any_refreshToekn')
    })

    it('should return 401 if password is invalid', async () => {
        const { sut, loginUserUseCaseStub } = makeSut()
        jest.spyOn(loginUserUseCaseStub, 'execute').mockRejectedValueOnce(
            new InvalidPasswordError()
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(401)
    })

    it('should return 404 if user is not found', async () => {
        const { sut, loginUserUseCaseStub } = makeSut()
        jest.spyOn(loginUserUseCaseStub, 'execute').mockRejectedValueOnce(
            new UserNotFoundError()
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
    })
})
