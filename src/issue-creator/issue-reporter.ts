import { HttpService } from '@nestjs/common';
import { request, gql } from 'graphql-request';
import { IssueFormat } from '../IssueFormat';
import { ConfigService } from '@nestjs/config';

/**
 * Provides the basic functionality every "detailed" IssueCreator should have
 */
export abstract class IssueReporter {
  api = this.configService.get<string>('BACKEND_API');

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) { }

  /**
   * sends Issues to the current MockApi (https://github.com/ccims/ccims-backend/tree/apiMockup)
   * and receives the Issue ID from it if the request was successful.
   *
   * @param issue issue to be send
   * @returns the issueID received when the the request was accepted by the server
   */
  async reportIssue(issue: IssueFormat) {
    const inputData = { input: issue };
    const queryIssue = gql`
      mutation createIssue($input: CreateIssueInput!) {
        createIssue(input: $input) {
          issue {
            id
          }
        }
      }
    `;
    try {
      const data = await request(`${this.api}`, queryIssue, inputData);
      console.log(JSON.stringify(data, undefined, 2));
      const issueID = data.createIssue.issue.id;
      return issueID;
    } catch (error) {
      console.error(JSON.stringify(error, undefined, 2));
    }
  }

  /**
   * Updates a last occurrence of an Issue by adding a comment to the existing Issue.
   * 
   * @param issueID the Issue where to add the comment.
   * @param lastOccurrence the last time the Issue occurred.
   * @returns the issueID received when the the request was accepted by the server
   */
  async updateLastOccurrence(issueID: string, lastOccurrence: number) {
    const lastOccurrenceString: string = "Last occurrence at" + new Date(lastOccurrence)
    const inputData = {
      input: {
        "issueID": issueID,
        "body": 'Last occurred' + lastOccurrence
      }
    };
    const queryIssue = gql`
      mutation addIssueComment($input: AddIssueCommentInput!) { 
        addIssueComment (input: $input) {
            comment {
              id
            }
        }
      }      
    `;
    try {
      const data = await request(`${this.api}`, queryIssue, inputData);
      console.log(JSON.stringify(data, undefined, 2));      
      return issueID;
    } catch (error) {
      console.error(JSON.stringify(error, undefined, 2));
    }
  }
}
