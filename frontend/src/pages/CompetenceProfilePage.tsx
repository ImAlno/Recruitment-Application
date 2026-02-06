import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';
import { useCompetenceForm } from '../hooks';
import { AVAILABLE_COMPETENCES } from '../types/application';
import { getCompetenceLabel } from '../utils/applicationUtils';

const CompetenceProfilePage = () => {
    const navigate = useNavigate();
    const {
        selectedCompetenceId,
        setSelectedCompetenceId,
        years,
        setYears,
        error,
        setError,
        competences,
        handleAddCompetence,
        removeCompetence,
        clearApplication,
        clearError
    } = useCompetenceForm();

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
                                value={selectedCompetenceId.toString()}
                                onChange={(e) => {
                                    setSelectedCompetenceId(parseInt(e.target.value));
                                    clearError();
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
                                    value={years}
                                    onChange={(e) => {
                                        setYears(e.target.value);
                                        clearError();
                                    }}
                                    min="0"
                                    step="0.5"
                                />
                                <Button onClick={handleAddCompetence}>Add</Button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-600 text-sm">{error}</p>
                        )}

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
                                    {competences.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                                                No competences added yet
                                            </td>
                                        </tr>
                                    ) : (
                                        competences.map((comp, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="px-4 py-2">{getCompetenceLabel(comp.competence_id)}</td>
                                                <td className="px-4 py-2">{comp.years_of_experience}</td>
                                                <td className="px-4 py-2 text-right">
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => removeCompetence(index)}
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
                        <Button variant="outline" onClick={() => {
                            clearApplication();
                            navigate('/applicant/dashboard');
                        }}>Cancel Application</Button>
                        <Button
                            onClick={() => {
                                if (competences.length === 0) {
                                    setError('Please add at least one competence before proceeding');
                                    return;
                                }
                                navigate('/applicant/apply/availability');
                            }}
                        >
                            Next – Availability
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </Layout>
    );
};

export default CompetenceProfilePage;
