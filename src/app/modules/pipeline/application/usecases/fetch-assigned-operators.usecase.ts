import { Injectable, NotFoundException } from '@nestjs/common';
import PipelineRepo from '../../infrastructure/repos/pipeline.repo';

@Injectable()
class FetchAssignedOperatorsUsecase {
  constructor(private readonly pipelineRepo: PipelineRepo) {}

  async execute(pipelineCode: string) {
    const pipeline = await this.pipelineRepo.findByCode(pipelineCode);
    if (!pipeline) {
      throw new NotFoundException('Pipeline not found');
    }

    return this.pipelineRepo.getAssignedOperators(pipelineCode);
  }
}

export default FetchAssignedOperatorsUsecase;
