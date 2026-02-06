import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useReviewSubmit } from '../hooks';
import { getCompetenceLabel } from '../utils/applicationUtils';

const ReviewSubmitPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        competences,
        availability,
        isSubmitting,
        error,
        handleFinalSubmit
    } = useReviewSubmit();

    return (
        <Layout>
            <div className="max-w-2xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold">Review & Submit</h1>

                <div className="space-y-6">
                    {user && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                    <span className="text-gray-500">First Name:</span> <span>{user.firstName}</span>
                                    <span className="text-gray-500">Last Name:</span> <span>{user.lastName}</span>
                                    <span className="text-gray-500">Email:</span> <span>{user.email}</span>
                                    <span className="text-gray-500">Person Number:</span> <span>{user.personNumber}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Competence Summary</CardTitle>
                            <Button size="sm" variant="outline" onClick={() => navigate('/applicant/apply/competence')}>Edit</Button>
                        </CardHeader>
                        <CardContent>
                            {competences.length === 0 ? (
                                <p className="text-sm text-gray-500">No competences added yet</p>
                            ) : (
                                <ul className="text-sm space-y-1">
                                    {competences.map((comp, index) => (
                                        <li key={index}>
                                            {getCompetenceLabel(comp.competence_id)}: {comp.years_of_experience} years
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Availability Summary</CardTitle>
                            <Button size="sm" variant="outline" onClick={() => navigate('/applicant/apply/availability')}>Edit</Button>
                        </CardHeader>
                        <CardContent>
                            {availability.length === 0 ? (
                                <p className="text-sm text-gray-500">No availability periods added yet</p>
                            ) : (
                                <ul className="text-sm space-y-1">
                                    {availability.map((period, index) => (
                                        <li key={index}>
                                            {period.from_date} to {period.to_date}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {error && (
                    <p className="text-red-600 text-sm">{error}</p>
                )}

                <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => navigate('/applicant/apply/availability')}>Back</Button>
                    <Button
                        size="lg"
                        onClick={handleFinalSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                </div>
            </div>
        </Layout>
    );
};

export default ReviewSubmitPage;
