import { Link } from 'react-router-dom'
import AuthFormInput from '../components/AuthFormInput'
import AuthLayout from '../components/AuthLayout'
import AuthPasswordInput from '../components/AuthPasswordInput'

function Register() {
  return (
    <AuthLayout
      title="Create your account"
      description="Join the arena and discover a better way to explore ideas."
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-zinc-200 transition hover:text-white"
          >
            Log in
          </Link>
        </>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(event) => event.preventDefault()}
      >
        <AuthFormInput
          id="register-name"
          label="Full name"
          type="text"
          name="name"
          placeholder="Your name"
          autoComplete="name"
          required
        />

        <AuthFormInput
          id="register-email"
          label="Email address"
          type="email"
          name="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <AuthPasswordInput
          id="register-password"
          label="Password"
          name="password"
          placeholder="Create a password"
          autoComplete="new-password"
          minLength={8}
          required
        />

        <button
          type="submit"
          className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20 active:scale-[0.99]"
        >
          Create Account
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

export default Register
