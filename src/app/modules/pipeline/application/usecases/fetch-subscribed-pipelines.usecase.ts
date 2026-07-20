import { Injectable } from '@nestjs/common';
import { IAuth } from '../../../../../shared/auth/token.service';
import PipelineRepo from '../../infrastructure/repos/pipeline.repo';

@Injectable()
class FetchSubscribedPipelinesUsecase {
  constructor(private readonly pipelineRepo: PipelineRepo) {}

  async execute(user: IAuth) {
    return this.pipelineRepo.findSubscribed(user.code);
  }
}

export default FetchSubscribedPipelinesUsecase;
