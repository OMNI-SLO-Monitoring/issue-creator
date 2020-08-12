import { HttpService } from '@nestjs/common';
import { request, gql } from 'graphql-request'
import { IssueFormat } from '../IssueFormat';

/**
 * Provides the basic functionality every "detailed" IssueComponent should have
 */
export abstract class IssueReporter {
  api = 'http://localhost:8080/api'; // TODO: currently you have to insert your own IP address with port 8080

  constructor(private http: HttpService) { }

  /**
   * Takes an @param issue and sends Issues to the (not yet implemented) api.
   * Can be called in every Component that extends IssueComponent. It has the
   * form of IssueFormat.
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
