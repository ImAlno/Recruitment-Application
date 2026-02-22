
import Header from './Header';
import Footer from './Footer';

/**
 * Props for the Layout component.
 */
interface LayoutProps {
    /** The main content to be rendered within the layout. */
    children: React.ReactNode;
}

/**
 * Main Layout component that wraps pages with a Header and Footer.
 * Ensures a consistent look and feel across the application.
 * 
 * @param {LayoutProps} props - The component props.
 * @returns {JSX.Element} The rendered layout with header, main content area, and footer.
 */
const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
