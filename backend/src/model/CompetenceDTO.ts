export interface CompetenceDTO {
  competence_id: number;
  years_of_experience: number;
}

export interface AvailabilityDTO {
  from_date: string;
  to_date: string;
}

export interface CreateApplicationDTO {
  competences: CompetenceDTO[];
  availability: AvailabilityDTO[];
}