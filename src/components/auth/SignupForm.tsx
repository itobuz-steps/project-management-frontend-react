export function SignupForm() {
  return (
    <form className="xs:min-w-75 flex flex-col items-center justify-between gap-3">
      <input
        id="username"
        type="text"
        placeholder="Username"
        required
        className="focus:border-primary-300 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-xs transition-all duration-300 outline-none"
      />
      <input
        id="email"
        type="email"
        placeholder="Email"
        required
        className="focus:border-primary-300 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-xs transition-all duration-300 outline-none"
      />
      <input
        id="password"
        type="password"
        placeholder="Password"
        required
        className="focus:border-primary-300 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-xs transition-all duration-300 outline-none"
      />
      <p id="signup-message" className="text-center" />
      <button
        className="bg-primary-500 hover:bg-primary-600 mt-5 w-full cursor-pointer rounded-lg py-3 font-semibold text-white transition-all duration-300 disabled:bg-gray-300 disabled:text-gray-400"
        type="submit"
      >
        Sign Up
      </button>
    </form>
  );
}
