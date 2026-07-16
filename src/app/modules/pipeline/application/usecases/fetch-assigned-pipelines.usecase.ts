import { IAuth } from '../../../../../shared/auth/token.service';
import PipelineRepo from '../../infrastructure/repos/pipeline.repo';

class FetchAssignedPipelinesUsecase {
  constructor(private readonly pipelineRepo: PipelineRepo) {}

  async execute(user: IAuth) {
    return this.pipelineRepo.findAssigned(user.code);
  }
}

export default FetchAssignedPipelinesUsecase;
