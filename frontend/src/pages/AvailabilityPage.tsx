import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';
import { useAvailabilityForm } from '../hooks';

const AvailabilityPage = () => {
    const navigate = useNavigate();
    const {
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        error,
        setError,
        availability,
        handleAddAvailability,
        removeAvailability,
        clearError
    } = useAvailabilityForm();

    return (
        <Layout>
            <div className="max-w-2xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold">Apply for Position</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Availability</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                            <Input
                                label="Start Date"
                                type="date"
                                value={startDate}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                    clearError();
                                }}
                            />
                            <div className="flex gap-2 items-end">
                                <Input
                                    label="End Date"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => {
                                        setEndDate(e.target.value);
                                        clearError();
                                    }}
                                />
                                <Button onClick={handleAddAvailability}>Add</Button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-600 text-sm">{error}</p>
                        )}

                        <div className="border rounded-md overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Start Date</th>
                                        <th className="px-4 py-2 text-left">End Date</th>
                                        <th className="px-4 py-2 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {availability.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                                                No availability periods added yet
                                            </td>
                                        </tr>
                                    ) : (
                                        availability.map((period, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="px-4 py-2">{period.from_date}</td>
                                                <td className="px-4 py-2">{period.to_date}</td>
                                                <td className="px-4 py-2 text-right">
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => removeAvailability(index)}
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
                            <Button variant="outline" onClick={() => navigate('/applicant/apply/competence')}>Back</Button>
                            <Button variant="outline" onClick={() => navigate('/applicant/dashboard')}>Cancel</Button>
                        </div>
                        <Button
                            onClick={() => {
                                if (availability.length === 0) {
                                    setError('Please add at least one availability period before proceeding');
                                    return;
                                }
                                navigate('/applicant/apply/review');
                            }}
                        >
                            Next – Review Application
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </Layout>
    );
};

export default AvailabilityPage;
