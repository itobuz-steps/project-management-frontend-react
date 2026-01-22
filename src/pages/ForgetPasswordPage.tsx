import { AuthLayout } from '../components/auth/AuthLayout';
import bgImage from '../assets/bg-signup.svg';
import { ForgetPasswordContainer } from '../components/auth/ForgetPasswordContainer';

export function ForgetPasswordPage() {
  return (
    <AuthLayout backgroundImageUrl={bgImage}>
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-10">
        <ForgetPasswordContainer />
      </div>
    </AuthLayout>
  );
}
