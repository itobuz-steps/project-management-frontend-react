import { ForgotPasswordForm } from './ForgotPasswordForm';
export function ForgotPasswordContainer() {
  return (
    <div className="xs:px-10 block min-h-100 min-w-75 rounded-lg bg-gray-50 px-5 py-10 text-center inset-shadow-sm">
      <h1 className="mb-5 text-lg font-semibold">Reset Password</h1>
      <ForgotPasswordForm />
    </div>
  );
}
