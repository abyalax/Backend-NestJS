import { HttpStatus } from '@nestjs/common';
import { IsNumber, IsString } from 'class-validator';

export class ResponseAPI<T> {
  @IsNumber()
  statusCode: HttpStatus;
  @IsString()
  message: string;
  data: T;

  constructor(statusCode: HttpStatus, message: string, data: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
