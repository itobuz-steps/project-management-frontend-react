import { AuthLayout } from '../components/auth/AuthLayout';
import bgImage from '../assets/bg-forget-password.svg';
import { ForgotPasswordContainer } from '../components/auth/ForgotPasswordContainer';

export function ForgotPasswordPage() {
  return (
    <AuthLayout backgroundImageUrl={bgImage}>
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-10">
        <ForgotPasswordContainer />
      </div>
    </AuthLayout>
  );
}
