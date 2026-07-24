import {
    CreateTransactionController,
    DeleteTransactioController,
    UpdateTransactionController
} from '../../controllers'
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeUpdateTransactionController
} from './transaction'

describe('Transaction Controller Factories', () => {
    it('should return a valid CreateTransactionController instance', async () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController
        )
    })

    it('should return a valid UpdateTransactionController instance', async () => {
        expect(makeUpdateTransactionController()).toBeInstanceOf(
            UpdateTransactionController
        )
    })

    it('should return a valid DeleteTransactioController instance', async () => {
        expect(makeDeleteTransactionController()).toBeInstanceOf(
            DeleteTransactioController
        )
    })
})
