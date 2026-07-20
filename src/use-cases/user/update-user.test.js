import { faker } from '@faker-js/faker'
import { UpdateUserUseCase } from './update-user'
import { EmailAlreadyInUseError } from '../../errors/user'

describe('UpdateUserUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 })
    }

    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
        }
    }

    class UpdateUserRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub()

        const passwordHasherAdapterStub = new PasswordHasherAdapterStub()

        const updateUserRepositoryStub = new UpdateUserRepositoryStub()

        const sut = new UpdateUserUseCase(
            getUserByEmailRepositoryStub,
            passwordHasherAdapterStub,
            updateUserRepositoryStub
        )

        return {
            sut,
            getUserByEmailRepositoryStub,
            passwordHasherAdapterStub,
            updateUserRepositoryStub
        }
    }

    it('should update user successfully (without email and password)', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(faker.string.uuid(), {
            first_name: faker.string.uuid(),
            last_name: faker.string.uuid()
        })

        // assert
        expect(result).toBe(user)
    })

    it('should update user successfully (with emai)', async () => {
        // arrange
        const { sut, getUserByEmailRepositoryStub } = makeSut()
        const executeSpy = jest.spyOn(getUserByEmailRepositoryStub, 'execute')

        // act
        const result = await sut.execute(faker.string.uuid(), {
            email: user.email
        })

        // assert
        expect(executeSpy).toHaveBeenCalledWith(user.email)
        expect(result).toBe(user)
    })

    it('should update user successfully (with password)', async () => {
        // arrange
        const { sut, passwordHasherAdapterStub } = makeSut()
        const executeSpy = jest.spyOn(passwordHasherAdapterStub, 'execute')

        // act
        const result = await sut.execute(faker.string.uuid(), {
            password: user.password
        })

        // assert
        expect(executeSpy).toHaveBeenCalledWith(user.password)
        expect(result).toBe(user)
    })

    it('should throw EmailAlreadyInUseError if email is already in use', async () => {
        // arrange
        const { sut, getUserByEmailRepositoryStub } = makeSut()
        jest.spyOn(
            getUserByEmailRepositoryStub,
            'execute'
        ).mockResolvedValueOnce(user)

        // act
        const result = sut.execute(faker.string.uuid(), {
            email: faker.internet.email()
        })

        // assert
        expect(result).rejects.toThrow()
    })

    it('should throw EmailAlreadyInUseError if email is already in use', async () => {
        // arrange
        const { sut, getUserByEmailRepositoryStub } = makeSut()
        jest.spyOn(
            getUserByEmailRepositoryStub,
            'execute'
        ).mockResolvedValueOnce(user)

        // act
        const result = sut.execute(faker.string.uuid(), {
            email: user.email
        })

        // assert
        expect(result).rejects.toThrow(new EmailAlreadyInUseError(user.email))
    })

    it('should call UpdateUserRepository with correct params', async () => {
        // arrange
        const { sut, updateUserRepositoryStub } = makeSut()
        const executeSpy = jest.spyOn(updateUserRepositoryStub, 'execute')
        const updateParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 })
        }

        // act
        await sut.execute(user.id, updateParams)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(user.id, {
            ...updateParams,
            password: 'hashed_password'
        })
    })
})
