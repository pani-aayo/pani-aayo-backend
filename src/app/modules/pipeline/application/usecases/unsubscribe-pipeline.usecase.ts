import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import PipelineRepo from '../../infrastructure/repos/pipeline.repo';

@Injectable()
class UnsubscribePipelineUsecase {
  constructor(private readonly pipelineRepo: PipelineRepo) {}

  async execute(pipelineCode: string, userCode: string) {
    const pipeline = await this.pipelineRepo.findByCode(pipelineCode);
    if (!pipeline) {
      throw new NotFoundException('Pipeline not found');
    }

    try {
      await this.pipelineRepo.unsubscribe(pipelineCode, userCode);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Subscription not found');
      }
      throw err;
    }
  }
}

export default UnsubscribePipelineUsecase;
