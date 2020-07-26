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
  reportIssue(issue: IssueFormat) {
    //In GraphQL notation, the issue to be sent
    //In this case "null" is a placeholder for the real values.
    const queryIssue = `{
      title: null;
      body: null;
      componentIDs: null;
      category: null;
      labels: null;
      assignees: null;
      locations: null;
      startDate: null;
      dueDate: null;
      estimatedTime: null;
      clientMutationID: null;
    }`;
    console.log('Reporting Issue');
    // TODO: Where/What to send to API
    this.client.request(queryIssue).then(data => console.log(data));
  }
}
