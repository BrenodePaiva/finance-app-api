import {
    IdGeneratorAdapter,
    PasswordComparatorAdapter,
    PasswordHasherAdapter,
    TokensGeneratorAdapter
} from '../../adapters/index.js'
import {
    CreateUserController,
    DeleteUserController,
    GetUserBalanceController,
    GetUserByIdController,
    UpdateUserController
} from '../../controllers/index.js'
import { LoginUserController } from '../../controllers/user/login-user.js'
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
    LoginUserUseCase,
    UpdateUserUseCase
} from '../../use-cases/index.js'

export const makeGetUserByIdController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)

    return new GetUserByIdController(getUserByIdUseCase)
}

export const makeCreateUserController = () => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()

    const idGeneratorAdapter = new IdGeneratorAdapter()

    const passwordHasherAdapter = new PasswordHasherAdapter()

    const tokensGeneratorAdapter = new TokensGeneratorAdapter()

    const createUserRepository = new PostgresCreateUserRepository()

    const createUserUseCase = new CreateUserUseCase(
        getUserByEmailRepository,
        idGeneratorAdapter,
        passwordHasherAdapter,
        tokensGeneratorAdapter,
        createUserRepository
    )

    return new CreateUserController(createUserUseCase)
}

export const makeUpdateUserController = () => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()

    const passwordHasherAdapter = new PasswordHasherAdapter()

    const updateUserRepository = new PostgresUpdateUserRepository()

    const updateUserUseCase = new UpdateUserUseCase(
        getUserByEmailRepository,
        passwordHasherAdapter,
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

export const makeLoginUserController = () => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()

    const passwordComparatorAdapter = new PasswordComparatorAdapter()

    const tokensGeneratorAdapter = new TokensGeneratorAdapter()

    const loginUserUseCase = new LoginUserUseCase(
        getUserByEmailRepository,
        passwordComparatorAdapter,
        tokensGeneratorAdapter
    )

    return new LoginUserController(loginUserUseCase)
}
