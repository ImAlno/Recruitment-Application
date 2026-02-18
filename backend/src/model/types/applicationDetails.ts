export type ApplicationDetailsDTO = {
  applicationId: number;
  status: string | null; 
  createdAt: string |null; 
  competences: {
    competenceId: number;
    competenceName: string | null;
    yearsOfExperience: string | null;
  }[];
  availability: {
    fromDate: string | null;
    toDate: string | null;
  }[];
  applicant: {
    personId: number;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
};