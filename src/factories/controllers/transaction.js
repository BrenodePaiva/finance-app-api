import {
    CreateTransactionController,
    GetTransactionsByUserIdController,
    UpdateTransactionController
} from '../../controllers/index.js'
import {
    PostgresCreateTransactionRepository,
    PostgresGetTransactionsByUserIdRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateTransactionRepository
} from '../../repositories/postgres/index.js'
import {
    CreateTransactionUseCase,
    GetTransactionsByUserIdUseCase,
    UpdateTransactionUseCase
} from '../../use-cases/index.js'

export const makeCreateTransactionController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const createTransactionRepository =
        new PostgresCreateTransactionRepository()

    const createTransactionUseCase = new CreateTransactionUseCase(
        getUserByIdRepository,
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
    const updateTransactionRepository =
        new PostgresUpdateTransactionRepository()

    const updateTransactioUseCase = new UpdateTransactionUseCase(
        updateTransactionRepository
    )

    return new UpdateTransactionController(updateTransactioUseCase)
}
