import { HttpStatus } from "@nestjs/common";
import { ResponseAPI } from "./response";

describe('Response', () => {
  it('should be defined', () => {
    expect(new ResponseAPI(HttpStatus.ACCEPTED, 'Success')).toBeDefined();
  });
});
