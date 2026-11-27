import type { ReactNode } from 'react'

export type ChatIconName =
  | 'brand'
  | 'menu'
  | 'plus'
  | 'search'
  | 'message'
  | 'settings'
  | 'logout'
  | 'send'
  | 'spark'
  | 'code'
  | 'idea'
  | 'compare'
  | 'close'
  | 'arrow'
  | 'user'

const iconPaths: Record<ChatIconName, ReactNode> = {
  brand: (
    <>
      <path d="m12 2.8 2.3 7 6.9 2.2-6.9 2.3-2.3 6.9-2.2-6.9L2.8 12l7-2.2 2.2-7Z" />
      <path d="m18.7 2 .7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7.7-2.1Z" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.2 4.2" />
    </>
  ),
  message: (
    <path d="M20 11.2a7.6 7.6 0 0 1-8 7.2 8.8 8.8 0 0 1-3.8-.8L4 19l1.3-3.2A6.8 6.8 0 0 1 4 11.2 7.6 7.6 0 0 1 12 4a7.6 7.6 0 0 1 8 7.2Z" />
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="m19.4 15 .1.1a1.8 1.8 0 1 1-2.5 2.5l-.1-.1a1.8 1.8 0 0 0-3 .9v.2a1.8 1.8 0 1 1-3.6 0v-.2a1.8 1.8 0 0 0-3-.9l-.1.1a1.8 1.8 0 1 1-2.5-2.5l.1-.1a1.8 1.8 0 0 0-.9-3h-.2a1.8 1.8 0 1 1 0-3.6h.2a1.8 1.8 0 0 0 .9-3l-.1-.1a1.8 1.8 0 1 1 2.5-2.5l.1.1a1.8 1.8 0 0 0 3-.9v-.2a1.8 1.8 0 1 1 3.6 0v.2a1.8 1.8 0 0 0 3 .9l.1-.1a1.8 1.8 0 1 1 2.5 2.5l-.1.1a1.8 1.8 0 0 0 .9 3h.2a1.8 1.8 0 1 1 0 3.6h-.2a1.8 1.8 0 0 0-.9 3Z" />
    </>
  ),
  logout: (
    <>
      <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
      <path d="M14 16l4-4-4-4M18 12H9" />
    </>
  ),
  send: <path d="m21 3-7.2 18-3.5-7.3L3 10.2 21 3Zm0 0L10.3 13.7" />,
  spark: (
    <>
      <path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" />
      <path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" />
    </>
  ),
  code: <path d="m8 8-4 4 4 4m8-8 4 4-4 4m-2-11-4 14" />,
  idea: (
    <>
      <path d="M9 18h6m-5 3h4m-2-19a7 7 0 0 0-4.3 12.5c.7.5 1.3 1.4 1.3 2.5h6c0-1.1.6-2 1.3-2.5A7 7 0 0 0 12 2Z" />
      <path d="M12 5v2m-4.5.5L9 9m7.5-1.5L15 9" />
    </>
  ),
  compare: (
    <>
      <path d="M4 5h7v14H4zM13 5h7v14h-7z" />
      <path d="M6.5 9h2m-2 3h2m7-3h2m-2 3h2" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
}

interface ChatIconProps {
  name: ChatIconName
  className?: string
}

function ChatIcon({ name, className = 'size-4' }: ChatIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      className={className}
    >
      {iconPaths[name]}
    </svg>
  )
}

export default ChatIcon
