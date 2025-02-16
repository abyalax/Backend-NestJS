import { ZodType } from 'zod';
import { ValidationPipe } from './validation.pipe';

describe('ValidationPipe', () => {
  it('should be defined', () => {
    const zodType: ZodType = {} as ZodType;
    expect(new ValidationPipe(zodType)).toBeDefined();
  });
});
