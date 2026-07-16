import { Injectable } from '@nestjs/common';
import PipelineRepo from '../../infrastructure/repos/pipeline.repo';
import { ListPipelinesDto } from '../dtos/list-pipelines.dto';

@Injectable()
class ListPipelinesUsecase {
  constructor(private readonly pipelineRepo: PipelineRepo) {}

  async execute(dto: ListPipelinesDto) {
    const skip = (dto.page - 1) * dto.limit;
    const { items, total } = await this.pipelineRepo.findMany({
      skip,
      take: dto.limit,
      search: dto.search,
      includeOperators: dto.includeOperators,
    });

    return {
      data: items,
      meta: {
        page: dto.page,
        limit: dto.limit,
        total,
        totalPages: Math.ceil(total / dto.limit),
      },
    };
  }
}

export default ListPipelinesUsecase;
