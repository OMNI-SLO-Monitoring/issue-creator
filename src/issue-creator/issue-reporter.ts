import { HttpService } from '@nestjs/common';
import { request, GraphQLClient } from 'graphql-request';
import { IssueFormat } from '../IssueFormat';

/**
 * Provides the basic functionality every "detailed" IssueComponent should have
 */
export abstract class IssueReporter {
  api: string = 'https://localhost:8080/api'; // TODO: What API Address
  //graphql client which sends issues to api
  client = new GraphQLClient(this.api, { headers: {} });

  constructor(private http: HttpService) {}

  /**
   * Takes an @param issue and sends Issues to the (not yet implemented) api.
   * Can be called in every Component that extends IssueComponent. It has the
   * form of IssueFormat.
   */
  // TODO: Create Issue Format (Interface)
  async reportIssue(issue: IssueFormat) {
    // TODO: Where/What to send to API 
    //In GraphQL notation, the issue to be sent
    //In this case "null" is a placeholder for the real values.
    
    const inputData = { input : issue }
    const queryIssue = `
    mutation createIssue($input: CreateIssueInput!) {
      createIssue(input: $input) {
        issue {
          id
          title
          body
          createdAt
          category
          startDate
          dueDate
          estimatedTime
        }
      }
    }
    `

    // this.client.request(queryIssue, inputData).then(data => console.log(data));
    
    try {
        const data = await request(this.api, queryIssue, inputData)
        console.log(JSON.stringify(data, undefined, 2))
      } catch (error) {
        console.error(JSON.stringify(error, undefined, 2))
        console.log('ERROR');
      }
  }
}
