import React, { useState, useEffect } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

// 1. Define the shape of your search parameters
interface AuthSearchSchema {
  mode?: 'login' | 'signup';
}

const AuthPage: React.FC = () => {
    // 2. Type the search hook. Note: In a full TanStack setup, 
    // this is often inferred from your route tree definition.
    const search = useSearch({ from: '/auth' }) as AuthSearchSchema;
    const navigate = useNavigate();

    // 3. Initialize state with a boolean
    const [isLogin, setIsLogin] = useState<boolean>(search.mode === 'login');

    // 4. Keep state in sync with URL changes
    useEffect(() => {
        setIsLogin(search.mode === 'login');
    }, [search.mode]);

    // 5. Explicitly type the parameter and the navigation logic
    const toggleForm = (toLogin: boolean): void => {
        setIsLogin(toLogin);
        navigate({ 
            to: '/auth', 
            search: { mode: toLogin ? 'login' : 'signup' } 
        });
    };

    return (
        <div>
            {isLogin ? (
                <LoginForm onToggleForm={() => toggleForm(false)} />
            ) : (
                <RegisterForm onToggleForm={() => toggleForm(true)} />
            )}
        </div>
    );
};

export default AuthPage;