import { z } from 'zod'

export class LoginUserRequest {
    email: string
    password: string
}

export const loginUserRequestValidation = z.object({
    email: z.string().email().max(30).min(3),
    password: z.string().max(30).min(6),
})