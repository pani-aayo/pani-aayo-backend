import { Injectable, NotFoundException } from '@nestjs/common';
import PipelineRepo from '../../infrastructure/repos/pipeline.repo';
import { CreatePipelineRoutineDto } from '../dtos/create-pipeline-routine.dto';

@Injectable()
class CreatePipelineRoutineUsecase {
  constructor(private readonly pipelineRepo: PipelineRepo) {}

  async execute(pipelineCode: string, dto: CreatePipelineRoutineDto, userCode: string) {
    const pipeline = await this.pipelineRepo.findByCode(pipelineCode);
    if (!pipeline) {
      throw new NotFoundException('Pipeline not found');
    }

    return this.pipelineRepo.setRoutine(pipelineCode, dto, userCode);
  }
}

export default CreatePipelineRoutineUsecase;
