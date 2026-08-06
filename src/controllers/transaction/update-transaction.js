import { ZodError } from 'zod'
import {
    badRequest,
    checkIfIdIsValid,
    forbidden,
    invalidIdResponse,
    ok,
    serverError,
    transactionNotFoundResponse
} from '../helpers/index.js'
import { updateTransactionSchema } from '../../schemas/transaction.js'
import { ForbiddenError, TransactionNotFoundError } from '../../errors/index.js'

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
            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse()
            }

            if (error instanceof ForbiddenError) {
                return forbidden()
            }

            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message
                })
            }
            console.error(error)
            return serverError()
        }
    }
}
