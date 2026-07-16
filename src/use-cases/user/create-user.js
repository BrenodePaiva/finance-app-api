import { v4 as uuidv4 } from 'uuid'
import { EmailAlreadyInUseError } from '../../errors/user.js'

export class CreateUserUseCase {
    constructor(
        getUserByEmailRepository,
        passwordHasherAdapter,
        createUserRepository
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.passwordHasherAdapter = passwordHasherAdapter
        this.createUserRepository = createUserRepository
    }
    async execute(createUserParams) {
        const userWithProvidedEmail =
            await this.getUserByEmailRepository.execute(createUserParams.email)

        if (userWithProvidedEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

        const userId = uuidv4()
        const hashedPassword = await this.passwordHasherAdapter.execute(
            createUserParams.password
        )

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword
        }
        return await this.createUserRepository.execute(user)
    }
}
