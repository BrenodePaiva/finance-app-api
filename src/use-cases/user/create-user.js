import { EmailAlreadyInUseError } from '../../errors/user.js'

export class CreateUserUseCase {
    constructor(
        getUserByEmailRepository,
        idGeneratorAdapter,
        passwordHasherAdapter,
        tokensGeneratorAdapter,
        createUserRepository
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.idGeneratorAdapter = idGeneratorAdapter
        this.passwordHasherAdapter = passwordHasherAdapter
        this.tokensGeneratorAdapter = tokensGeneratorAdapter
        this.createUserRepository = createUserRepository
    }
    async execute(createUserParams) {
        const userWithProvidedEmail =
            await this.getUserByEmailRepository.execute(createUserParams.email)

        if (userWithProvidedEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

        const userId = this.idGeneratorAdapter.execute()
        const hashedPassword = await this.passwordHasherAdapter.execute(
            createUserParams.password
        )

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword
        }
        const createdUser = await this.createUserRepository.execute(user)

        return {
            ...createdUser,
            tokens: this.tokensGeneratorAdapter.execute(userId)
        }
    }
}
