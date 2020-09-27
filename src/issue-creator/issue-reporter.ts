import { request } from 'graphql-request';
import { IssueFormat } from '../IssueFormat';
import { ConfigService } from '@nestjs/config';

/**
 * Provides the basic functionality to report Issues to the API https://github.com/ccims/ccims-backend-gql should have and to add comments to them
 */
export abstract class IssueReporter {
  api = this.configService.get<string>('BACKEND_API');

  constructor(
    public readonly configService: ConfigService,
  ) { }

  /**
   * sends Issues to the current Backend (https://github.com/ccims/ccims-backend-gql)
   * and receives the Issue ID from it if the request was successful.
   *
   * @param issue issue to be send
   * @returns the issueID received when the the request was accepted by the server
   */
  async reportIssue(issue: IssueFormat) {
    const inputData = { input: issue };
    const queryIssue = `
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
      const issueID = data.createIssue.issue.id;
      console.log("CREATED ISSUE", issueID);
      return issueID;
    } catch (error) {
      throw new Error(error);
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
    console.log(issueID);
    const inputData = {
      input: {
        "issue": issueID,
        "body": 'Last occurred' + lastOccurrence
      }
    };
    const queryIssue = `
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
      console.log("ADDED COMMENT", data);
      return issueID;
    } catch (error) {
      throw new Error(error);
    }
  }


}
