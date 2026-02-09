export interface Competence {
    competence_id: number;
    years_of_experience: number;
}

export interface AvailabilityPeriod {
    from_date: string;
    to_date: string;
}

export interface ApplicationSubmissionRequest {
    competences: Competence[];
    availability: AvailabilityPeriod[];
    userId: number;
}