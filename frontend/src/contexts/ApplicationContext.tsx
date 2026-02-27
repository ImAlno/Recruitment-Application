import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Competence, AvailabilityPeriod, ApplicationSubmission } from '../types/application';
import { applicationService } from '../services';
import { useAuth } from './AuthContext';

/**
 * Type definition for the Application Context state and actions.
 */
interface ApplicationContextType {
    /** The list of added competence profiles. */
    competences: Competence[];
    /** The list of added availability periods. */
    availability: AvailabilityPeriod[];
    /** Adds a new competence profile to the state. */
    addCompetence: (competence: Competence) => void;
    /** Removes a competence profile by its index in the list. */
    removeCompetence: (index: number) => void;
    /** Adds a new availability period to the state. */
    addAvailability: (period: AvailabilityPeriod) => void;
    /** Removes an availability period by its index in the list. */
    removeAvailability: (index: number) => void;
    /** Performs the asynchronous submission of the complete application to the backend. Returns success status. */
    submitApplication: () => Promise<boolean>;
    /** Resets the application state and clears local storage. */
    clearApplication: () => void;
    /** True if an application submission is currently in progress. */
    isSubmitting: boolean;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

/**
 * Custom hook to access the Application Context.
 * Must be used within an ApplicationProvider.
 * 
 * @returns {ApplicationContextType} The state and actions of the application context.
 * @throws {Error} If called outside of an ApplicationProvider.
 */
export const useApplication = () => {
    const context = useContext(ApplicationContext);
    if (!context) {
        throw new Error('useApplication must be used within ApplicationProvider');
    }
    return context;
};

interface ApplicationProviderProps {
    children: ReactNode;
}

/**
 * Context Provider component that manages the state of a job application.
 * Persists data to localStorage to avoid loss on page refreshes.
 * 
 * @param {ApplicationProviderProps} props - The component props.
 * @returns {JSX.Element} The rendered provider.
 */
export const ApplicationProvider: React.FC<ApplicationProviderProps> = ({ children }) => {
    const [competences, setCompetences] = useState<Competence[]>(() => {
        const saved = localStorage.getItem('application_competences');
        return saved ? JSON.parse(saved) : [];
    });
    const [availability, setAvailability] = useState<AvailabilityPeriod[]>(() => {
        const saved = localStorage.getItem('application_availability');
        return saved ? JSON.parse(saved) : [];
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        localStorage.setItem('application_competences', JSON.stringify(competences));
    }, [competences]);

    useEffect(() => {
        localStorage.setItem('application_availability', JSON.stringify(availability));
    }, [availability]);

    const addCompetence = (competence: Competence) => {
        setCompetences([...competences, competence]);
    };

    const removeCompetence = (index: number) => {
        setCompetences(competences.filter((_, i) => i !== index));
    };

    const addAvailability = (period: AvailabilityPeriod) => {
        setAvailability([...availability, period]);
    };

    const removeAvailability = (index: number) => {
        setAvailability(availability.filter((_, i) => i !== index));
    };

    const submitApplication = async (): Promise<boolean> => {
        if (!user) {
            console.error('No user logged in');
            return false;
        }

        setIsSubmitting(true);
        try {
            const submission: ApplicationSubmission = {
                competences,
                availability,
                userId: user.id,
            };

            await applicationService.submitApplication(submission);

            clearApplication();
            return true;
        } catch (error) {
            console.error('Error submitting application:', error);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const clearApplication = () => {
        setCompetences([]);
        setAvailability([]);
        localStorage.removeItem('application_competences');
        localStorage.removeItem('application_availability');
    };

    return (
        <ApplicationContext.Provider
            value={{
                competences,
                availability,
                addCompetence,
                removeCompetence,
                addAvailability,
                removeAvailability,
                submitApplication,
                clearApplication,
                isSubmitting,
            }}
        >
            {children}
        </ApplicationContext.Provider>
    );
};
