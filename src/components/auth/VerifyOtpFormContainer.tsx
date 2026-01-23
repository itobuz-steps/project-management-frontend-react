import { VerifyOtpForm } from './VerifyOtpForm';

export function VerifyOtpFormContainer() {
  return (
    <div className="verify-form-container xs:px-10 block min-h-100 min-w-75 rounded-lg bg-gray-50 px-5 py-10 text-center inset-shadow-sm">
      <h1 className="mb-10 text-lg font-semibold">Enter OTP</h1>
      <VerifyOtpForm />
    </div>
  );
}
