import { HttpStatus } from "@nestjs/common"

export class ResponseAPI<T> {
    data: T | undefined
    message: string
    statusCode: number

    constructor(statusCode: HttpStatus, message: string, data?: T) {
        this.statusCode = statusCode
        this.message = message
        this.data = data
    }
}
