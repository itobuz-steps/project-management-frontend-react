import { AuthLayout } from '../components/auth/AuthLayout';
import { TabSwitcher } from '../components/auth/TabSwitcher';
import bgImage from '../assets/bg-signup.svg';
import { LoginContainer } from '../components/auth/LoginContainer';

export function LoginPage() {
  return (
    <AuthLayout backgroundImageUrl={bgImage}>
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-10 dark:bg-slate-700">
        <TabSwitcher selectedTab="login" />
        <LoginContainer />
      </div>
    </AuthLayout>
  );
}
