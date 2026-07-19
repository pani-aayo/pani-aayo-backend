import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import PipelineRepo from '../../infrastructure/repos/pipeline.repo';

@Injectable()
class SubscribePipelineUsecase {
  constructor(private readonly pipelineRepo: PipelineRepo) {}

  async execute(pipelineCode: string, userCode: string) {
    const pipeline = await this.pipelineRepo.findByCode(pipelineCode);
    if (!pipeline) {
      throw new NotFoundException('Pipeline not found');
    }

    try {
      return await this.pipelineRepo.subscribe(pipelineCode, userCode);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('Already subscribed to this pipeline');
      }
      throw err;
    }
  }
}

export default SubscribePipelineUsecase;
