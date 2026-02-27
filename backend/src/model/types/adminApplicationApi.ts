/**
 * Represents the summarized application data returned to recruiters.
 */
export interface AdminApplicatinResponse {
  applicationId: number;
  firstName: string | null;
  lastName: string | null;
  status: string | null;
  createdAt: string | null;
}
