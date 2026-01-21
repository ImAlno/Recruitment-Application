
import Layout from '../components/Layout';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    return (
        <Layout>
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>Enter your credentials to access your account.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input label="Username" placeholder="johndoe" />
                        <Input label="Password" type="password" />
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button fullWidth>Login</Button>
                        <Link to="/" className="text-sm text-blue-600 hover:underline">Back to Landing</Link>
                    </CardFooter>
                </Card>
            </div>
        </Layout>
    );
};

export default LoginPage;
