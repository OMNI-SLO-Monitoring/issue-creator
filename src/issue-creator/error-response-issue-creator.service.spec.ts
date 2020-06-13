import { Test, TestingModule } from '@nestjs/testing';
import { ErrorResponseIssueCreatorService } from './error-response-issue-creator.service';

describe('ErrorResponseIssueCreatorService', () => {
  let service: ErrorResponseIssueCreatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorResponseIssueCreatorService],
    }).compile();

    service = module.get<ErrorResponseIssueCreatorService>(ErrorResponseIssueCreatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
