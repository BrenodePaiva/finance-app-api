import { ZodError } from 'zod'
import { UnauthorizedError } from '../../errors/index.js'
import { refreshTokenSchema } from '../../schemas/user.js'
import { badRequest, ok, serverError, unauthorized } from '../helpers/index.js'

export class RefreshTokenController {
    constructor(refreshTokenUseCase) {
        this.refreshTokenUseCase = refreshTokenUseCase
    }

    async execute(httpRequest) {
        try {
            const parmas = httpRequest.body
            await refreshTokenSchema.parseAsync(parmas)
            const response = this.refreshTokenUseCase.execute(
                parmas.refreshToken
            )

            return ok(response)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message
                })
            }

            if (error instanceof UnauthorizedError) {
                return unauthorized()
            }
            return serverError()
        }
    }
}
