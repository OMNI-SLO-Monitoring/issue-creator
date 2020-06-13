import { Test, TestingModule } from '@nestjs/testing';
import { IssueAssignerService } from './issue-assigner.service';

describe('IssueAssignerService', () => {
  let service: IssueAssignerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IssueAssignerService],
    }).compile();

    service = module.get<IssueAssignerService>(IssueAssignerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
