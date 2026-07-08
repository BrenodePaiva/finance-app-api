import { UserNotFoundError } from '../../errors/user.js'
import { serverError, userNotFoundResponse } from '../helpers.js'
import { ok } from '../helpers/http.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    requiredFieldIsMissingResponse
} from '../helpers/validation.js'

export class GetTransactionsByUserIdController {
    constructor(getTransactionByUserIdUseCase) {
        this.getTransactionByUserIdUseCase = getTransactionByUserIdUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId
            if (!userId) {
                return requiredFieldIsMissingResponse('userId')
            }

            const userIdIsValid = checkIfIdIsValid(userId)
            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            const transaction =
                await this.getTransactionByUserIdUseCase.execute({ userId })

            return ok(transaction)
        } catch (error) {
            console.error(error)
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return serverError()
        }
    }
}
