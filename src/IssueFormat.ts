/**
 * This is the issue format as defined by the backend developers and
 * messages of this type are sent to Sandro's API.
 */
export interface IssueFormat {
  title: string;
  body?: string;
  componentIDs: string[]; //type will be replaced by ID[] where ID is the ID of the components later on
  category?: any; //type will be replaced by IssueCategory later on
  labels: string[]; //type will be replaced by ID[] where ID is the ID of the components later on
  assignees: string[]; //type will be replaced by ID[] where ID is the ID of the components later on
  locations: string[]; //type will be replaced by ID[] where ID is the ID of the components later on
  startDate?: number; //type will be replaced by Date
  dueDate?: number; //type will be replaced by Date
  estimatedTime?: number; //type will be replaced by TimeSpan
  clientMutationID: string;
}
