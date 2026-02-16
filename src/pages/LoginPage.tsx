import { AuthLayout } from '../components/auth/AuthLayout';
import { TabSwitcher } from '../components/auth/TabSwitcher';
import bgImage from '../assets/bg-signup.svg';
import { LoginContainer } from '../components/auth/LoginContainer';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/for-you');
    }
  }, [navigate]);

  return (
    <AuthLayout backgroundImageUrl={bgImage}>
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-10">
        <TabSwitcher selectedTab="login" />
        <LoginContainer />
      </div>
    </AuthLayout>
  );
}
