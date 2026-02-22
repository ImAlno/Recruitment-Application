import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook to get a random goofy subheader for the landing page.
 * Loads the array of subheaders from translations and selects one at random.
 * Re-randomizes if the language changes.
 * 
 * @returns {string} A random subheader string.
 */
export const useRandomSubheader = () => {
    const { t, i18n } = useTranslation();
    const [subheader, setSubheader] = useState("");

    useEffect(() => {
        // We use returnObjects: true to get the array of subheaders
        const subheaders = t('landing.subheaders', { returnObjects: true });

        if (Array.isArray(subheaders)) {
            const randomIndex = Math.floor(Math.random() * subheaders.length);
            setSubheader(subheaders[randomIndex]);
        }
    }, [t, i18n.language]);

    return subheader;
};
