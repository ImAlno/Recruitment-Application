import { useTranslation } from 'react-i18next';
import type { Requirement } from '../../utils/validation';

/**
 * Props for the RequirementChecklist component.
 */
interface RequirementChecklistProps {
    /** The title of the checklist (e.g., 'Username Requirements'). */
    title: string;
    /** The current value of the field being validated. */
    value: string;
    /** The list of requirement objects (test function + translation key). */
    requirements: Requirement[];
    /** Optional additional CSS classes. */
    className?: string;
}

/**
 * Functional component that displays a list of validation requirements.
 * Dynamically updates icons and colors based on whether each requirement is met by the input value.
 * 
 * @param {RequirementChecklistProps} props - The component props.
 * @returns {JSX.Element | null} The rendered checklist or null if no value is provided.
 */
const RequirementChecklist = ({
    title,
    value,
    requirements,
    className = ''
}: RequirementChecklistProps) => {
    const { t } = useTranslation();
    if (!value) return null;

    return (
        <div className={`mt-2 p-3 bg-gray-50 rounded-md border border-gray-100 text-xs space-y-1 ${className}`}>
            <p className="font-medium text-gray-500 mb-1">{title}:</p>
            <div className="grid grid-cols-1 gap-1">
                {requirements.map((req, index) => {
                    const isMet = req.test(value);
                    return (
                        <div
                            key={index}
                            className={`flex items-center gap-2 ${isMet ? 'text-green-600' : 'text-gray-400'
                                }`}
                        >
                            <span>{isMet ? '✓' : '○'}</span>
                            <span>{t(req.key)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RequirementChecklist;
