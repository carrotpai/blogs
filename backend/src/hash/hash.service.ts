import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class HashService {
  async create(plainTextPassword: string): Promise<string | undefined> {
    return await hash(plainTextPassword, 10);
  }

  async compare(providedPasssword: string, hashedPassword: string) {
    return await compare(providedPasssword, hashedPassword);
  }
}
