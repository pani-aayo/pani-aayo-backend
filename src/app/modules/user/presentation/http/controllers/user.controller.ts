import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthUser } from '../../../../../../shared/auth/decorators/current-user.decorator';
import { Public } from '../../../../../../shared/auth/decorators/public.decorator';
import type { IAuth } from '../../../../../../shared/auth/token.service';
import LoginUsecase from '../../../application/usecases/login.usecase';
import { LoginResult } from '../../../domain/interfaces/user';
import { LoginDto } from '../dtos/login.dto';

@Controller('users')
class UserController {
  constructor(private readonly loginUsecase: LoginUsecase) {}

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<LoginResult> {
    return this.loginUsecase.execute(dto);
  }

  @Get('me')
  me(@AuthUser() user: IAuth): IAuth {
    return user;
  }
}

export default UserController;
