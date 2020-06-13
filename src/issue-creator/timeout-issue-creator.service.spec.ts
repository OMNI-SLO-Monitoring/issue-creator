import { Test, TestingModule } from '@nestjs/testing';
import { TimeoutIssueCreatorService } from './timeout-issue-creator.service';

describe('TimeoutIssueCreatorService', () => {
  let service: TimeoutIssueCreatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeoutIssueCreatorService],
    }).compile();

    service = module.get<TimeoutIssueCreatorService>(TimeoutIssueCreatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
