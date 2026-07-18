import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import UserRepo from '../../../user/infrastructure/repos/user.repo';
import PipelineRepo from '../../infrastructure/repos/pipeline.repo';
import { SetPipelineOperatorsDto } from '../dtos/set-pipeline-operators.dto';

@Injectable()
class SetPipelineOperatorsUsecase {
  constructor(
    private readonly pipelineRepo: PipelineRepo,
    private readonly userRepo: UserRepo,
  ) {}

  async execute(pipelineCode: string, dto: SetPipelineOperatorsDto, createdBy: string) {
    const pipeline = await this.pipelineRepo.findByCode(pipelineCode);
    if (!pipeline) {
      throw new NotFoundException('Pipeline not found');
    }

    const operatorCodes = [...new Set(dto.operatorCodes)];
    const operators = await this.userRepo.findOperatorsByCodes(operatorCodes);
    if (operators.length !== operatorCodes.length) {
      throw new BadRequestException('One or more operator codes are invalid or not operators');
    }

    return this.pipelineRepo.setOperators(pipelineCode, operatorCodes, createdBy);
  }
}

export default SetPipelineOperatorsUsecase;
