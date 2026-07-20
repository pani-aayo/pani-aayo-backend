import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { TokenService } from '../../../../../shared/auth/token.service';
import { LoginResult, UserRole } from '../../domain/interfaces/user';
import UserRepo from '../../infrastructure/repos/user.repo';
import { LoginDto } from '../../presentation/http/dtos/login.dto';

@Injectable()
class LoginUsecase {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResult> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new UnauthorizedException('Invalid credentials');

    const accessToken = await this.tokenService.sign({
      sub: user.id,
      code: user.code,
      email: user.email,
      roles: user.userRoles.map((userRole) => userRole.role),
    });

    if (dto.deviceId) {
      await this.userRepo.upsertDevice(user.code, dto.deviceId);
    }

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        code: user.code,
        email: user.email,
        roles: user.userRoles.map((userRole) => userRole.role as UserRole),
      },
    };
  }
}

export default LoginUsecase;
