import { AuthLayout } from '../components/auth/AuthLayout';
import { SignupContainer } from '../components/auth/SignupContainer';
import { TabSwitcher } from '../components/auth/TabSwitcher';
import bgImage from '../assets/bg-signup.svg';

export function SignupPage() {
  return (
    <AuthLayout backgroundImageUrl={bgImage}>
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-10 dark:bg-slate-700">
        <TabSwitcher selectedTab="signup" />
        <SignupContainer />
      </div>
    </AuthLayout>
  );
}
