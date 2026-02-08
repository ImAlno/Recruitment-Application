import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Competence, AvailabilityPeriod, ApplicationSubmission } from '../types/application';
import { applicationService } from '../services';
import { useAuth } from './AuthContext';

interface ApplicationContextType {
    competences: Competence[];
    availability: AvailabilityPeriod[];
    addCompetence: (competence: Competence) => void;
    removeCompetence: (index: number) => void;
    addAvailability: (period: AvailabilityPeriod) => void;
    removeAvailability: (index: number) => void;
    submitApplication: () => Promise<boolean>;
    clearApplication: () => void;
    isSubmitting: boolean;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

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

            const response = await applicationService.submitApplication(submission);

            if (response.success) {
                clearApplication();
                return true;
            } else {
                console.error('Application submission failed');
                return false;
            }
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
