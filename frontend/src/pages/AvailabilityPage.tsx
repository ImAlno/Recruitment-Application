
import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';

const AvailabilityPage = () => {
    const navigate = useNavigate();

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
                            <Input label="Start Date" type="date" />
                            <div className="flex gap-2 items-end">
                                <Input label="End Date" type="date" />
                                <Button>Add</Button>
                            </div>
                        </div>

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
                                    <tr className="border-b">
                                        <td className="px-4 py-2">2024-06-01</td>
                                        <td className="px-4 py-2">2024-08-31</td>
                                        <td className="px-4 py-2 text-right">
                                            <Button variant="danger" size="sm">Remove</Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => navigate('/applicant/apply/competence')}>Back</Button>
                            <Button variant="outline" onClick={() => navigate('/applicant/dashboard')}>Cancel</Button>
                        </div>
                        <Button onClick={() => navigate('/applicant/apply/review')}>Next – Review Application</Button>
                    </CardFooter>
                </Card>
            </div>
        </Layout>
    );
};

export default AvailabilityPage;
