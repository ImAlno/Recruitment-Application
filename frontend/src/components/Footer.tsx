const Footer = () => {
    return (
        <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-4">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
                        Built by Recruitment Corp. The source code is available on GitHub.
                    </p>
                </div>
                <div className="flex gap-4">
                    <a href="#" className="text-sm font-medium hover:underline underline-offset-4">Accessibility</a>
                    <a href="#" className="text-sm font-medium hover:underline underline-offset-4">Terms</a>
                    <a href="#" className="text-sm font-medium hover:underline underline-offset-4">Privacy</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
