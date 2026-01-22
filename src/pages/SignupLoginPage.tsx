import { useState } from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { SignupContainer } from '../components/auth/SignupContainer';
import { TabSwitcher } from '../components/auth/TabSwitcher';
import { LoginContainer } from '../components/auth/LoginContainer';
import bgImage from '../assets/bg-signup.svg';

export function SignupLoginPage() {
  const [selectedTab, setSelectedTab] = useState<'signup' | 'login'>('signup');

  return (
    <AuthLayout backgroundImageUrl={bgImage}>
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-10">
        <TabSwitcher
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        {selectedTab === 'signup' && <SignupContainer />}
        {selectedTab === 'login' && <LoginContainer />}
      </div>
    </AuthLayout>
  );
}
