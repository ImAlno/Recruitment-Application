/**
 * Represents a specific competence and associated years of experience.
 */
export interface Competence {
    competence_id: number;
    years_of_experience: number;
}

/**
 * Represents a date range for when an applicant is available to work.
 */
export interface AvailabilityPeriod {
    from_date: string;
    to_date: string;
}

/**
 * Represents the incoming request payload for submitting a complete application.
 */
export interface ApplicationSubmissionRequest {
    competences: Competence[];
    availability: AvailabilityPeriod[];
    userId: number;
}