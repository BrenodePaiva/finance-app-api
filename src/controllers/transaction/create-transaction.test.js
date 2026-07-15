import { faker } from '@faker-js/faker'
import { CreateTransactionController } from './create-transaction'

describe('CreateTransactionController', () => {
    class CreateTransactionUseCaseStub {
        async execute(trasanction) {
            return trasanction
        }
    }

    const makeSut = () => {
        const createTransactionUseCaseStub = new CreateTransactionUseCaseStub()
        const sut = new CreateTransactionController(
            createTransactionUseCaseStub
        )

        return { sut, createTransactionUseCaseStub }
    }

    const httpRequest = {
        body: {
            user_id: faker.string.uuid(),
            name: faker.string.alpha(10),
            date: faker.date.anytime().toISOString(),
            amount: Number(faker.finance.amount()),
            type: 'EXPENSE'
        }
    }

    it('should return 201 when creating transaction successfuly', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(201)
    })

    it('should return 400 when missing user_id', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: { ...httpRequest.body, user_id: undefined }
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing name', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: { ...httpRequest.body, name: undefined }
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing date', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: { ...httpRequest.body, date: undefined }
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing type', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: { ...httpRequest.body, type: undefined }
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing amount', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: { ...httpRequest.body, amount: undefined }
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when date is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: { ...httpRequest.body, date: 'invalid_date' }
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when type is not EXPENSE, EARNING or INVESTMENT', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: { ...httpRequest.body, type: 'invalid_type' }
        })

        // assert
        expect(result.statusCode).toBe(400)
    })
})
