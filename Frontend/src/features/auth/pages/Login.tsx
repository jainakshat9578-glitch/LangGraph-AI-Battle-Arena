import { Link } from 'react-router-dom'
import AuthFormInput from '../components/AuthFormInput'
import AuthLayout from '../components/AuthLayout'
import AuthPasswordInput from '../components/AuthPasswordInput'

function Login() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue exploring what AI can do together."
      footer={
        <>
          New to the arena?{' '}
          <Link
            to="/register"
            className="font-medium text-zinc-200 transition hover:text-white"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(event) => event.preventDefault()}
      >
        <AuthFormInput
          id="login-email"
          label="Email address"
          type="email"
          name="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <AuthPasswordInput
          id="login-password"
          label="Password"
          name="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-400">
            <input
              type="checkbox"
              name="rememberMe"
              className="size-4 cursor-pointer rounded border-white/20 bg-[#111114] accent-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]"
            />
            Remember me
          </label>
          <a
            href="#forgot-password"
            onClick={(event) => event.preventDefault()}
            className="text-sm text-zinc-400 transition hover:text-zinc-200"
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20 active:scale-[0.99]"
        >
          Log in
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="size-4 transition-transform group-hover:translate-x-0.5"
          >
            <path
              d="M4 10h12m-5-5 5 5-5 5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </form>
    </AuthLayout>
  )
}

export default Login
