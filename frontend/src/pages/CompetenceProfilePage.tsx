
import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';

const CompetenceProfilePage = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="max-w-2xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold">Apply for Position</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Competence Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                            <Select
                                label="Area of Expertise"
                                options={[
                                    { label: "Select competence...", value: "" },
                                    { label: "Ticket sales", value: "ticket-sales" },
                                    { label: "Lotteries", value: "lotteries" },
                                    { label: "Roller coaster operation", value: "roller-coaster" }
                                ]}
                            />
                            <div className="flex gap-2 items-end">
                                <Input label="Years of Experience" type="number" placeholder="0" />
                                <Button>Add</Button>
                            </div>
                        </div>

                        <div className="border rounded-md overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Area</th>
                                        <th className="px-4 py-2 text-left">Years</th>
                                        <th className="px-4 py-2 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="px-4 py-2">Ticket sales</td>
                                        <td className="px-4 py-2">2</td>
                                        <td className="px-4 py-2 text-right">
                                            <Button variant="danger" size="sm">Remove</Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                        <Button variant="outline" onClick={() => navigate('/applicant/dashboard')}>Cancel Application</Button>
                        <Button onClick={() => navigate('/applicant/apply/availability')}>Next – Availability</Button>
                    </CardFooter>
                </Card>
            </div>
        </Layout>
    );
};

export default CompetenceProfilePage;
