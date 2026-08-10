import { UnauthorizedError } from '../../errors'
import { RefreshTokenUseCase } from './refresh-token'

describe('RefreshTokenUseCase', () => {
    class TokenVerifierAdapterStub {
        execute() {
            return true
        }
    }

    class TokensGeneratorAdapterStub {
        execute() {
            return {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token'
            }
        }
    }

    const makeSut = () => {
        const tokenVerifierAdapterStub = new TokenVerifierAdapterStub()

        const tokensGeneratorAdapterStub = new TokensGeneratorAdapterStub()

        const sut = new RefreshTokenUseCase(
            tokenVerifierAdapterStub,
            tokensGeneratorAdapterStub
        )

        return {
            sut,
            tokenVerifierAdapterStub,
            tokensGeneratorAdapterStub
        }
    }

    it('should return new tokens', () => {
        const { sut } = makeSut()
        const refreshToken = 'any_refresh_token'

        const result = sut.execute(refreshToken)

        expect(result).toEqual({
            accessToken: 'any_access_token',
            refreshToken: 'any_refresh_token'
        })
    })

    it('should throw if TokenVerifierAdapter throws', () => {
        const { sut, tokenVerifierAdapterStub } = makeSut()
        const refreshToken = 'any_refresh_token'
        jest.spyOn(tokenVerifierAdapterStub, 'execute').mockImplementationOnce(
            () => {
                throw new Error()
            }
        )

        expect(() => sut.execute(refreshToken)).toThrow(new UnauthorizedError())
    })
})
