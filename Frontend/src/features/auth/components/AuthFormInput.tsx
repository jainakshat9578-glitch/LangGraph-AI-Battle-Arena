import type { InputHTMLAttributes, ReactNode } from 'react'

export interface AuthFormInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'id'> {
  id: string
  label: string
  trailingElement?: ReactNode
}

function AuthFormInput({
  id,
  label,
  trailingElement,
  ...inputProps
}: AuthFormInputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-zinc-200"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={`h-12 w-full rounded-xl border border-white/10 bg-[#111114] pl-4 ${trailingElement ? 'pr-12' : 'pr-4'} text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-zinc-400/60 focus:ring-4 focus:ring-white/[0.04]`}
          {...inputProps}
        />
        {trailingElement ? (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {trailingElement}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default AuthFormInput
