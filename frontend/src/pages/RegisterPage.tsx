
import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    return (
        <Layout>
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Create Account</CardTitle>
                        <CardDescription>Enter your details to register as an applicant.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input label="First Name" placeholder="John" />
                        <Input label="Last Name" placeholder="Doe" />
                        <Input label="Email Address" type="email" placeholder="john.doe@example.com" />
                        <Input label="Person Number" placeholder="YYYYMMDD-XXXX" />
                        <Input label="Username" placeholder="johndoe" />
                        <Input label="Password" type="password" />
                        <Input label="Confirm Password" type="password" />
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button fullWidth>Create Account</Button>
                        <Link to="/" className="text-sm text-blue-600 hover:underline">Cancel / Back to Landing</Link>
                    </CardFooter>
                </Card>
            </div>
        </Layout>
    );
};

export default RegisterPage;
