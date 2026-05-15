import AuthStatus from "./components/auth-status";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="absolute top-8 right-8">
        <AuthStatus />
      </div>

      <main className="flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          Welcome to VAuth
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl">
          A modern authentication system built with Next.js, better-auth, and Tailwind CSS
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Secure Authentication
            </h2>
            <p className="text-slate-600 mb-6">
              Get started with a fully functional authentication system with sign-up and sign-in capabilities.
            </p>
            <a
              href="/signup"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Account
            </a>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Already a User?
            </h2>
            <p className="text-slate-600 mb-6">
              Sign in to your account and start exploring all the features we have to offer.
            </p>
            <a
              href="/login"
              className="inline-block bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
