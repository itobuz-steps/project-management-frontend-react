import { AuthLayout } from '../components/auth/AuthLayout';
import { SignupContainer } from '../components/auth/SignupContainer';
import { TabSwitcher } from '../components/auth/TabSwitcher';
import bgImage from '../assets/bg-signup.svg';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function SignupPage() {
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
        <TabSwitcher selectedTab="signup" />
        <SignupContainer />
      </div>
    </AuthLayout>
  );
}
