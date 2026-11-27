import { useState } from 'react'
import type { AuthFormInputProps } from './AuthFormInput'
import AuthFormInput from './AuthFormInput'

type AuthPasswordInputProps = Omit<
  AuthFormInputProps,
  'type' | 'trailingElement'
>

function AuthPasswordInput(props: AuthPasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <AuthFormInput
      {...props}
      type={isVisible ? 'text' : 'password'}
      trailingElement={
        <button
          type="button"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
          onClick={() => setIsVisible((visible) => !visible)}
          className="rounded-md p-1 text-zinc-500 transition hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60"
        >
          {isVisible ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="size-[18px]"
            >
              <path
                d="M3 3 17 17M8.6 8.6a2 2 0 0 0 2.8 2.8M8.2 4.2A8.7 8.7 0 0 1 10 4c4.2 0 7.2 3.5 8 6-.3.9-1 2-2 3M5.2 5.2C3.5 6.3 2.4 8 2 10c.8 2.5 3.8 6 8 6 1.1 0 2.1-.2 3-.6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.4"
              />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="size-[18px]"
            >
              <path
                d="M2 10s2.9-5 8-5 8 5 8 5-2.9 5-8 5-8-5-8-5Z"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="1.4"
              />
              <circle
                cx="10"
                cy="10"
                r="2.1"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
          )}
        </button>
      }
    />
  )
}

export default AuthPasswordInput
