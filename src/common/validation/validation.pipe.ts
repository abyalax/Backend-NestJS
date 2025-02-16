import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private zodType: ZodType) { }
  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      return this.zodType.parse(value) as unknown;
    }
  }
}
