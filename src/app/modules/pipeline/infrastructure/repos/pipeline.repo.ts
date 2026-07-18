import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../../../shared/prisma/prisma.service';
import { CreatePipelineRoutineDto } from '../../application/dtos/create-pipeline-routine.dto';
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

  async findByCode(code: string) {
    return this.prisma.pipeline.findFirst({ where: { code, deletedAt: null } });
  }

  async findAssigned(operatorCode: string) {
    return this.prisma.pipeline.findMany({ where: { PipelineOperators: { some: { operatorCode } } } });
  }

  async setOperators(pipelineCode: string, operatorCodes: string[], createdBy: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.pipelineOperators.deleteMany({ where: { pipelineCode } });

      if (operatorCodes.length > 0) {
        await tx.pipelineOperators.createMany({
          data: operatorCodes.map((operatorCode) => ({
            pipelineCode,
            operatorCode,
            createdBy,
          })),
        });
      }

      const assignments = await tx.pipelineOperators.findMany({
        where: { pipelineCode },
        orderBy: { createdAt: 'desc' },
      });

      const operators = await tx.user.findMany({
        where: { code: { in: operatorCodes } },
        select: { code: true, name: true, email: true },
      });

      const operatorByCode = new Map(operators.map((operator) => [operator.code, operator]));

      return {
        pipelineCode,
        operators: assignments.map((assignment) => ({
          code: assignment.operatorCode,
          name: operatorByCode.get(assignment.operatorCode)?.name,
          email: operatorByCode.get(assignment.operatorCode)?.email,
          assignedAt: assignment.createdAt,
        })),
      };
    });
  }

  async setRoutine(pipelineCode: string, dto: CreatePipelineRoutineDto, userCode: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.pipeline.update({
        where: { code: pipelineCode },
        data: { routineSummary: dto.routineSummary, updatedBy: userCode },
      });

      return tx.pipelineRoutines.upsert({
        where: { pipelineCode },
        create: {
          code: crypto.randomUUID(),
          pipelineCode,
          routine: dto.routine,
          createdBy: userCode,
        },
        update: {
          routine: dto.routine,
          updatedBy: userCode,
        },
      });
    });
  }
}

export default PipelineRepo;
