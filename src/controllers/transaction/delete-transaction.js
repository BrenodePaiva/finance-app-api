import { TransactionNotFoundError } from '../../errors/index.js'
import {
    ok,
    serverError,
    transactionNotFoundResponse
} from '../helpers/index.js'
import { checkIfIdIsValid, invalidIdResponse } from '../helpers/validation.js'

export class DeleteTransactioController {
    constructor(deleteTransactioUseCase) {
        this.deleteTransactioUseCase = deleteTransactioUseCase
    }
    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId
            const user_id = httpRequest.params.user_id

            const idIsValid = checkIfIdIsValid(transactionId)
            if (!idIsValid) {
                return invalidIdResponse()
            }

            const deletedTransaction =
                await this.deleteTransactioUseCase.execute(
                    transactionId,
                    user_id
                )

            return ok(deletedTransaction)
        } catch (error) {
            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse()
            }

            console.error(error)
            return serverError()
        }
    }
}
