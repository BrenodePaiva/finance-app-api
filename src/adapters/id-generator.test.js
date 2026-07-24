import { IdGeneratorAdapter } from './id-generator'

describe('IdGeneratorAdapter', () => {
    it('should return a random id', () => {
        const sut = new IdGeneratorAdapter()
        const uuidRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/

        const result = sut.execute()

        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(result).toMatch(uuidRegex)
    })
})
