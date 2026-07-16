import { Injectable } from '@nestjs/common';
import { UserRole } from '../../domain/interfaces/user';
import UserRepo from '../../infrastructure/repos/user.repo';
import { FetchOperatorsDto } from '../../presentation/http/dtos/fetch-operators.dto';

@Injectable()
class FetchOperatorsUsecase {
  constructor(private readonly userRepo: UserRepo) {}

  async execute(query: FetchOperatorsDto) {
    const skip = (query.page - 1) * query.limit;
    const { items, total } = await this.userRepo.findMany({
      skip,
      take: query.limit,
      search: query.search,
      roles: [UserRole.OPERATOR],
    });

    return {
      data: items,
      meta: { page: query.page, limit: query.limit, total },
    };
  }
}

export default FetchOperatorsUsecase;
