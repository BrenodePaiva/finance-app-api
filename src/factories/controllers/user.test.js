import { CreateUserController } from '../../controllers'
import { makeCreateUserController } from './user'

describe('User Controller Factories', () => {
    it('should return a valid CreateUserController instance', async () => {
        expect(makeCreateUserController()).toBeInstanceOf(CreateUserController)
    })
})
