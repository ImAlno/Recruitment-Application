import { useState, useEffect } from 'react';

const SUBHEADERS = [
    "Roger's AI just resigned to pursue its dream of becoming a toaster, leaving him desperately understaffed. Help him out—apply today!",
    "Roger's AI is on a mandatory coffee break, which means he's finally admitting he needs real human staff. Help him out—apply today!"
];

/**
 * Custom hook to get a random goofy subheader for Roger's recruitapp
 */
export const useRandomSubheader = () => {
    const [subheader, setSubheader] = useState("");

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * SUBHEADERS.length);
        setSubheader(SUBHEADERS[randomIndex]);
    }, []);

    return subheader;
};
