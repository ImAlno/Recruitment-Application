import { useTranslation } from 'react-i18next';

/**
 * Common Footer component for the application.
 * Displays copyright/description and links to accessibility, terms, and privacy.
 * 
 * @returns {JSX.Element} The rendered footer.
 */
const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-4">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
                        {t('footer.description')}
                    </p>
                </div>
                <div className="flex gap-4">
                    <a href="#" className="text-sm font-medium hover:underline underline-offset-4">{t('footer.accessibility')}</a>
                    <a href="#" className="text-sm font-medium hover:underline underline-offset-4">{t('footer.terms')}</a>
                    <a href="#" className="text-sm font-medium hover:underline underline-offset-4">{t('footer.privacy')}</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
