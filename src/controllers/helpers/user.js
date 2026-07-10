import { badRequest, notFound } from './http.js'

export const invalidPasswordResponse = () =>
    badRequest({
        message: 'Password must be at least 6 characters long'
    })

export const invalidEmailResponse = () =>
    badRequest({
        message: 'Invalid e-mail address. Please provide a valid one'
    })

export const userNotFoundResponse = () =>
    notFound({
        message: 'User not found'
    })
