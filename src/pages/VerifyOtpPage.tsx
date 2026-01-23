import { AuthLayout } from '../components/auth/AuthLayout';
import bgImage from '../assets/bg-signup.svg';
import { VerifyOtpFormContainer } from '../components/auth/VerifyOtpFormContainer';

export function VerifyOtpPage() {
  return (
    <AuthLayout backgroundImageUrl={bgImage}>
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-10">
        <VerifyOtpFormContainer />
      </div>
    </AuthLayout>
  );
}
