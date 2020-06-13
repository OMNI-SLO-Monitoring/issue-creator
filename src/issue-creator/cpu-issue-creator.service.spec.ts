import { Test, TestingModule } from '@nestjs/testing';
import { CpuIssueCreatorService } from './cpu-issue-creator.service';

describe('CpuIssueCreatorService', () => {
  let service: CpuIssueCreatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CpuIssueCreatorService],
    }).compile();

    service = module.get<CpuIssueCreatorService>(CpuIssueCreatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
