import { LogMessageFormat } from "logging-format";

// Interface for every IssueCreator
export interface IssueCreatorComponent {
    handleLog(log: LogMessageFormat);
}