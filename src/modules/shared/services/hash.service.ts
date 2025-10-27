import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'

@Injectable()
export class HashService {
  private readonly saltRounds: number

  constructor(private readonly configService: ConfigService) {
    this.saltRounds = Number(this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10))
  }

  async hash(input: string): Promise<string> {
    return bcrypt.hash(input, this.saltRounds)
  }

  async compare(input: string, hash: string): Promise<boolean> {
    return bcrypt.compare(input, hash)
  }
}
