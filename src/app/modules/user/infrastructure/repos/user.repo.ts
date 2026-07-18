import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { Prisma } from '../../../../../generated/prisma/client';
import { FindManyParams } from '../../../../../shared/interfaces';
import { PrismaService } from '../../../../../shared/prisma/prisma.service';
import { withoutAttrs } from '../../../../../shared/utils/object';
import { UserRole } from '../../domain/interfaces/user';
import { CreateOperatorDto } from '../../presentation/http/dtos/create-operator.dto';

@Injectable()
class UserRepo {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOperatorDto & { roles: UserRole[] }) {
    return this.prisma.user.create({
      data: {
        ...withoutAttrs(dto, ['roles']),
        code: crypto.randomUUID(),
        password: await bcrypt.hash(dto.password, 10),
        userRoles: { create: dto.roles.map((role) => ({ role })) },
      },
    });
  }

  async findMany(query: FindManyParams & { roles?: UserRole[] }) {
    const { skip, take, search, roles } = query;
    const where: Prisma.UserWhereInput = {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ],
          }
        : {}),
      ...(roles ? { userRoles: { some: { role: { in: roles } } } } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      this.prisma.user.count({ where }),
    ]);

    return { items, total };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email }, include: { userRoles: true } });
  }

  async findByCode(code: string) {
    return this.prisma.user.findUnique({ where: { code } });
  }

  async findOperatorsByCodes(codes: string[]) {
    return this.prisma.user.findMany({
      where: {
        code: { in: codes },
        userRoles: { some: { role: UserRole.OPERATOR } },
      },
      select: { code: true, name: true, email: true },
    });
  }
}

export default UserRepo;
