import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../../../shared/prisma/prisma.service';
import { FetchPipelinesParams, fetchPipelinesQuery } from './queries/fetch-pipelines.query';

@Injectable()
class PipelineRepo {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<Prisma.PipelineUncheckedCreateInput, 'code'>) {
    return this.prisma.pipeline.create({ data: { ...data, code: crypto.randomUUID() } });
  }

  async findMany(params: FetchPipelinesParams) {
    return fetchPipelinesQuery(this.prisma, params);
  }

  async findAssigned(operatorCode: string) {
    return this.prisma.pipeline.findMany({ where: { PipelineOperators: { some: { operatorCode } } } });
  }
}

export default PipelineRepo;
