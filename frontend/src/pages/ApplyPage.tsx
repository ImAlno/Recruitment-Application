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
import { useTranslation } from 'react-i18next';

const STEPS = {
    COMPETENCE: 0,
    AVAILABILITY: 1,
    REVIEW: 2
} as const;

type Step = typeof STEPS[keyof typeof STEPS];

/**
 * Multi-step application page for job seekers.
 * Guides the user through documenting their competence profile and availability periods 
 * before a final review and submission.
 * Uses framer-motion for smooth transitions between steps.
 * 
 * @returns {JSX.Element} The rendered multi-step application form.
 */
const ApplyPage = () => {
    const { t } = useTranslation();
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
                    <h1 className="text-2xl font-bold text-blue-900">{t('apply.title')}</h1>
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
                                        <CardTitle>{t('apply.competenceProfile')}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                            <Select
                                                label={t('apply.areaOfExpertise')}
                                                value={competenceForm.selectedCompetenceId.toString()}
                                                onChange={(e) => {
                                                    competenceForm.setSelectedCompetenceId(parseInt(e.target.value));
                                                    competenceForm.clearError();
                                                }}
                                                options={[
                                                    { label: t('apply.selectCompetence'), value: "0" },
                                                    ...AVAILABLE_COMPETENCES.map(c => ({
                                                        label: t(`common.competences.${c.label.toLowerCase().replace(/ /g, '_')}`, { defaultValue: c.label }),
                                                        value: c.id.toString()
                                                    }))
                                                ]}
                                            />
                                            <div className="flex gap-2 items-end">
                                                <Input
                                                    label={t('apply.yearsOfExperience')}
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
                                                <Button onClick={competenceForm.handleAddCompetence}>{t('apply.add')}</Button>
                                            </div>
                                        </div>

                                        {competenceForm.error && (
                                            <p className="text-red-600 text-sm">{t(competenceForm.error)}</p>
                                        )}

                                        <div className="border rounded-md overflow-hidden shadow-sm">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 border-b">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left">{t('apply.area')}</th>
                                                        <th className="px-4 py-2 text-left">{t('apply.years')}</th>
                                                        <th className="px-4 py-2 text-right">{t('common.action')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {competenceForm.competences.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                                                                {t('apply.noCompetences')}
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        competenceForm.competences.map((comp, index) => (
                                                            <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                                                                <td className="px-4 py-2">
                                                                    {t(`common.competences.${getCompetenceLabel(comp.competence_id).toLowerCase().replace(/ /g, '_')}`, { defaultValue: getCompetenceLabel(comp.competence_id) })}
                                                                </td>
                                                                <td className="px-4 py-2 font-medium">{comp.years_of_experience}</td>
                                                                <td className="px-4 py-2 text-right">
                                                                    <Button
                                                                        variant="danger"
                                                                        size="sm"
                                                                        onClick={() => competenceForm.removeCompetence(index)}
                                                                    >
                                                                        {t('apply.remove')}
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
                                        <Button variant="outline" type="button" onClick={handleCancel}>{t('common.cancel')}</Button>
                                        <Button onClick={() => {
                                            if (competenceForm.competences.length === 0) {
                                                competenceForm.setError(t('apply.atLeastOneCompetence'));
                                                return;
                                            }
                                            changeStep(STEPS.AVAILABILITY);
                                        }}>{t('apply.nextAvailability')}</Button>
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
                                        <CardTitle>{t('apply.availability')}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                            <Input
                                                label={t('apply.startDate')}
                                                type="date"
                                                value={availabilityForm.startDate}
                                                onChange={(e) => {
                                                    availabilityForm.setStartDate(e.target.value);
                                                    availabilityForm.clearError();
                                                }}
                                            />
                                            <div className="flex gap-2 items-end">
                                                <Input
                                                    label={t('apply.endDate')}
                                                    type="date"
                                                    value={availabilityForm.endDate}
                                                    onChange={(e) => {
                                                        availabilityForm.setEndDate(e.target.value);
                                                        availabilityForm.clearError();
                                                    }}
                                                />
                                                <Button onClick={availabilityForm.handleAddAvailability}>{t('apply.add')}</Button>
                                            </div>
                                        </div>

                                        {availabilityForm.error && (
                                            <p className="text-red-600 text-sm">{t(availabilityForm.error)}</p>
                                        )}

                                        <div className="border rounded-md overflow-hidden shadow-sm">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 border-b">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left">{t('apply.startDate')}</th>
                                                        <th className="px-4 py-2 text-left">{t('apply.endDate')}</th>
                                                        <th className="px-4 py-2 text-right">{t('common.action')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {availabilityForm.availability.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                                                                {t('apply.noAvailability')}
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
                                                                        {t('apply.remove')}
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
                                            <Button variant="outline" onClick={() => changeStep(STEPS.COMPETENCE)}>{t('error.back')}</Button>
                                            <Button variant="outline" onClick={handleCancel}>{t('common.cancel')}</Button>
                                        </div>
                                        <Button onClick={() => {
                                            if (availabilityForm.availability.length === 0) {
                                                availabilityForm.setError(t('apply.atLeastOneAvailability'));
                                                return;
                                            }
                                            changeStep(STEPS.REVIEW);
                                        }}>{t('apply.nextReview')}</Button>
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
                                                        <CardTitle className="text-lg">{t('apply.personalInfo')}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                                                            <span className="text-gray-500 font-medium">{t('apply.firstName')}</span> <span>{user.firstName}</span>
                                                            <span className="text-gray-500 font-medium">{t('apply.lastName')}</span> <span>{user.lastName}</span>
                                                            <span className="text-gray-500 font-medium">{t('apply.email')}</span> <span>{user.email}</span>
                                                            <span className="text-gray-500 font-medium">{t('apply.personNumber')}</span> <span>{user.personNumber}</span>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </AnimatedItem>
                                        )}

                                        <AnimatedItem>
                                            <Card>
                                                <CardHeader className="flex flex-row items-center justify-between">
                                                    <CardTitle className="text-lg">{t('apply.competenceSummary')}</CardTitle>
                                                    <Button size="sm" variant="outline" onClick={() => changeStep(STEPS.COMPETENCE)}>{t('apply.edit')}</Button>
                                                </CardHeader>
                                                <CardContent>
                                                    {competenceForm.competences.length === 0 ? (
                                                        <p className="text-sm text-gray-500">{t('apply.noCompetences')}</p>
                                                    ) : (
                                                        <ul className="text-sm space-y-2">
                                                            {competenceForm.competences.map((comp, index) => (
                                                                <li key={index} className="flex justify-between border-b border-gray-100 pb-1">
                                                                    <span className="text-gray-600">
                                                                        {t(`common.competences.${getCompetenceLabel(comp.competence_id).toLowerCase().replace(/ /g, '_')}`, { defaultValue: getCompetenceLabel(comp.competence_id) })}
                                                                    </span>
                                                                    <span className="font-medium text-blue-700">{comp.years_of_experience} {t('apply.yearsAbbr')}</span>
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
                                                    <CardTitle className="text-lg">{t('apply.availabilitySummary')}</CardTitle>
                                                    <Button size="sm" variant="outline" onClick={() => changeStep(STEPS.AVAILABILITY)}>{t('apply.edit')}</Button>
                                                </CardHeader>
                                                <CardContent>
                                                    {availabilityForm.availability.length === 0 ? (
                                                        <p className="text-sm text-gray-500">{t('apply.noAvailability')}</p>
                                                    ) : (
                                                        <ul className="text-sm space-y-2">
                                                            {availabilityForm.availability.map((period, index) => (
                                                                <li key={index} className="flex justify-between border-b border-gray-100 pb-1">
                                                                    <span className="text-gray-600">{period.from_date} {t('apply.to')} {period.to_date}</span>
                                                                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">{t('apply.available')}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </AnimatedItem>
                                    </AnimatedList>

                                    {reviewSubmit.error && (
                                        <p className="text-red-600 text-sm p-4 bg-red-50 rounded-md border border-red-100">{t(reviewSubmit.error)}</p>
                                    )}

                                    <div className="flex justify-between pt-4">
                                        <div className="flex gap-2">
                                            <Button variant="outline" onClick={() => changeStep(STEPS.AVAILABILITY)}>{t('error.back')}</Button>
                                            <Button variant="outline" onClick={handleCancel}>{t('common.cancel')}</Button>
                                        </div>
                                        <Button
                                            size="lg"
                                            onClick={reviewSubmit.handleFinalSubmit}
                                            disabled={reviewSubmit.isSubmitting}
                                        >
                                            {reviewSubmit.isSubmitting ? t('apply.submitting') : t('apply.submitApplication')}
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
