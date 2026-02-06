/**
 * Application-related type definitions
 */

export interface Competence {
    competence_id: number;
    years_of_experience: number;
}

export interface AvailabilityPeriod {
    from_date: string;
    to_date: string;
}

export interface ApplicationSubmission {
    competences: Competence[];
    availability: AvailabilityPeriod[];
    userId: number;
}

export interface CompetenceOption {
    id: number;
    label: string;
}

export const AVAILABLE_COMPETENCES: CompetenceOption[] = [
    { id: 1, label: "Ticket sales" },
    { id: 2, label: "Lotteries" },
    { id: 3, label: "Roller coaster operation" },
];
