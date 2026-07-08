import { ok, serverError } from '../helpers/http.js'
import { checkIfIdIsValid, invalidIdResponse } from '../helpers/validation.js'

export class DeleteTransactioController {
    constructor(deleteTransactioUseCase) {
        this.deleteTransactioUseCase = deleteTransactioUseCase
    }
    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId

            const idIsValid = checkIfIdIsValid(transactionId)
            if (!idIsValid) {
                return invalidIdResponse()
            }

            const transaction =
                await this.deleteTransactioUseCase.execute(transactionId)

            return ok(transaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
