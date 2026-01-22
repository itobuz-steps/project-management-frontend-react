import { SignupForm } from './SignupForm';

export function SignupContainer() {
  return (
    <div className="xs:w-auto block min-h-100 w-[90%] rounded-lg bg-gray-50 px-5 py-10 text-center inset-shadow-sm sm:px-10">
      <h1 className="mb-7 text-lg font-semibold">Sign Up Form</h1>
      <SignupForm />
    </div>
  );
}
