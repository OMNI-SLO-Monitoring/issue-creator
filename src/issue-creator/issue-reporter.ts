import { HttpService } from '@nestjs/common';
import { request, gql } from 'graphql-request'
import { IssueFormat } from '../IssueFormat';

/**
 * Provides the basic functionality every "detailed" IssueComponent should have
 */
export abstract class IssueReporter {
  api = 'http://localhost:8080/api'; // TODO: currently IP address

  constructor(private http: HttpService) { }

  /**
   * Takes an @param issue and sends Issues to the (not yet implemented) api.
   * Can be called in every Component that extends IssueComponent. It has the
   * form of IssueFormat.
   */
  // TODO: Create Issue Format (Interface)
  async reportIssue(issue: IssueFormat){
    // TODO: Where/What to send to API 
    //In GraphQL notation, the issue to be sent
    //In this case "null" is a placeholder for the real values.

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
    console.log(queryIssue);

    try {
      const data = await request(`${this.api}`, queryIssue, inputData)
      console.log(JSON.stringify(data, undefined, 2))
    } catch (error) {
      console.error(JSON.stringify(error, undefined, 2))
      console.log('There was an error', error);
    }
  }
  

}
