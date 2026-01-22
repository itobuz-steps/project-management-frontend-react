import { Link } from 'react-router-dom';

export function LoginForm() {
  return (
    <form className="login-form xs:min-w-75 flex flex-col items-center gap-4">
      <input
        id="email-input"
        type="email"
        placeholder="Email"
        required
        className="input-field focus:border-primary-300 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-xs transition-all duration-300 outline-none"
      />
      <input
        id="password-input"
        type="password"
        placeholder="Password"
        required
        className="input-field focus:border-primary-300 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-xs transition-all duration-300 outline-none"
      />
      <div className="forgot-password -mt-2 ml-auto">
        <Link
          to={'/forgot-password'}
          className="text-primary-300 hover:text-primary-400 w-full font-semibold transition-colors duration-300"
        >
          Forgot password?
        </Link>
      </div>
      <button
        className="login-button bg-primary-500 hover:bg-primary-600 mt-8 w-full cursor-pointer rounded-lg py-3 font-semibold text-white transition-all duration-300"
        type="submit"
      >
        Login
      </button>
    </form>
  );
}
