import { Test, TestingModule } from '@nestjs/testing';
import { CbOpenIssueCreatorService } from './cb-open-issue-creator.service';

describe('CbOpenIssueCreatorService', () => {
  let service: CbOpenIssueCreatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CbOpenIssueCreatorService],
    }).compile();

    service = module.get<CbOpenIssueCreatorService>(CbOpenIssueCreatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
