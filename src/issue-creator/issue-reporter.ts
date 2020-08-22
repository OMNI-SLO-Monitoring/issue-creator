import { HttpService } from '@nestjs/common';
import { request, gql } from 'graphql-request'
import { IssueFormat } from '../IssueFormat';

/**
 * Provides the basic functionality every "detailed" IssueComponent should have
 */
export abstract class IssueReporter {
  api = 'http://localhost:8080/api'; 

  constructor(private http: HttpService) { }

  /**
   * Takes an @param issue and sends Issues to the current MockApi and receives the Issue ID
   * Can be called in every Component that extends IssueComponent.
   * @returns the issueID received when the the request was accepted by the server
   */
  async reportIssue(issue: IssueFormat) {
    const inputData = { input: issue }
    const queryIssue = gql`
    mutation createIssue($input: CreateIssueInput!) {
      createIssue(input: $input) {
        issue {
          id
        }
      }
    }
    `
    try {
      const data = await request(`${this.api}`, queryIssue, inputData)
      console.log(JSON.stringify(data, undefined, 2))
      const issueID = data.createIssue.issue.id;
      return issueID;
    } catch (error) {
      console.error(JSON.stringify(error, undefined, 2))
      console.log(error);
    }
  }



}
