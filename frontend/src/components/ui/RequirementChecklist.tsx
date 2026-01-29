import type { Requirement } from '../../utils/validation';

interface RequirementChecklistProps {
    title: string;
    value: string;
    requirements: Requirement[];
    className?: string;
}

const RequirementChecklist = ({
    title,
    value,
    requirements,
    className = ''
}: RequirementChecklistProps) => {
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
                            <span>{req.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RequirementChecklist;
