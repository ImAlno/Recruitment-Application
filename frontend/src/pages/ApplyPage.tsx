import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { useCompetenceForm, useAvailabilityForm, useReviewSubmit } from '../hooks';
import { AVAILABLE_COMPETENCES } from '../types/application';
import { getCompetenceLabel } from '../utils/applicationUtils';
import AnimatedPage from '../components/layout/AnimatedPage';
import { AnimatedList, AnimatedItem } from '../components/common/AnimatedList';

const STEPS = {
    COMPETENCE: 0,
    AVAILABILITY: 1,
    REVIEW: 2
} as const;

type Step = typeof STEPS[keyof typeof STEPS];

const ApplyPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>(STEPS.COMPETENCE);
    const { user } = useAuth();

    // Hooks for different parts of the form
    const competenceForm = useCompetenceForm();
    const availabilityForm = useAvailabilityForm();
    const reviewSubmit = useReviewSubmit();

    const handleCancel = () => {
        competenceForm.clearApplication();
        navigate('/applicant/dashboard', { replace: true });
    };

    const stepVariants: Variants = {
        initial: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        animate: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1]
            }
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -50 : 50,
            opacity: 0,
            transition: {
                duration: 0.2,
                ease: [0.25, 0.1, 0.25, 1]
            }
        })
    };

    const [dir, setDir] = useState(1);
    const changeStep = (newStep: Step) => {
        setDir(newStep > step ? 1 : -1);
        setStep(newStep);
    };

    return (
        <Layout>
            <AnimatedPage className="max-w-2xl mx-auto space-y-8">
                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <h1 className="text-2xl font-bold text-blue-900">Application</h1>
                    <div className="flex items-center gap-2">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className={`h-2 w-8 rounded-full transition-colors ${i <= step ? 'bg-blue-600' : 'bg-gray-200'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="relative overflow-hidden min-h-[500px]">
                    <AnimatePresence mode="wait" custom={dir}>
                        {step === STEPS.COMPETENCE && (
                            <motion.div
                                key="competence"
                                custom={dir}
                                variants={stepVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="w-full"
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Competence Profile</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                            <Select
                                                label="Area of Expertise"
                                                value={competenceForm.selectedCompetenceId.toString()}
                                                onChange={(e) => {
                                                    competenceForm.setSelectedCompetenceId(parseInt(e.target.value));
                                                    competenceForm.clearError();
                                                }}
                                                options={[
                                                    { label: "Select competence...", value: "0" },
                                                    ...AVAILABLE_COMPETENCES.map(c => ({
                                                        label: c.label,
                                                        value: c.id.toString()
                                                    }))
                                                ]}
                                            />
                                            <div className="flex gap-2 items-end">
                                                <Input
                                                    label="Years of Experience"
                                                    type="number"
                                                    placeholder="0"
                                                    value={competenceForm.years}
                                                    onChange={(e) => {
                                                        competenceForm.setYears(e.target.value);
                                                        competenceForm.clearError();
                                                    }}
                                                    min="0"
                                                    step="0.5"
                                                />
                                                <Button onClick={competenceForm.handleAddCompetence}>Add</Button>
                                            </div>
                                        </div>

                                        {competenceForm.error && (
                                            <p className="text-red-600 text-sm">{competenceForm.error}</p>
                                        )}

                                        <div className="border rounded-md overflow-hidden shadow-sm">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 border-b">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left">Area</th>
                                                        <th className="px-4 py-2 text-left">Years</th>
                                                        <th className="px-4 py-2 text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {competenceForm.competences.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                                                                No competences added yet
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        competenceForm.competences.map((comp, index) => (
                                                            <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                                                                <td className="px-4 py-2">{getCompetenceLabel(comp.competence_id)}</td>
                                                                <td className="px-4 py-2 font-medium">{comp.years_of_experience}</td>
                                                                <td className="px-4 py-2 text-right">
                                                                    <Button
                                                                        variant="danger"
                                                                        size="sm"
                                                                        onClick={() => competenceForm.removeCompetence(index)}
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="justify-between">
                                        <Button variant="outline" type="button" onClick={handleCancel}>Cancel</Button>
                                        <Button onClick={() => {
                                            if (competenceForm.competences.length === 0) {
                                                competenceForm.setError('Please add at least one competence before proceeding');
                                                return;
                                            }
                                            changeStep(STEPS.AVAILABILITY);
                                        }}>Next – Availability</Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        )}

                        {step === STEPS.AVAILABILITY && (
                            <motion.div
                                key="availability"
                                custom={dir}
                                variants={stepVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="w-full"
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Availability</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                            <Input
                                                label="Start Date"
                                                type="date"
                                                value={availabilityForm.startDate}
                                                onChange={(e) => {
                                                    availabilityForm.setStartDate(e.target.value);
                                                    availabilityForm.clearError();
                                                }}
                                            />
                                            <div className="flex gap-2 items-end">
                                                <Input
                                                    label="End Date"
                                                    type="date"
                                                    value={availabilityForm.endDate}
                                                    onChange={(e) => {
                                                        availabilityForm.setEndDate(e.target.value);
                                                        availabilityForm.clearError();
                                                    }}
                                                />
                                                <Button onClick={availabilityForm.handleAddAvailability}>Add</Button>
                                            </div>
                                        </div>

                                        {availabilityForm.error && (
                                            <p className="text-red-600 text-sm">{availabilityForm.error}</p>
                                        )}

                                        <div className="border rounded-md overflow-hidden shadow-sm">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 border-b">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left">Start Date</th>
                                                        <th className="px-4 py-2 text-left">End Date</th>
                                                        <th className="px-4 py-2 text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {availabilityForm.availability.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                                                                No availability periods added yet
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        availabilityForm.availability.map((period, index) => (
                                                            <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                                                                <td className="px-4 py-2 font-medium">{period.from_date}</td>
                                                                <td className="px-4 py-2 font-medium">{period.to_date}</td>
                                                                <td className="px-4 py-2 text-right">
                                                                    <Button
                                                                        variant="danger"
                                                                        size="sm"
                                                                        onClick={() => availabilityForm.removeAvailability(index)}
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="justify-between">
                                        <div className="flex gap-2">
                                            <Button variant="outline" onClick={() => changeStep(STEPS.COMPETENCE)}>Back</Button>
                                            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                                        </div>
                                        <Button onClick={() => {
                                            if (availabilityForm.availability.length === 0) {
                                                availabilityForm.setError('Please add at least one availability period before proceeding');
                                                return;
                                            }
                                            changeStep(STEPS.REVIEW);
                                        }}>Next – Review</Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        )}

                        {step === STEPS.REVIEW && (
                            <motion.div
                                key="review"
                                custom={dir}
                                variants={stepVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="w-full"
                            >
                                <div className="space-y-6">
                                    <AnimatedList className="space-y-6">
                                        {user && (
                                            <AnimatedItem>
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">Personal Information</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                                                            <span className="text-gray-500 font-medium">First Name:</span> <span>{user.firstName}</span>
                                                            <span className="text-gray-500 font-medium">Last Name:</span> <span>{user.lastName}</span>
                                                            <span className="text-gray-500 font-medium">Email:</span> <span>{user.email}</span>
                                                            <span className="text-gray-500 font-medium">Person Number:</span> <span>{user.personNumber}</span>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </AnimatedItem>
                                        )}

                                        <AnimatedItem>
                                            <Card>
                                                <CardHeader className="flex flex-row items-center justify-between">
                                                    <CardTitle className="text-lg">Competence Summary</CardTitle>
                                                    <Button size="sm" variant="outline" onClick={() => changeStep(STEPS.COMPETENCE)}>Edit</Button>
                                                </CardHeader>
                                                <CardContent>
                                                    {competenceForm.competences.length === 0 ? (
                                                        <p className="text-sm text-gray-500">No competences added yet</p>
                                                    ) : (
                                                        <ul className="text-sm space-y-2">
                                                            {competenceForm.competences.map((comp, index) => (
                                                                <li key={index} className="flex justify-between border-b border-gray-100 pb-1">
                                                                    <span className="text-gray-600">{getCompetenceLabel(comp.competence_id)}</span>
                                                                    <span className="font-medium text-blue-700">{comp.years_of_experience} years</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </AnimatedItem>

                                        <AnimatedItem>
                                            <Card>
                                                <CardHeader className="flex flex-row items-center justify-between">
                                                    <CardTitle className="text-lg">Availability Summary</CardTitle>
                                                    <Button size="sm" variant="outline" onClick={() => changeStep(STEPS.AVAILABILITY)}>Edit</Button>
                                                </CardHeader>
                                                <CardContent>
                                                    {availabilityForm.availability.length === 0 ? (
                                                        <p className="text-sm text-gray-500">No availability periods added yet</p>
                                                    ) : (
                                                        <ul className="text-sm space-y-2">
                                                            {availabilityForm.availability.map((period, index) => (
                                                                <li key={index} className="flex justify-between border-b border-gray-100 pb-1">
                                                                    <span className="text-gray-600">{period.from_date} to {period.to_date}</span>
                                                                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">Available</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </AnimatedItem>
                                    </AnimatedList>

                                    {reviewSubmit.error && (
                                        <p className="text-red-600 text-sm p-4 bg-red-50 rounded-md border border-red-100">{reviewSubmit.error}</p>
                                    )}

                                    <div className="flex justify-between pt-4">
                                        <div className="flex gap-2">
                                            <Button variant="outline" onClick={() => changeStep(STEPS.AVAILABILITY)}>Back</Button>
                                            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                                        </div>
                                        <Button
                                            size="lg"
                                            onClick={reviewSubmit.handleFinalSubmit}
                                            disabled={reviewSubmit.isSubmitting}
                                        >
                                            {reviewSubmit.isSubmitting ? 'Submitting...' : 'Submit Application'}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </AnimatedPage>
        </Layout>
    );
};

export default ApplyPage;

