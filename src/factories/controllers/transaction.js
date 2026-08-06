import { IdGeneratorAdapter } from '../../adapters/index.js'
import {
    CreateTransactionController,
    DeleteTransactioController,
    GetTransactionsByUserIdController,
    UpdateTransactionController
} from '../../controllers/index.js'
import {
    PostgresCreateTransactionRepository,
    PostgresDeleteTransactionRepository,
    PostgresGetTransactionByIdRepository,
    PostgresGetTransactionsByUserIdRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateTransactionRepository
} from '../../repositories/postgres/index.js'
import {
    CreateTransactionUseCase,
    DeleteTransactionUseCase,
    GetTransactionsByUserIdUseCase,
    UpdateTransactionUseCase
} from '../../use-cases/index.js'

export const makeCreateTransactionController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const idGeneratorAdapter = new IdGeneratorAdapter()

    const createTransactionRepository =
        new PostgresCreateTransactionRepository()

    const createTransactionUseCase = new CreateTransactionUseCase(
        getUserByIdRepository,
        idGeneratorAdapter,
        createTransactionRepository
    )

    return new CreateTransactionController(createTransactionUseCase)
}

export const makeGetTransactionsByUserIdController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const getTransactionsByUserIdRepository =
        new PostgresGetTransactionsByUserIdRepository()

    const getTransactionsByUserIdUseCase = new GetTransactionsByUserIdUseCase(
        getUserByIdRepository,
        getTransactionsByUserIdRepository
    )

    return new GetTransactionsByUserIdController(getTransactionsByUserIdUseCase)
}

export const makeUpdateTransactionController = () => {
    const getTransactionByIdRepository =
        new PostgresGetTransactionByIdRepository()

    const updateTransactionRepository =
        new PostgresUpdateTransactionRepository()

    const updateTransactioUseCase = new UpdateTransactionUseCase(
        getTransactionByIdRepository,
        updateTransactionRepository
    )

    return new UpdateTransactionController(updateTransactioUseCase)
}

export const makeDeleteTransactionController = () => {
    const deleteTransactionRepository =
        new PostgresDeleteTransactionRepository()

    const deleteTransactionUseCase = new DeleteTransactionUseCase(
        deleteTransactionRepository
    )

    return new DeleteTransactioController(deleteTransactionUseCase)
}
