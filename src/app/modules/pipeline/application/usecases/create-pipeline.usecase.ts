import { Injectable } from '@nestjs/common';
import PipelineRepo from '../../infrastructure/repos/pipeline.repo';
import { CreatePipelineDto } from '../../presentation/http/dtos/create-pipeline.dto';

@Injectable()
class CreatePipelineUsecase {
  constructor(private readonly pipelineRepo: PipelineRepo) {}

  async execute(dto: CreatePipelineDto, createdBy: string) {
    return this.pipelineRepo.create({ ...dto, createdBy });
  }
}

export default CreatePipelineUsecase;
