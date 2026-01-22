export function ForgetPasswordForm() {
  return (
    <form className="forgot-form xs:min-w-75 flex flex-col items-center gap-3">
      <div className="email xs:grid-cols-[3fr_1fr] xs:grid-rows-none mt-4 grid w-full grid-rows-[1fr_1fr] items-center gap-2">
        <input
          id="email-input"
          type="email"
          placeholder="Enter your email"
          required
          className="input-field focus:border-primary-300 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-xs transition-all duration-300 outline-none"
        />
        <button
          className="send bg-primary-500 hover:bg-primary-600 text-small h-full w-full cursor-pointer rounded-lg px-1 font-semibold text-white transition-all duration-300"
          type="button"
        >
          Send OTP
        </button>
      </div>
      <div className="otp flex w-full flex-col items-center">
        <input
          id="otp-input"
          type="text"
          placeholder="Enter OTP"
          required
          className="input-field focus:border-primary-300 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-xs transition-all duration-300 outline-none disabled:bg-gray-200 disabled:text-gray-600"
        />
      </div>
      <div className="new-password flex w-full flex-col items-center">
        <input
          id="password-input"
          type="password"
          placeholder="Enter new password"
          required
          className="input-field focus:border-primary-300 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-xs transition-all duration-300 outline-none disabled:bg-gray-200 disabled:text-gray-600"
        />
      </div>
      <button
        className="reset-button bg-primary-500 hover:bg-primary-600 mt-5 w-full cursor-pointer rounded-lg py-3 font-semibold text-white transition-all duration-300"
        type="submit"
      >
        Reset Password
      </button>
      <p className="back-to-login mt-4">
        <a
          href="../pages/signup.html"
          className="text-primary-300 hover:text-primary-400 self-end text-sm font-semibold transition-colors duration-300"
        >
          ← Back to Login
        </a>
      </p>
    </form>
  );
}
