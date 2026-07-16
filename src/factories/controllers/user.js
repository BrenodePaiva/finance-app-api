import { PasswordHasherAdapter } from '../../adapters/index.js'
import {
    CreateUserController,
    DeleteUserController,
    GetUserBalanceController,
    GetUserByIdController,
    UpdateUserController
} from '../../controllers/index.js'
import {
    PostgresCreateUserRepository,
    PostgresDeleteUserRepository,
    PostgresGetUserBalanceRepository,
    PostgresGetUserByEmailRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateUserRepository
} from '../../repositories/postgres/index.js'
import {
    CreateUserUseCase,
    DeleteUserUseCase,
    GetUserBalanceUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase
} from '../../use-cases/index.js'

export const makeGetUserByIdController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)

    return new GetUserByIdController(getUserByIdUseCase)
}

export const makeCreateUserController = () => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()

    const passwordHasherAdapter = new PasswordHasherAdapter()

    const createUserRepository = new PostgresCreateUserRepository()

    const createUserUseCase = new CreateUserUseCase(
        getUserByEmailRepository,
        passwordHasherAdapter,
        createUserRepository
    )

    return new CreateUserController(createUserUseCase)
}

export const makeUpdateUserController = () => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()

    const updateUserRepository = new PostgresUpdateUserRepository()

    const updateUserUseCase = new UpdateUserUseCase(
        getUserByEmailRepository,
        updateUserRepository
    )

    return new UpdateUserController(updateUserUseCase)
}

export const makeDeleteUserController = () => {
    const deleteUserRepository = new PostgresDeleteUserRepository()

    const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)

    return new DeleteUserController(deleteUserUseCase)
}

export const makeGetUserBalanceController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const getUserBalanceRepository = new PostgresGetUserBalanceRepository()

    const getUserBalanceUseCase = new GetUserBalanceUseCase(
        getUserByIdRepository,
        getUserBalanceRepository
    )

    return new GetUserBalanceController(getUserBalanceUseCase)
}
