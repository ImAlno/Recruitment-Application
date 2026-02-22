/**
 * Application-related type definitions
 */

/**
 * Represents a specific competence or skill of an applicant.
 */
export interface Competence {
    /** Unique identifier for the competence type. */
    competence_id: number;
    /** Number of years of experience in this competence. */
    years_of_experience: number;
}

/**
 * Represents a time period during which an applicant is available to work.
 */
export interface AvailabilityPeriod {
    /** The start date of availability (yyyy-mm-dd). */
    from_date: string;
    /** The end date of availability (yyyy-mm-dd). */
    to_date: string;
}

/**
 * Data structure for submitting a job application.
 */
export interface ApplicationSubmission {
    /** List of competencies shared by the applicant. */
    competences: Competence[];
    /** List of availability periods. */
    availability: AvailabilityPeriod[];
    /** The ID of the user submitting the application. */
    userId: number;
}

export interface CompetenceOption {
    id: number;
    label: string;
}

/**
 * Defined list of competences available for selection in the system.
 */
export const AVAILABLE_COMPETENCES: CompetenceOption[] = [
    { id: 1, label: "Ticket sales" },
    { id: 2, label: "Lotteries" },
    { id: 3, label: "Roller coaster operation" },
];
