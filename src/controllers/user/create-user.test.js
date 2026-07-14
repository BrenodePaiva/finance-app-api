import { CreateUserController } from './create-user'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }

    it('should return 201 when creating a user successfully', async () => {
        //   arrange
        const createUserUseCaseStub = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(
            createUserUseCaseStub
        )

        const httpRequest = {
            body: {
                first_name: 'Teste',
                last_name: 'Jest',
                email: 'teste@jest.com',
                password: '1234567'
            }
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toBe(httpRequest.body)
    })

    it('should return 400 if first_name is not provided', async () => {
        // arrange
        const createUserUseCaseStub = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(
            createUserUseCaseStub
        )

        const httpRequest = {
            body: {
                last_name: 'Jest',
                email: 'teste@jest.com',
                password: '1234567'
            }
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if last_name is not provided', async () => {
        //   arrange
        const createUserUseCaseStub = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(
            createUserUseCaseStub
        )

        const httpRequest = {
            body: {
                first_name: 'Teste',
                email: 'teste@jest.com',
                password: '1234567'
            }
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not provided', async () => {
        //   arrange
        const createUserUseCaseStub = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(
            createUserUseCaseStub
        )

        const httpRequest = {
            body: {
                first_name: 'Teste',
                last_name: 'Jest',
                password: '1234567'
            }
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not valid', async () => {
        // arrange
        const createUserUseCaseStub = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(
            createUserUseCaseStub
        )

        const httpRequest = {
            body: {
                first_name: 'Teste',
                last_name: 'Jest',
                email: 'tes',
                password: '1234567'
            }
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is not provided', async () => {
        //   arrange
        const createUserUseCaseStub = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(
            createUserUseCaseStub
        )

        const httpRequest = {
            body: {
                first_name: 'Teste',
                last_name: 'Jest',
                email: 'test@jest.com'
            }
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is less than 6 characters', async () => {
        //   arrange
        const createUserUseCaseStub = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(
            createUserUseCaseStub
        )

        const httpRequest = {
            body: {
                first_name: 'Teste',
                last_name: 'Jest',
                email: 'test@jest.com',
                password: '123'
            }
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })
})
