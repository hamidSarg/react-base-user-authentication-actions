import {FormEvent, forwardRef, useImperativeHandle, useLayoutEffect, useState, useTransition} from "react";
import {LoginFormProps, LoginFormRef} from "@pages/login/index.type.ts";
import {useHttpService} from "@context/http";


const LoginForm = forwardRef<LoginFormRef, LoginFormProps>(({ onLoginSuccess }, ref) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
    const [isPending, startTransition] = useTransition();

    const httpService = useHttpService(); // Access the NetworkService


    useImperativeHandle(ref, () => ({
        resetForm: () => {
            setEmail('');
            setPassword('');
            setErrors({});
        },
    }));

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            newErrors.email = 'Invalid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        startTransition(() => {
            httpService
                .post<{ token: string }>('/login', { email, password })
                .then((response) => {
                    onLoginSuccess(response.token);
                })
                .catch((error) => {
                    setErrors({ general: error.message });
                });
        });
    };

    useLayoutEffect(() => {
        const emailInput = document.getElementById('email');
        emailInput?.focus();
    }, []);


    return (
        <div className="flex justify-center items-center max-w-[40%] w-[40%] min-h-screen bg-gray-100">
            <div className="flex flex-col items-center justify-center  bg-white rounded-lg shadow-md p-6">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Login</h2>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`mt-1 block w-full px-4 py-2 border ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        placeholder="Enter your email"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`mt-1 block w-full px-4 py-2 border ${
                            errors.password ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        placeholder="Enter your password"
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    onClick={handleSubmit}
                    className={`w-full py-2 px-4 text-white font-semibold rounded-md ${
                        isPending ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {isPending ? 'Logging in...' : 'Login'}
                </button>
            </div>
        </div>
    );
});

export default LoginForm;
