import { LoginForm } from './LoginForm';

export function LoginContainer() {
  return (
    <div className="xs:px-10 xs:w-auto block min-h-100 w-[90%] rounded-lg bg-gray-50 px-5 py-10 text-center inset-shadow-sm">
      <h1 className="mb-12 text-lg font-semibold">Login Form</h1>
      <LoginForm />
    </div>
  );
}
