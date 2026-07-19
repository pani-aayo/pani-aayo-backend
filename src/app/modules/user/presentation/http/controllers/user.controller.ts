import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthUser } from '../../../../../../shared/auth/decorators/current-user.decorator';
import { Public } from '../../../../../../shared/auth/decorators/public.decorator';
import type { IAuth } from '../../../../../../shared/auth/token.service';
import LoginUsecase from '../../../application/usecases/login.usecase';
import LogoutUsecase from '../../../application/usecases/logout.usecase';
import RegisterResidentUsecase from '../../../application/usecases/register-resident.usecase';
import UpsertDeviceUsecase from '../../../application/usecases/upsert-device.usecase';
import { LoginResult } from '../../../domain/interfaces/user';
import { LoginDto } from '../dtos/login.dto';
import { LogoutDto } from '../dtos/logout.dto';
import { RegisterResidentDto } from '../dtos/register-resident.dto';
import { UpsertDeviceDto } from '../dtos/upsert-device.dto';

@Controller('users')
class UserController {
  constructor(
    private readonly loginUsecase: LoginUsecase,
    private readonly logoutUsecase: LogoutUsecase,
    private readonly registerResidentUsecase: RegisterResidentUsecase,
    private readonly upsertDeviceUsecase: UpsertDeviceUsecase,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<LoginResult> {
    return this.loginUsecase.execute(dto);
  }

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterResidentDto) {
    return this.registerResidentUsecase.execute(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() dto: LogoutDto, @AuthUser() user: IAuth): Promise<void> {
    return this.logoutUsecase.execute(user.code, dto);
  }

  @Post('me/device')
  async upsertDevice(@Body() dto: UpsertDeviceDto, @AuthUser() user: IAuth) {
    return this.upsertDeviceUsecase.execute(user.code, dto);
  }

  @Get('me')
  me(@AuthUser() user: IAuth): IAuth {
    return user;
  }
}

export default UserController;
