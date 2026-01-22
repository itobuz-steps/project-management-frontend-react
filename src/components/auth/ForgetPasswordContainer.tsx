import { ForgetPasswordForm } from './ForgetPasswordForm';
export function ForgetPasswordContainer() {
  return (
    <div className="forgot-form-container xs:px-10 block min-h-100 min-w-75 rounded-lg bg-gray-50 px-5 py-10 text-center inset-shadow-sm">
      <h1 className="mb-5 text-lg font-semibold">Reset Password</h1>
      <ForgetPasswordForm />
    </div>
  );
}
