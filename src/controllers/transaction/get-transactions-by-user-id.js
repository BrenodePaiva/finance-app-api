import { ZodError } from 'zod'
import { UserNotFoundError } from '../../errors/user.js'
import { getTransactionByUserIdSchema } from '../../schemas/index.js'
import {
    serverError,
    userNotFoundResponse,
    ok,
    badRequest
} from '../helpers/index.js'

export class GetTransactionsByUserIdController {
    constructor(getTransactionByUserIdUseCase) {
        this.getTransactionByUserIdUseCase = getTransactionByUserIdUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId
            const from = httpRequest.query.from
            const to = httpRequest.query.to

            await getTransactionByUserIdSchema.parseAsync({
                user_id: userId,
                from,
                to
            })

            const transaction =
                await this.getTransactionByUserIdUseCase.execute(
                    userId,
                    from,
                    to
                )

            return ok(transaction)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message
                })
            }

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            console.error(error)
            return serverError()
        }
    }
}
