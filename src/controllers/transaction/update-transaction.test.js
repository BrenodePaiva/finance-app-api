import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from './update-transaction'

describe('UpdateTransactioController', () => {
    class UpdateTransactionUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                user_id: faker.string.uuid(),
                name: faker.string.alpha(10),
                date: faker.date.anytime().toISOString(),
                amount: Number(faker.finance.amount()),
                type: 'EXPENSE'
            }
        }
    }

    const makeSut = () => {
        const updateTransactionUseCaseStub = new UpdateTransactionUseCaseStub()
        const sut = new UpdateTransactionController(
            updateTransactionUseCaseStub
        )

        return { sut, updateTransactionUseCaseStub }
    }

    const httpRequest = {
        params: {
            transactionId: faker.string.uuid()
        },
        body: {
            name: faker.string.alpha(10),
            date: faker.date.anytime().toISOString(),
            amount: Number(faker.finance.amount()),
            type: 'EXPENSE'
        }
    }

    it('should return 200 when updating a transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when transaction id is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            params: { transactionId: 'invalid_id' }
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when unallowed field is provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                unallowed_field: 'some_value'
            }
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when amount is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                amount: 'invalid_amount'
            }
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when type is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                type: 'invalid_type'
            }
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 500 when UpdateTransactionUseCase throws', async () => {
        // arrange
        const { sut, updateTransactionUseCaseStub } = makeSut()
        jest.spyOn(
            updateTransactionUseCaseStub,
            'execute'
        ).mockRejectedValueOnce(new Error())

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })

    it('should call UpdateTransactionUseCase with correct params', async () => {
        // arrange
        const { sut, updateTransactionUseCaseStub } = makeSut()
        const executeSpy = jest.spyOn(updateTransactionUseCaseStub, 'execute')

        // act
        await sut.execute(httpRequest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.transactionId,
            httpRequest.body
        )
    })
})
