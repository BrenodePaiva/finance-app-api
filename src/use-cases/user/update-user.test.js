import { faker } from '@faker-js/faker'
import { UpdateUserUseCase } from './update-user'

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
})
