import { ZodError } from 'zod'
import {
    badRequest,
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError
} from '../helpers/index.js'
import { updateTransactionSchema } from '../../schemas/transaction.js'

export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId

            const isIdValid = checkIfIdIsValid(transactionId)
            if (!isIdValid) {
                return invalidIdResponse()
            }

            const params = httpRequest.body

            await updateTransactionSchema.parseAsync(params)

            const transaction = await this.updateTransactionUseCase.execute(
                transactionId,
                params
            )
            return ok(transaction)
        } catch (error) {
            if (error instanceof ZodError) {
                if (error.issues[0].code === 'unrecognized_keys') {
                    return badRequest({
                        message: 'Some provided fields are not allowed.'
                    })
                }
                return badRequest({
                    message: error.issues[0].message
                })
            }
            console.error(error)
            return serverError()
        }
    }
}
