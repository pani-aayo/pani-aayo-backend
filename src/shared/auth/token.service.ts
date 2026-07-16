import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../../generated/prisma/enums';

export interface IAuth {
  sub: number;
  code: string;
  email: string;
  roles: UserRole[];
}

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: IAuth): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  verify(token: string): Promise<IAuth> {
    return this.jwtService.verifyAsync<IAuth>(token);
  }
}
