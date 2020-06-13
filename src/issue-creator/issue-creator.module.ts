import { Module } from '@nestjs/common';
import { IssueAssignerService } from './issue-assigner.service';
import { CpuIssueCreatorService } from './cpu-issue-creator.service';
import { TimeoutIssueCreatorService } from './timeout-issue-creator.service';
import { ErrorResponseIssueCreatorService } from './error-response-issue-creator.service';
import { CbOpenIssueCreatorService } from './cb-open-issue-creator.service';

@Module({
  providers: [
    IssueAssignerService,
    CpuIssueCreatorService,
    TimeoutIssueCreatorService,
    ErrorResponseIssueCreatorService,
    CbOpenIssueCreatorService,
  ],
  exports: [
    IssueAssignerService,
    CpuIssueCreatorService,
    TimeoutIssueCreatorService,
    ErrorResponseIssueCreatorService,
    CbOpenIssueCreatorService,
  ],
})
export class IssueCreatorModule {}
